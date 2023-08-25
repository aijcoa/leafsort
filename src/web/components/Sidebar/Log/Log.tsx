import React, { memo, useContext, useEffect, useState } from 'react';
import { Card } from '../../Card/Card';
import { LogItem } from './LogItem';
import { Modal } from '../../Modal/Modal';
import { LogContext } from '../../../providers/LogContext';
import { LogContextInterface } from '@types';
import './Log.scss';

export const Log = memo(() => {
  const [isLogModalOpen, setLogModalOpen] = useState<boolean>(false);

  const logContext = useContext<LogContextInterface>(LogContext);
  const { logItems, getLogItems } = logContext;

  const handleOnClick = () => logItems.length > 0 && setLogModalOpen(!isLogModalOpen);

  useEffect(() => {
    getLogItems();
  }, [getLogItems]);

  const renderLogTable = (isModalTable: boolean) => {
    return (
      <table className="table log table-hover w-100 mb-0">
        <tbody className="w-100">
          {logItems.map((logItem: LogItem, index: number) => (
            <LogItem logItem={logItem} key={index} isFullScreen={isModalTable} />
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div className="h-100" onClick={handleOnClick}>
        <Card bodyClasses="overflow-auto log-body flex-row" classes="col-10 h-100" title="Log">
          {renderLogTable(false)}
        </Card>
      </div>

      {isLogModalOpen && (
        <Modal
          title={'Log'}
          onClose={() => setLogModalOpen(false)}
          onSubmit={() => setLogModalOpen(false)}>
          {renderLogTable(true)}
        </Modal>
      )}
    </>
  );
});

Log.displayName = 'Log';
