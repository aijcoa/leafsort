import { ipcMain } from 'electron';
import { hasUncaughtExceptionCaptureCallback } from 'process';
import { BindConflictException } from './exceptions/BindConflictException';
import { store } from './main';

export const registerKeyBindsIPC = () => {
  ipcMain.handle('get-all-key-binds', () => {
    try {
      return store.get('keyBinds', [] as KeyBindType[]);
    } catch (err) {
      console.error(err);

      return false;
    }
  });

  ipcMain.handle('add-key-bind', (_e: Event, keyBind: KeyBindType): boolean => {
    const keyBinds: KeyBindType[] = store.get('keyBinds');

    if (keyBinds.find((k) => k.accelerator === keyBind.accelerator)) {
      throw new BindConflictException('Bind in use');
    } else {
      keyBinds.push(keyBind);
      store.set('keyBinds', keyBinds);

      return true;
    }
  });

  ipcMain.handle('remove-key-map', (_e: Event, keyBind: KeyBindType): boolean => {
    try {
      const keyBinds: KeyBindType[] = store.get('keyBinds');
      const index = keyBinds.findIndex((k: KeyBindType) => k.accelerator === keyBind.accelerator);

      if (index !== -1) {
        keyBinds.splice(index, 1);
        store.set('keyBinds', keyBinds);
      }

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  });

  // const keyBind = store.get('keyBinds').find((keyBind) => keyBind.bind === 'J');
};
