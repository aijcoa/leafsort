import { useContext, useEffect } from 'react';
import { GalleryContextInterface, KeyBindContextInterface } from '../../main/@types/Context';
import { GalleryContext } from '../providers/GalleryContext';
import { KeyBindContext } from '../providers/KeyBindContext';

import './App.scss';
import { Gallery } from './Gallery/Gallery';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar/Sidebar';

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
    onRemove,
    imgURL,
    imgList,
    sortedImages,
  } = galleryContext;

  const updateTitle = async (filefolderPath: string) => {
    await myAPI.updateTitle(filefolderPath);
  };

  useEffect(() => {
    if (folderPath) myAPI.history(folderPath);
  }, [folderPath]);

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
    const unlistenFn = myAPI.menuRemove(onRemove);
    return () => {
      unlistenFn();
    };
  }, [onRemove]);

  useEffect(() => {
    const unlistenFn = myAPI.menuOpen(getImagesFromPath);
    return () => {
      unlistenFn();
    };
  }, [getImagesFromPath]);

  useEffect(() => {
    const title = !folderPath ? 'Leaf | Sort' : `Sorting - ${folderPath}`;
    updateTitle(title);
  }, [folderPath]);

  useEffect(() => {
    getKeyBinds();
  }, [getKeyBinds, imgURL, registerKeyBinds]);

  useEffect(() => {
    if (!imgURL || !keyBinds) return;

    registerKeyBinds(keyBinds);
  }, [imgURL, keyBinds, registerKeyBinds]);

  return (
    <div className="row gx-3 h-100 justify-content-center">
      <div className="col-9 h-100">
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

      <Sidebar imagesSorted={sortedImages} />
    </div>
  );
};
