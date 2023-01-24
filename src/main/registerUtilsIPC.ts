import { app, ipcMain } from 'electron';
import { checkmime, isVideo } from './shared/utils';

import fs from 'fs-extra';
import path from 'node:path';
import { store } from './main';
import { addLogItem, disableUndo } from './shared/logger';
import { OperationType } from './@types/Enums';

const isDarwin = process.platform === 'darwin';
const dotfiles = isDarwin ? '.' : '._';

export const registerUtilsIPC = () => {
  ipcMain.handle('dirname', (_e: Event, filePath: string) => {
    return path.dirname(filePath);
  });

  ipcMain.handle('readdir', async (_e: Event, dir: string) => {
    return fs.promises
      .readdir(dir, { withFileTypes: true })
      .then((dirents) =>
        dirents
          .filter((dirent) => dirent.isFile())
          .filter(({ name }) => !name.startsWith(dotfiles))
          .map(({ name }) => path.resolve(dir, name))
          .filter((item) => checkmime(item))
          .sort(),
      )
      .catch((err) => console.error(err));
  });

  ipcMain.handle('mime-check', (_e: Event, filePath: string) => {
    return checkmime(filePath);
  });

  ipcMain.handle('is-video', (_e: Event, filePath: string) => {
    return isVideo(filePath);
  });

  ipcMain.handle('get-locale', () => store.get('language') || app.getLocale());

  ipcMain.handle('file-history', (_e, arg: string) => app.addRecentDocument(arg));

  ipcMain.handle('set-current-file', (_e, currentFile: string) => {
    store.set('currentFile', currentFile);
  });

  ipcMain.handle('move-file', async (_e, filePath: string, destinationPath: string) => {
    const fileName = path.basename(filePath);
    const fullPath =
      fs.existsSync(destinationPath) && fs.lstatSync(destinationPath).isDirectory()
        ? `${destinationPath}/${fileName}`
        : destinationPath;

    fs.move(filePath, fullPath).then(async () => {
      await addLogItem({
        operation: OperationType.MOVED,
        prevState: filePath,
        afterState: fullPath,
        canBeUndone: true,
      });
    });
  });

  ipcMain.handle('get-log-items', (): LogItem[] => {
    return store.get('log', [] as LogItem[]);
  });

  ipcMain.handle('add-log-item', (_e: Event, logItem: LogItem): void => {
    const logItems: LogItem[] = store.get('log');

    logItems.push(logItem);
    store.set('log', logItems);
  });

  ipcMain.handle('disable-undo-log', (_e: Event, logItem: LogItem): void => {
    disableUndo(logItem);
  });
};
