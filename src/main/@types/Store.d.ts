declare type StoreType = {
  ask: boolean;
  x: number | undefined;
  y: number | undefined;
  width: number | undefined;
  height: number | undefined;
  language?: string;
  darkMode: boolean;
  showMenu: boolean;
  currentFile: FileType | undefined;
  previousFile: FileType | undefined;
  nextFile: FileType | undefined;
  keyBinds: KeyBindType[];
};

declare type FileType = {
  name: string;
  path: string;
};

declare type KeyBindType = {
  accelerator?: string;
  path?: string;
};
