import React, { useCallback, useEffect, useState } from 'react';
import { AddKeyBindModal } from '../AddKeyBindModal/AddKeyBindModal';
import { Card } from '../Card/Card';
import { Plus } from '../Icons/Plus';
import { KeyMap } from '../KeyMap/KeyMap';
import './KeyMappings.scss';

const { myAPI } = window;

export const KeyMappings = () => {
  const [keyMappings, setKeyMappings] = useState<KeyBindType[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const getAllKeyBinds = useCallback(() => {
    myAPI.getAllKeyBinds().then((result) => {
      if (result) {
        setKeyMappings(result);
      }
    });
  }, []);

  const handleAddKeyBind = useCallback(
    (keyBind: KeyBindType) => {
      myAPI.addKeyBind(keyBind).then(() => {
        setKeyMappings((mappings) => [...mappings, keyBind]);
        getAllKeyBinds();
      });
    },
    [getAllKeyBinds],
  );

  const removeKeyBind = useCallback(
    (bind: KeyBindType) => {
      myAPI.removeKeyBind(bind).then(() => getAllKeyBinds());
    },
    [getAllKeyBinds],
  );

  useEffect(() => {
    getAllKeyBinds();
  }, [getAllKeyBinds]);

  return (
    <>
      <Card classes="col-10 h-100" title="Key | Path">
        {keyMappings.length ? (
          <table className="table key-mapping table-hover">
            <tbody>
              {keyMappings &&
                keyMappings.map((keyMap, index) => (
                  <KeyMap key={index} keyMap={keyMap} onRemoveKeyBind={removeKeyBind} />
                ))}
              <tr className="add-key-bind">
                <td colSpan={2} className="text-center path">
                  Add key mapping
                </td>
                <td>
                  <div onClick={() => setModalOpen(true)} className="icon" title="Add key bind">
                    <Plus size="small" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="icon no-binds" title="Add key bind" onClick={() => setModalOpen(true)}>
            <Plus size="medium" />
          </div>
        )}
      </Card>

      {isModalOpen && (
        <AddKeyBindModal
          onSave={handleAddKeyBind}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default KeyMappings;
