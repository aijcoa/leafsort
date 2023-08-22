import path from 'path';
import mime from 'mime-types';

export const checkmime = (filePath: string) => {
  const regexp = new RegExp(/bmp|ico|gif|jpeg|png|svg|webp|webm|mp4/);
  const mimetype = mime.lookup(filePath);

  return (mimetype && regexp.test(mimetype)) || false;
};

export const getResourceDirectory = (isDevelop: boolean) => {
  return isDevelop
    ? path.join(process.cwd(), 'dist')
    : path.join(process.resourcesPath, 'app.asar.unpacked', 'dist');
};

export const isVideo = (filePath: string) => {
  const regexp = new RegExp(/webm|mp4/);
  const mimetype = mime.lookup(filePath);

  return (mimetype && regexp.test(mimetype)) || false;
};

export const capitalizeFirstLetter = (input: string): string => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const getTrashDirectory = () => {
  switch (process.platform) {
    case 'darwin':
      return path.join(process.env.HOME || '', '.Trash');
    case 'win32':
      return path.join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Temp');
    default:
      return path.join(process.env.HOME || '', '.local', 'share', 'Trash');
  }
};

export const isDarwin = process.platform === 'darwin';

export const isDevelop = process.env.NODE_ENV === 'development';

export const dotfiles = isDarwin ? '.' : '._';
