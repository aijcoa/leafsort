import { memo, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Mousetrap from 'mousetrap';
import { Accelerator } from '../Accelerator/Accelerator';

import 'mousetrap/plugins/record/mousetrap-record';
import './AddKeyBindModal.scss';
import { KeyBindContextInterface } from '../../../main/@types/Context';
import { KeyBindContext } from '../../providers/KeyBindContext';

const { myAPI } = window;

interface Props {
  isOpen: boolean;
  children?: ReactNode;
  onClose: () => void;
  onSave: () => void;
}

export const AddKeyBindModal = memo((props: Props) => {
  const { isOpen, onClose, onSave, children } = props;

  const [keyBind, setKeyBind] = useState<KeyBindType>();
  const recorderRef = useRef<HTMLTableCellElement>(null);

  const keyBindContext = useContext<KeyBindContextInterface>(KeyBindContext);
  const { keyBinds, setKeyBinds, registerKeyBinds } = keyBindContext;

  const showHideClass = isOpen ? 'modal d-block' : 'modal d-none';

  const handleAddKeyBind = useCallback(
    async (keyBind: KeyBindType) => {
      await registerKeyBinds([keyBind]);
      await myAPI.storeKeyBind(keyBind);

      setKeyBinds([...keyBinds, keyBind]);
      onSave();
    },
    [keyBinds, onSave, registerKeyBinds, setKeyBinds],
  );

  const recordAccelerator = () => {
    Mousetrap.record((sequence: string[]) => {
      if (sequence.toString() === 'enter') return;

      setKeyBind({ ...keyBind, accelerator: sequence.join('+') });
    });
  };

  const onClickOpen = useCallback(async () => {
    const filefolderPath = await myAPI.openDialog();
    if (!filefolderPath) return;

    setKeyBind({ ...keyBind, path: filefolderPath });
  }, [keyBind]);

  useEffect(() => {
    recorderRef.current?.focus();
  }, []);

  window.onkeydown = async (event: KeyboardEvent) => {
    if (event.key === 'Enter' && keyBind?.accelerator && keyBind.path) {
      await handleAddKeyBind(keyBind);
      onClose();
    }
  };

  return (
    <div className={showHideClass} onClick={onClose}>
      <section className="modal-main" onClick={(e) => e.stopPropagation()}>
        {children}
        <p className="text-center">Press the desired key bind, choose a path, then ENTER to save</p>
        <table className="store-key-bind table">
          <tbody>
            <tr>
              <td
                ref={recorderRef}
                className="accelerator-recorder w-50 h-100"
                tabIndex={0}
                onKeyDown={recordAccelerator}>
                <div className="accelerator-output">
                  {keyBind?.accelerator && <Accelerator accelerator={keyBind.accelerator} />}
                </div>
              </td>
              <td className="select-path" onClick={onClickOpen}>
                {keyBind?.path || 'PATH'}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
});

AddKeyBindModal.displayName = 'AddKeyBindModal';
