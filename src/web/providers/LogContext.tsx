import React, { createContext, useState } from 'react';
import { LogContextInterface } from '@types';

const { myAPI } = window;

export const LogContext = createContext<LogContextInterface>({
  logItems: [],
  getLogItems: () => Promise.resolve([]),
});

export const LogContextProvider = (props: { children: React.ReactNode }): React.ReactElement => {
  const [logItems, setLogItems] = useState<LogItem[]>([]);

  const getLogItems = async (): Promise<LogItem[]> => {
    const logItems: LogItem[] = await myAPI.getLogItems();
    setLogItems(logItems.reverse());

    return logItems;
  };

  return (
    <LogContext.Provider
      value={{
        logItems,
        getLogItems,
      }}>
      {props.children}
    </LogContext.Provider>
  );
};
