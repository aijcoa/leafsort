/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { GalleryContextInterface, KeyBindContextInterface } from '../../main/@types/Context';
import Mousetrap from 'mousetrap';
import { GalleryContext } from './GalleryContext';

const { myAPI } = window;

export const KeyBindContext = createContext<KeyBindContextInterface>({
  keyBinds: [] as KeyBindType[],
  setKeyBinds: (keyBinds: KeyBindType[]) => [],
  getAllKeyBinds: () => Promise.resolve([]),
  registerKeyBinds: (keyBind: KeyBindType[]) => Promise.resolve(),
  unregisterKeyBind: (keyBind: KeyBindType) => Promise.resolve(),
});

export const KeyBindContextProvider = (props: {
  children: React.ReactNode;
}): React.ReactElement => {
  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { onMove } = galleryContext;

  const [keyBinds, setKeyBinds] = useState<KeyBindType[]>([]);

  const getAllKeyBinds = useCallback(async (): Promise<KeyBindType[]> => {
    const binds = await myAPI.getAllKeyBinds();
    setKeyBinds(binds);
    return binds;
  }, []);

  const registerKeyBinds = useCallback(
    async (binds: KeyBindType[]) => {
      Object.entries(binds).forEach(([_idx, bind]) => {
        if (bind.accelerator) {
          Mousetrap.bind(bind.accelerator.toLowerCase(), async () => {
            if (bind.path) onMove(bind.path);
          });

          return false;
        }
      });
    },
    [onMove],
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
        getAllKeyBinds,
        registerKeyBinds,
        unregisterKeyBind,
      }}>
      {props.children}
    </KeyBindContext.Provider>
  );
};
