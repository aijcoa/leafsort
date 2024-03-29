import { useContext } from 'react';
import { preventDefault } from '../../../helpers/helpers';
import { GalleryContext, LogContext } from '../../../providers';
import { GalleryContextInterface, LogContextInterface } from '@types';

const { myAPI } = window;

interface Props {
  logItem: LogItem;
  isFullScreen: boolean;
}

export const LogItem = (props: Props) => {
  const { isFullScreen, logItem } = props;

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { setSortedImages, sortedImages, getFilesFromPath, folderPath } = galleryContext;

  const logContext = useContext<LogContextInterface>(LogContext);
  const { getLogItems } = logContext;

  const hideShowClass = isFullScreen ? 'log-action' : 'd-none';

  const handleUndo = async (e: React.MouseEvent<HTMLTableCellElement>, operation: LogItem) => {
    preventDefault(e);

    if (!operation.afterState || !operation.canBeUndone) return;

    Promise.all([
      myAPI.undoOperation(operation),
      getLogItems(),
      getFilesFromPath(null, folderPath),
    ]).catch((err) => console.error(err));

    sortedImages > 0 ?? setSortedImages(sortedImages - 1);
  };

  return (
    <tr>
      {isFullScreen && <td className="log-item">{logItem.operation}</td>}

      <td className="log-item">
        {logItem.prevState} {'->'} {logItem.afterState}
      </td>

      {logItem.canBeUndone ? (
        <td onClick={(e) => handleUndo(e, logItem)} className={hideShowClass}>
          Undo
        </td>
      ) : (
        <td className={hideShowClass}>Undone</td>
      )}
    </tr>
  );
};
