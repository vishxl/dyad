/**
 * proxy.js – zero-dependency worker-based HTTP/WS forwarder
 */

const { parentPort, workerData } = require("worker_threads");

const http = require("http");
const https = require("https");

const { URL } = require("url");
const fs = require("fs");
const path = require("path");

/* ──────────────────────────── worker code ─────────────────────────────── */
const LISTEN_HOST = "127.0.0.1";
const LISTEN_PORT = workerData.port;
const PREVIEW_HOSTNAME = workerData.hostname;
// Keep this worker-side check aligned with shared/preview_hostname.ts's
// isAppPreviewHostname; the unbundled worker cannot import TypeScript.
if (
  typeof PREVIEW_HOSTNAME !== "string" ||
  (PREVIEW_HOSTNAME !== "localhost" &&
    (!/^app-([1-9]\d*)\.localhost$/.test(PREVIEW_HOSTNAME) ||
      !Number.isSafeInteger(Number(PREVIEW_HOSTNAME.split(".")[0].slice(4)))))
) {
  throw new Error("Invalid preview hostname");
}
let previewOrigin;
let rememberedOrigin = null; // e.g. "http://localhost:5173"
let rememberedBaseUrl = null;

/* ---------- hosted-deployment public base path (see context/dyad-web-deployment.md) ---- */
/* When DYAD_PREVIEW_PUBLIC_URL_BASE is set (e.g. "https://<host>/preview"), teammates'
 * browsers reach this worker through a reverse proxy at <base>/<boundPort>/... instead
 * of http://<PREVIEW_HOSTNAME>:<boundPort>/. Desktop/dev mode strips that
 * prefix inbound; hosted mode keeps it (Vite runs with matching --base) and
 * rewrites redirects and the injected service-worker registration outbound.
 * Unset (default, desktop/dev): every behavior below is identical to before. */
let publicUrlBase = null; // e.g. "https://host/preview"
let publicBasePath = null; // e.g. "/preview" — path-only
let publicPrefix = null; // e.g. "https://host/preview/42113" — full URL, for outbound rewriting
let publicPrefixPath = null; // e.g. "/preview/42113" — path-only, for inbound matching
{
  const raw = process.env.DYAD_PREVIEW_PUBLIC_URL_BASE;
  if (raw) {
    try {
      const parsed = new URL(raw);
      publicUrlBase = parsed.origin + parsed.pathname.replace(/\/$/, "");
      publicBasePath = parsed.pathname.replace(/\/$/, "");
    } catch {
      throw new Error(
        `Invalid DYAD_PREVIEW_PUBLIC_URL_BASE "${raw}". Must be an absolute http/https URL.`,
      );
    }
  }
}

function computePublicPrefix(boundPort) {
  if (!publicUrlBase) return null;
  publicPrefixPath = `${publicBasePath}/${boundPort}`;
  return `${publicUrlBase}/${boundPort}`;
}

/* Strip the public /preview/<port> prefix from an inbound request path.
 * Returns null when the path is outside the public prefix. */
function stripPublicPrefix(reqPath) {
  if (!publicPrefixPath) return reqPath;
  if (reqPath === publicPrefixPath || reqPath === publicPrefixPath + "/") {
    return "/";
  }
  if (reqPath.startsWith(`${publicPrefixPath}/`)) {
    return reqPath.slice(publicPrefixPath.length) || "/";
  }
  return null;
}

function isPublicOrigin(originHeader) {
  if (!publicUrlBase) return false;
  return originHeader === new URL(publicUrlBase).origin;
}

/* Hosted mode only: reject dot-segments so /preview/<port>/../x can never
 * escape the prefix and reach upstream paths outside this app. */
function publicPathEscapes(reqPath) {
  if (!publicPrefixPath) return false;
  try {
    const decoded = decodeURIComponent(reqPath);
    return decoded.split("/").some((seg) => seg === ".." || seg === ".");
  } catch {
    return true;
  }
}
const fixedHeaders = workerData?.fixedHeaders || {};
const authBootstrapToken = workerData?.authBootstrapToken;

/* ---------- pre-configure rememberedOrigin from workerData ------- */
{
  const fixed = workerData?.targetOrigin;
  if (fixed) {
    try {
      rememberedBaseUrl = new URL(fixed);
      rememberedOrigin = rememberedBaseUrl.origin;
      parentPort?.postMessage(
        `[proxy-worker] fixed upstream origin: ${rememberedOrigin}`,
      );
    } catch {
      throw new Error(
        `Invalid target origin "${fixed}". Must be absolute http/https URL.`,
      );
    }
  }
}

