import fs from "node:fs";
import path from "node:path";
import { EventEmitter } from "node:events";

const configuredDataDir = path.resolve(
  process.env.DYAD_DATA_DIR?.trim() ||
    process.env.DYAD_DEV_USER_DATA_DIR?.trim() ||
    path.join(process.cwd(), "userData"),
);

const ensureDir = (target: string) => {
  fs.mkdirSync(target, { recursive: true });
  return target;
};

function getAppPath(name: string): string {
  const map: Record<string, string> = {
    userData: configuredDataDir,
    sessionData: configuredDataDir,
    temp: path.join(configuredDataDir, "tmp"),
    crashDumps: path.join(configuredDataDir, "Crashpad"),
    logs: path.join(configuredDataDir, "logs"),
    appData: configuredDataDir,
    home: path.join(configuredDataDir, "home"),
  };

  const resolved = map[name] ?? path.join(configuredDataDir, name);
  ensureDir(path.dirname(resolved));
  return resolved;
}

const ipcHandlers = new Map<string, (...args: any[]) => Promise<any> | any>();

export const ipcMain = new EventEmitter() as EventEmitter & {
  handle: (
    channel: string,
    listener: (...args: any[]) => Promise<any> | any,
  ) => void;
  handleOnce: (
    channel: string,
    listener: (...args: any[]) => Promise<any> | any,
  ) => void;
  removeHandler: (channel: string) => void;
  getHandler: (
    channel: string,
  ) => ((...args: any[]) => Promise<any> | any) | undefined;
};

ipcMain.handle = (channel, listener) => {
  ipcHandlers.set(channel, listener);
};

ipcMain.handleOnce = (channel, listener) => {
  ipcHandlers.set(channel, listener);
};

ipcMain.removeHandler = (channel) => {
  ipcHandlers.delete(channel);
};

ipcMain.getHandler = (channel) => ipcHandlers.get(channel);

export const ipcRenderer = {
  invoke: async (channel: string, ...args: any[]) => {
    const handler = ipcHandlers.get(channel);
    if (!handler) {
      throw new Error(`No IPC handler registered for channel "${channel}".`);
    }
    return await handler({ sender: { id: 0 } }, ...args);
  },
  on: () => undefined,
  once: () => undefined,
  removeAllListeners: () => undefined,
  send: () => undefined,
  sendSync: () => undefined,
  removeListener: () => undefined,
};

const virtualWindow = {
  id: 1,
  isDestroyed: () => false,
  focus: () => undefined,
  show: () => undefined,
  hide: () => undefined,
  close: () => undefined,
  destroy: () => undefined,
  webContents: {
    id: 1,
    send: () => undefined,
    once: () => undefined,
    removeListener: () => undefined,
    addListener: () => undefined,
    on: () => undefined,
    isDestroyed: () => false,
  },
};

export const app = {
  isPackaged: false,
  name: "Dyad",
  isReady: () => true,
  whenReady: async () => undefined,
  once: () => app,
  on: () => app,
  off: () => app,
  addListener: () => app,
  removeListener: () => app,
  quit: () => undefined,
  exit: (code = 0) => {
    process.exitCode = code;
  },
  getName: () => "Dyad",
  getVersion: () => process.env.DYAD_APP_VERSION || "0.0.0-headless",
  getPath: (name: string) => getAppPath(name),
  setPath: (name: string, value: string) => {
    if (
      name === "userData" ||
      name === "sessionData" ||
      name === "crashDumps"
    ) {
      ensureDir(value);
    }
    return value;
  },
  setActivationPolicy: () => undefined,
  disableHardwareAcceleration: () => undefined,
  commandLine: {
    appendSwitch: () => undefined,
    appendArgument: () => undefined,
  },
  dock: {
    hide: () => undefined,
    show: () => undefined,
    setIcon: () => undefined,
  },
};

export class BrowserWindow {
  static fromWebContents() {
    return virtualWindow;
  }

  static getAllWindows() {
    return [virtualWindow];
  }

