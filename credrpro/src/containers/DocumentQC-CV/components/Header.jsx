import React from 'react';
import classNames from 'classnames';
import { Card, CardBody } from 'reactstrap';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';

const DocumentQcCvHeader = ({
  leadStatus,
  onQcStatusUpdate,
  universalCheck,
}) => {
  const getClassName = (tabStatus) => {
    return leadStatus.toLowerCase() === tabStatus.toLowerCase()
      ? 'btn-outline blue selected'
      : 'btn-outline blue';
  };

  const disputeCount = useSelector(
    (state) => state.documentQcData.disputeCount
  );
  const rejectedCount = useSelector(
    (state) => state.documentQcData.rejectedCount
  );
  const pendingCount = useSelector(
    (state) => state.documentQcData.pendingCount
  );
  const approvedCount = useSelector(
    (state) => state.documentQcData.approvedCount
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
            className={classNames(getClassName('All'), styles.statusBtn)}
            onClick={() => onQcStatusUpdate('ALL', universalCheck)}
          >{`All (${total})`}</button> */}
          <button
            className={classNames(getClassName('Pending'), styles.statusBtn)}
            onClick={() => onQcStatusUpdate('PENDING', universalCheck)}
          >{`Pending (${pendingCount})`}</button>
          <button
            className={classNames(getClassName('Dispute'), styles.statusBtn)}
            onClick={() => onQcStatusUpdate('DISPUTE', universalCheck)}
          >{`Dispute (${disputeCount})`}</button>
          <button
            className={classNames(getClassName('Rejected'), styles.statusBtn)}
            onClick={() => onQcStatusUpdate('REJECTED', universalCheck)}
          >{`Rejected (${rejectedCount})`}</button>
          <button
            className={classNames(
              getClassName('Cond_Approved'),
              styles.statusBtn
            )}
            onClick={() => onQcStatusUpdate('COND_APPROVED', universalCheck)}
          >{`Conditional Approved (${conditionalCount})`}</button>
          {/* <button
            className={classNames(getClassName('Approved'), styles.statusBtn)}
            onClick={() => onQcStatusUpdate('APPROVED', universalCheck)}
          >{`Approved (${approvedCount})`}</button> */}
        </CardBody>
      </Card>
    </>
  );
};

export default DocumentQcCvHeader;
