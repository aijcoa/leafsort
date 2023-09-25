/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { LogContext } from './LogContext';
import { GalleryContextInterface, LogContextInterface } from '@types';

const { myAPI } = window;

export const GalleryContext = createContext<GalleryContextInterface>({
  folderPath: '',
  setFolderPath: (folderPath: string) => '',
  sortedImages: 0,
  setSortedImages: (sortedImages: number) => 0,
  fileList: [],
  setImgList: (fileList: string[]) => [],
  filePath: '',
  setFilePath: (filePath: string) => '',
  onMoveFile: (destinationPath: string) => Promise.resolve(),
  removeIndexFromState: (index: number) => Promise.resolve(),
  onClickOpen: () => Promise.resolve(),
  getFilesFromPath: (_e: Event, folderPath: string) => Promise.resolve(),
});

export const GalleryContextProvider = (props: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [folderPath, setFolderPath] = useState('');
  const [filePath, setFilePath] = useState<string>('');
  const [fileList, setImgList] = useState<string[]>([]);
  const [sortedImages, setSortedImages] = useState<number>(0);

  const logContext = useContext<LogContextInterface>(LogContext);
  const { getLogItems } = logContext;

  const removeIndexFromState = useCallback(
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
      removeIndexFromState(index),
    ]).then(() => {
      setSortedImages(sortedImages + 1);
      onNext();
    });
  };

  return (
    <GalleryContext.Provider
      value={{
        filePath,
        setFilePath,
        fileList,
        setImgList,
        folderPath,
        setFolderPath,
        sortedImages,
        setSortedImages,
        onClickOpen,
        getFilesFromPath,
        removeIndexFromState,
        onMoveFile,
      }}>
      {props.children}
    </GalleryContext.Provider>
  );
};