  static getFocusedWindow() {
    return virtualWindow;
  }

  static fromId() {
    return virtualWindow;
  }

  webContents = {
    id: 0,
    send: () => undefined,
    once: () => undefined,
    removeListener: () => undefined,
    addListener: () => undefined,
    on: () => undefined,
    isDestroyed: () => false,
  };

  constructor() {
    return this;
  }

  loadURL() {
    return undefined;
  }

  loadFile() {
    return undefined;
  }

  show() {
    return undefined;
  }

  hide() {
    return undefined;
  }

  close() {
    return undefined;
  }

  destroy() {
    return undefined;
  }

  focus() {
    return undefined;
  }

  isDestroyed() {
    return false;
  }

  setMenuBarVisibility() {
    return undefined;
  }

  setAutoHideMenuBar() {
    return undefined;
  }

  setAlwaysOnTop() {
    return undefined;
  }

  setTitle() {
    return undefined;
  }
}

export class WebContentsView {
  webContents = {
    id: 0,
    send: () => undefined,
    once: () => undefined,
    removeListener: () => undefined,
    addListener: () => undefined,
    on: () => undefined,
    isDestroyed: () => false,
  };
}

export const Menu = {
  buildFromTemplate: () => ({}) as any,
  setApplicationMenu: () => undefined,
};

export const dialog = {
  showErrorBox: () => undefined,
  showMessageBox: async () => ({ response: 0 }),
  showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
  showSaveDialog: async () => ({ canceled: true, filePath: undefined }),
};

export const shell = {
  openExternal: async () => undefined,
  openPath: async () => "",
  showItemInFolder: () => undefined,
};

export const nativeTheme = {
  shouldUseDarkColors: false,
  themeSource: "system",
  on: () => undefined,
  off: () => undefined,
  once: () => undefined,
  addListener: () => undefined,
  removeListener: () => undefined,
};

export const safeStorage = {
  isEncryptionAvailable: () => true,
  encryptString: (text: string) => Buffer.from(text, "utf8"),
  decryptString: (buffer: Buffer | Uint8Array | string) => {
    if (typeof buffer === "string") {
      return buffer;
    }
    return Buffer.from(buffer).toString("utf8");
  },
};

export const autoUpdater = {
  setFeedURL: () => undefined,
  checkForUpdates: async () => ({}),
  on: () => autoUpdater,
  once: () => autoUpdater,
  quitAndInstall: () => undefined,
};

export const protocol = {
  registerStringProtocol: () => undefined,
  registerFileProtocol: () => undefined,
  registerSchemesAsPrivileged: () => undefined,
  interceptFileProtocol: () => undefined,
};

export const net = {
  fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
};

export const nativeImage = {
  createFromPath: () => ({}) as any,
};

export const crashReporter = {
  start: () => undefined,
  addExtraParameter: () => undefined,
};

export const session = {
  defaultSession: {
    cookies: { flushStore: async () => undefined },
    protocol: { registerStringProtocol: () => undefined },
    resourcesPath: configuredDataDir,
  },
};

export const clipboard = {
  readText: () => "",
  writeText: () => undefined,
  readImage: () => null,
  writeImage: () => undefined,
};

export const notification = {
  show: () => undefined,
};

export const utilityProcess = {
  fork: () => ({
    pid: 0,
    kill: () => undefined,
    on: () => undefined,
    once: () => undefined,
    removeListener: () => undefined,
  }),
};

export const screen = {
  getPrimaryDisplay: () => ({
    bounds: { x: 0, y: 0, width: 1200, height: 800 },
    scaleFactor: 1,
  }),
  getAllDisplays: () => [],
};

const electronShim = {
  app,
  BrowserWindow,
  WebContentsView,
  Menu,
  dialog,
  shell,
  safeStorage,
  autoUpdater,
  protocol,
  net,
  nativeImage,
  crashReporter,
  session,
  clipboard,
  notification,
  utilityProcess,
  screen,
  ipcMain,
  ipcRenderer,
  nativeTheme,
};

export default electronShim;
