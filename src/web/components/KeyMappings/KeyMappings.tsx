import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../Card/Card';
import { FolderOpen } from '../Icons/FolderOpen';
import { Plus } from '../Icons/Plus';
import { KeyMap } from '../KeyMap/KeyMap';
import './KeyMappings.scss';

const { myAPI } = window;

export const KeyMappings = () => {
  const [keyMappings, setKeyMappings] = useState<KeyBindType[]>([]);

  const getAllKeyBinds = useCallback(() => {
    myAPI.getAllKeyBinds().then((result) => {
      if (result) {
        setKeyMappings(result);
      }
    });
  }, []);

  const handleAddKeyBind = useCallback(() => {
    const emptyKeyBind = { path: undefined, accelerator: undefined };
    setKeyMappings((mappings) => [...mappings, emptyKeyBind]);
  }, []);

  const addKeyBind = useCallback((bind: KeyBindType) => {
    myAPI
      .addKeyBind(bind)
      .then(() => getAllKeyBinds())
      .catch(() => alert('Bind already in use.'));
  }, []);

  const removeKeyBind = useCallback((bind: KeyBindType) => {
    myAPI.removeKeyBind(bind).then(() => getAllKeyBinds());
  }, []);

  const updateKeyBind = useCallback((index: number, bind: KeyBindType) => {
    console.info('index: ', index);
    console.info('bind: ', bind);
  }, []);

  const updateKeyPath = useCallback((bind: KeyBindType) => {
    //
  }, []);

  useEffect(() => {
    getAllKeyBinds();
  }, [getAllKeyBinds]);

  window.onkeydown = (event: KeyboardEvent) => {
    if (keyMappings.findIndex((k: KeyBindType) => k.accelerator === event.key)) {
      console.info('triggered existing key bind');
    }
  };

  return (
    <Card classes="col-10 h-100" title="Key | Path">
      {/* <button onClick ={() => addKeyBind()}>Add Key Bind</button> */}

      {keyMappings.length ? (
        <table className="table key-mapping table-hover">
          <tbody>
            {keyMappings &&
              keyMappings.map((keyMap, index) => (
                <KeyMap
                  key={index}
                  index={index}
                  keyMap={keyMap}
                  onUpdateKeyBind={updateKeyBind}
                  onRemoveKeyBind={removeKeyBind}
                  onSaveKeyBind={addKeyBind}
                />
              ))}
            <tr className="add-key-bind">
              <td colSpan={2} className="path">
                Add a key bind
              </td>
              <td>
                <div onClick={handleAddKeyBind} className="icon" title="Add key bind...">
                  <Plus />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="folder">
          <div className="icon" title="Open..." onClick={handleAddKeyBind}>
            <FolderOpen size="large" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default KeyMappings;
