import fs from "node:fs/promises";
import path from "node:path";
import { assertMutationPathAllowed, safeJoin } from "@/ipc/utils/path_utils";
import {
  getNextBillionMediaDir,
  listStoredAttachments,
  resolveAttachmentLogicalPath,
  toAttachmentLogicalPath,
} from "@/ipc/utils/media_path_utils";
import {
  NextBillionError,
  NextBillionErrorKind,
} from "@/errors/nextbillion_error";
import { readContainedTextFile } from "@/ipc/utils/bounded_text_file";
import { isDotenvFilePath, redactDotenvValues } from "@/utils/dotenv_redaction";
import { SANDBOX_READ_FILE_LIMIT_BYTES } from "./limits";

type StructuredObject = { [key: string]: unknown };

export interface SandboxFileStats {
  size: number;
  isText: boolean;
  mtime: string;
}

export interface SandboxReadFileOptions {
  start?: number;
  length?: number;
  encoding?: "utf8" | "base64";
}

// Names of the built-in host functions exposed to MustardScript. Kept as a
// const tuple so other modules can import the runtime value (e.g. to avoid
// registering MCP capabilities that would shadow these names) while keeping the
// union type intact. write_file is only injected by the local-agent main-thread
// sandbox path because it needs AgentContext.
export const SANDBOX_HOST_CALL_NAMES = [
  "read_file",
  "list_files",
  "file_stats",
  "write_file",
] as const;
export type SandboxHostCallName = (typeof SANDBOX_HOST_CALL_NAMES)[number];

export type SandboxHostCallObserver = (params: {
  name: SandboxHostCallName;
  path?: string;
}) => void;

const DENIED_PATH_PATTERNS = [
  /(^|[/\\])\.git([/\\]|$)/i,
  /(^|[/\\])\.npmrc$/i,
  /(^|[/\\])\.yarnrc(?:\.yml)?$/i,
  /(^|[/\\])\.pypirc$/i,
  /(^|[/\\])\.(?:bash|zsh|fish|python|mysql|psql|sqlite)_history$/i,
  /(^|[/\\])node_modules([/\\]|$)/i,
  /(^|[/\\])\.ssh([/\\]|$)/i,
  /(^|[/\\])\.aws([/\\]|$)/i,
  /(^|[/\\])\.config([/\\]|$)/i,
  /(^|[/\\])\.netrc$/i,
  /\.key$/i,
  /\.pem$/i,
];
const DOTENV_DENIED_PATH_PATTERN =
  /(^|[/\\])(?:\.env(?:\.[^/\\]+)*|\.envrc)(?:[/\\]|$)/i;

function isDeniedSandboxPath(
  filePath: string,
  options?: { allowDotenvFile?: boolean },
): boolean {
  if (DENIED_PATH_PATTERNS.some((pattern) => pattern.test(filePath))) {
    return true;
  }
  if (!DOTENV_DENIED_PATH_PATTERN.test(filePath)) {
    return false;
  }
  return !(options?.allowDotenvFile && isDotenvFilePath(filePath));
}

const TEXT_EXTENSIONS = new Set([
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".log",
  ".md",
  ".mjs",
  ".cjs",
  ".sql",
  ".svg",
  ".text",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
]);

function isStructuredObject(value: unknown): value is StructuredObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNodeErrorWithCode(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === code
  );
}

function parseOptionalNonNegativeInteger(
  value: unknown,
  name: string,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new NextBillionError(
      `read_file ${name} must be a non-negative integer.`,
      NextBillionErrorKind.Validation,
    );
  }
  return value;
}

function parseReadOptions(value: unknown): SandboxReadFileOptions {
  if (value == null) {
    return {};
  }
  if (!isStructuredObject(value)) {
    throw new NextBillionError(
      "read_file options must be an object.",
      NextBillionErrorKind.Validation,
    );
  }

  const start = value.start;
  const length = value.length;
  const encoding = value.encoding;

  if (encoding !== undefined && encoding !== "utf8" && encoding !== "base64") {
    throw new NextBillionError(
      "read_file encoding must be 'utf8' or 'base64'.",
      NextBillionErrorKind.Validation,
    );
  }

  return {
    start: parseOptionalNonNegativeInteger(start, "start"),
    length: parseOptionalNonNegativeInteger(length, "length"),
    encoding: encoding as "utf8" | "base64" | undefined,
  };
}

