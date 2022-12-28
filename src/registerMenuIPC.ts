import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import { store } from './main';

import path from 'node:path';

import i18next from 'i18next';

const isDarwin = process.platform === 'darwin';
const dotfiles = isDarwin ? '.' : '._';

export const registerMenuIPC = (mainWindow: BrowserWindow) => {
  ipcMain.handle('open-dialog', async () => {
    return dialog
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
        title: `${i18next.t('Select an image')}`,
        filters: [
          {
            name: i18next.t('Image files'),
            extensions: ['bmp', 'gif', 'ico', 'jpg', 'jpeg', 'png', 'svg', 'webp'],
          },
        ],
      })
      .then((result) => {
        if (result.canceled) return;
        if (path.basename(result.filePaths[0]).startsWith(dotfiles)) return;

        return result.filePaths[0];
      })
      .catch((err) => console.log(err));
  });

  ipcMain.handle('move-to-trash', async (_e: Event, filepath: string) => {
    await shell.trashItem(filepath).then(() => shell.beep());
  });

  ipcMain.handle('update-title', (_e: Event, filepath: string) => {
    mainWindow.setTitle(path.basename(filepath));
  });

  ipcMain.handle('get-locale', () => store.get('language') || app.getLocale());

  ipcMain.handle('file-history', (_e, arg) => app.addRecentDocument(arg));
};
