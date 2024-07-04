import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { NavLink } from 'react-router-dom'

const ProfDashboardHeader = ({ status }) => {
  const getClassName = (tabStatus) => {
    return tabStatus.toLowerCase() === status.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }

  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border">
      <NavLink to='/profDashboard' className={getClassName('conversionFunnel')} style={{border:'1px solid'}}>Conversion Funnel</NavLink>
      <NavLink to='/profDashboard/TATDashboard' className={getClassName('TAT')} style={{border:'1px solid'}}>TAT</NavLink>
        {/* <button className={getClassName('payments')} onClick={() => onChangeStatus('payments')}>Payments</button> */}
        <NavLink to='/profDashboard/pricingDashboard' className={getClassName('Pricing')} style={{border:'1px solid'}}>Pricing</NavLink>
        {/* <button className={getClassName('bBikeWisePerformance')} onClick={() => onChangeStatus('bBikeWisePerformance')}>Bike Wise Performance</button> */}
        <NavLink to='/profDashboard/OutletWisePerformance' className={getClassName('OutletWisePerformance')} style={{border:'1px solid'}}>Outlet Wise Performance</NavLink>
        <NavLink to='/profDashboard/ValuatorWisePerformance' className={getClassName('ValuatorPerformance')} style={{border:'1px solid'}}>Valuator Performance</NavLink>
      </CardBody>
    </Card>
  )
}



export default ProfDashboardHeader