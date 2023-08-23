import { useContext, useEffect } from 'react';
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

  const keyBindContext = useContext<KeyBindContextInterface>(KeyBindContext);
  const { keyBinds, getKeyBinds, registerKeyBinds } = keyBindContext;

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const {
    onNext,
    onPrevious,
    folderPath,
    setFolderPath,
    getImagesFromPath,
    onTrash,
    onRenameMenu,
    imgURL,
    showRenameModal,
    setShowRenameModal,
  } = galleryContext;

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
    const unlistenFn = myAPI.menuRename(onRenameMenu);
    return () => {
      unlistenFn();
    };
  }, [onRenameMenu]);

  useEffect(() => {
    const unlistenFn = myAPI.menuOpen(getImagesFromPath);
    return () => {
      unlistenFn();
    };
  }, [getImagesFromPath]);

  useEffect(() => {
    const title = !folderPath ? 'Leaf | Sort' : `Sorting - ${folderPath}`;
    myAPI.updateTitle(title);
  }, [folderPath]);

  useEffect(() => {
    getKeyBinds();
  }, [getKeyBinds, imgURL, registerKeyBinds]);

  useEffect(() => {
    if (!imgURL || !keyBinds) return;

    registerKeyBinds(keyBinds);
  }, [imgURL, keyBinds, registerKeyBinds]);

  return (
    <div className="row gx-3 h-100">
      <div className="col-md-9 h-100">
        <div className="row gy-0 h-100">
          <Header folderPath={folderPath} />
          <Gallery
            isDarwin={isDarwin}
            myAPI={myAPI}
            setFolderPath={setFolderPath}
            imgURL={imgURL}
          />
        </div>
      </div>
      <Sidebar />

      {showRenameModal && (
        <RenameModal
          myAPI={myAPI}
          originalFilePath={imgURL}
          onClose={() => setShowRenameModal(false)}
        />
      )}
    </div>
  );
};
