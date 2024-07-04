import React, { Fragment } from 'react'
import { renderString, getDate, getAmount } from '../../../core/utility'

const ExchangeDetails = ({ exchange, valuator, store,vehicle }) => (
  <Fragment>
    <h1 className="tab-heading">Exchange Details</h1>
    <div className="data-row">
      <p className="title">Lead&nbsp;Date&nbsp;Time</p>
      <p className="data">{getDate(exchange.leadCreateAt)}</p>
    </div>
    <div className="data-row">
      <p className="title">Exchange&nbsp;Date&nbsp;Time</p>
      <p className="data">{getDate(exchange.orderCreatedAt)}</p>
    </div>
    <div className="data-row">
      <p className="title">Order&nbsp;Type</p>
      <p className="data">{renderString(exchange.orderType)}</p>
    </div>
    <div className="data-row">
      <p className="title">Highest&nbsp;Bid</p>
      <p className="data">{getAmount(exchange.highestBid)}</p>
    </div>
   
    <div className="data-row">
      <p className="title">Commission</p>
      <p className="data">{getAmount(valuator.commission)}</p>
    </div>
    <div className="data-row">
      <p className="title">Incentive</p>
      <p className="data">{getAmount(store.storeIncentive)}</p>
    </div>
    <div className="data-row">
      <p className="title">Ownership&nbsp;Charges</p>
      <p className="data">{getAmount(exchange.ownersPriceDeduction)}</p>
    </div>

    <div className="data-row">
      <p className="title">Challan</p>
      <p className="data">{getAmount(vehicle.bikeChallan)}</p>
    </div>
    <div className="data-row">
      <p className="title">Voucher&nbsp;Price</p>
      <p className="data">{getAmount(exchange.orderVoucherPrice)}</p>
    </div>
    <div className="data-row">
      <p className="title">Voucher&nbsp;Code</p>
      <p className="data">{renderString(exchange.orderVoucherCode)}</p>
    </div>
    <div className="data-row">
      <p className="title">Valuator&nbsp;Name</p>
      <p className="data">{renderString(exchange.valuatorName)}</p>
    </div>
    <div className="data-row">
      <p className="title">Valuator&nbsp;Phone&nbsp;Number</p>
      <p className="data">{renderString(exchange.valuatorNumber)}</p>
    </div>
    <div className="data-row">
      <p className="title">Outlet</p>
      <p className="data">{renderString(exchange.valuatorStoreName)}</p>
    </div>
  </Fragment>
)

export default ExchangeDetails