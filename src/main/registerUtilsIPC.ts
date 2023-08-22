import { app, ipcMain, shell } from 'electron';
import { checkmime, dotfiles, getTrashDirectory, isVideo } from './shared/utils';
import fs from 'fs-extra';
import path from 'node:path';
import { store } from './main';
import { addLogItem, markAsUndone } from './shared/logger';
import { OperationType } from './@types/Enums';
import { rebuildMenu } from './createMenu';

export const registerUtilsIPC = () => {
  ipcMain.handle('dirname', (_e: Event, filePath: string) => {
    return path.dirname(filePath);
  });

  ipcMain.handle('readdir', async (_e: Event, dir: string): Promise<void | string[]> => {
    return fs.promises
      .readdir(dir, { withFileTypes: true })
      .then((dirents) => {
        store.set('hasFile', true);
        rebuildMenu();

        return dirents
          .filter((dirent) => dirent.isFile())
          .filter(({ name }) => !name.startsWith(dotfiles))
          .map(({ name }) => path.resolve(dir, name))
          .filter((item) => checkmime(item))
          .sort();
      })
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
      }).catch((err) => console.error(err));
    });
  });

  ipcMain.handle('rename-file', async (_e, filePath: string, newName: string) => {
    const newPath = path.resolve(path.dirname(filePath), newName);

    fs.rename(filePath, newPath).then(async () => {
      await addLogItem({
        operation: OperationType.RENAMED,
        prevState: filePath,
        afterState: newPath,
        canBeUndone: true,
      }).catch((err) => console.error(err));
    });
  });

  ipcMain.handle('move-to-trash', async (_e: Event, filePath: string) => {
    Promise.all([
      shell.trashItem(filePath).then(() => shell.beep()),

      addLogItem({
        operation: OperationType.DELETED,
        prevState: filePath,
        afterState: getTrashDirectory() + '/' + path.basename(filePath),
        canBeUndone: false,
      }),
    ]).catch((err) => console.error(err));
  });

  ipcMain.handle('get-log-items', (): LogItem[] => {
    return store.get('log', [] as LogItem[]);
  });

  ipcMain.handle('undo-operation', async (_e: Event, log: LogItem): Promise<void> => {
    switch (log.operation) {
      case OperationType.DELETED:
        Promise.all([
          fs.move(log.afterState, log.prevState),
          markAsUndone(log),
          addLogItem({
            operation: OperationType.RESTORED,
            prevState: log.afterState,
            afterState: log.prevState,
            canBeUndone: true,
          }),
        ]);

        break;
      case OperationType.MOVED:
        Promise.all([
          fs.move(log.afterState, log.prevState),
          markAsUndone(log),
          addLogItem({
            operation: OperationType.MOVED,
            prevState: log.afterState,
            afterState: log.prevState,
            canBeUndone: true,
          }),
        ]);

        break;
      case OperationType.RENAMED:
        Promise.all([
          fs.rename(log.afterState, log.prevState),
          markAsUndone(log),
          addLogItem({
            operation: OperationType.RENAMED,
            prevState: log.afterState,
            afterState: log.prevState,
            canBeUndone: true,
          }),
        ]);

        break;
    }
  });
};
