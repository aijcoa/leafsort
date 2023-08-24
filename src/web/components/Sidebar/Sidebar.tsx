import { memo, useContext, useEffect } from 'react';
import { GalleryContext } from '../../providers/GalleryContext';
import { Card } from '../Card/Card';
import KeyMapList from './KeyMapList/KeyMapList';
import { Log } from './Log/Log';
import { GalleryContextInterface } from 'types/index';

export const Sidebar = memo(() => {
  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { logItems, getLogItems, sortedImages } = galleryContext;

  useEffect(() => {
    getLogItems();
  }, [getLogItems, sortedImages]);

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
        <Log logItems={logItems} />
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
