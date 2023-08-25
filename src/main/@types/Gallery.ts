export interface GalleryContextInterface {
  folderPath: string | '';
  setFolderPath(folderPath: string): void;
  sortedImages: number;
  setSortedImages(sortedImages: number): void;
  fileList: string[];
  setImgList(fileList: string[]): void;
  filePath: string;
  setFilePath(filePath: string): void;
  onMoveFile: (destinationPath: string) => Promise<void>;
  removeIndexFromState: (index: number) => Promise<void>;
  onClickOpen(): Promise<void>;
  getFilesFromPath(_e: Event | null, filefolderPath: string): Promise<void>;
}
