// Access gate for the headless RPC surface (POST /rpc/<channel> + /ws).
//
// Two layers:
// 1. Origin allowlist — browser clients are only accepted from the local
//    renderer origin (Vite on 127.0.0.1:4173 by default). Requests WITHOUT an
//    Origin header (curl, node scripts, same-process probes) are allowed:
//    the threat being defended against is a web page open in any browser on
//    this machine driving the server cross-origin, and non-browser localhost
//    clients already run with the user's own privileges.
// 2. Optional shared token — when DYAD_RPC_TOKEN is set, every request must
//    present it (x-dyad-rpc-token header on /rpc, ?token= query on /ws). The
//    renderer bridge picks it up from VITE_RPC_TOKEN, which the
//    headless:browser launcher passes through.

export const DEFAULT_RPC_ALLOWED_ORIGINS = [
  "http://127.0.0.1:4173",
  "http://localhost:4173",
];

export function getAllowedRpcOrigins(
  env: {
    DYAD_RPC_ALLOWED_ORIGINS?: string;
  } = process.env,
): Set<string> {
  const raw = env.DYAD_RPC_ALLOWED_ORIGINS?.trim();
  const list = raw ? raw.split(",") : DEFAULT_RPC_ALLOWED_ORIGINS;
  return new Set(
    list.map((origin) => origin.trim().replace(/\/$/, "")).filter(Boolean),
  );
}

export function isRpcRequestAllowed(options: {
  origin: string | undefined;
  presentedToken: string | undefined;
  expectedToken: string | undefined;
  allowedOrigins: Set<string>;
}): boolean {
  const { origin, presentedToken, expectedToken, allowedOrigins } = options;
  if (expectedToken && presentedToken !== expectedToken) {
    return false;
  }
  if (!origin) {
    return true;
  }
  return allowedOrigins.has(origin.trim().replace(/\/$/, ""));
}
