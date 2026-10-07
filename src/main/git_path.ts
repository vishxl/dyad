import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export interface ResolveLocalGitDirectoryOptions {
  appPath?: string;
  resourcesPath?: string;
  bundledGitDir?: string;
  systemGitBin?: string;
  systemGitExecPath?: string;
  exists?: (target: string) => boolean;
}

export function findSystemGitBinary(
  options: Pick<
    ResolveLocalGitDirectoryOptions,
    "systemGitBin" | "exists"
  > = {},
): string | undefined {
  const exists = options.exists ?? fs.existsSync;

  if (options.systemGitBin && options.systemGitBin.trim()) {
    return options.systemGitBin;
  }

  const entries = (process.env.PATH ?? "")
    .split(path.delimiter)
    .filter(Boolean);

  for (const entry of entries) {
    const candidates = [path.join(entry, "git"), path.join(entry, "git.exe")];
    for (const candidate of candidates) {
      if (exists(candidate)) {
        return candidate;
      }
    }
  }

  return undefined;
}

export function findSystemGitDirectory(
  options: Pick<
    ResolveLocalGitDirectoryOptions,
    "systemGitBin" | "systemGitExecPath" | "exists"
  > = {},
): string | undefined {
  const exists = options.exists ?? fs.existsSync;

  const execPath =
    options.systemGitExecPath ??
    (() => {
      const gitBin = findSystemGitBinary(options);
      if (!gitBin) {
        return undefined;
      }
      const result = spawnSync(gitBin, ["--exec-path"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      if (result.status !== 0 || !result.stdout) {
        return undefined;
      }
      const candidate = result.stdout.trim();
      return exists(candidate) ? candidate : undefined;
    })();

  if (!execPath) {
    return undefined;
  }

  const execDir = path.dirname(execPath);
  const gitDir = path.dirname(execDir);
  if (
    gitDir &&
    exists(
      path.join(gitDir, "bin", path.basename(options.systemGitBin ?? "git")),
    )
  ) {
    return gitDir;
  }

  return undefined;
}

function isValidGitDirectoryRoot(
  directory: string | undefined,
  exists: (target: string) => boolean,
): boolean {
  if (!directory || !directory.trim()) {
    return false;
  }

  const gitBinCandidates = [
    path.join(directory, "bin", "git"),
    path.join(directory, "bin", "git.exe"),
    path.join(directory, "cmd", "git.exe"),
    path.join(directory, "usr", "bin", "git"),
    path.join(directory, "mingw64", "bin", "git.exe"),
  ];
  const gitExecCandidates = [
    path.join(directory, "libexec", "git-core"),
    path.join(directory, "usr", "libexec", "git-core"),
    path.join(directory, "mingw64", "libexec", "git-core"),
  ];

  return (
    gitBinCandidates.some((candidate) => exists(candidate)) &&
    gitExecCandidates.some((candidate) => exists(candidate))
  );
}

export function sanitizeLocalGitDirectory(
  options: ResolveLocalGitDirectoryOptions = {},
): string | undefined {
  const exists = options.exists ?? fs.existsSync;
  const envGitDirectory = process.env.LOCAL_GIT_DIRECTORY?.trim();

  if (envGitDirectory && isValidGitDirectoryRoot(envGitDirectory, exists)) {
    return envGitDirectory;
  }

  if (envGitDirectory && !isValidGitDirectoryRoot(envGitDirectory, exists)) {
    delete process.env.LOCAL_GIT_DIRECTORY;
  }

  const resolved = resolveLocalGitDirectory(options);
  if (resolved) {
    process.env.LOCAL_GIT_DIRECTORY = resolved;
  }

  return resolved;
}

export function ensureRuntimeGitEnvironment(
  options: ResolveLocalGitDirectoryOptions = {},
): string | undefined {
  const resolved = sanitizeLocalGitDirectory(options);
  if (!resolved) {
    delete process.env.LOCAL_GIT_DIRECTORY;
  }
  return resolved;
}

export function resolveLocalGitDirectory(
  options: ResolveLocalGitDirectoryOptions = {},
): string | undefined {
  const appPath = options.appPath ?? process.cwd();
  const resourcesPath = options.resourcesPath ?? process.resourcesPath;
  const bundledGitDir =
    options.bundledGitDir ??
    path.join(appPath, "node_modules", "dugite", "git");
  const packagedGitDir = path.join(resourcesPath ?? "", "git");

  const exists = options.exists ?? fs.existsSync;

  const candidates = [bundledGitDir, packagedGitDir];
  for (const candidate of candidates) {
    if (candidate && exists(candidate)) {
      return candidate;
    }
  }

  const systemGitDir = findSystemGitDirectory({
    systemGitBin: options.systemGitBin,
    systemGitExecPath: options.systemGitExecPath,
    exists,
  });
  return systemGitDir ?? undefined;
}