function assertSandboxGuestPath(
  guestPath: string,
  options?: { allowDotenvFile?: boolean },
): void {
  if (!guestPath || typeof guestPath !== "string") {
    throw new NextBillionError(
      "File path is required.",
      NextBillionErrorKind.Validation,
    );
  }
  if (path.isAbsolute(guestPath) || /^[A-Za-z]:[/\\]/.test(guestPath)) {
    throw new NextBillionError(
      "Absolute paths are not allowed in sandbox scripts.",
      NextBillionErrorKind.Validation,
    );
  }
  if (guestPath.startsWith("~/") || guestPath.startsWith("\\\\")) {
    throw new NextBillionError(
      "Home and UNC paths are not allowed in sandbox scripts.",
      NextBillionErrorKind.Validation,
    );
  }
  if (/(^|[/\\])\.\.([/\\]|$)/.test(guestPath)) {
    throw new NextBillionError(
      "Path traversal is not allowed in sandbox scripts.",
      NextBillionErrorKind.Validation,
    );
  }
  if (isDeniedSandboxPath(guestPath, options)) {
    throw new NextBillionError(
      `Sandbox scripts cannot access protected path: ${guestPath}`,
      NextBillionErrorKind.Precondition,
    );
  }
}

export function assertAllowedGuestPath(guestPath: string): void {
  assertSandboxGuestPath(guestPath);
}

