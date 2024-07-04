import React, { Fragment } from 'react'
import { renderString } from '../../../core/utility'

const FHDShowroomDetails = ({ showroom }) => (
  <Fragment>
    <h1 className="tab-heading">FHD Showroom Details</h1>
    <div className="data-row">
      <p className="title">Outlet&nbsp;Name</p>
      <p className="data">{renderString(showroom.storeName)}</p>
    </div>
    <div className="data-row">
      <p className="title">Outlet&nbsp;Location</p>
      <p className="data">{renderString(showroom.storeLocation)}</p>
    </div>
    <div className="data-row">
      <p className="title">Outlet&nbsp;Number</p>
      <p className="data">{renderString(showroom.storeContactNumber)}</p>
    </div>
  </Fragment>
)

export default FHDShowroomDetails