export const preventDefault = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const getFileNameFromPath = (path: string) => {
  const pathArr = path.split('/');
  return pathArr[pathArr.length - 1];
};

export const trimExtension = (fileName: string) => fileName.replace(/\.[^/.]+$/, '');
