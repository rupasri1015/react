import React, { Fragment } from 'react';
import { renderString, getBikeName, getAmount } from '../../../core/utility';

const VehicleDetails = ({ vehicle }) => (
	<Fragment>
		<h1 className="tab-heading">Vehicle Details</h1>
		<div className="data-row">
			<p className="title">MMV</p>
			<p className="data">{getBikeName(vehicle.bikeManufactureName, vehicle.bikeModelName, vehicle.bikeVariantName)}</p>
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
		{/* <div className="data-row">
      <p className="title">Challan</p>
      <p className="data">{getAmount(vehicle.bikeChallan)}</p>
    </div> */}
	</Fragment>
);

export default VehicleDetails;
