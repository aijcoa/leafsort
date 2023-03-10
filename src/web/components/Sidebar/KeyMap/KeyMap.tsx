import { memo } from 'react';
import { Trash } from '../../Icons/Trash';
import './KeyMap.scss';
import { Accelerator } from '../Accelerator/Accelerator';

interface Props {
  keyMap: KeyBindType;
  onRemoveKeyBind: (bind: KeyBindType) => void;
}

export const KeyMap = memo((props: Props) => {
  const { keyMap, onRemoveKeyBind } = props;

  const getFolderFromPath = (path: string) => {
    const match = path.match(/([^/]+)$/);
    return match ? match[0] : path;
  };

  return (
    <tr className="key-bind table-active">
      <td>
        <Accelerator accelerator={keyMap?.accelerator} />
      </td>
      <td className="path">{keyMap.path && <code>{getFolderFromPath(keyMap.path)}</code>}</td>
      <td>
        <div
          className="icon delete-key-bind"
          title="Remove Bind"
          onClick={() => onRemoveKeyBind(keyMap)}>
          <Trash />
        </div>
      </td>
    </tr>
  );
});

KeyMap.displayName = 'KeyMap';
