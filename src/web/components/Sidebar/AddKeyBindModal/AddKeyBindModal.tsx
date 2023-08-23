import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Mousetrap from 'mousetrap';
import { Accelerator } from '../Accelerator/Accelerator';
import 'mousetrap/plugins/record/mousetrap-record';
import './AddKeyBindModal.scss';
import { KeyBindContext } from '../../../providers/KeyBindContext';
import { Modal } from '../../Modal/Modal';
import { KeyBindContextInterface } from 'types/index';

const { myAPI } = window;

interface Props {
  onClose: () => void;
  onSubmit: () => void;
}

export const AddKeyBindModal = (props: Props) => {
  const { onClose, onSubmit } = props;
  const recorderRef = useRef<HTMLTableCellElement>(null);
  const [keyBind, setKeyBind] = useState<KeyBindType>();
  const keyBindContext = useContext<KeyBindContextInterface>(KeyBindContext);
  const { keyBinds, setKeyBinds, registerKeyBinds } = keyBindContext;

  const handleAddKeyBind = useCallback(
    async (keyBind: KeyBindType): Promise<boolean> => {
      try {
        await registerKeyBinds([keyBind]);
        await myAPI.storeKeyBind(keyBind);

        setKeyBinds([...keyBinds, keyBind]);
        onSubmit();

        return true;
      } catch (error) {
        alert(error);
        setKeyBind({ ...keyBind, accelerator: '' });

        return false;
      }
    },
    [keyBinds, onSubmit, registerKeyBinds, setKeyBinds],
  );

  const recordAccelerator = () => {
    Mousetrap.record((sequence: string[]) => {
      if (sequence.toString() === 'enter') return;

      setKeyBind({ ...keyBind, accelerator: sequence.join('+') });
    });
  };

  const onClickOpen = useCallback(async () => {
    const destinationPath = await myAPI.openDialog();

    if (!destinationPath) return;

    setKeyBind({ ...keyBind, path: destinationPath });
  }, [keyBind]);

  const handleClose = useCallback(() => {
    setKeyBind(undefined);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (keyBind?.accelerator && keyBind.path) {
      handleAddKeyBind(keyBind).then((success) => (success ? handleClose() : null));
    }
  }, [handleAddKeyBind, handleClose, keyBind]);

  useEffect(() => {
    recorderRef.current?.focus();
  }, []);

  return (
    <Modal
      onSubmit={handleSubmit}
      onClose={handleClose}
      title={'Press the desired key bind, choose a path, then ENTER to save'}>
      <table className="store-key-bind table">
        <tbody>
          <tr>
            <td
              ref={recorderRef}
              className="accelerator-recorder w-50 h-100"
              tabIndex={0}
              onKeyDown={recordAccelerator}>
              <div className="accelerator-output align-items-center">
                {keyBind?.accelerator && <Accelerator accelerator={keyBind.accelerator} />}
              </div>
            </td>
            <td className="select-path text-center" onClick={onClickOpen}>
              {keyBind?.path || 'SELECT PATH'}
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};
