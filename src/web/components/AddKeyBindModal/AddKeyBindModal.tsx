import { memo, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/record/mousetrap-record';

import './AddKeyBindModal.scss';
import { Accelerator } from '../Accelerator/Accelerator';

const { myAPI } = window;

interface Props {
  isOpen: boolean;
  children?: ReactNode;
  onClose: () => void;
  onSave: (keyBind: KeyBindType) => void;
}

export const AddKeyBindModal = memo((props: Props) => {
  const { isOpen, onClose, onSave, children } = props;

  const [keyBind, setKeyBind] = useState<KeyBindType>();
  const recorderRef = useRef<HTMLTableCellElement>(null);

  const showHideClassName = isOpen ? 'modal d-block' : 'modal d-none';
  // const modifiers: string[] = ['alt', 'ctrl', 'capslock', 'shift', 'return', 'meta'];

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

  window.onkeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && keyBind?.accelerator && keyBind.path) {
      onSave(keyBind);
      onClose();
    }
  };

  return (
    <div className={showHideClassName} onClick={onClose}>
      <section className="modal-main" onClick={(e) => e.stopPropagation()}>
        {children}
        <p className="text-center">Press the desired key bind and choose a path</p>
        <table className="add-key-bind table">
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
