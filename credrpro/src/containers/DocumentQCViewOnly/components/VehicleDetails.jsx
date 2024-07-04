import React, { Fragment } from 'react';
import { renderString, getBikeName, getAmount } from '../../../core/utility';

const VehicleDetails = ({ vehicle }) => (
  <Fragment>
    <div
      style={{
        padding: '8px 15px',
        background: '#FFDEC7',
        width: '150px',
        color: '#98360C',
        letterSpacing: '0.05ch',
        borderTopLeftRadius: '5px',
      }}
    >
      <span style={{ fontWeight: 600, fontSize: '14px' }}>Vehicle Details</span>
    </div>
    <div className="data-row">
      <p className="title">MMV</p>
      <p className="data">
        {getBikeName(
          vehicle.bikeManufactureName,
          vehicle.bikeModelName,
          vehicle.bikeVariantName
        )}
      </p>
    </div>
    <div className="data-row">
      <p className="title">Year</p>
      <p className="data">{renderString(vehicle.bikeManufacturerYear)}</p>
    </div>
    <div className="data-row">
      <p className="title">Registration&nbsp;Number</p>
      <p className="data">{renderString(vehicle.bikeRegistrationNumber)}</p>
    </div>
    <div className="data-row">
      <p className="title">No.&nbsp;of&nbsp;Owners</p>
      <p className="data">{renderString(vehicle.noOfUsers)}</p>
    </div>
    <div className="data-row">
      <p className="title">Finance&nbsp;(Y/N)</p>
      <p className="data">{renderString(vehicle.bikeFinance)}</p>
    </div>
    <div className="data-row">
      <p className="title">Insurance&nbsp;(Y/N)</p>
      <p className="data">{renderString(vehicle.insurance)}</p>
    </div>
  </Fragment>
);

export default VehicleDetails;
