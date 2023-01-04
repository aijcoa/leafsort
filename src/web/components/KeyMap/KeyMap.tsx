import { memo, useEffect, useState } from 'react';
import { Trash } from '../Icons/Trash';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/record/mousetrap-record';
import './KeyMap.scss';
import { Accelerator } from '../Accelerator/Accelerator';

interface Props {
  keyMap: KeyBindType;
  index: number;
  onUpdateKeyBind: (index: number, bind: KeyBindType) => void;
  onRemoveKeyBind: (bind: KeyBindType) => void;
  onSaveKeyBind: (bind: KeyBindType) => void;
}

export const KeyMap = memo((props: Props) => {
  const { keyMap, index, onRemoveKeyBind, onSaveKeyBind, onUpdateKeyBind } = props;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newKeyBind, setNewKeyBind] = useState<KeyBindType>();

  const rec = () => {
    Mousetrap.record((sequence: string[]) => {
      setNewKeyBind({ accelerator: sequence.join('+'), path: undefined });
    });
  };

  // const rec = (e: KeyboardEvent) => {
  //   e.preventDefault();
  //   setNewKeyBind('');

  //   let input = e.key;
  //   input = input.toLowerCase();
  //   input = input.replace('Control', 'ctrl');

  //   const tempBind = newKeyBind ? '+' + newKeyBind + '+' : '';
  //   if (!tempKeyMap.includes('+' + input + '+') && (newKeyBind + input).length < 25) {
  //     input = newKeyBind ? newKeyBind + '+' + input : input;
  //     setNewKeyBind(input);
  //   }
  // };

  // useEffect(() => {
  //   if (inputRef.current) {
  //     let foo: string[] = [];

  //     inputRef.current.addEventListener('keydown', (event) => {
  //       console.log(foo);
  //       foo.push(event.key);
  //     });
  //     inputRef.current.addEventListener('keyup', () => {
  //       setNewKeyBind(foo);
  //       // foo = [];
  //     });
  //     foo = [];
  //   }
  // }, []);

  useEffect(() => {
    if (!keyMap.accelerator || !keyMap.path) {
      setIsEditing(true);
    }
  }, [keyMap.accelerator, keyMap.path]);

  return (
    <tr className="key-bind table-active">
      <td>
        {newKeyBind?.accelerator ? (
          <Accelerator accelerator={newKeyBind?.accelerator} />
        ) : (
          <input onKeyDown={rec} className="empty-bind" placeholder={'Add Bind'} />
        )}
      </td>
      <td className="path">
        {keyMap?.path ? (
          <kbd>keyMap.path</kbd>
        ) : (
          <input onKeyDown={rec} className="empty-bind" placeholder={newKeyBind?.path || 'Path'} />
        )}
      </td>
      <td>
        {isEditing ? (
          <div
            className="icon remove-key-map"
            title="Save KeyMap..."
            onClick={() => onSaveKeyBind(keyMap)}>
            <Trash />
          </div>
        ) : (
          <div
            className="icon remove-key-map"
            title="Remove KeyMap..."
            onClick={() => onRemoveKeyBind(keyMap)}>
            <Trash />
          </div>
        )}
      </td>
    </tr>
  );
});

KeyMap.displayName = 'KeyMap';
