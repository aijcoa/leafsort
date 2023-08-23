import { memo, useContext } from 'react';
import { Card } from '../Card/Card';
import { FolderOpen } from '../Icons/FolderOpen';
import { View } from '../View/View';
import './Gallery.scss';
import { GalleryContextInterface, IElectronAPI } from 'types/index';
import { GalleryContext } from '../../providers';

interface Props {
  isDarwin: boolean;
  myAPI: IElectronAPI;
  imgURL?: string;
  setFolderPath: (path: string) => void;
}

export const Gallery = memo((props: Props) => {
  const { isDarwin, myAPI, setFolderPath, imgURL } = props;

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { onClickOpen, setImgURL, setImgList } = galleryContext;

  const preventDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    preventDefault(e);

    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0] as FileWithPath;

      if (file.name.startsWith('.')) return;

      const imgs = await myAPI.readdir(file.path);

      if (!imgs || imgs.length === 0) {
        window.location.reload();
        return;
      }

      setFolderPath(file.path);
      setImgList(imgs);
      setImgURL(imgs[0]);
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
              <FolderOpen size="medium" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
});

Gallery.displayName = 'Gallery';
