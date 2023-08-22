declare global {
  interface Window {
    myAPI: IElectronAPI;
  }

  interface FileWithPath extends File {
    path: string;
  }
}

export interface IElectronAPI {
  getLocale: () => Promise<string>;
  contextMenu: () => Promise<void>;
  history: (filePath: string) => Promise<void>;
  mimecheck: (filePath: string) => Promise<boolean>;
  isVideo: (filePath: string) => Promise<boolean>;
  dirname: (filePath: string) => Promise<string>;
  readdir: (dirPath: string) => Promise<void | string[]>;
  moveToTrash: (filePath: string) => Promise<void>;
  moveFile: (filePath: string, destinationPath: string) => Promise<void>;
  renameFile: (filePath: string, newFileName: string) => Promise<void>;
  openDialog: () => Promise<string | void | undefined>;
  updateTitle: (filePath: string) => Promise<void>;
  getKeyBinds: () => Promise<KeyBindType[]>;
  storeKeyBind: (keyBind: KeyBindType) => Promise<void>;
  deleteKeyBind: (keyBind: KeyBindType) => Promise<void>;
  getLogItems: () => Promise<LogItem[]>;
  undoOperation: (logItem: LogItem) => Promise<void>;
  menuNext: (listener: () => Promise<void>) => () => Electron.IpcRenderer;
  menuPrev: (listener: () => Promise<void>) => () => Electron.IpcRenderer;
  menuRemove: (listener: () => Promise<void>) => () => Electron.IpcRenderer;
  menuRename: (listener: () => Promise<void>) => () => Electron.IpcRenderer;
  menuOpen: (
    listener: (_e: Event, filePath: string) => Promise<void>,
  ) => () => Electron.IpcRenderer;
}
