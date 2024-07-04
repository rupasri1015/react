import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { useSelector } from 'react-redux'

const VehicleStatusHeader = ({ status, onChangeStatus }) => {

  const allCount = useSelector(state => state.vehicle.allCount)
  const delivered = useSelector(state => state.vehicle.delivered)
  const dispute = useSelector(state => state.vehicle.dispute)
  const delivery_dispute = useSelector(state => state.vehicle.delivery_dispute)
  const pickup_dispute = useSelector(state => state.vehicle.pickup_dispute)
  const assigned = useSelector(state => state.vehicle.assigned)
  const pending = useSelector(state => state.vehicle.pending)
  const intrasist = useSelector(state => state.vehicle.intrasist)
  const pendingConfirmation = useSelector(state => state.vehicle.pendingConfirmation)
  const pendingAssignment = useSelector(state => state.vehicle.unAssigned)

  const getClassName = (tabStatus) => {
    if(status === 'UNASSIGNED'){
      status = 'PENDING_ASSIGNMENT'
    }
    if(status === 'REJECTED'){
      status = 'PENDING_ASSIGNMENT'
    }
    if(status === 'DELIVERED_CONFIRM_PENDING'){
      status = 'PENDING_CONFIRMATION'
    }
    if(status === 'DISPUTE'){
      status = 'DELIVERY_DISPUTE'
    }
    return tabStatus.toLowerCase() === status.toLowerCase() ? 'btn-outline blue mt-2 mb-2 selected' : 'btn-outline blue mt-2 mb-2'
  }

  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border" style={{ padding: "0 10px" }}>
        <button className={getClassName('all')} onClick={() => onChangeStatus('ALL')}>All({allCount})</button>
        <button className={getClassName('assigned')} onClick={() => onChangeStatus('ASSIGNED')}>Assigned ({assigned})</button>
        <button className={getClassName('PENDING_ASSIGNMENT')} onClick={() => onChangeStatus('PENDING_ASSIGNMENT')}>Pending Assignment ({pendingAssignment})</button>
        <button className={getClassName('pending')} onClick={() => onChangeStatus('PENDING')}>Pending Pickup ({pending})</button>
        <button className={getClassName('PICKUP_DISPUTE')} onClick={() => onChangeStatus('PICKUP_DISPUTE')}>Pickup Dispute ({pickup_dispute})</button>
        <button className={getClassName('INTRANSIT')} onClick={() => onChangeStatus('INTRANSIT')}>In-Transit ({intrasist})</button>
        <button className={getClassName('delivered')} onClick={() => onChangeStatus('DELIVERED')}>Delivered ({delivered})</button>
        <button className={getClassName('PENDING_CONFIRMATION')} onClick={() => onChangeStatus('PENDING_CONFIRMATION')}>Pending Confirmation ({pendingConfirmation})</button>
        <button className={getClassName('DELIVERY_DISPUTE')} onClick={() => onChangeStatus('DELIVERY_DISPUTE')}>Delivery Dispute ({delivery_dispute})</button>
      </CardBody>
    </Card>
  )
}

export default VehicleStatusHeader