// Bridges Electron's utilityProcess parentPort API onto a plain
// child_process.fork child so the real code-explorer worker bundle runs in
// non-Electron test/benchmark runtimes. See electron_mock.ts utilityProcess.
const bundle = process.env.NEXTBILLION_TEST_WORKER_BUNDLE;
if (!bundle) {
  throw new Error("NEXTBILLION_TEST_WORKER_BUNDLE not set");
}
process.parentPort = {
  on(event, listener) {
    if (event === "message") {
      process.on("message", (m) => listener({ data: m }));
    }
  },
  postMessage(message) {
    process.send(message);
  },
  start() {},
};
require(bundle);
