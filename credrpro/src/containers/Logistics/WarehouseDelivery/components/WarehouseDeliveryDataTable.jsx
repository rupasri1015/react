import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getWarehouseData, resetWarehouseData } from '../../../../redux/actions/warehouseDeliveryAction';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Chip from '@material-ui/core/Chip';
import Pagination from 'rc-pagination';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import NoResultFound from '../../../../shared/components/NoResultFound';
import { getDate, getBikeName, capaitalize, renderString, getElapsedTime } from '../../../../core/utility';
import { PERMISSIONS, getRole } from '../../../../core/services/rbacServices';
import '../../style.scss'
const allHeaders = [
	{ id: 'Exchange Date', label: 'Exchange Date' },
	{ id: 'Assigned Date', label: 'Assigned Date' },
	{ id: 'Scheduled Date', label: 'Scheduled Date' },
	{ id: 'Picked up Date', label: 'Picked up Date' },
	{ id: 'outlet', label: 'FHD Outlet' },
	{ id: 'MMV-Year', label: 'MMV-Year' },
	{ id: 'Registration Number', label: 'Registration Number' },
	{ id: 'Conversion Category', label: 'Conversion Category' },
	{ id: 'Coordinator Details', label: 'Coordinator Details' },
	{ id: 'Status', label: 'Status' },
	{ id: 'ownedBy', label: 'Owned By' }
];

const confirmPendingHeaders = [
	{ id: 'delivered', label: 'Delivered Date' },
	{ id: 'Picked up Date', label: 'Pickup Date' },
	{ id: 'Scheduled Date', label: 'Scheduled Date' },
	{ id: 'Assigned Date', label: 'Assigned Date' },
	{ id: 'Exchange Date', label: 'Exchange Date' },
	{ id: 'tat', label: 'TAT' },
	{ id: 'outlet', label: 'FHD Outlet' },
	{ id: 'MMV-Year', label: 'MMV-Year' },
	{ id: 'Registration Number', label: 'Registration Number' },
	{ id: 'Conversion Category', label: 'Conversion Category' },
	{ id: 'Coordinator Details', label: 'Coordinator Details' },
	{ id: 'Status', label: 'Status' },
	{ id: 'ownedBy', label: 'Owned By' }
];

const deliveredHeaders = [
	{ id: 'delivered', label: 'Delivered Date' },
	{ id: 'Picked up Date', label: 'Pickup Date' },
	{ id: 'Scheduled Date', label: 'Scheduled Date' },
	{ id: 'Assigned Date', label: 'Assigned Date' },
	{ id: 'Exchange Date', label: 'Exchange Date' },
	{ id: 'tat', label: 'TAT' },
	{ id: 'outlet', label: 'FHD Outlet' },
	{ id: 'MMV-Year', label: 'MMV-Year' },
	{ id: 'Registration Number', label: 'Registration Number' },
	{ id: 'Conversion Category', label: 'Conversion Category' },
	{ id: 'Coordinator Details', label: 'Coordinator Details' },
	{ id: 'Status', label: 'Status' },
	{ id: 'ownedBy', label: 'Owned By' }
];

const disputeHeaders = [
	{ id: 'delivery dispute', label: 'Disputed Date' },
	{ id: 'reason', label: 'Dispute Reason' },
	{ id: 'Picked up Date', label: 'Pickup Date' },
	{ id: 'Scheduled Date', label: 'Scheduled Date' },
	{ id: 'Assigned Date', label: 'Assigned Date' },
	{ id: 'Exchange Date', label: 'Exchange Date' },
	{ id: 'tat', label: 'TAT' },
	{ id: 'outlet', label: 'FHD Outlet' },
	{ id: 'MMV-Year', label: 'MMV-Year' },
	{ id: 'Registration Number', label: 'Registration Number' },
	{ id: 'Conversion Category', label: 'Conversion Category' },
	{ id: 'Coordinator Details', label: 'Coordinator Details' },
	{ id: 'Status', label: 'Status' },
	{ id: 'ownedBy', label: 'Owned By' }
];

class WarehouseTable extends Component {
	componentDidMount() {
		const { dispatch, status } = this.props;
		dispatch(getWarehouseData({ pageNum: 1, vehicleStatus: status }));
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(resetWarehouseData());
	}

	componentDidUpdate() {
		const { warehouseData, onStatusChange, isRegistrationSearch } = this.props;
		if (isRegistrationSearch && warehouseData.length === 1) {
			onStatusChange(warehouseData[0].vehicleStatus);
		}
	}

	getTableHeader = () => {
		const { status } = this.props;
		switch (status.toLowerCase()) {
			case 'all':
				return allHeaders;
			case 'delivered_confirm_pending':
				return confirmPendingHeaders;
			case 'delivered':
				return deliveredHeaders;
			case 'dispute':
				return disputeHeaders;
			default:
				return [];
		}
	};

	customerDetails = (leadCustId) => {
		const { onCustomerDetails } = this.props;
		if (onCustomerDetails) {
			onCustomerDetails(leadCustId);
		}
	};

	handlePageChange = (pageNum) => {
		const { onPageChange, page } = this.props;
		if (page !== pageNum) {
			onPageChange(pageNum);
		}
	};

	getCount = () => {
		const { pendingConfirmation, delivered, dispute, allCount, status } = this.props;
		switch (status.toLowerCase()) {
			case 'all':
				return allCount;
			case 'delivered_confirm_pending':
				return pendingConfirmation;
			case 'delivered':
				return delivered;
			case 'dispute':
				return dispute;
			default:
				return allCount;
		}
	};

	viewBikeDetails = (inventoryId) => {
		const { onViewDetails } = this.props;
		onViewDetails(inventoryId);
	};

