import React, { useCallback, useContext, useState } from 'react';
import { KeyBindContextInterface } from '../../../../main/@types/Context';
import { KeyBindContext } from '../../../providers/KeyBindContext';
import { Card } from '../../Card/Card';
import { Plus } from '../../Icons/Plus';
import { AddKeyBindModal } from '../AddKeyBindModal/AddKeyBindModal';
import { KeyMap } from '../KeyMap/KeyMap';
import './KeyMapList.scss';

const { myAPI } = window;

export const KeyMapList = () => {
  const keyBindContext = useContext<KeyBindContextInterface>(KeyBindContext);
  const { keyBinds, getKeyBinds } = keyBindContext;

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const removeKeyBind = useCallback(
    (bind: KeyBindType) => {
      myAPI.deleteKeyBind(bind).then(() => getKeyBinds());
    },
    [getKeyBinds],
  );

  return (
    <>
      <Card classes="col-10 h-100" title="Key | Path">
        {keyBinds.length ? (
          <table className="table key-mapping table-hover">
            <tbody>
              {keyBinds &&
                keyBinds.map((keyMap, index) => (
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
          onSave={getKeyBinds}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default KeyMapList;
