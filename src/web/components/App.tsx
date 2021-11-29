import { useRef, useCallback, useState, useEffect } from 'react';
import { UAParser } from 'ua-parser-js';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './App.scss';

import { ToolBar } from './ToolBar';
import empty from './empty.png';

const { myAPI } = window;
const isDarwin = new UAParser().getOS().name === 'Mac OS';

export const App = () => {
  const [url, setUrl] = useState<string>(empty);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj: React.MutableRefObject<L.Map | null> = useRef(null);

  const getZoom = (
    imgWidth: number,
    width: number,
    imgHeight: number,
    height: number
  ) => {
    if (imgWidth > width || imgHeight > height) {
      const zoomX = width / imgWidth;
      const zoomY = height / imgHeight;

      return zoomX >= zoomY ? zoomY : zoomX;
    } else {
      return 1;
    }
  };

  const draw = useCallback(
    (width: number, height: number) => {
      const node = mapRef.current;

      if (node) {
        const img = new Image();
        img.onload = () => {
          const zoom = getZoom(img.width, width, img.height, height);

          const bounds = new L.LatLngBounds([
            [img.height * zoom, 0],
            [0, img.width * zoom],
          ]);

          if (mapObj.current) {
            mapObj.current.off();
            mapObj.current.remove();
          }

          mapObj.current = L.map(node, {
            maxBounds: bounds,
            crs: L.CRS.Simple,
            preferCanvas: true,
            zoomDelta: 0.3,
            zoomSnap: 0.3,
            wheelPxPerZoomLevel: 360,
            doubleClickZoom: false,
            zoomControl: false,
            attributionControl: false,
          }).fitBounds(bounds);

          mapObj.current.on('dblclick', () => {
            const center = bounds.getCenter();
            if (mapObj.current) mapObj.current.setView(center, 0);
          });

          if (img.width < width && img.height < height) {
            const center = bounds.getCenter();
            mapObj.current.setView(center, 0, { animate: false });
          }

          L.imageOverlay(img.src, bounds).addTo(mapObj.current);

          node.blur();
          node.focus();
        };

        img.src = url;
      }
    },
    [url]
  );

  const onPrevent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    onPrevent(e);

    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0];

      if (file.name.startsWith(isDarwin ? '.' : '._')) return;

      const mime = await myAPI.mimecheck(file.path);
      if (mime) {
        setUrl(file.path);
        myAPI.history(file.path);
      }
    }
  };

  const onNext = useCallback(async () => {
    if (url === empty) return;

    const dir = await myAPI.dirname(url);
    if (!dir) {
      setUrl(empty);
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0) {
      setUrl(empty);
      return;
    }

    if (list.length === 1) return;

    const index = list.indexOf(url);
    if (index === list.length - 1 || index === -1) {
      setUrl(list[0]);
    } else {
      setUrl(list[index + 1]);
    }
  }, [url]);

  const onPrev = useCallback(async () => {
    if (url === empty) return;

    const dir = await myAPI.dirname(url);
    if (!dir) {
      setUrl(empty);
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0) {
      setUrl(empty);
      return;
    }

    if (list.length === 1) return;

    const index = list.indexOf(url);
    if (index === 0) {
      setUrl(list[list.length - 1]);
    } else if (index === -1) {
      setUrl(list[0]);
    } else {
      setUrl(list[index - 1]);
    }
  }, [url]);

  const onRemove = useCallback(async () => {
    if (url === empty) return;

    const dir = await myAPI.dirname(url);
    if (!dir) {
      setUrl(empty);
      return;
    }

    const list = await myAPI.readdir(dir);
    if (!list || list.length === 0 || !list.includes(url)) {
      setUrl(empty);
      return;
    }

    const index = list.indexOf(url);

    await myAPI.moveToTrash(url);
    const newList = await myAPI.readdir(dir);

    if (!newList || newList.length === 0) {
      setUrl(empty);
      return;
    }

    if (index > newList.length - 1) {
      setUrl(newList[0]);
    } else {
      setUrl(newList[index]);
    }
  }, [url]);

  const onClickOpen = async () => {
    const filepath = await myAPI.openDialog();
    if (!filepath) return;

    const mime = await myAPI.mimecheck(filepath);
    if (mime) {
      setUrl(filepath);
      myAPI.history(filepath);
    }
  };

  const onMenuOpen = useCallback(async (_e: Event, filepath: string) => {
    if (!filepath) return;

    const mime = await myAPI.mimecheck(filepath);
    if (mime) {
      setUrl(filepath);
      myAPI.history(filepath);
    }
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (url === empty) return;

    if (e.key === '0') {
      if (mapObj.current) mapObj.current.setZoom(0);
    }
  };

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    myAPI.contextMenu();
  };

  const updateTitle = async (filepath: string) => {
    await myAPI.updateTitle(filepath);
  };

  useEffect(() => {
    myAPI.menuNext(onNext);

    return () => {
      myAPI.removeMenuNext();
    };
  }, [onNext]);

  useEffect(() => {
    myAPI.menuPrev(onPrev);

    return () => {
      myAPI.removeMenuPrev();
    };
  }, [onPrev]);

  useEffect(() => {
    myAPI.menuRemove(onRemove);

    return () => {
      myAPI.removeMenuRemove();
    };
  }, [onRemove]);

  useEffect(() => {
    myAPI.menuOpen(onMenuOpen);

    return () => {
      myAPI.removeMenuOpen();
    };
  }, [onMenuOpen]);

  useEffect(() => {
    const title = url !== empty ? url : 'LeafView';

    updateTitle(title);
  }, [url]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        const width = entries[0].contentRect.width;
        const height = entries[0].contentRect.height;

        draw(width, height);
      }
    );

    if (mapRef.current) resizeObserver.observe(mapRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [draw]);

  return (
    <div
      className="container"
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      onDragOver={onPrevent}
      onDragEnter={onPrevent}
      onDragLeave={onPrevent}
      onContextMenu={onContextMenu}
    >
      <div className="bottom">
        <ToolBar
          onPrev={onPrev}
          onNext={onNext}
          onRemove={onRemove}
          onClickOpen={onClickOpen}
        />
      </div>
      <div className={url === empty ? 'view init' : 'view'} ref={mapRef} />
    </div>
  );
};
