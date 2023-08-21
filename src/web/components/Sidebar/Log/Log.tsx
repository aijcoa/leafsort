import React, { useState } from 'react';
import { Card } from '../../Card/Card';
import { LogItem } from './LogItem';
import './Log.scss';

interface Props {
  logItems: LogItem[];
}

export const Log = (props: Props) => {
  const { logItems } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fullScreenClass = isFullScreen ? 'fullscreen' : 'h-100';

  return (
    <div className={fullScreenClass} onClick={() => setIsFullScreen(!isFullScreen)}>
      <Card bodyClasses="overflow-auto log-body flex-row" classes="col-10 h-100" title="Log">
        {logItems.length ? (
          <table className="table log table-hover w-100">
            <tbody className="w-100">
              {logItems &&
                logItems.map((logItem: LogItem, index) => (
                  <LogItem logItem={logItem} key={index} isFullScreen={isFullScreen} />
                ))}
            </tbody>
          </table>
        ) : null}
      </Card>
    </div>
  );
};
