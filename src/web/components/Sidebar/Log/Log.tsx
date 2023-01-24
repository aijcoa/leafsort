import React, { useContext, useState } from 'react';
import { GalleryContextInterface } from '../../../../main/@types/Context';
import { OperationType } from '../../../../main/@types/Enums';
import { GalleryContext } from '../../../providers/GalleryContext';
import { Card } from '../../Card/Card';
import './Log.scss';

const { myAPI } = window;

interface Props {
  logItems: LogItem[];
}

export const Log = (props: Props) => {
  const { logItems } = props;

  const [isFullScreen, setIsFullScreen] = useState(false);

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { setSortedImages, sortedImages, getLogItems, getImagesFromPath, folderPath } =
    galleryContext;

  const fullScreenClass = isFullScreen ? 'fullscreen' : 'h-100';
  const hideShowClass = isFullScreen ? 'log-action' : 'd-none';

  const preventDefault = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUndo = async (e: React.MouseEvent<HTMLTableCellElement>, operation: LogItem) => {
    preventDefault(e);

    if (!operation.afterState || !operation.canBeUndone) return;

    await myAPI.moveFile(operation.afterState, operation.prevState);
    await myAPI.disableUndo(operation);
    await getLogItems();
    await getImagesFromPath(null, folderPath);

    sortedImages > 0 ?? setSortedImages(sortedImages - 1);
    setIsFullScreen(false);
  };

  const renderOperation = (operation: string) => {
    switch (operation) {
      case OperationType.MOVED:
        return '->';
      default:
        break;
    }
  };

  return (
    <div className={fullScreenClass} onClick={() => setIsFullScreen(!isFullScreen)}>
      <Card bodyClasses="overflow-scroll" classes="col-10 h-100" title="Log">
        {logItems.length ? (
          <table className="table log table-hover w-100">
            <tbody className="w-100">
              {logItems &&
                logItems.map((logItem: LogItem, index) => (
                  <tr key={index}>
                    <td className="log-item">
                      {logItem.prevState} {renderOperation(logItem.operation)} {logItem.afterState}
                    </td>
                    {logItem.canBeUndone ? (
                      <td onClick={(e) => handleUndo(e, logItem)} className={hideShowClass}>
                        Undo
                      </td>
                    ) : (
                      <td onClick={(e) => preventDefault(e)} className={hideShowClass}>
                        Undone
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="icon no-binds">
            <p>No Logs</p>
          </div>
        )}
      </Card>
    </div>
  );
};
