import React, { useState } from 'react';
import { Card } from '../../Card/Card';
import { LogItem } from './LogItem';
import { Modal } from '../../Modal/Modal';
import './Log.scss';

interface Props {
  logItems: LogItem[];
}

export const Log = (props: Props) => {
  const { logItems } = props;
  const [isLogMoadalOpen, setLogModalOpen] = useState<boolean>(false);

  const handleOnClick = () => logItems.length > 0 && setLogModalOpen(!isLogMoadalOpen);

  const renderLogTable = (isModalTable: boolean) => {
    return (
      <table className="table log table-hover w-100 mb-0">
        <tbody className="w-100">
          {logItems.map((logItem: LogItem, index) => (
            <LogItem logItem={logItem} key={index} isFullScreen={isModalTable} />
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div onClick={handleOnClick}>
        <Card bodyClasses="overflow-auto log-body flex-row" classes="col-10 h-100" title="Log">
          {renderLogTable(false)}
        </Card>
      </div>

      {isLogMoadalOpen && (
        <Modal
          title={'Log'}
          onClose={() => setLogModalOpen(false)}
          onSubmit={() => setLogModalOpen(false)}>
          {renderLogTable(true)}
        </Modal>
      )}
    </>
  );
};
