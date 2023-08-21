/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { GalleryContextInterface, KeyBindContextInterface } from '../../main/@types/Context';
import Mousetrap from 'mousetrap';
import { GalleryContext } from './GalleryContext';

const { myAPI } = window;

export const KeyBindContext = createContext<KeyBindContextInterface>({
  keyBinds: [] as KeyBindType[],
  setKeyBinds: (keyBinds: KeyBindType[]) => [],
  getKeyBinds: () => Promise.resolve([]),
  registerKeyBinds: (keyBind: KeyBindType[]) => Promise.resolve(),
  unregisterKeyBind: (keyBind: KeyBindType) => Promise.resolve(),
});

export const KeyBindContextProvider = (props: {
  children: React.ReactNode;
}): React.ReactElement => {
  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { onMoveFile } = galleryContext;

  const [keyBinds, setKeyBinds] = useState<KeyBindType[]>([]);

  const getKeyBinds = useCallback(async (): Promise<KeyBindType[]> => {
    const binds = await myAPI.getKeyBinds();
    setKeyBinds(binds);
    return binds;
  }, []);

  const registerKeyBinds = useCallback(
    async (binds: KeyBindType[]) => {
      Object.entries(binds).forEach(([_idx, bind]) => {
        if (bind.accelerator) {
          Mousetrap.bind(bind.accelerator.toLowerCase(), async () => {
            if (bind.path) await onMoveFile(bind.path);
          });

          return false;
        }
      });
    },
    [onMoveFile],
  );

  const unregisterKeyBind = useCallback(async (keyBind: KeyBindType) => {
    if (!keyBind.accelerator) return;
    Mousetrap.ubind(keyBind.accelerator);
  }, []);

  return (
    <KeyBindContext.Provider
      value={{
        keyBinds,
        setKeyBinds,
        getKeyBinds,
        registerKeyBinds,
        unregisterKeyBind,
      }}>
      {props.children}
    </KeyBindContext.Provider>
  );
};
