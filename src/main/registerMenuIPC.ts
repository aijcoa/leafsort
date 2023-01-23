import path from 'node:path';
import i18next from 'i18next';
import { BrowserWindow, ipcMain, dialog, shell } from 'electron';

const isDarwin = process.platform === 'darwin';
const dotfiles = isDarwin ? '.' : '._';

export const registerMenuIPC = (mainWindow: BrowserWindow) => {
  ipcMain.handle('open-dialog', async () => {
    return dialog
      .showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
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
      .catch((err) => console.info(err));
  });

  ipcMain.handle('move-to-trash', async (_e: Event, filePath: string) => {
    await shell.trashItem(filePath).then(() => shell.beep());
  });

  ipcMain.handle('update-title', (_e: Event, filePath: string) => {
    mainWindow.setTitle(path.basename(filePath));
  });
};
