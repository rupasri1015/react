import React from 'react'
import { Row, Col, Card } from 'reactstrap'
import { useSelector } from 'react-redux'

const DeliveryTat = () => {

  const between0to24 = useSelector(state => state.warehouse.between0to24)
  const between24to48 = useSelector(state => state.warehouse.between24to48)
  const between48to72 = useSelector(state => state.warehouse.between48to72)
  const above72 = useSelector(state => state.warehouse.above72)

  return (
    <Row>
      <Col sm={12} className="mb-3"><h3>Delivery TAT Summary</h3></Col>
      <Col md={3}>
        <Card body className="card-shadow">
          <h4 className="tat-title blue">0 <span>Hours to</span> 24 <span>Hours</span></h4>
          <h4 className="tat-number">{between0to24}</h4>
        </Card>
      </Col>
      <Col md={3}>
        <Card body className="card-shadow">
          <h4 className="tat-title orange">24 <span>Hours to</span> 48 <span>Hours</span></h4>
          <h4 className="tat-number">{between24to48}</h4>
        </Card>
      </Col>
      <Col md={3}>
        <Card body className="card-shadow">
          <h4 className="tat-title light-red">48 <span>Hours to</span> 72 <span>Hours</span></h4>
          <h4 className="tat-number">{between48to72}</h4>
        </Card>
      </Col>
      <Col md={3}>
        <Card body className="card-shadow">
          <h4 className="tat-title red">72 <span>Hours</span> +</h4>
          <h4 className="tat-number">{above72}</h4>
        </Card>
      </Col>
    </Row>
  )
}

export default DeliveryTat