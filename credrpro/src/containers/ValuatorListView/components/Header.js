import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { useSelector } from 'react-redux'

const ValuatorListHeader = ({ status, onChangeStatus }) => {

  const pendingCount = useSelector(state => state.valuatorList.pendingCount)
  const preDropCount = useSelector(state => state.valuatorList.preDropCount)
  const inspectedCount = useSelector(state => state.valuatorList.inspectedCount)
  const docDisputeCount = useSelector(state => state.valuatorList.docDisputeCount)
  const rescheduleCount = useSelector(state => state.valuatorList.rescheduleCount)
  const adiyCompletedCount = useSelector(state => state.valuatorList.adiyCompletedCount)
  const getClassName = (currentStatus) => {
    return status.toLowerCase() === currentStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }

  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border">
        <button className={getClassName('PENDING')} onClick={() => onChangeStatus('PENDING')}>{`Pending ${pendingCount ? `(${pendingCount})` : ""}`}</button>
        <button className={getClassName('RESCHEDULE')} onClick={() => onChangeStatus('RESCHEDULE')}>{`ReScheduled ${rescheduleCount ? `(${rescheduleCount})` : ""}`}</button>
        <button className={getClassName('ADIY_COMPLETED')} onClick={() => onChangeStatus('ADIY_COMPLETED')}>{`ADIY Completed ${adiyCompletedCount ? `(${adiyCompletedCount})` : ""}`}</button>
        <button className={getClassName('INSPECTED')} onClick={() => onChangeStatus('INSPECTED')}>{`Inspected  ${inspectedCount ? `(${inspectedCount})` : ""}`}</button>
        <button className={getClassName('DOCDISPUTE')} onClick={() => onChangeStatus('DOCDISPUTE')}>{`Doc Dispute ${docDisputeCount ? `(${docDisputeCount})` : ""}`}</button>
        <button className={getClassName('PREDROP')} onClick={() => onChangeStatus('PREDROP')}>{`Pre Dropped ${preDropCount ? `(${preDropCount})` : ""}`}</button>

      </CardBody>
    </Card>
  )
}

export default ValuatorListHeader