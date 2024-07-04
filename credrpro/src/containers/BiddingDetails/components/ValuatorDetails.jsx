import React, { Fragment } from 'react'
import { renderString } from '../../../core/utility'

const ValuatorDetails = ({ valuator }) => (
  <Fragment>
    <h1 className="tab-heading">Valuator Details</h1>
    <div className="data-row">
      <p className="title">Valuator&nbsp;Name</p>
      <p className="data">{renderString(valuator.userName)}</p>
    </div>
    <div className="data-row">
      <p className="title">Phone&nbsp;Number</p>
      <p className="data">{renderString(valuator.userNumber)}</p>
    </div>
  </Fragment>
)

export default ValuatorDetails