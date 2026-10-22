/**
 * Fallback preview router for hosted deployments (see context/dyad-web-deployment.md).
 *
 * Used only if the installed Caddy doesn't support placeholder upstreams
 * (`reverse_proxy 127.0.0.1:{re.pv.1}`). Caddy then proxies /preview/* here and
 * this router forwards HTTP + WebSocket upgrades to 127.0.0.1:<port> with
 * Host rewritten to localhost:<port> so worker/proxy_server.js's authority
 * check passes. Like the Caddy primary path, the /preview/<port> prefix is
 * forwarded as-is — the worker strips it itself (single source of truth).
 *
 * Zero dependencies. Run: node deploy/preview-router.mjs (listens 127.0.0.1:8788).
 */
import http from "node:http";

const LISTEN_PORT = Number(process.env.DYAD_PREVIEW_ROUTER_PORT ?? 8788);
// Preview proxy workers bind 42100 + appId % 10000 with 50 fallback ports.
const MIN_PORT = 42100;
const MAX_PORT = 42100 + 10000 + 50;

const server = http.createServer((req, res) => {
  const m = req.url.match(/^\/preview\/(\d+)(\/.*)?$/);
  const port = m ? Number(m[1]) : null;
  if (!port || port < MIN_PORT || port > MAX_PORT) {
    res.writeHead(404, { "content-type": "text/plain" });
    return void res.end("Unknown preview");
  }
  const headers = { ...req.headers, host: `localhost:${port}` };
  const up = http.request(
    {
      hostname: "127.0.0.1",
      port,
      path: req.url, // full /preview/<port>/... — the worker strips the prefix
      method: req.method,
      headers,
    },
    (upRes) => {
      res.writeHead(upRes.statusCode, upRes.headers);
      upRes.pipe(res);
    },
  );
  up.on("error", () => {
    res.writeHead(502, { "content-type": "text/plain" });
    res.end("Preview upstream error");
  });
  req.pipe(up);
});

server.on("upgrade", (req, socket, head) => {
  const m = req.url.match(/^\/preview\/(\d+)(\/.*)?$/);
  const port = m ? Number(m[1]) : null;
  if (!port || port < MIN_PORT || port > MAX_PORT) {
    socket.end("HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
    return;
  }
  const headers = { ...req.headers, host: `localhost:${port}` };
  const up = http.request({
    hostname: "127.0.0.1",
    port,
    path: req.url, // full /preview/<port>/... — the worker strips the prefix
    method: "GET",
    headers,
  });
  up.on("upgrade", (upRes, upSocket, upHead) => {
    let response = `HTTP/1.1 101 Switching Protocols\r\n`;
    for (const [k, v] of Object.entries(upRes.headers)) {
      for (const val of Array.isArray(v) ? v : [v])
        response += `${k}: ${val}\r\n`;
    }
    socket.write(response + "\r\n");
    if (upHead?.length) socket.write(upHead);
    if (head?.length) upSocket.write(head);
    upSocket.pipe(socket).pipe(upSocket);
    socket.on("error", () => upSocket.destroy());
    upSocket.on("error", () => socket.destroy());
  });
  up.on("error", () => socket.destroy());
  up.end();
});

server.listen(LISTEN_PORT, "127.0.0.1", () => {
  console.log(`[preview-router] listening on 127.0.0.1:${LISTEN_PORT}`);
});
