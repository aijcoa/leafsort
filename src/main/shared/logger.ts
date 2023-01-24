import { store } from '../main';

export const addLogItem = async (logItem: LogItem) => {
  const logItems = store.get('log', [] as LogItem[]);
  logItems.push(logItem);
  store.set('log', logItems);
};

export const clearLog = () => {
  store.set('log', [] as LogItem[]);
};

export const disableUndo = (logItem: LogItem) => {
  const disabledLogItem = { ...logItem, canBeUndone: false };

  const logItems = store.get('log', [] as LogItem[]);
  const index = logItems.findIndex(
    (l: LogItem) =>
      l.afterState === logItem.afterState &&
      l.prevState === logItem.prevState &&
      l.canBeUndone === logItem.canBeUndone,
  );

  logItems[index] = disabledLogItem;

  store.set('log', logItems);
};
