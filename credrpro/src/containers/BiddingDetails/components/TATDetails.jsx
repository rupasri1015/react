import React, { Fragment } from 'react'
import { getDate } from '../../../core/utility'

const TATDetails = ({ history }) => (
  <Fragment>
    <h1 className="tab-heading">TAT Details</h1>
    <div className="data-row">
      <p className="title">Lead&nbsp;Date&nbsp;Time</p>
      <p className="data">{getDate(history.leadCreateAt)}</p>
    </div>
    <div className="data-row">
      <p className="title">Bidding&nbsp;Date&nbsp;Time</p>
      <p className="data">{getDate(history.auctionCreatedAt)}</p>
    </div>
    <div className="data-row">
      <p className="title">Exchange&nbsp;Date&nbsp;Time</p>
      <p className="data">{getDate(history.orderCreatedAt)}</p>
    </div>
  </Fragment>
)

export default TATDetails