import { app, ipcMain } from 'electron';
import { checkmime, isVideo } from './shared/utils';

import fs from 'fs-extra';
import path from 'node:path';
import { store } from './main';

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
    await fs.move(filePath, `${destinationPath}/${fileName}`);

    console.info(`moving ${filePath} to ${destinationPath}`);
  });
};
