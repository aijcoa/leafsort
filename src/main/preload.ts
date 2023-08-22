import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('myAPI', {
  getLocale: (): Promise<string> => ipcRenderer.invoke('get-locale'),

  contextMenu: (): Promise<void> => ipcRenderer.invoke('show-context-menu'),

  history: (filePath: string): Promise<void> => ipcRenderer.invoke('file-history', filePath),

  mimecheck: (filePath: string): Promise<boolean> => ipcRenderer.invoke('mime-check', filePath),

  isVideo: (filePath: string): Promise<boolean> => ipcRenderer.invoke('is-video', filePath),

  dirname: (filePath: string): Promise<string> => ipcRenderer.invoke('dirname', filePath),

  readdir: (dirPath: string): Promise<void | string[]> => ipcRenderer.invoke('readdir', dirPath),

  moveToTrash: (filePath: string): Promise<void> => ipcRenderer.invoke('move-to-trash', filePath),

  moveFile: (filePath: string, destinationPath: string): Promise<void> =>
    ipcRenderer.invoke('move-file', filePath, destinationPath),

  renameFile: (filePath: string, newFileName: string): Promise<void> =>
    ipcRenderer.invoke('rename-file', filePath, newFileName),

  openDialog: (): Promise<string | void | undefined> => ipcRenderer.invoke('open-dialog'),

  updateTitle: (title: string): Promise<void> => ipcRenderer.invoke('update-title', title),

  menuNext: (listener: () => Promise<void>) => {
    ipcRenderer.on('menu-next', listener);
    return () => ipcRenderer.removeAllListeners('menu-next');
  },

  menuPrev: (listener: () => Promise<void>) => {
    ipcRenderer.on('menu-prev', listener);
    return () => ipcRenderer.removeAllListeners('menu-prev');
  },

  menuRemove: (listener: () => Promise<void>) => {
    ipcRenderer.on('menu-remove', listener);
    return () => ipcRenderer.removeAllListeners('menu-remove');
  },

  menuRename: (listener: () => Promise<void>) => {
    ipcRenderer.on('menu-rename', listener);
    return () => ipcRenderer.removeAllListeners('menu-rename');
  },

  menuOpen: (listener: (_e: Event, filePath: string) => Promise<void>) => {
    ipcRenderer.on('menu-open', listener);
    return () => ipcRenderer.removeAllListeners('menu-open');
  },

  storeKeyBind: async (keyBind: KeyBindType): Promise<void> =>
    ipcRenderer.invoke('store-key-bind', keyBind),

  deleteKeyBind: async (keyBind: KeyBindType): Promise<void> =>
    ipcRenderer.invoke('delete-key-bind', keyBind),

  getKeyBinds: (): Promise<KeyBindType[]> => ipcRenderer.invoke('get-key-binds'),

  getLogItems: (): Promise<LogItem[]> => ipcRenderer.invoke('get-log-items'),

  undoOperation: (logItem: LogItem): Promise<LogItem[]> =>
    ipcRenderer.invoke('undo-operation', logItem),
});
