import { memo, useContext } from 'react';
import { Card } from '../Card/Card';
import { FolderOpen } from '../Icons/FolderOpen';
import { View } from '../View/View';
import { GalleryContext } from '../../providers';
import { GalleryContextInterface, IElectronAPI } from '@types';
import './Gallery.scss';

interface Props {
  isDarwin: boolean;
  myAPI: IElectronAPI;
  filePath?: string;
  setFolderPath: (path: string) => void;
}

export const Gallery = memo((props: Props) => {
  const { isDarwin, myAPI, setFolderPath, filePath } = props;

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { onClickOpen, setFilePath: setFilePath, setImgList } = galleryContext;

  const preventDefault = (e: React.DragEvent<HTMLDivElement> | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    preventDefault(e);

    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0] as FileWithPath;

      if (file.name.startsWith('.')) return;

      const files = await myAPI.readdir(file.path);

      if (!files || files.length === 0) {
        window.location.reload();
        return;
      }

      setFolderPath(file.path);
      setImgList(files);
      setFilePath(files[0]);
    }
  };

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDarwin) {
      return false;
    }

    preventDefault(e);
    myAPI.contextMenu();
  };

  return (
    <div
      className="image-container h-90"
      onDrop={onDrop}
      onDragOver={preventDefault}
      onDragEnter={preventDefault}
      onDragLeave={preventDefault}
      onContextMenu={onContextMenu}>
      {filePath ? (
        <Card classes="h-100" title={filePath}>
          <View url={filePath} />
        </Card>
      ) : (
        <Card bodyClasses="gallery" classes="h-100" title="Select a folder to begin">
          <div className="folder">
            <div className="icon" title="Open..." onClick={onClickOpen}>
              <FolderOpen size="medium" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
});

Gallery.displayName = 'Gallery';
