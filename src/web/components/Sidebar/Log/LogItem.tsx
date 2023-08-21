import { useContext } from 'react';
import { GalleryContextInterface } from '../../../../main/@types/Context';
import { preventDefault } from '../../../helpers/helpers';
import { GalleryContext } from '../../../providers/GalleryContext';
import { OperationType } from '../../../../main/@types/Enums';

const { myAPI } = window;

interface Props {
  logItem: LogItem;
  isFullScreen: boolean;
}

export const LogItem = (props: Props) => {
  const { isFullScreen, logItem } = props;

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { setSortedImages, sortedImages, getLogItems, getImagesFromPath, folderPath } =
    galleryContext;

  const hideShowClass = isFullScreen ? 'log-action' : 'd-none';

  const handleUndo = async (e: React.MouseEvent<HTMLTableCellElement>, operation: LogItem) => {
    preventDefault(e);

    if (!operation.afterState || !operation.canBeUndone) return;

    Promise.all([
      await myAPI.moveFile(operation.afterState, operation.prevState),
      await getLogItems(),
      await getImagesFromPath(null, folderPath),
    ]);

    sortedImages > 0 ?? setSortedImages(sortedImages - 1);
  };

  return (
    <tr>
      <td className="log-item">
        {logItem.prevState} {'->'} {logItem.afterState}
      </td>

      {logItem.canBeUndone && (
        <td onClick={(e) => handleUndo(e, logItem)} className={hideShowClass}>
          Undo
        </td>
      )}

      {logItem.operation === OperationType.UNDO && (
        <td onClick={(e) => preventDefault(e)} className={hideShowClass}>
          Undone
        </td>
      )}

      {logItem.operation === OperationType.DELETED && (
        <td onClick={(e) => preventDefault(e)} className={hideShowClass}>
          Trashed
        </td>
      )}
    </tr>
  );
};
