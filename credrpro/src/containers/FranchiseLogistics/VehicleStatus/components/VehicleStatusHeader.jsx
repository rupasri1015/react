import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { useSelector } from 'react-redux'

const VehicleStatusHeader = ({ status, onChangeStatus }) => {

  const allCount = useSelector(state => state.vehicleStatus.totalCount)
  const delivered = useSelector(state => state.vehicleStatus.deliveredCount)
  const deliveryDispute = useSelector(state => state.vehicleStatus.deliveryDisputeCount)
  const inTransit = useSelector(state => state.vehicleStatus.inTransitCount)
  const pendingAssignment = useSelector(state => state.vehicleStatus.pendingAssignmentCount)
  const pendingConfirmation = useSelector(state => state.vehicleStatus.pendingConfirmationCount)
  const pendingPickup = useSelector(state => state.vehicleStatus.pendingPickupCount)
  const pickupDispute = useSelector(state => state.vehicleStatus.pickupDisputeCount)
  const assignedCount = useSelector(state => state.vehicleStatus.assignedCount)

  const getClassName = (tabStatus) => {
    return tabStatus.toLowerCase() === status.toLowerCase() ? 'btn-outline blue mt-2 mb-2 selected' : 'btn-outline blue mt-2 mb-2'
  }

  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border" style={{ padding: "0 10px" }}>
        <button className={getClassName('all')} onClick={() => onChangeStatus('ALL')}>All({allCount})</button>
        <button className={getClassName('assigned')} onClick={() => onChangeStatus('ASSIGNED')}>Assigned ({assignedCount})</button>
        <button className={getClassName('open')} onClick={() => onChangeStatus('OPEN')}>Pending Assignment ({pendingAssignment})</button>
        <button className={getClassName('pending_pickup')} onClick={() => onChangeStatus('PENDING_PICKUP')}>Pending Pickup ({pendingPickup})</button>
        <button className={getClassName('PICKUP_DISPUTE')} onClick={() => onChangeStatus('PICKUP_DISPUTE')}>Pickup Dispute ({pickupDispute})</button>
        <button className={getClassName('IN_TRANSIT')} onClick={() => onChangeStatus('IN_TRANSIT')}>In-Transit ({inTransit})</button>
        <button className={getClassName('DELIVERED')} onClick={() => onChangeStatus('DELIVERED')}>Delivered ({delivered})</button>
        <button className={getClassName('PENDING_CONFIRMATION')} onClick={() => onChangeStatus('PENDING_CONFIRMATION')}>Pending Confirmation ({pendingConfirmation})</button>
        <button className={getClassName('DELIVERY_DISPUTE')} onClick={() => onChangeStatus('DELIVERY_DISPUTE')}>Delivery Dispute ({deliveryDispute})</button>
      </CardBody>
    </Card>
  )
}

export default VehicleStatusHeader