import { app } from 'electron';

import log from 'electron-log';
import Store from 'electron-store';

import path from 'node:path';

import { setLocales } from './setLocales';
import { createWindow } from './createWindow';
import { getResourceDirectory } from './shared/utils';
import { clearLog } from './shared/logger';

log.info('App starting...');

const isDarwin = process.platform === 'darwin';
const isDevelop = process.env.NODE_ENV === 'development';

const initWidth = 800;
const initHeight = 528;

export const store = new Store<StoreType>({
  configFileMode: 0o666,
  defaults: {
    ask: true,
    x: undefined,
    y: undefined,
    width: initWidth,
    height: initHeight,
    darkMode: true,
    showMenu: true,
    hasFile: false,
    previousFile: undefined,
    nextFile: undefined,
    keyBinds: [] as KeyBindType[],
    log: [] as LogItem[],
  },
});

app.whenReady().then(() => {
  const locale = store.get('language') || app.getLocale();
  setLocales(locale);
  store.set('language', locale);
  store.delete('hasFile');

  clearLog();
  createWindow();
});

app.setAboutPanelOptions({
  applicationName: app.name,
  applicationVersion: isDarwin
    ? app.getVersion()
    : `v${app.getVersion()} (${process.versions['electron']})`,
  version: process.versions['electron'],
  iconPath: path.resolve(getResourceDirectory(isDevelop), 'images/logo.png'),
});

app.once('window-all-closed', () => app.exit());
