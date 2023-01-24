import { ipcMain } from 'electron';
import { BindConflictException } from './exceptions/BindConflictException';
import { store } from './main';

export const registerKeyBindsIPC = () => {
  ipcMain.handle('get-key-binds', (): KeyBindType[] => {
    return store.get('keyBinds', [] as KeyBindType[]);
  });

  ipcMain.handle('store-key-bind', (_e: Event, keyBind: KeyBindType): void => {
    const keyBinds: KeyBindType[] = store.get('keyBinds');

    if (keyBinds.find((k) => k.accelerator === keyBind.accelerator)) {
      throw new BindConflictException('Bind in use');
    } else {
      keyBinds.push(keyBind);
      store.set('keyBinds', keyBinds);
    }
  });

  ipcMain.handle('delete-key-bind', (_e: Event, keyBind: KeyBindType): void => {
    try {
      const keyBinds: KeyBindType[] = store.get('keyBinds');
      const index = keyBinds.findIndex((k: KeyBindType) => k.accelerator === keyBind.accelerator);

      if (index !== -1) {
        keyBinds.splice(index, 1);
        store.set('keyBinds', keyBinds);
      }
    } catch (err) {
      console.error(err);
    }
  });
};
