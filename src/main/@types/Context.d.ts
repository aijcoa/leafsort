/* eslint-disable no-undef */
declare global {
  interface Window {
    myAPI: IElectronAPI;
  }

  /**
   * https://stackoverflow.com/a/72680192/2130426
   */
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

  openDialog: () => Promise<string | void | undefined>;

  updateTitle: (filePath: string) => Promise<void>;

  menuNext: (listener: () => Promise<void>) => () => Electron.IpcRenderer;

  menuPrev: (listener: () => Promise<void>) => () => Electron.IpcRenderer;

  menuRemove: (listener: () => Promise<void>) => () => Electron.IpcRenderer;

  menuOpen: (
    listener: (_e: Event, filePath: string) => Promise<void>,
  ) => () => Electron.IpcRenderer;

  getKeyBinds: () => Promise<KeyBindType[]>;

  storeKeyBind: (keyBind: KeyBindType) => Promise<void>;

  deleteKeyBind: (keyBind: KeyBindType) => Promise<void>;

  getLogItems: () => Promise<LogItem[]>;

  disableUndo: (logItem: LogItem) => Promise<void>;
}

export interface GalleryContextInterface {
  folderPath: string | '';
  setFolderPath(folderPath: string): void;
  logItems: LogItem[];
  setLogItems(logItems: LogItem[]): void;
  getLogItems: () => Promise<LogItem[]>;
  sortedImages: number;
  setSortedImages(sortedImages: number): void;
  imgList: string[];
  setImgList(imgList: string[]): void;
  imgURL: string;
  setImgURL(imgURL: string): void;
  onNext(): Promise<void>;
  onPrevious(): Promise<void>;
  onRemove(): Promise<void>;
  onSort: (destinationPath: string) => Promise<void>;
  onClickOpen(): Promise<void>;
  getImagesFromPath(_e: Event | null, filefolderPath: string): Promise<void>;
}

export interface KeyBindContextInterface {
  keyBinds: KeyBindType[];
  setKeyBinds(keyBinds: KeyBindType[]): void;
  getKeyBinds: () => Promise<KeyBindType[]>;
  registerKeyBinds: (keyBind: KeyBindType[]) => Promise<void>;
  unregisterKeyBind: (keyBind: KeyBindType) => Promise<void>;
}
