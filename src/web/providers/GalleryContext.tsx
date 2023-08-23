/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useCallback, useState } from 'react';
import { GalleryContextInterface } from 'types/index';

const { myAPI } = window;

export const GalleryContext = createContext<GalleryContextInterface>({
  folderPath: '',
  setFolderPath: (folderPath: string) => '',
  logItems: [],
  setLogItems: (logItems: LogItem[]) => [],
  getLogItems: () => Promise.resolve([]),
  sortedImages: 0,
  setSortedImages: (sortedImages: number) => 0,
  fileList: [],
  setImgList: (fileList: string[]) => [],
  filePath: '',
  setFilePath: (filePath: string) => '',
  onNext: () => Promise.resolve(),
  onPrevious: () => Promise.resolve(),
  onTrash: () => Promise.resolve(),
  onMoveFile: (destinationPath: string) => Promise.resolve(),
  onClickOpen: () => Promise.resolve(),
  getFilesFromPath: (_e: Event, folderPath: string) => Promise.resolve(),
});

export const GalleryContextProvider = (props: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [folderPath, setFolderPath] = useState('');
  const [filePath, setFilePath] = useState<string>('');
  const [fileList, setImgList] = useState<string[]>([]);
  const [logItems, setLogItems] = useState<LogItem[]>([]);
  const [sortedImages, setSortedImages] = useState<number>(0);

  const removeImageFromState = useCallback(
    async (index: number) => {
      const newList = await myAPI.readdir(folderPath);

      if (!newList || newList.length === 0) {
        window.location.reload();
        return;
      }

      setImgList(newList);

      if (index > newList.length - 1) {
        setFilePath(newList[0]);
      } else {
        setFilePath(newList[index]);
      }
    },
    [folderPath],
  );

  const getFilesFromPath = useCallback(async (_e: Event | null, folderPath: string) => {
    if (!folderPath) return;

    setFolderPath(folderPath);

    const files = await myAPI.readdir(folderPath);
    if (!files || files.length === 0) {
      window.location.reload();

      return;
    }

    setImgList(files);
    setFilePath(files[0]);
  }, []);

  const onNext = useCallback(async () => {
    if (!filePath) return;

    const index = fileList.indexOf(filePath);
    if (index === fileList.length - 1 || index === -1) {
      setFilePath(fileList[0]);
    } else {
      setFilePath(fileList[index + 1]);
    }
  }, [fileList, filePath]);

  const onPrevious = useCallback(async () => {
    if (!filePath) return;

    const index = fileList.indexOf(filePath);
    if (index === 0) {
      setFilePath(fileList[fileList.length - 1]);
    } else if (index === -1) {
      setFilePath(fileList[0]);
    } else {
      setFilePath(fileList[index - 1]);
    }
  }, [fileList, filePath]);

  const onTrash = useCallback(async () => {
    if (!fileList || fileList.length === 0) {
      window.location.reload();
      return;
    }

    const index = fileList.indexOf(filePath);

    await myAPI.moveToTrash(filePath);
    await removeImageFromState(index);
  }, [fileList, filePath, removeImageFromState]);

  const onClickOpen = useCallback(async () => {
    const folderPath = await myAPI.openDialog();
    if (!folderPath) return;

    await getFilesFromPath(null, folderPath);
    setFolderPath(folderPath);
  }, [getFilesFromPath]);

  const onMoveFile = async (destinationPath: string) => {
    if (!filePath) {
      alert('Select a folder to sort');
      return;
    }

    const index = fileList.indexOf(filePath);

    Promise.all([
      myAPI.moveFile(filePath, destinationPath),
      getLogItems(),
      removeImageFromState(index),
    ]);

    setSortedImages(sortedImages + 1);
    onNext();
  };

  const getLogItems = async (): Promise<LogItem[]> => {
    const logItems: LogItem[] = await myAPI.getLogItems();
    setLogItems(logItems.reverse());

    return logItems;
  };

  return (
    <GalleryContext.Provider
      value={{
        filePath: filePath,
        setFilePath: setFilePath,
        fileList,
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
        getFilesFromPath,
        onTrash,
        onMoveFile,
      }}>
      {props.children}
    </GalleryContext.Provider>
  );
};
