import { ipcMain } from 'electron';
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
    try {
      const keyBinds: KeyBindType[] = store.get('keyBinds');
      keyBinds.push(keyBind);
      store.set('keyBinds', keyBinds);

      return true;
    } catch (err) {
      console.error(err);

      return false;
    }
  });

  ipcMain.handle('remove-key-bind', (_e: Event, keyBind: KeyBindType): boolean => {
    try {
      const keyBinds: KeyBindType[] = store.get('keyBinds');
      const index = keyBinds.findIndex((k: KeyBindType) => k.bind === keyBind.bind);

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