	render() {
		const { warehouseData, page, onConfirmDelivery, status } = this.props;
		return (
			<div className="table-wraper">
				<Table size="small">
					<TableHead>
						<TableRow>
							{this.getTableHeader().map((column) => (
								<TableCell key={column.id}>{column.label}</TableCell>
							))}
							{PERMISSIONS.LOGISTICS.includes(getRole()) ? (
								status.toLowerCase() !== 'delivered' ? (
									<TableCell>Action</TableCell>
								) : (
									<TableCell>View Bike Details</TableCell>
								)
							) : (
								status.toLowerCase() === 'delivered' && <TableCell>View Bike Details</TableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{Boolean(warehouseData.length) &&
							warehouseData.map((data, id) => {
								const {
									makeName,
									modelName,
									variantName,
									registrationNumber,
									fhdName,
									orderCreatedDate,
									runnerAssignedAt,
									pickUpDate,
									pickedUpDate,
									coordinatoreName,
									makeYear,
									leadId,
									deliveredDate,
									vehicleStatus,
									coordinatoreNum,
									valuatorNumber,
									valuatorName,
									deliveryTat,
									conversionCategory,
									vehicleDisputeReason,
									coordinatoreConfirmedDate,
									ownedBy
								} = data;
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={`${registrationNumber} ${id}`}>
										{status.toLowerCase() === 'all' && (
											<>
												<TableCell>
													<p>{getDate(orderCreatedDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(runnerAssignedAt)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(pickUpDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(pickedUpDate)}</p>
												</TableCell>
											</>
										)}
										{status.toLowerCase() === 'delivered_confirm_pending' && (
											<>
												<TableCell>
													<p>{getDate(deliveredDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(pickUpDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(pickUpDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(runnerAssignedAt)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(orderCreatedDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getElapsedTime(deliveryTat)}</p>
												</TableCell>
											</>
										)}
										{status.toLowerCase() === 'delivered' && (
											<>
												<TableCell>
													<p>{getDate(coordinatoreConfirmedDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(pickUpDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(pickUpDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(runnerAssignedAt)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(orderCreatedDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getElapsedTime(deliveryTat)}</p>
												</TableCell>
											</>
										)}
										{status.toLowerCase() === 'dispute' && (
											<>
												<TableCell>
													<p>{getDate(coordinatoreConfirmedDate)}</p>
												</TableCell>
												<TableCell>
													<p>{renderString(vehicleDisputeReason)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(pickUpDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(pickUpDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(runnerAssignedAt)}</p>
												</TableCell>
												<TableCell>
													<p>{getDate(orderCreatedDate)}</p>
												</TableCell>
												<TableCell>
													<p>{getElapsedTime(deliveryTat)}</p>
												</TableCell>
											</>
										)}

										<TableCell>
											<p className="tableCellHead">{renderString(fhdName)}</p>
											<p>{renderString(valuatorName)}</p>
											<p>{renderString(valuatorNumber)}</p>
										</TableCell>
										<TableCell>
											<p>{`${getBikeName(makeName, modelName, variantName)} ${renderString(makeYear)}`}</p>
										</TableCell>
										<TableCell>
											<p>{renderString(registrationNumber)}</p>
											<small className='leadLabel'>{leadId}</small>
										</TableCell>
										<TableCell>
											<Chip
												label={capaitalize(conversionCategory)}
												classes={{ colorPrimary: capaitalize(conversionCategory) }}
												color="primary"
											/>
										</TableCell>
										<TableCell>
											<p>{renderString(coordinatoreName)}</p>
											<p>{renderString(coordinatoreNum)}</p>
										</TableCell>
										<TableCell>
											<Chip
												label={
													vehicleStatus === 'DELIVERED_CONFIRM_PENDING' ? 'Confirm Pending' : capaitalize(vehicleStatus)
												}
												classes={{
													colorPrimary:
														vehicleStatus === 'DELIVERED_CONFIRM_PENDING' ? 'Pending' : capaitalize(vehicleStatus)
												}}
												color="primary"
											/>
										</TableCell>
										{PERMISSIONS.LOGISTICS.includes(getRole()) ? (
											vehicleStatus === 'DELIVERED_CONFIRM_PENDING' || vehicleStatus === 'DISPUTE' ? (
												<TableCell>
													<button className="btn-outline--small accept" onClick={() => onConfirmDelivery(data)}>
														Confirm&nbsp;Delivery
													</button>
												</TableCell>
											) : status.toLowerCase() === 'delivered' ? (
												<TableCell>
													<button className="btn-outline--small blue" onClick={() => this.viewBikeDetails(leadId)}>
														View&nbsp;Details
													</button>
												</TableCell>
											) : (
												<TableCell>NA</TableCell>
											)
										) : (
											status.toLowerCase() === 'delivered' && (
												<TableCell>
													<button
														className="btn-outline--small blue"
														type="button"
														onClick={() => this.viewBikeDetails(leadId)}
													>
														View&nbsp;Details
													</button>
												</TableCell>
											)
										)}
										<TableCell>
											<p>{renderString(ownedBy)}</p>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
				<div className="table-paginator">
					{Boolean(warehouseData.length) ? (
						<Pagination
							className="float-right"
							showSizeChanger={false}
							total={this.getCount()}
							pageSize={12}
							current={page}
							locale={localeInfo}
							onChange={this.handlePageChange}
						/>
					) : (
						<NoResultFound />
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	warehouseData: state.warehouse.vehicleStatus,
	allCount: state.warehouse.allCount,
	pendingConfirmation: state.warehouse.delivered_confirm_pending,
	delivered: state.warehouse.delivered,
	dispute: state.warehouse.dispute,
	page: state.warehouse.pageNum
});

export default connect(mapStateToProps)(WarehouseTable);
