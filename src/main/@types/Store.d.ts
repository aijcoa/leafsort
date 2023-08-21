declare type StoreType = {
  ask: boolean;
  x: number | undefined;
  y: number | undefined;
  width: number | undefined;
  height: number | undefined;
  language?: string;
  darkMode: boolean;
  showMenu: boolean;
  hasFile: boolean;
  previousFile: FileType | undefined;
  nextFile: FileType | undefined;
  keyBinds: KeyBindType[];
  log: LogItem[];
};

declare type FileType = {
  name: string;
  path: string;
};

declare type KeyBindType = {
  accelerator?: string;
  path?: string;
};

declare type LogItem = {
  operation: OperationType;
  prevState: string;
  afterState?: string;
  canBeUndone?: boolean;
};
