import React, { useCallback, useContext, useState } from 'react';
import { Card } from '../../Card/Card';
import { Plus } from '../../Icons/Plus';
import { AddKeyBindModal } from '../AddKeyBindModal/AddKeyBindModal';
import { KeyMap } from '../KeyMap/KeyMap';
import './KeyMapList.scss';
import { KeyBindContextInterface } from 'types/index';
import { KeyBindContext } from '../../../providers/index';

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
      <Card
        bodyClasses={
          keyBinds.length === 0 ? 'justify-content-center align-items-center d-flex' : ''
        }
        classes="col-10 h-100"
        title="Key | Path">
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
                  <button onClick={() => setModalOpen(true)} className="icon" title="Add key bind">
                    <Plus size="small" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <button className="icon no-binds" title="Add key bind" onClick={() => setModalOpen(true)}>
            <Plus size="medium" />
          </button>
        )}
      </Card>

      {isModalOpen && (
        <AddKeyBindModal onSubmit={getKeyBinds} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};

export default KeyMapList;
