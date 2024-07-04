import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { useSelector } from 'react-redux'

const RefurbHeader = ({ refurbStatus, onRefurbStatusUpdate, uSearch }) => {

  const getClassName = (tabStatus) => {
    if (refurbStatus === 'QC Pending') {
      refurbStatus = 'QC_PENDING'
    }
    else if(refurbStatus === 'DROPPED'){
      refurbStatus = 'DROPPED'
    }
    else if (refurbStatus === 'QC Completed') {
      refurbStatus = 'QC_COMPLETED'
    }
    else if(refurbStatus === 'In Progress') {
      refurbStatus = 'REFURB_IN_PROGRESS'
    }
    else if(refurbStatus === '1A Pass') {
      refurbStatus = '1A_PASS'
    }
    return refurbStatus.toLowerCase() === tabStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }

  const total = useSelector(state => state.refurb.count)
  const progressCount = useSelector(state => state.refurb.refurbCount)
  const oneApassCount = useSelector(state => state.refurb.oneAcount)
  const pendingCount = useSelector(state => state.refurb.pendingCount)
  const alternateStockCount = useSelector(state => state.refurb.alternateCount)
  const qcCompleted = useSelector(state => state.refurb.qcCompletedCount)
  const droppedCount = useSelector(state => state.refurb.dropCount)


  return (
    <Card className="pending-inventory-header mt-3">
      <CardBody className="card-shadow square-border">
        <button className={getClassName('qc_pending')} onClick={() => onRefurbStatusUpdate('QC_PENDING', uSearch)}>{`Pending QC (${pendingCount})`}</button>
        <button className={getClassName('qc_completed')} onClick={() => onRefurbStatusUpdate('QC_COMPLETED', uSearch)}>{`QC Completed (${qcCompleted})`}</button>
        <button className={getClassName('Refurb_in_progress')} onClick={() => onRefurbStatusUpdate('REFURB_IN_PROGRESS', uSearch)}>{`In Progress (${progressCount})`}</button>
        <button className={getClassName('1a_pass')} onClick={() => onRefurbStatusUpdate('1A_PASS', uSearch)}>{`1A Pass (${oneApassCount})`}</button>
        <button className={getClassName('dropped')} onClick={() => onRefurbStatusUpdate('DROPPED', uSearch)}>{`Dropped (${droppedCount})`}</button>
        {/* <button className={getClassName('alternate_stock')} onClick={() => onRefurbStatusUpdate('ALTERNATE_STOCK', uSearch)}>{`Alternate Stock (${alternateStockCount})`}</button> */}
      </CardBody>
    </Card>
  )
}

export default RefurbHeader