function isTextPath(filePath: string): boolean {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

export async function assertSandboxWritePathAllowed(params: {
  appPath: string;
  guestPath: string;
}): Promise<void> {
  assertAllowedGuestPath(params.guestPath);
  const normalized = await assertMutationPathAllowed({
    appPath: params.appPath,
    relativePath: params.guestPath,
  });
  if (isDeniedSandboxPath(normalized)) {
    throw new NextBillionError(
      `Sandbox scripts cannot access protected path: ${params.guestPath}`,
      NextBillionErrorKind.Precondition,
    );
  }
}

async function resolveSandboxPath(params: {
  appPath: string;
  guestPath: string;
  allowDotenvRead?: boolean;
}): Promise<{ filePath: string; displayPath: string }> {
  if (params.guestPath.startsWith("attachments:")) {
    const attachment = await resolveAttachmentLogicalPath(
      params.appPath,
      params.guestPath,
    );
    if (!attachment) {
      throw new NextBillionError(
        `Attachment not found: ${params.guestPath}`,
        NextBillionErrorKind.NotFound,
      );
    }
    return {
      filePath: attachment.filePath,
      displayPath: toAttachmentLogicalPath(attachment.logicalName),
    };
  }

  if (params.allowDotenvRead) {
    assertSandboxGuestPath(params.guestPath, { allowDotenvFile: true });
  } else {
    assertAllowedGuestPath(params.guestPath);
  }
  return {
    filePath: safeJoin(params.appPath, params.guestPath),
    displayPath: params.guestPath,
  };
}

async function assertResolvedPathAllowed(params: {
  appPath: string;
  filePath: string;
  displayPath: string;
  allowDotenvRead?: boolean;
}): Promise<{ realFilePath: string; isDotenv: boolean }> {
  const realAppPath = await fs.realpath(params.appPath);
  let realFilePath: string;
  try {
    realFilePath = await fs.realpath(params.filePath);
  } catch (error) {
    if (isNodeErrorWithCode(error, "ENOENT")) {
      throw new NextBillionError(
        `File not found: ${params.displayPath}`,
        NextBillionErrorKind.NotFound,
      );
    }
    throw error;
  }
  const relative = path.relative(realAppPath, realFilePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new NextBillionError(
      `Sandbox scripts cannot access files outside the app: ${params.displayPath}`,
      NextBillionErrorKind.Precondition,
    );
  }
  if (params.displayPath.startsWith("attachments:")) {
    const realMediaPath = await fs.realpath(
      getNextBillionMediaDir(params.appPath),
    );
    const mediaRelative = path.relative(realMediaPath, realFilePath);
    if (mediaRelative.startsWith("..") || path.isAbsolute(mediaRelative)) {
      throw new NextBillionError(
        `Sandbox scripts cannot access files outside attachment storage: ${params.displayPath}`,
        NextBillionErrorKind.Precondition,
      );
    }
    return { realFilePath, isDotenv: isDotenvFilePath(params.displayPath) };
  }
  const normalized = relative.split(path.sep).join("/");
  if (
    isDeniedSandboxPath(normalized, {
      allowDotenvFile: params.allowDotenvRead,
    })
  ) {
    throw new NextBillionError(
      `Sandbox scripts cannot access protected path: ${params.displayPath}`,
      NextBillionErrorKind.Precondition,
    );
  }
  const isDotenv =
    isDotenvFilePath(params.displayPath) || isDotenvFilePath(normalized);
  return { realFilePath, isDotenv };
}

export async function sandboxReadFile(
  appPath: string,
  guestPath: string,
  rawOptions?: unknown,
): Promise<string> {
  const options = parseReadOptions(rawOptions);
  const resolved = await resolveSandboxPath({
    appPath,
    guestPath,
    allowDotenvRead: true,
  });
  const { realFilePath, isDotenv } = await assertResolvedPathAllowed({
    appPath,
    ...resolved,
    allowDotenvRead: true,
  });

  if (
    options.length !== undefined &&
    options.length > SANDBOX_READ_FILE_LIMIT_BYTES
  ) {
    throw new NextBillionError(
      `read_file length ${options.length} exceeds the ${SANDBOX_READ_FILE_LIMIT_BYTES} byte limit. Read the file in chunks with start and length instead.`,
      NextBillionErrorKind.Validation,
    );
  }

  if (isDotenv) {
    const sanitized = Buffer.from(
      redactDotenvValues(
        await readContainedTextFile({
          rootPath: appPath,
          filePath: realFilePath,
          displayPath: resolved.displayPath,
          maxBytes: SANDBOX_READ_FILE_LIMIT_BYTES,
        }),
      ),
      "utf8",
    );
    const start = options.start ?? 0;
    if (start > sanitized.length) {
      return "";
    }
    const remainingBytes = sanitized.length - start;
    const length = options.length ?? remainingBytes;
    if (length > SANDBOX_READ_FILE_LIMIT_BYTES) {
      throw new NextBillionError(
        `read_file would read ${length} sanitized bytes from ${resolved.displayPath}, exceeding the ${SANDBOX_READ_FILE_LIMIT_BYTES} byte limit. Use file_stats to get the source size, then read bounded chunks with start and length.`,
        NextBillionErrorKind.Validation,
      );
    }
    const bytes = sanitized.subarray(start, start + length);
    return (options.encoding ?? "utf8") === "base64"
      ? bytes.toString("base64")
      : bytes.toString("utf8");
  }

  const stat = await fs.stat(realFilePath);
  if (!stat.isFile()) {
    throw new NextBillionError(
      `Path is not a file: ${resolved.displayPath}`,
      NextBillionErrorKind.Validation,
    );
  }
  const start = options.start ?? 0;
  if (start > stat.size) {
    return "";
  }
  const remainingBytes = stat.size - start;
  const length = options.length ?? remainingBytes;
  if (length > SANDBOX_READ_FILE_LIMIT_BYTES) {
    throw new NextBillionError(
      `read_file would read ${length} bytes from ${resolved.displayPath}, exceeding the ${SANDBOX_READ_FILE_LIMIT_BYTES} byte limit. Use file_stats to get the size, then read bounded chunks with start and length.`,
      NextBillionErrorKind.Validation,
    );
  }

  const handle = await fs.open(realFilePath, "r");
  try {
    const bytesToRead = Math.min(length, remainingBytes);
    const buffer = Buffer.alloc(bytesToRead);
    const { bytesRead } = await handle.read(buffer, 0, bytesToRead, start);
    const bytes = buffer.subarray(0, bytesRead);
    return (options.encoding ?? "utf8") === "base64"
      ? bytes.toString("base64")
      : bytes.toString("utf8");
  } finally {
    await handle.close();
  }
}

export async function sandboxFileStats(
  appPath: string,
  guestPath: string,
): Promise<SandboxFileStats> {
  const resolved = await resolveSandboxPath({
    appPath,
    guestPath,
    allowDotenvRead: true,
  });
  const { realFilePath, isDotenv } = await assertResolvedPathAllowed({
    appPath,
    ...resolved,
    allowDotenvRead: true,
  });
  const stat = await fs.stat(realFilePath);
  if (!stat.isFile()) {
    throw new NextBillionError(
      `Path is not a file: ${resolved.displayPath}`,
      NextBillionErrorKind.Validation,
    );
  }
  return {
    size: stat.size,
    isText: isDotenv || isTextPath(realFilePath),
    mtime: stat.mtime.toISOString(),
  };
}

export async function sandboxListFiles(
  appPath: string,
  guestDir?: string,
): Promise<string[]> {
  const dir = guestDir ?? ".";
  if (dir === "attachments:" || dir === "attachments") {
    const attachments = await listStoredAttachments(appPath);
    return attachments.map((attachment) =>
      toAttachmentLogicalPath(attachment.logicalName),
    );
  }

  assertAllowedGuestPath(dir);
  const dirPath = safeJoin(appPath, dir);
  const realAppPath = await fs.realpath(appPath);
  let realDirPath: string;
  try {
    realDirPath = await fs.realpath(dirPath);
  } catch (error) {
    if (isNodeErrorWithCode(error, "ENOENT")) {
      throw new NextBillionError(
        `Directory not found: ${dir}`,
        NextBillionErrorKind.NotFound,
      );
    }
    throw error;
  }
  const relative = path.relative(realAppPath, realDirPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new NextBillionError(
      `Sandbox scripts cannot list files outside the app: ${dir}`,
      NextBillionErrorKind.Precondition,
    );
  }
  const entries = await fs.readdir(realDirPath, { withFileTypes: true });
  return entries
    .filter((entry) => !isDeniedSandboxPath(entry.name))
    .map((entry) => {
      const relativePath = path
        .join(relative, entry.name)
        .split(path.sep)
        .join("/");
      return entry.isDirectory() ? `${relativePath}/` : relativePath;
    })
    .sort();
}

export function buildSandboxCapabilitiesWithObserver(
  appPath: string,
  onHostCall?: SandboxHostCallObserver,
) {
  return {
    read_file: (guestPath: unknown, options?: unknown) => {
      if (typeof guestPath !== "string") {
        throw new NextBillionError(
          "read_file path must be a string.",
          NextBillionErrorKind.Validation,
        );
      }
      onHostCall?.({ name: "read_file", path: guestPath });
      return sandboxReadFile(appPath, guestPath, options);
    },
    list_files: (dir?: unknown) => {
      if (dir !== undefined && typeof dir !== "string") {
        throw new NextBillionError(
          "list_files directory must be a string.",
          NextBillionErrorKind.Validation,
        );
      }
      onHostCall?.({ name: "list_files", path: dir });
      return sandboxListFiles(appPath, dir);
    },
    file_stats: (guestPath: unknown) => {
      if (typeof guestPath !== "string") {
        throw new NextBillionError(
          "file_stats path must be a string.",
          NextBillionErrorKind.Validation,
        );
      }
      onHostCall?.({ name: "file_stats", path: guestPath });
      return sandboxFileStats(appPath, guestPath);
    },
  };
}
