import { memo, useContext } from 'react';
import { GalleryContext, LogContextProvider } from '../../providers';
import { Card } from '../Card/Card';
import KeyMapList from './KeyMapList/KeyMapList';
import { Log } from './Log/Log';
import { GalleryContextInterface } from '@types';

export const Sidebar = memo(() => {
  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { sortedImages } = galleryContext;

  return (
    <div className="col-sm-3 d-none d-sm-none d-md-block h-100">
      <div className="row h-10">
        <Card
          classes="col-10 h-100"
          bodyClasses={'flex-row justify-content-center align-items-center'}
          title="Status">
          <span className="m-0">{sortedImages ? `Sorted ${sortedImages} files` : '...'}</span>
        </Card>
      </div>
      <div className="row h-50">
        <KeyMapList />
      </div>
      <div className="row h-40">
        <LogContextProvider>
          <Log />
        </LogContextProvider>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
