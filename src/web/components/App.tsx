import { useCallback, useContext, useEffect, useState } from 'react';
import { Gallery } from './Gallery/Gallery';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar/Sidebar';
import { RenameModal } from './RenameModal/RenameModal';
import { GalleryContextInterface, KeyBindContextInterface } from 'types/index';
import { KeyBindContext, GalleryContext } from '../providers';
import './App.scss';

const { myAPI } = window;

export const App = () => {
  const isDarwin = navigator.userAgentData.platform === 'macOS';
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);

  const keyBindContext = useContext<KeyBindContextInterface>(KeyBindContext);
  const { keyBinds, getKeyBinds, registerKeyBinds } = keyBindContext;

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const {
    onNext,
    onPrevious,
    folderPath,
    setFolderPath,
    getFilesFromPath,
    onTrash,
    filePath: filePath,
  } = galleryContext;

  const handleOnRenameMenu = useCallback(async () => {
    setShowRenameModal(!showRenameModal);
  }, [showRenameModal]);

  useEffect(() => {
    const unlistenFn = myAPI.menuNext(onNext);
    return () => {
      unlistenFn();
    };
  }, [onNext]);

  useEffect(() => {
    const unlistenFn = myAPI.menuPrev(onPrevious);
    return () => {
      unlistenFn();
    };
  }, [onPrevious]);

  useEffect(() => {
    const unlistenFn = myAPI.menuRemove(onTrash);
    return () => {
      unlistenFn();
    };
  }, [onTrash]);

  useEffect(() => {
    const unlistenFn = myAPI.menuRename(handleOnRenameMenu);
    return () => {
      unlistenFn();
    };
  }, [handleOnRenameMenu]);

  useEffect(() => {
    const unlistenFn = myAPI.menuOpen(getFilesFromPath);
    return () => {
      unlistenFn();
    };
  }, [getFilesFromPath]);

  useEffect(() => {
    const title = !folderPath ? 'Leaf | Sort' : `Sorting - ${folderPath}`;
    myAPI.updateTitle(title);
  }, [folderPath]);

  useEffect(() => {
    getKeyBinds();
  }, [getKeyBinds, filePath, registerKeyBinds]);

  useEffect(() => {
    if (!filePath || !keyBinds) return;

    registerKeyBinds(keyBinds);
  }, [filePath, keyBinds, registerKeyBinds]);

  return (
    <div className="row gx-3 h-100">
      <div className="col-md-9 h-100">
        <div className="row gy-0 h-100">
          <Header folderPath={folderPath} />
          <Gallery
            isDarwin={isDarwin}
            myAPI={myAPI}
            setFolderPath={setFolderPath}
            filePath={filePath}
          />
        </div>
      </div>
      <Sidebar />

      {showRenameModal && (
        <RenameModal
          myAPI={myAPI}
          originalFilePath={filePath}
          onClose={() => setShowRenameModal(false)}
        />
      )}
    </div>
  );
};
