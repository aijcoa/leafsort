import { memo, useContext } from 'react';
import { Card } from '../Card/Card';
import { FolderOpen } from '../Icons/FolderOpen';
import './Header.scss';
import { GalleryContextInterface } from 'types/index';
import { GalleryContext } from '../../providers';

interface Props {
  folderPath?: string;
}

export const Header = memo((props: Props) => {
  const { folderPath } = props;
  const galleryContext = useContext<GalleryContextInterface>(GalleryContext);
  const { onClickOpen } = galleryContext;
  const title: string = !folderPath ? 'Leaf | Sort' : `Sorting`;

  return (
    <Card
      bodyClasses="header flex-row align-items-center"
      classes="col-xs-12 h-10 d-flex"
      title={title}>
      {folderPath ? (
        <section className="d-flex flex-row align-items-baseline gap-3">
          <button className="icon folder" title="Open" onClick={onClickOpen}>
            <FolderOpen size="small" />
          </button>
          <span className="m-0">{folderPath}</span>
        </section>
      ) : (
        <p className="m-1">Open a folder to start.</p>
      )}
    </Card>
  );
});

Header.displayName = 'Header';
