export interface LogContextInterface {
  logItems: LogItem[];
  getLogItems: () => Promise<LogItem[]>;
}
