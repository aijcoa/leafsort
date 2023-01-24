/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useCallback, useState } from 'react';
import { GalleryContextInterface } from '../../main/@types/Context';

const { myAPI } = window;

export const GalleryContext = createContext<GalleryContextInterface>({
  folderPath: '',
  setFolderPath: (folderPath: string) => '',
  logItems: [],
  setLogItems: (logItems: LogItem[]) => [],
  getLogItems: () => Promise.resolve([]),
  sortedImages: 0,
  setSortedImages: (sortedImages: number) => 0,
  imgList: [],
  setImgList: (imgList: string[]) => [],
  imgURL: '',
  setImgURL: (imgURL: string) => '',
  onNext: () => Promise.resolve(),
  onPrevious: () => Promise.resolve(),
  onRemove: () => Promise.resolve(),
  onSort: (destinationPath: string) => Promise.resolve(),
  onClickOpen: () => Promise.resolve(),
  getImagesFromPath: (_e: Event, filefolderPath: string) => Promise.resolve(),
});

export const GalleryContextProvider = (props: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [folderPath, setFolderPath] = useState('');
  const [imgURL, setImgURL] = useState<string>('');
  const [imgList, setImgList] = useState<string[]>([]);
  const [logItems, setLogItems] = useState<LogItem[]>([]);
  const [sortedImages, setSortedImages] = useState<number>(0);

  const getLogItems = async (): Promise<LogItem[]> => {
    const logItems: LogItem[] = await myAPI.getLogItems();
    setLogItems(logItems.reverse());

    return logItems;
  };

  const removeImageFromState = useCallback(
    async (index: number) => {
      const newList = await myAPI.readdir(folderPath);

      if (!newList || newList.length === 0) {
        window.location.reload();
        return;
      }

      setImgList(newList);

      if (index > newList.length - 1) {
        setImgURL(newList[0]);
      } else {
        setImgURL(newList[index]);
      }
    },
    [folderPath],
  );

  const onNext = useCallback(async () => {
    if (!imgURL) return;

    const index = imgList.indexOf(imgURL);
    if (index === imgList.length - 1 || index === -1) {
      setImgURL(imgList[0]);
    } else {
      setImgURL(imgList[index + 1]);
    }
  }, [imgList, imgURL]);

  const onPrevious = useCallback(async () => {
    if (!imgURL) return;

    const index = imgList.indexOf(imgURL);
    if (index === 0) {
      setImgURL(imgList[imgList.length - 1]);
    } else if (index === -1) {
      setImgURL(imgList[0]);
    } else {
      setImgURL(imgList[index - 1]);
    }
  }, [imgList, imgURL]);

  const onRemove = useCallback(async () => {
    if (!imgList || imgList.length === 0) {
      window.location.reload();
      return;
    }

    const index = imgList.indexOf(imgURL);

    await myAPI.moveToTrash(imgURL);
    await removeImageFromState(index);
  }, [imgList, imgURL, removeImageFromState]);

  const onSort = async (destinationPath: string) => {
    if (!imgURL) {
      alert('Select a folder to sort');
      return;
    }

    const index = imgList.indexOf(imgURL);

    await myAPI.moveFile(imgURL, destinationPath);
    await getLogItems();
    await removeImageFromState(index);

    setSortedImages(sortedImages + 1);
    onNext();
  };

  const getImagesFromPath = useCallback(async (_e: Event | null, filefolderPath: string) => {
    if (!filefolderPath) return;

    setFolderPath(filefolderPath);

    const imgs = await myAPI.readdir(filefolderPath);

    if (!imgs || imgs.length === 0) {
      window.location.reload();
      return;
    }

    setImgList(imgs);
    setImgURL(imgs[0]);
  }, []);

  const onClickOpen = useCallback(async () => {
    const filefolderPath = await myAPI.openDialog();
    if (!filefolderPath) return;

    getImagesFromPath(null, filefolderPath);

    setFolderPath(filefolderPath);
  }, [getImagesFromPath]);

  return (
    <GalleryContext.Provider
      value={{
        imgURL,
        setImgURL,
        imgList,
        setImgList,
        folderPath,
        setFolderPath,
        logItems,
        setLogItems,
        getLogItems,
        sortedImages,
        setSortedImages,
        onNext,
        onPrevious,
        onClickOpen,
        getImagesFromPath,
        onRemove,
        onSort,
      }}>
      {props.children}
    </GalleryContext.Provider>
  );
};
