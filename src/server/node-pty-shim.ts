export function spawn() {
  const processLike = {
    pid: 0,
    kill: () => undefined,
    write: () => undefined,
    resize: () => undefined,
    destroy: () => undefined,
    onData: () => ({ dispose: () => undefined }),
    onExit: () => ({ dispose: () => undefined }),
    on: () => undefined,
    once: () => undefined,
    removeListener: () => undefined,
    emit: () => undefined,
    process: null,
    cols: 0,
    rows: 0,
  };
  return processLike as any;
}

export default { spawn };
