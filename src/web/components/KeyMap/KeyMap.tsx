import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../Card/Card';
import { KeyBind } from '../KeyBind/KeyBind';

const { myAPI } = window;

// state of keymaps
// onEffect of keymaps => add/remove on processor electron-state
// onDocument load keymaps from electron-state
// input for keymap, folderpicker for path

export const KeyMap = () => {
  const [keyMappings, setKeyMappings] = useState<KeyBindType[]>([]);

  const getAllKeyBinds = useCallback(() => {
    myAPI.getAllKeyBinds().then((result) => {
      if (result) {
        setKeyMappings(result);
      }
    });
  }, []);

  const addKeyBind = useCallback(() => {
    myAPI.addKeyBind({ bind: 'B', path: 'foo/bar' }).then(() => getAllKeyBinds());
  }, [getAllKeyBinds]);

  const removeKeyBind = useCallback(() => {
    myAPI.removeKeyBind({ bind: 'B', path: 'foo/bar' }).then(() => getAllKeyBinds());
  }, [getAllKeyBinds]);

  useEffect(() => {
    getAllKeyBinds();
  }, []);

  return (
    <Card classes="col-10 h-100" title="Mapping">
      <KeyBind empty={true} />
      <button onClick={() => addKeyBind()}>Add Key Bind</button>
      <button onClick={() => removeKeyBind()}>Remove Key Bind</button>

      {/* {keyMappings && keyMappings.map((keyMap) => <KeyBind key={keyMap.bind} bind={keyMap} />)} */}
    </Card>
  );
};

export default KeyMap;
