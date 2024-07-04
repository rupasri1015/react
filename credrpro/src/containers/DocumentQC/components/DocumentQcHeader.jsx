import React from 'react';
import classNames from 'classnames';
import { Card, CardBody } from 'reactstrap';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';

const DocumnetQcHeader = ({ leadStatus, onQcStatusUpdate, universalCheck }) => {
  const getClassName = (tabStatus) => {
    if (leadStatus === 'COND_APPROVED') {
      leadStatus = 'PENDING';
    }
    return leadStatus.toLowerCase() === tabStatus.toLowerCase()
      ? 'btn-outline blue selected'
      : 'btn-outline blue';
  };

  const approvedCount = useSelector(
    (state) => state.documentQcData.approvedCount
  );
  const disputeCount = useSelector(
    (state) => state.documentQcData.disputeCount
  );
  const rejectedCount = useSelector(
    (state) => state.documentQcData.rejectedCount
  );
  const pendingCount = useSelector(
    (state) => state.documentQcData.pendingCount
  );
  const conditionalCount = useSelector(
    (state) => state.documentQcData.conditionalCount
  );
  const total = useSelector((state) => state.documentQcData.count);

  return (
    <>
      <Card className="pending-inventory-header mt-3">
        <CardBody className={classNames('card-shadow', styles.cardBody)}>
          <div
            style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}
          >
            Filter By Status
          </div>
          {/* <button
            className={getClassName('All')}
            onClick={() => onQcStatusUpdate('ALL', universalCheck)}
          >{`All (${total})`}</button> */}
          <button
            className={getClassName('Pending')}
            onClick={() => onQcStatusUpdate('PENDING', universalCheck)}
          >{`Pending QC (${pendingCount + conditionalCount})`}</button>
          <button
            className={getClassName('approved')}
            onClick={() => onQcStatusUpdate('APPROVED', universalCheck)}
          >{`Approved (${approvedCount})`}</button>
          <button
            className={getClassName('Dispute')}
            onClick={() => onQcStatusUpdate('DISPUTE', universalCheck)}
          >{`Dispute (${disputeCount})`}</button>
          <button
            className={getClassName('Rejected')}
            onClick={() => onQcStatusUpdate('REJECTED', universalCheck)}
          >{`Rejected (${rejectedCount})`}</button>
        </CardBody>
      </Card>
    </>
  );
};

export default DocumnetQcHeader;
