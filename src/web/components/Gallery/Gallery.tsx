import { memo, useContext } from 'react';
import { FileWithPath, GalleryContextInterface, IElectronAPI } from '../../../@types/Context';
import { GalleryContext } from '../../providers/GalleryContext';
import { Card } from '../Card/Card';
import { FolderOpen } from '../Icons/FolderOpen';
import { View } from '../View/View';
import './Gallery.scss';

interface Props {
  isDarwin: boolean;
  myAPI: IElectronAPI;
  imgURL?: string;
  setFolderPath: (path: string) => void;
}

export const Gallery = memo((props: Props) => {
  const { isDarwin, myAPI, setFolderPath, imgURL } = props;
  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { onClickOpen, setImgURL } = galleryContext;

  const preventDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    preventDefault(e);

    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0] as FileWithPath;

      if (file.name.startsWith('.')) return;

      const dirName = await myAPI.dirname(file.path);
      setFolderPath(dirName);
      setImgURL(file.path);
    }
  };

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDarwin) {
      e.preventDefault();
      return false;
    }

    e.preventDefault();
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
      {imgURL ? (
        <Card classes="h-100" title={imgURL}>
          <View url={imgURL} />
        </Card>
      ) : (
        <Card bodyClasses="gallery" classes="h-100" title="Select a folder to begin">
          <div className="folder">
            <div className="icon" title="Open..." onClick={onClickOpen}>
              <FolderOpen size="large" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
});

Gallery.displayName = 'Gallery';
