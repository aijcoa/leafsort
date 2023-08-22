import {
  app,
  dialog,
  BrowserWindow,
  Menu,
  nativeTheme,
  shell,
  MenuItemConstructorOptions,
} from 'electron';

import path from 'node:path';
import i18next from 'i18next';
import Store from 'electron-store';
import { store } from './main';
import { Locale } from 'types/Locale';

const localeList: Locale[] = [
  { code: 'ar', value: 'اللغة العربية' },
  { code: 'cs', value: 'Čeština' },
  { code: 'de', value: 'Deutsch' },
  { code: 'en', value: 'English' },
  { code: 'es', value: 'Español' },
  { code: 'fr', value: 'Français' },
  { code: 'hu', value: 'Magyar' },
  { code: 'ja', value: '日本語' },
  { code: 'pl', value: 'Polski' },
  { code: 'pt', value: 'Português' },
  { code: 'ru', value: 'Русский' },
  { code: 'zh-CN', value: '简体中文' },
  { code: 'zh-TW', value: '繁体中文' },
];

// @TODO fix complexity
// eslint-disable-next-line complexity
export const createMenu = (win: BrowserWindow, store: Store<StoreType>) => {
  const isDarwin = process.platform === 'darwin';
  const dotfiles = isDarwin ? '.' : '._';
  const langSub: MenuItemConstructorOptions[] = [];
  const hasFile = store.get('hasFile') !== undefined;

  localeList.map((locale) => {
    langSub.push({
      label: locale.value,
      type: 'radio',
      id: `language-${locale.code}`,
      click: () => {
        if (store.get('language') !== locale.code) {
          store.set('language', locale.code);
          dialog
            .showMessageBox(win, {
              type: 'info',
              message: i18next.t('Warning'),
              buttons: ['OK', 'Later'],
              defaultId: 0,
              cancelId: 1,
            })
            .then((result) => {
              if (result.response === 0) {
                setImmediate(() => {
                  app.relaunch();
                  app.exit(0);
                });
              }
            });
        }
      },
      checked: store.get('language') === locale.code,
    });
  });

  const viewSub: MenuItemConstructorOptions[] = [
    {
      label: `${i18next.t('Skip Image')}`,
      accelerator: 'Ctrl+N',
      enabled: hasFile,
      click: () => win.webContents.send('menu-next'),
    },
    {
      label: 'Skip Image (invisible)',
      accelerator: 'CmdOrCtrl+N',
      enabled: hasFile,
      click: () => win.webContents.send('menu-next'),
      visible: false,
    },
    {
      label: 'Skip Image (invisible)',
      accelerator: 'CmdOrCtrl+Right',
      enabled: hasFile,
      click: () => win.webContents.send('menu-next'),
      visible: false,
    },
    {
      label: `${i18next.t('Prev Image')}`,
      accelerator: 'CmdOrCtrl+P',
      enabled: hasFile,
      click: () => win.webContents.send('menu-prev'),
    },
    {
      label: 'Prev Image (invisible)',
      accelerator: 'CmdOrCtrl+P',
      click: () => win.webContents.send('menu-prev'),
      visible: false,
    },
    {
      label: 'Prev Image (invisible)',
      accelerator: 'CmdOrCtrl+Left',
      click: () => win.webContents.send('menu-prev'),
      visible: false,
    },
    { type: 'separator' },
    {
      label: `${i18next.t('Toggle Dark Mode')}`,
      accelerator: 'CmdOrCtrl+Shift+D',
      type: 'checkbox',
      checked: store.get('darkMode'),
      click: () => {
        nativeTheme.themeSource = store.get('darkMode') ? 'light' : 'dark';
        store.set('darkMode', !store.get('darkMode'));
      },
    },
  ];

  if (!isDarwin) {
    viewSub.push(
      {
        label: `${i18next.t('Toggle Menubar')}`,
        accelerator: 'Ctrl+Shift+T',
        type: 'checkbox',
        checked: store.get('showMenu'),
        click: () => {
          win.setMenuBarVisibility(!win.menuBarVisible);
          store.set('showMenu', !store.get('showMenu'));
        },
      },
      {
        label: `${i18next.t('Language')}`,
        submenu: langSub,
      },
      { type: 'separator' },
      {
        label: `${i18next.t('Toggle Fullscreen')}`,
        role: 'togglefullscreen',
        accelerator: 'F11',
      },
    );
  } else {
    viewSub.push(
      {
        label: `${i18next.t('Language')}`,
        submenu: langSub,
      },
      { type: 'separator' },
      {
        label: `${i18next.t('Toggle Fullscreen')}`,
        role: 'togglefullscreen',
      },
    );
  }

  const helpSub: MenuItemConstructorOptions[] = [
    {
      label: `${i18next.t('Support URL...')}`,
      click: async () => await shell.openExternal('https://github.com/aijcoa/leafSort/#readme'),
    },
  ];

  const aboutItem: MenuItemConstructorOptions = {
    label: `${i18next.t(isDarwin ? 'About LeafSort' : 'About')}`,
    accelerator: 'CmdOrCtrl+I',
    click: () => app.showAboutPanel(),
  };

  if (!isDarwin) {
    helpSub.push(aboutItem);
  }

  const template: MenuItemConstructorOptions[] = [
    {
      label: `${i18next.t('File')}`,
      submenu: [
        {
          label: `${i18next.t('Open...')}`,
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            dialog
              .showOpenDialog(win, {
                properties: ['openDirectory', 'createDirectory'],
                title: `${i18next.t('Select a directory')}`,
              })
              .then((result) => {
                if (result.canceled) return;

                if (path.basename(result.filePaths[0]).startsWith(dotfiles)) {
                  return;
                }

                win.webContents.send('menu-open', result.filePaths[0]);
              })
              .catch((err) => {
                console.info('inside catch');
                console.info(err);
              });
          },
        },
        { type: 'separator' },
        {
          label: `${i18next.t('Move to Trash')}`,
          accelerator: 'Delete',
          click: () => win.webContents.send('menu-remove'),
        },
        {
          label: `${i18next.t('Rename')}`,
          accelerator: isDarwin ? 'Cmd+Return' : 'F2',
          enabled: hasFile,
          click: () => win.webContents.send('menu-rename'),
        },
        { type: 'separator' },
        {
          label: `${i18next.t('Close')}`,
          accelerator: isDarwin ? 'Cmd+W' : 'Alt+F4',
          role: 'close',
        },
      ],
    },
    {
      label: `${i18next.t('View')}`,
      submenu: viewSub,
    },
    {
      label: `${i18next.t('Window')}`,
      submenu: [
        {
          label: `${i18next.t('Minimize')}`,
          role: 'minimize',
          accelerator: 'CmdOrCtrl+M',
        },
        {
          label: `${i18next.t('Zoom')}`,
          click: () => {
            win.isMaximized() ? win.unmaximize() : win.maximize();
          },
        },
        { type: 'separator' },
        isDarwin
          ? {
              label: `${i18next.t('Bring All to Front')}`,
              role: 'front',
            }
          : {
              label: `${i18next.t('Close')}`,
              role: 'close',
              accelerator: 'Ctrl+W',
            },
      ],
    },
    {
      label: `${i18next.t('Help')}`,
      role: 'help',
      submenu: helpSub,
    },
  ];

  if (isDarwin) {
    template.unshift({
      label: 'LeafSort',
      submenu: [
        aboutItem,
        { type: 'separator' },
        {
          label: `${i18next.t('Hide LeafSort')}`,
          role: 'hide',
        },
        {
          label: `${i18next.t('Hide Others')}`,
          role: 'hideOthers',
        },
        {
          label: `${i18next.t('Show All')}`,
          role: 'unhide',
        },
        { type: 'separator' },
        {
          label: `${i18next.t('Quit LeafSort')}`,
          role: 'quit',
        },
      ],
    });
  }

  return Menu.buildFromTemplate(template);
};

export const rebuildMenu = (): void => {
  const window = BrowserWindow.getFocusedWindow();

  if (!window) return;

  Menu.setApplicationMenu(createMenu(window, store));
};
