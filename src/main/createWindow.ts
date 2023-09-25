import { app, BrowserWindow, Menu, nativeTheme } from 'electron';
import { createMenu } from './createMenu';
import { getResourceDirectory } from './shared/utils';
import { registerMenuIPC } from './registerMenuIPC';
import { store } from './main';
import { registerUtilsIPC } from './registerUtilsIPC';
import { registerKeyBindsIPC } from './registerKeyBindsIPC';
import path from 'node:path';

const isDarwin = process.platform === 'darwin';
const isDevelop = process.env.NODE_ENV === 'development';

export function createWindow(): BrowserWindow {
  let openFile: string | null = null;

  const initWidth = 800;
  const initHeight = 528;
  const dotFiles = isDarwin ? '.' : '._';

  const mainWindow = new BrowserWindow({
    show: false,
    x: store.get('x'),
    y: store.get('y'),
    minWidth: initWidth,
    minHeight: initHeight,
    width: store.get('width'),
    height: store.get('height'),
    icon: path.join(getResourceDirectory(isDevelop), 'images/logo.png'),
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1e1e1e' : '#f6f6f6',
    webPreferences: {
      safeDialogs: true,
      devTools: isDevelop,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (!isDarwin) mainWindow.setMenuBarVisibility(store.get('showMenu'));
  nativeTheme.themeSource = store.get('darkMode') ? 'dark' : 'light';

  const menu = createMenu(mainWindow, store);
  Menu.setApplicationMenu(menu);

  // eslint-disable-next-line complexity
  mainWindow.webContents.once('did-finish-load', () => {
    if (!isDarwin && process.argv.length >= 2) {
      const filePath = process.argv[process.argv.length - 1];
      if (path.basename(filePath).startsWith(dotFiles)) return;

      mainWindow.webContents.send('menu-open', filePath);
    }

    if (isDarwin && openFile) {
      if (path.basename(openFile).startsWith(dotFiles)) {
        openFile = null;
        return;
      }

      mainWindow.webContents.send('menu-open', openFile);
      openFile = null;
    }
  });

  if (isDarwin) {
    app.on('open-file', (e, filePath) => {
      e.preventDefault();

      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      if (path.basename(filePath).startsWith(dotFiles)) return;

      mainWindow.webContents.send('menu-open', filePath);
    });
  }

  mainWindow.loadFile('./dist/index.html');

  mainWindow.once('ready-to-show', () => {
    if (isDevelop) {
      mainWindow.webContents.openDevTools({ mode: 'right' });
    }

    mainWindow.show();
  });

  mainWindow.once('close', () => {
    const { x, y, width, height } = mainWindow.getBounds();
    store.set({ x, y, width, height });
  });

  registerMainIPC(mainWindow);

  return mainWindow;
}

function registerMainIPC(appWindow: BrowserWindow) {
  registerMenuIPC(appWindow);
  registerUtilsIPC();
  registerKeyBindsIPC();
}