/* ---------- optional resources for HTML injection ---------------------- */

let stacktraceJsContent = null;
let dyadShimContent = null;
let dyadComponentSelectorClientContent = null;
let dyadRecorderClientContent = null;
let dyadAuthBootstrapContent = null;
let dyadScreenshotClientContent = null;
let htmlToImageContent = null;
let dyadVisualEditorClientContent = null;
let dyadLogsContent = null;

try {
  const htmlToImagePath = path.join(
    __dirname,
    "..",
    "node_modules",
    "html-to-image",
    "dist",
    "html-to-image.js",
  );
  htmlToImageContent = fs.readFileSync(htmlToImagePath, "utf-8");
  parentPort?.postMessage(
    `[proxy-worker] html-to-image.js loaded from: ${htmlToImagePath}`,
  );
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read html-to-image.js: ${error.message}`,
  );
}

try {
  const stackTraceLibPath = path.join(
    __dirname,
    "..",
    "node_modules",
    "stacktrace-js",
    "dist",
    "stacktrace.min.js",
  );
  stacktraceJsContent = fs.readFileSync(stackTraceLibPath, "utf-8");
  parentPort?.postMessage("[proxy-worker] stacktrace.js loaded.");
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read stacktrace.js: ${error.message}`,
  );
}

try {
  const dyadShimPath = path.join(__dirname, "dyad-shim.js");
  dyadShimContent = fs.readFileSync(dyadShimPath, "utf-8");
  parentPort?.postMessage("[proxy-worker] dyad-shim.js loaded.");
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad-shim.js: ${error.message}`,
  );
}

try {
  const dyadComponentSelectorClientPath = path.join(
    __dirname,
    "dyad-component-selector-client.js",
  );
  dyadComponentSelectorClientContent = fs.readFileSync(
    dyadComponentSelectorClientPath,
    "utf-8",
  );
  parentPort?.postMessage(
    "[proxy-worker] dyad-component-selector-client.js loaded.",
  );
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad-component-selector-client.js: ${error.message}`,
  );
}

try {
  const dyadRecorderClientPath = path.join(
    __dirname,
    "dyad-recorder-client.js",
  );
  dyadRecorderClientContent = fs.readFileSync(dyadRecorderClientPath, "utf-8");
  parentPort?.postMessage("[proxy-worker] dyad-recorder-client.js loaded.");
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad-recorder-client.js: ${error.message}`,
  );
}

try {
  const dyadAuthBootstrapPath = path.join(__dirname, "dyad-auth-bootstrap.js");
  dyadAuthBootstrapContent = fs.readFileSync(dyadAuthBootstrapPath, "utf-8");
  parentPort?.postMessage("[proxy-worker] dyad-auth-bootstrap.js loaded.");
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad-auth-bootstrap.js: ${error.message}`,
  );
}

try {
  const dyadScreenshotClientPath = path.join(
    __dirname,
    "dyad-screenshot-client.js",
  );
  dyadScreenshotClientContent = fs.readFileSync(
    dyadScreenshotClientPath,
    "utf-8",
  );
  parentPort?.postMessage("[proxy-worker] dyad-screenshot-client.js loaded.");
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad-screenshot-client.js: ${error.message}`,
  );
}

try {
  const dyadVisualEditorClientPath = path.join(
    __dirname,
    "dyad-visual-editor-client.js",
  );
  dyadVisualEditorClientContent = fs.readFileSync(
    dyadVisualEditorClientPath,
    "utf-8",
  );
  parentPort?.postMessage(
    "[proxy-worker] dyad-visual-editor-client.js loaded.",
  );
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad-visual-editor-client.js: ${error.message}`,
  );
}

try {
  const dyadLogsPath = path.join(__dirname, "dyad_logs.js");
  dyadLogsContent = fs.readFileSync(dyadLogsPath, "utf-8");
  parentPort?.postMessage("[proxy-worker] dyad_logs.js loaded.");
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad_logs.js: ${error.message}`,
  );
}

// Load Service Worker files
let dyadSwContent = null;
let dyadSwRegisterContent = null;

try {
  const dyadSwPath = path.join(__dirname, "dyad-sw.js");
  dyadSwContent = fs.readFileSync(dyadSwPath, "utf-8");
  parentPort?.postMessage("[proxy-worker] dyad-sw.js loaded.");
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad-sw.js: ${error.message}`,
  );
}

