import React, { Fragment } from 'react'
import { Card, CardBody } from 'reactstrap'

const PricingFilter = ({ data, onPricingChange }) => {
  return (
    <Fragment>
      <div className="container">
        <div className="row mb-2 mt-3">
          {data.map((dataTy, index) => (
            <div key={index} className="col-md-2 col-sm-6">
              <Card key={index}>
                < CardBody key={index} className="card-shadow square-border" style={{ backgroundImage: dataTy.fill, cursor: 'pointer' }} onClick={() => onPricingChange(dataTy.label)} >
                  <p className="text-center" style={{ fontSize: '21px', color: '#fff', width: '100%' }}><span>{dataTy.label}</span></p>
                  <p className="text-center" style={{ fontSize: '21px', color: '#fff', width: '100%' }}><span>{dataTy.value ? dataTy.value : '0' }</span> </p>
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




export default PricingFilter