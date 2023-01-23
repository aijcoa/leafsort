import { app } from 'electron';

import log from 'electron-log';
import Store from 'electron-store';

import path from 'node:path';

import { setLocales } from './setLocales';
import { createWindow } from './createWindow';
import { getResourceDirectory } from './shared/utils';

// eslint-disable-next-line no-console
console.log = log.log;
log.info('App starting...');

let openfile: string | null = null;

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
    currentFile: undefined,
    previousFile: undefined,
    nextFile: undefined,
    keyBinds: [],
  },
});

app.once('will-finish-launching', () => {
  app.once('open-file', (e, filePath) => {
    e.preventDefault();
    openfile = filePath;
  });
});

app.whenReady().then(() => {
  const locale = store.get('language') || app.getLocale();
  setLocales(locale);
  store.set('language', locale);

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