try {
  const dyadSwRegisterPath = path.join(__dirname, "dyad-sw-register.js");
  dyadSwRegisterContent = fs.readFileSync(dyadSwRegisterPath, "utf-8");
  parentPort?.postMessage("[proxy-worker] dyad-sw-register.js loaded.");
} catch (error) {
  parentPort?.postMessage(
    `[proxy-worker] Failed to read dyad-sw-register.js: ${error.message}`,
  );
}

if (publicUrlBase) {
  // Hosted mode: the register script uses scope "/" at the public origin, which
  // would let this app's service worker intercept the Dyad UI's paths (all
  // previews share one public origin). Rewrite to register under the app's
  // public prefix; the bound port is appended once known (see injectHTML).
  // ponytail: prefix is port-dependent, so the scope string is patched per-response
  // in injectHTML via swRegisterScopeForPrefix rather than at load.
}

function swRegisterContentForPrefix() {
  if (!publicPrefix || !dyadSwRegisterContent) return dyadSwRegisterContent;
  return dyadSwRegisterContent.replace(
    /register\(\s*["']\/dyad-sw\.js["']\s*,\s*\{\s*scope:\s*["']\/["']\s*\}\s*\)/,
    `register("${publicPrefix}/dyad-sw.js", { scope: "${publicPrefix}/" })`,
  );
}

/* ---------------------- helper: need to inject? ------------------------ */
function needsInjection(pathname) {
  // Inject for routes without a file extension (e.g., "/foo", "/foo/bar", "/")
  const ext = path.extname(pathname).toLowerCase();
  return ext === "" || ext === ".html";
}

/* Hosted mode only: rewrite root-absolute asset URLs in HTML to the public
 * prefix. Under <base>/<port>/... the browser resolves src="/@vite/client"
 * against the origin root, which routes to the Dyad UI instead of this app —
 * the preview loads blank. Rewriting to "<prefix>/@vite/client" lets Caddy
 * route back here, where stripPublicPrefix removes the prefix again.
 * Skips protocol-relative (//) and already-prefixed paths.
 * ponytail: HTML src/href/action/poster only — JS fetch("/api/...") and CSS
 * url() inside external stylesheets still resolve root-absolute; if apps need
 * those, the fix is a per-app Vite `base`, not more regex here. */
function rewriteHtmlAssetPaths(txt) {
  if (!publicPrefixPath) return txt;
  txt = String(txt); // injectHTML returns a Buffer
  const esc = publicPrefixPath
    .replace(/^\//, "")
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `(\\s(?:src|href|action|poster)\\s*=\\s*["'])/(?!/)(?!${esc}(?:/|["']))`,
    "gi",
  );
  return txt.replace(re, `$1${publicPrefixPath}/`);
}

function injectHTML(buf) {
  let txt = buf.toString("utf8");
  // These are strings that were used since the first version of the dyad shim.
  // If the dyad shim is used from legacy apps which came pre-baked with the shim
  // as a vite plugin, then do not inject the shim twice to avoid weird behaviors.
  const legacyAppWithShim =
    txt.includes("window-error") && txt.includes("unhandled-rejection");

  const scripts = [];
  // Both injected bridges read the same per-proxy capability before any app
  // script runs. Escape at the HTML boundary even though today's token is a
  // UUID so a future token-source change cannot create an attribute injection.
  const escapedProxyToken = String(authBootstrapToken || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (!legacyAppWithShim) {
    if (stacktraceJsContent) {
      scripts.push(`<script>${stacktraceJsContent}</script>`);
    } else {
      scripts.push(
        '<script>console.warn("[proxy-worker] stacktrace.js was not injected.");</script>',
      );
    }

    if (dyadShimContent) {
      scripts.push(`<script>${dyadShimContent}</script>`);
    } else {
      scripts.push(
        '<script>console.warn("[proxy-worker] dyad shim was not injected.");</script>',
      );
    }
  }
  if (dyadComponentSelectorClientContent) {
    scripts.push(`<script>${dyadComponentSelectorClientContent}</script>`);
  } else {
    scripts.push(
      '<script>console.warn("[proxy-worker] dyad component selector client was not injected.");</script>',
    );
  }
  if (dyadRecorderClientContent) {
    scripts.push(
      `<script data-dyad-recorder-token="${escapedProxyToken}">${dyadRecorderClientContent}</script>`,
    );
  } else {
    scripts.push(
      '<script>console.warn("[proxy-worker] dyad recorder client was not injected.");</script>',
    );
  }
  if (dyadAuthBootstrapContent) {
    scripts.push(
      `<script data-dyad-auth-token="${escapedProxyToken}">${dyadAuthBootstrapContent}</script>`,
    );
  } else {
    scripts.push(
      '<script>console.warn("[proxy-worker] dyad auth bootstrap was not injected.");</script>',
    );
  }
  if (htmlToImageContent) {
    scripts.push(`<script>${htmlToImageContent}</script>`);
    parentPort?.postMessage(
      "[proxy-worker] html-to-image script injected into HTML.",
    );
  } else {
    scripts.push(
      '<script>console.error("[proxy-worker] html-to-image was not injected - library not loaded.");</script>',
    );
    parentPort?.postMessage(
      "[proxy-worker] WARNING: html-to-image not injected!",
    );
  }
  if (dyadScreenshotClientContent) {
    scripts.push(`<script>${dyadScreenshotClientContent}</script>`);
  } else {
    scripts.push(
      '<script>console.warn("[proxy-worker] dyad screenshot client was not injected.");</script>',
    );
  }
  if (dyadVisualEditorClientContent) {
    scripts.push(`<script>${dyadVisualEditorClientContent}</script>`);
  } else {
    scripts.push(
      '<script>console.warn("[proxy-worker] dyad visual editor client was not injected.");</script>',
    );
  }
  if (dyadLogsContent) {
    scripts.push(`<script>${dyadLogsContent}</script>`);
  } else {
    scripts.push(
      '<script>console.warn("[proxy-worker] dyad_logs.js was not injected.");</script>',
    );
  }
  if (swRegisterContentForPrefix()) {
    scripts.push(`<script>${swRegisterContentForPrefix()}</script>`);
  } else {
    scripts.push(
      '<script>console.warn("[proxy-worker] dyad-sw-register.js was not injected.");</script>',
    );
  }
  const allScripts = scripts.join("\n");

  const headRegex = /<head[^>]*>/i;
  if (headRegex.test(txt)) {
    txt = txt.replace(headRegex, `$&\n${allScripts}`);
  } else {
    txt = allScripts + "\n" + txt;
    parentPort?.postMessage(
      "[proxy-worker] Warning: <head> tag not found – scripts prepended.",
    );
  }
  return Buffer.from(txt, "utf8");
}

/* ---------------- helper: build upstream URL from request -------------- */
function buildTargetURL(clientReq) {
  if (!rememberedOrigin || !rememberedBaseUrl)
    throw new Error("No upstream configured.");

  const incomingUrl = new URL(clientReq.url, rememberedOrigin);
  const basePath = rememberedBaseUrl.pathname.replace(/\/$/, "");
  let incomingPath = incomingUrl.pathname;

  // Hosted mode: Vite apps are launched with --base <publicPrefixPath>
  // (app_runtime_service getViteBaseArg), so the prefix must be KEPT — Vite
  // rejects requests outside its base ("configured with a public base URL").
  // Desktop/dev mode strips it so the app keeps its root-relative behavior.
  // ponytail: hosted previews assume Vite apps; non-Vite apps get no --base
  // and would need a per-app strip decision if anyone ever runs one hosted.
  if (!publicUrlBase) {
    const stripped = stripPublicPrefix(incomingPath);
    if (stripped !== null) {
      incomingPath = stripped;
    }
  }

  if (
    basePath &&
    (incomingPath === basePath || incomingPath.startsWith(`${basePath}/`))
  ) {
    incomingPath = incomingPath.slice(basePath.length) || "/";
  }

  const targetPath =
    incomingPath === "/"
      ? rememberedBaseUrl.pathname
      : `${basePath}${incomingPath}`;

  return new URL(
    `${targetPath}${incomingUrl.search}`,
    rememberedBaseUrl.origin,
  );
}

/* ----------------------------------------------------------------------- */
/* Cookie rewriting for the embedded preview iframe                        */
/*                                                                         */
/* In a packaged build the Dyad shell loads from file://, a cross-site     */
/* top-level ancestor to the http://localhost preview. That makes the      */
/* request's "site for cookies" cross-site, so the browser withholds       */
/* default Lax/Strict cookies and auth sessions fail to stick. (Dev mode   */
/* hides this: the shell runs on http://localhost, same-site with the      */
/* preview.)                                                               */
/*                                                                         */
/* Fix: rewrite every forwarded Set-Cookie to                              */
/* `SameSite=None; Secure` so it's sent inside the iframe.                 */
/* (Secure is required by SameSite=None and honored over localhost.)       */
/* ----------------------------------------------------------------------- */
function rewriteCookieForIframe(cookieStr) {
  if (!cookieStr || typeof cookieStr !== "string") return cookieStr;
  // filter(Boolean) drops empty segments from leading/trailing/double semicolons
  // so we never emit a malformed header like "...; ; Secure".
  const parts = cookieStr
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return cookieStr;
  const nameValue = parts[0];
  // Host-only cookies isolate previews, including deletion cookies. Keep the
  // existing iframe SameSite handling for the packaged file:// shell.
  const attrs = parts.slice(1).filter((p) => {
    const lower = p.toLowerCase();
    return (
      !lower.startsWith("samesite") &&
      !/^domain\s*=/.test(lower) &&
      lower !== "secure" &&
      lower !== "partitioned"
    );
  });
  attrs.push("Secure", "SameSite=None");
  return [nameValue, ...attrs].join("; ");
}

/* Rewrites the Set-Cookie header (an array in Node) in place on `headers`. */
function rewriteSetCookieHeaders(headers) {
  const sc = headers["set-cookie"];
  if (!sc) return headers;
  const list = Array.isArray(sc) ? sc : [sc];
  headers["set-cookie"] = list.map(rewriteCookieForIframe);
  return headers;
}

const PROXY_FRAME_ANCESTORS_CSP =
  "frame-ancestors 'self' file: http://localhost:* http://127.0.0.1:* http://[::1]:*";

function appendHeader(headers, name, value) {
  const lowerName = name.toLowerCase();
  const existingName =
    Object.keys(headers).find((key) => key.toLowerCase() === lowerName) ??
    lowerName;
  const existing = headers[existingName];

  if (existing === undefined) {
    headers[existingName] = value;
  } else if (Array.isArray(existing)) {
    headers[existingName] = [...existing, value];
  } else {
    headers[existingName] = [existing, value];
  }

  return headers;
}

function applyProxyFrameAncestorsCsp(headers) {
  // Separate CSP header means app-supplied policies keep enforcing unchanged.
  return appendHeader(
    headers,
    "content-security-policy",
    PROXY_FRAME_ANCESTORS_CSP,
  );
}

/* ----------------------------------------------------------------------- */
/* 1. Plain HTTP request / response                                        */
/* ----------------------------------------------------------------------- */

const server = http.createServer((clientReq, clientRes) => {
  if (!hasPreviewAuthority(clientReq)) {
    clientRes.writeHead(421, { "content-type": "text/plain" });
    clientRes.end("This preview belongs to a different app hostname.");
    return;
  }
  // Special handling for Service Worker file
  const swPath = stripPublicPrefix(clientReq.url);
  if (swPath !== null && swPath === "/dyad-sw.js") {
    if (dyadSwContent) {
      clientRes.writeHead(200, {
        "content-type": "application/javascript",
        // Scoped to the public prefix when hosted so this app's SW can never
        // intercept the Dyad UI origin's paths.
        "service-worker-allowed": publicPrefixPath
          ? `${publicPrefixPath}/`
          : "/",
        "cache-control": "no-cache",
      });
      clientRes.end(dyadSwContent);
      return;
    } else {
      clientRes.writeHead(404, { "content-type": "text/plain" });
      clientRes.end("Service Worker file not found");
      return;
    }
  }
  if (publicPrefix && swPath === null) {
    clientRes.writeHead(404, { "content-type": "text/plain" });
    clientRes.end("Not found under public preview path");
    return;
  }
  if (publicPathEscapes(clientReq.url)) {
    clientRes.writeHead(400, { "content-type": "text/plain" });
    clientRes.end("Bad request");
    return;
  }

  let target;
  try {
    target = buildTargetURL(clientReq);
  } catch (err) {
    clientRes.writeHead(400, { "content-type": "text/plain" });
    return void clientRes.end("Bad request: " + err.message);
  }

  const isTLS = target.protocol === "https:";
  const lib = isTLS ? https : http;

  /* Copy request headers but rewrite Host / Origin / Referer */
  const headers = { ...clientReq.headers, host: target.host, ...fixedHeaders };
  if (headers.origin) headers.origin = target.origin;
  if (headers.referer) {
    try {
      const ref = new URL(headers.referer);
      headers.referer = target.origin + ref.pathname + ref.search;
    } catch {
      delete headers.referer;
    }
  }
  if (needsInjection(target.pathname)) {
    // Request uncompressed content from upstream
    delete headers["accept-encoding"];
    // Avoid getting cached resources.
    delete headers["if-none-match"];
  }

  const upOpts = {
    protocol: target.protocol,
    hostname: target.hostname,
    port: target.port || (isTLS ? 443 : 80),
    path: target.pathname + target.search,
    method: clientReq.method,
    headers,
  };

  const upReq = lib.request(upOpts, (upRes) => {
    rewriteRedirect(upRes.headers);
    const wantsInjection = needsInjection(target.pathname);
    // Only inject when upstream indicates HTML content
    const contentTypeHeader = upRes.headers["content-type"];
    const contentType = Array.isArray(contentTypeHeader)
      ? contentTypeHeader[0]
      : contentTypeHeader || "";
    const isHtml =
      typeof contentType === "string" &&
      contentType.toLowerCase().includes("text/html");
    const inject = wantsInjection && isHtml;

    if (!inject) {
      rewriteSetCookieHeaders(upRes.headers);
      applyProxyFrameAncestorsCsp(upRes.headers);
      clientRes.writeHead(upRes.statusCode, upRes.headers);
      return void upRes.pipe(clientRes);
    }

    const chunks = [];
    upRes.on("data", (c) => chunks.push(c));
    upRes.on("end", () => {
      try {
        const merged = Buffer.concat(chunks);
        const patched = rewriteHtmlAssetPaths(injectHTML(merged));

        const hdrs = {
          ...upRes.headers,
          "content-length": Buffer.byteLength(patched),
        };
        // If we injected content, it's no longer encoded in the original way
        delete hdrs["content-encoding"];
        delete hdrs["transfer-encoding"];
        // Also, remove ETag as content has changed
        delete hdrs["etag"];
        // Never cache an injected document. The scripts above are stamped with
        // this proxy instance's capability token, and a restart mints a new one
        // — so a cached copy carries a token the proxy no longer honors, and
        // recorder control and `dyad-auth-login` messages sent with it are
        // rejected with nothing on screen explaining why. `last-modified` and
        // `expires` go too: left behind they still permit heuristic freshness
        // and conditional revalidation into the same stale document.
        delete hdrs["last-modified"];
        delete hdrs["expires"];
        hdrs["cache-control"] = "no-store, must-revalidate";
        rewriteSetCookieHeaders(hdrs);
        applyProxyFrameAncestorsCsp(hdrs);

        clientRes.writeHead(upRes.statusCode, hdrs);
        clientRes.end(patched);
      } catch (e) {
        clientRes.writeHead(500, { "content-type": "text/plain" });
        clientRes.end("Injection failed: " + e.message);
      }
    });
  });

  clientReq.pipe(upReq);
  upReq.on("error", (e) => {
    clientRes.writeHead(502, { "content-type": "text/plain" });
    clientRes.end("Upstream error: " + e.message);
  });
});

/* ----------------------------------------------------------------------- */
/* 2. WebSocket / generic Upgrade tunnelling                               */
/* ----------------------------------------------------------------------- */

server.on("upgrade", (req, socket, _head) => {
  // Chromium tears down HMR sockets during navigation/reload. Once upgraded,
  // raw sockets no longer have HTTP's error handling; a reset must only close
  // this tunnel, never crash the app's proxy worker.
  let upstreamSocket;
  socket.on("error", () => {
    upstreamSocket?.destroy();
    socket.destroy();
  });
  socket.on("close", () => upstreamSocket?.destroy());
  if (!hasPreviewAuthority(req)) {
    socket.end("HTTP/1.1 421 Misdirected Request\r\nConnection: close\r\n\r\n");
    return;
  }
  // Browser WebSockets carry cookies without CORS preflight. Never turn a
  // foreign Origin into a trusted upstream Origin. Non-browser clients may
  // omit Origin, but browsers (including HMR) must use this preview's origin —
  // or, in hosted mode, the public reverse-proxy origin.
  if (
    req.headers.origin &&
    req.headers.origin !== previewOrigin &&
    !isPublicOrigin(req.headers.origin)
  ) {
    socket.end("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
    return;
  }
  if (publicPrefix && stripPublicPrefix(req.url.split("?")[0]) === null) {
    socket.end("HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
    return;
  }
  if (publicPathEscapes(req.url)) {
    socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
    return;
  }
  let target;
  try {
    target = buildTargetURL(req);
  } catch (err) {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n" + err.message);
    return socket.destroy();
  }

  const isTLS = target.protocol === "https:";
  const headers = { ...req.headers, host: target.host, ...fixedHeaders };
  if (headers.origin) headers.origin = target.origin;

  const upReq = (isTLS ? https : http).request({
    protocol: target.protocol,
    hostname: target.hostname,
    port: target.port || (isTLS ? 443 : 80),
    path: target.pathname + target.search,
    method: "GET",
    headers,
  });

  upReq.on("upgrade", (upRes, upSocket, upHead) => {
    upstreamSocket = upSocket;
    upSocket.on("error", () => socket.destroy());
    upSocket.on("close", () => socket.destroy());
    if (socket.destroyed) {
      upSocket.destroy();
      return;
    }
    rewriteSetCookieHeaders(upRes.headers);
    socket.write(
      "HTTP/1.1 101 Switching Protocols\r\n" +
        Object.entries(upRes.headers)
          .flatMap(([k, v]) =>
            (Array.isArray(v) ? v : [v]).map((value) => `${k}: ${value}`),
          )
          .join("\r\n") +
        "\r\n\r\n",
    );
    if (upHead && upHead.length) socket.write(upHead);
    if (_head && _head.length) upSocket.write(_head);

    upSocket.pipe(socket).pipe(upSocket);
  });

  upReq.on("error", () => socket.destroy());
  upReq.end();
});

/* ----------------------------------------------------------------------- */

// Prefer the deterministic port (LISTEN_PORT). If it is already in use, scan
// the fallback band upward instead of evicting whatever already holds the port.
const FALLBACK_PORT_START = workerData?.fallbackPortStart || LISTEN_PORT + 1;
const MAX_PORT_ATTEMPTS = workerData?.maxPortAttempts || 50;

function listenWithFallback(port, nextFallback, attemptsLeft) {
  function onError(err) {
    if (err && err.code === "EADDRINUSE" && attemptsLeft > 1) {
      parentPort?.postMessage(
        `[proxy-worker] port ${port} in use, trying ${nextFallback}`,
      );
      listenWithFallback(nextFallback, nextFallback + 1, attemptsLeft - 1);
      return;
    }
    parentPort?.postMessage(
      `proxy-server-error code=${err?.code || "UNKNOWN"} base=${LISTEN_PORT} lastTried=${port}`,
    );
  }

  server.once("error", onError);
  server.listen(port, LISTEN_HOST, () => {
    server.removeListener("error", onError);
    const boundPort = server.address()?.port ?? port;
    previewOrigin = `http://${PREVIEW_HOSTNAME}:${boundPort}`;
    publicPrefix = computePublicPrefix(boundPort);
    if (publicPrefix) {
      parentPort?.postMessage(`proxy-server-start public-url=${publicPrefix}/`);
    }
    parentPort?.postMessage(`proxy-server-start url=${previewOrigin}`);
  });
}

listenWithFallback(LISTEN_PORT, FALLBACK_PORT_START, MAX_PORT_ATTEMPTS);

function hasPreviewAuthority(req) {
  // Never forward cookies received through localhost, another app's name, or
  // a conflicting absolute-form request target.
  if (
    !previewOrigin ||
    req.headers.host?.toLowerCase() !== new URL(previewOrigin).host
  ) {
    return false;
  }
  try {
    return new URL(req.url, previewOrigin).origin === previewOrigin;
  } catch {
    return false;
  }
}

function rewriteRedirect(headers) {
  // Relative redirects already resolve on the public origin (and must retain
  // their request-relative path semantics).
  if (!headers.location || !/^(https?:)?\/\//i.test(headers.location)) return;
  try {
    const location = new URL(headers.location, rememberedOrigin);
    if (location.origin === rememberedOrigin) {
      // Hosted mode: point the browser back through the public proxy path.
      headers.location = publicPrefix
        ? `${publicPrefix}${location.pathname}${location.search}${location.hash}`
        : previewOrigin + location.pathname + location.search + location.hash;
    }
  } catch {
    // Leave malformed upstream redirects to the browser.
  }
}
