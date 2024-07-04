import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { useSelector } from 'react-redux'

const WarehouseHeader = ({ status, onChangeStatus }) => {

  const allCount = useSelector(state => state.warehouse.allCount)
  const pendingConfirmation = useSelector(state => state.warehouse.delivered_confirm_pending)
  const delivered = useSelector(state => state.warehouse.delivered)
  const dispute = useSelector(state => state.warehouse.dispute)

  const getClassName = (tabStatus) => {
    return tabStatus.toLowerCase() === status.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }


  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border">
        <button className={getClassName('all')} onClick={() => onChangeStatus('ALL')}>All ({allCount})</button>
        <button className={getClassName('delivered_confirm_pending')} onClick={() => onChangeStatus('DELIVERED_CONFIRM_PENDING')}>Pending Confirmation ({pendingConfirmation})</button>
        <button className={getClassName('delivered')} onClick={() => onChangeStatus('DELIVERED')}>Delivered At Warehouse ({delivered})</button>
        <button className={getClassName('dispute')} onClick={() => onChangeStatus('DISPUTE')}>Dispute ({dispute})</button>
      </CardBody>
    </Card>
  )
}

export default WarehouseHeader