
import React, { Fragment } from 'react'
import { Card, CardBody } from 'reactstrap'


const ProfDashboardCircular = ({ data, data01, status }) => {
  return (
    <Fragment>
      <div className="container">
        <div className="row mb-5">
          {data.map((dataTy, index) => (
            <div key= {index} className="col-md-2 col-sm-6">
              <Card key= {index} className="pending-inventory-header">
                <CardBody key= {index} className="card-shadow square-border" style={{ backgroundImage: dataTy.fill }}>
                  <h6 className="h6 text-left" style={{fontSize:'14px', color:'#fff'}}>{dataTy.label}</h6>
                        <p className="text-center" style={{fontSize:'20px', color:'#fff'}}>{(dataTy.type === 'price' ? <span>{dataTy.value}</span> :dataTy.value)}</p>
                </CardBody>
              </Card>
            </div>
          ))
          }
        </div>
      </div>
    </Fragment>
  )
}

export default ProfDashboardCircular




