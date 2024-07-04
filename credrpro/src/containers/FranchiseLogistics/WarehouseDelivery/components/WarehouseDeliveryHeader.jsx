import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { useSelector } from 'react-redux'

const WarehouseHeader = ({ status, onChangeStatus }) => {

  const allCount = useSelector(state => state.warehouseFranchise.totalCount)
  const pendingConfirmation = useSelector(state => state.warehouseFranchise.pendingConfirmationCount)
  const delivered = useSelector(state => state.warehouseFranchise.deliveredCount)
  const dispute = useSelector(state => state.warehouseFranchise.deliveryDisputeCount)

  const getClassName = (tabStatus) => {
    return tabStatus.toLowerCase() === status.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }

  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border">
        <button className={getClassName('all')} onClick={() => onChangeStatus('ALL')}>All ({allCount})</button>
        <button className={getClassName('pending_confirmation')} onClick={() => onChangeStatus('PENDING_CONFIRMATION')}>Pending Confirmation ({pendingConfirmation})</button>
        <button className={getClassName('delivered')} onClick={() => onChangeStatus('DELIVERED')}>Delivered At Warehouse ({delivered})</button>
        <button className={getClassName('delivery_dispute')} onClick={() => onChangeStatus('DELIVERY_DISPUTE')}>Dispute ({dispute})</button>
      </CardBody>
    </Card>
  )
}

export default WarehouseHeader