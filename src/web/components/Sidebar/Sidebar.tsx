import { memo, useContext, useEffect } from 'react';
import { GalleryContext } from '../../providers/GalleryContext';
import { Card } from '../Card/Card';
import KeyMapList from './KeyMapList/KeyMapList';
import { Log } from './Log/Log';
import { GalleryContextInterface } from 'types/index';

interface Props {
  imagesSorted?: number | null;
}

export const Sidebar = memo((props: Props) => {
  const { imagesSorted } = props;

  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { logItems, getLogItems, sortedImages } = galleryContext;

  useEffect(() => {
    getLogItems();
  }, [getLogItems, sortedImages]);

  return (
    <div className="col-3 h-100">
      <div className="row h-10">
        <Card classes="col-10 h-100" title="Status">
          {imagesSorted ? <p>Sorted {imagesSorted} files</p> : <p>...</p>}
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
