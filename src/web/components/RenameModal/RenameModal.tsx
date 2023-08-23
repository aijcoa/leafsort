import { memo, useContext, useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal/Modal';
import { getFileNameFromPath, trimExtension } from '../../helpers/helpers';
import './RenameModal.scss';
import { GalleryContext } from '../../providers';
import { GalleryContextInterface, IElectronAPI } from 'types/index';

interface Props {
  myAPI: IElectronAPI;
  originalFilePath: string;
  onClose: () => void;
}

export const RenameModal = memo<Props>((props: Props) => {
  const { myAPI, originalFilePath, onClose } = props;
  const [fileName, setFileName] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const originalFileName = getFileNameFromPath(originalFilePath);

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { getFilesFromPath, folderPath } = galleryContext;

  const handleSubmit = async () => {
    if (!fileName) return;
    await myAPI.renameFile(originalFilePath, fileName);
    await getFilesFromPath(null, folderPath);
    onClose();
  };

  useEffect(() => {
    inputRef.current?.setSelectionRange(0, trimExtension(originalFileName).length, 'forward');
  }, [originalFileName, originalFilePath]);

  return (
    <Modal onSubmit={handleSubmit} onClose={onClose} title={'Rename File'}>
      <div className="rename-modal">
        <input
          autoFocus
          value={fileName ?? originalFileName}
          ref={inputRef}
          className="w-100"
          type="text"
          id="rename-modal__input"
          onChange={(e) => {
            setFileName(e.target.value);
          }}
        />
        <div className="rename-modal__buttons d-flex">
          <button className="w-50" onClick={onClose}>
            Cancel
          </button>
          <button className="w-50" onClick={handleSubmit}>
            Rename
          </button>
        </div>
      </div>
    </Modal>
  );
});

RenameModal.displayName = 'RenameModal';
