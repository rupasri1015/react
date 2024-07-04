import React, { Fragment } from 'react'
import { renderString } from '../../../core/utility'
import { CallIcon } from '../../../core/utility/iconHelper'
import { getMobile, getUserID, getRole } from '../../../core/services/rbacServices'
import { callToCustomer } from '../../../core/services/biddingServices'

const UserDetails = ({ user, leadId }) => {

  const callCustomer = (mobileNumber) => {
    const payload = {
      fromNumber: getMobile(),
      toNumber: mobileNumber,
      userId: getUserID(),
      leadId: leadId
    }
    callToCustomer(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          console.log(apiResponse)
        }
      })
  }

  return (
    <Fragment>
      <h1 className="tab-heading">User Details</h1>
      <div className="data-row">
        <p className="title">Customer&nbsp;Name</p>
        <p className="data">{renderString(user.userName)}</p>
      </div>
      {
        getRole() === 'SHD_COMMISSION' ?
          <div className="data-row">
            <p className="title">Customer&nbsp;Number</p>
            <p className="data">{renderString('XXXXXXXXX')}
            </p>
          </div> :
          <div className="data-row">
            <p className="title">Customer&nbsp;Number</p>
            <p className="data">{renderString('XXXXXXXXX')}
              <span><img src={CallIcon} style={{ width: 20, cursor: "pointer" }} alt="Call To Customer" onClick={() => callCustomer(user.userNumber)} /></span>
            </p>
          </div>
      }
      <div className="data-row">
        <p className="title">Id&nbsp;Proof&nbsp;Type</p>
        <p className="data">{renderString(user.userIdProofType)}</p>
      </div>
      <div className="data-row">
        <p className="title">Id&nbsp;Proof&nbsp;Number</p>
        <p className="data">{renderString(user.userIdNumber)}</p>
      </div>
      <div className="data-row">
        <p className="title">Owner&nbsp;Name</p>
        <p className="data">{renderString(user.ownerName)}</p>
      </div>
      <div className="data-row">
        <p className="title">Address&nbsp;Line&nbsp;1</p>
        <p className="data">{renderString(user.addr1)}</p>
      </div>
      <div className="data-row">
        <p className="title">Address&nbsp;Line&nbsp;2</p>
        <p className="data">{renderString(user.addr2)}</p>
      </div>
    </Fragment>
  )
}
export default UserDetails