export interface GalleryContextInterface {
  folderPath: string | '';
  setFolderPath(folderPath: string): void;
  logItems: LogItem[];
  setLogItems(logItems: LogItem[]): void;
  getLogItems: () => Promise<LogItem[]>;
  sortedImages: number;
  setSortedImages(sortedImages: number): void;
  imgList: string[];
  setImgList(imgList: string[]): void;
  imgURL: string;
  setImgURL(imgURL: string): void;
  onNext(): Promise<void>;
  onPrevious(): Promise<void>;
  onTrash(): Promise<void>;
  onMoveFile: (destinationPath: string) => Promise<void>;
  onClickOpen(): Promise<void>;
  getImagesFromPath(_e: Event | null, filefolderPath: string): Promise<void>;
}
