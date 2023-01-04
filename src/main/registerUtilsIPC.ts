import { ipcMain } from 'electron';
import { checkmime, isVideo } from './shared/utils';
import { store } from './main';

import fs from 'node:fs';
import path from 'node:path';

const isDarwin = process.platform === 'darwin';
const dotfiles = isDarwin ? '.' : '._';

export const registerUtilsIPC = () => {
  ipcMain.handle('dirname', (_e: Event, filepath: string) => {
    return path.dirname(filepath);
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

  ipcMain.handle('mime-check', (_e: Event, filepath: string) => {
    return checkmime(filepath);
  });

  ipcMain.handle('is-video', (_e: Event, filepath: string) => {
    return isVideo(filepath);
  });
};
