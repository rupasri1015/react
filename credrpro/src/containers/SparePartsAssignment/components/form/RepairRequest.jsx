import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import Header from '../Header';
import { useDispatch } from 'react-redux';
import { Button, Card, CardBody, InputGroup } from 'reactstrap'
import { Link } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import { getUserID } from '../../../../core/services/rbacServices';
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction';
import { setNotification } from '../../../../redux/actions/notificationAction';
import {
	getRepairRequestData,
	submitRepairRequest,
	createPartsRequisition
} from '../../../../core/services/sparePartsAssignmentServices';
import AssignmentHistoryTable from './AssignmentHistoryTable'
import {
	getRepairRequestId,
	disableAssignButton
} from './utils';
import { PERMISSIONS, getRole } from '../../../../core/services/rbacServices'

const columns = [
	{label: 'Spare Part Name', value:'sparePartName'},
	{label: 'Requested Qty', value:'requestedQuantity'},
	{label: 'Previously assigned Qty', value:'preAssignedQuantity'},
	{label: 'Available Qty', value:'tempAvailableQty'},
	{label: 'Enter Assignment (+/-)', value:'assignedQuantity'},
	{label: 'Order Item Id', value:'orderItemId'},
];

const RepairRequest = ({ history }) => {
  const dispatch = useDispatch();
	const [assignReqData, setAssignReqData] = useState([]);
	const [historyData, setHistoryData] = useState([]);
	const [disableAssign, setDisableAssign] = useState(false);
	const [disableConfirm, setDisableConfirm] = useState(true);
	const [cprButtonActive, setCprButtonActive] = useState(false);
	const [allData, setAllData] = useState({});
	const [errorMessage, setErrorMessage] = useState([]);

	useEffect(() => {
		const currentPath = window.location.pathname;
    dispatch(showLoader());
		getRepairRequestData(getRepairRequestId(currentPath))
		.then(apiResponse => {
			if (apiResponse.isValid) {
				let { data } = apiResponse;
				setAllData(data);
				setAssignReqData(data.spareParts.map((d) => {
					d.tempAvailableQty = d.availableQuantity;
					d.assignedQuantity = d.pendingQuantity;
					d.orderItemIdAvailability = [];
					return d;
				}));
				dispatch(hideLoader());
				setHistoryData(data.assignments);
				setCprButtonActive(data.createRequest);
			}
		})
	}, [])

	const handleAssignmentDecrease = (index) => {
		let tempAssignData = JSON.parse(JSON.stringify(assignReqData));
		if(tempAssignData[index].assignedQuantity - 1 >= 0) {
			tempAssignData[index].assignedQuantity -= 1;
			setDisableConfirm(true);
			setDisableAssign(false);
		}
		setAssignReqData(tempAssignData);
	}

	const handleAssignmentIncrease = (index) => {
		let tempAssignData = JSON.parse(JSON.stringify(assignReqData));
		if(tempAssignData[index].assignedQuantity + 1 <= tempAssignData[index].pendingQuantity
			&& tempAssignData[index].assignedQuantity + 1 <= tempAssignData[index].availableQuantity
			) {
			tempAssignData[index].assignedQuantity += 1;
			setDisableConfirm(true);
			setDisableAssign(false);
		}
		setAssignReqData(tempAssignData);
	}

	const handleSerialNumber = (orderItemId, index) =>{
		let tempAssignData = JSON.parse(JSON.stringify(assignReqData));
		if(orderItemId) {
			tempAssignData[index].selectedOrderIds = orderItemId.map(itemId => itemId.value);
			tempAssignData[index].orderItemIdAvailability = orderItemId.map(itemId => itemId.availableQuantity);
		} else {
			tempAssignData[index].selectedOrderIds = [];
			tempAssignData[index].orderItemIdAvailability = [];
		}
		setAssignReqData(tempAssignData);
	}

	const handleAssign = () => {
		let tempAssignData = JSON.parse(JSON.stringify(assignReqData));
		setAssignReqData(tempAssignData.map((data) => {
			data.tempAvailableQty = data.availableQuantity - data.assignedQuantity;
			return data;
		}))
		setDisableAssign(true);
		setDisableConfirm(false);
	}

	const handleConfirm = () => {
		const currentPath = window.location.pathname;
		let sparePartRequests = assignReqData.map((data) => {
			const { sparePartName, assignedQuantity, orderItemId, sparePartId, selectedOrderIds } = data;
			return({ sparePartName, assignedQuantity, orderItemId, sparePartId, selectedOrderIds })
		})
		const payload = { sparePartRequests,
			repairRequestId: getRepairRequestId(currentPath),
			userId: getUserID()
		}
		
    dispatch(showLoader());
		submitRepairRequest(payload)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				if(apiResponse.message === 'error') {
					setErrorMessage(apiResponse.data.map(message => message.sparePartId));
					dispatch(setNotification('danger', 'Invalid Order Item Id', apiResponse.message));
				} else {
					setErrorMessage([]);
					dispatch(setNotification('success', 'Data Added Successfully', ''));
					history.push('/sparePartsAssignment');
				}
				dispatch(hideLoader());
			}
			else {
				setErrorMessage([]);
				dispatch(setNotification('danger', 'Data is not added', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}

	const handleCPRRequest = () => {
		const currentPath = window.location.pathname;
    dispatch(showLoader());
		createPartsRequisition(getRepairRequestId(currentPath))
		.then(apiResponse => {
			if (apiResponse.isValid) {
				dispatch(setNotification('success', 'CPR created', apiResponse.message));
				dispatch(hideLoader());
				setCprButtonActive(false);
			} else {
				dispatch(setNotification('danger', 'CPR failed', apiResponse.message));
				dispatch(hideLoader());
			}
		})

	}

	const dummyClick = () => {};

	return(
		<div>
			<Header toWrite='Spare Parts Assignment Details'/>

			<div>
				<span className='assignment-details'>
					Bike Registration Number: {allData.registrationNumber || 'Unavailable'}
				</span>
				<span className='assignment-details'>MMV: {allData.mmv}</span>
				<span className='assignment-details'>Year: {allData.year}</span>
			</div>
			
			<Card className="pending-inventory-header">
        <CardBody className="card-shadow square-border">
					<Table size="small">
						<TableHead>
							<TableRow>
								{
									columns.map((row, index) => (
										<TableCell
											key={index}
										>
											{row.label}
										</TableCell>
									))
								}
							</TableRow>
						</TableHead>
						<TableBody>
							{
								assignReqData.map((rowData, index) => {
									return(
										<TableRow hover tabIndex={-1}  key={ index }>
											{
												columns.map((col, index1) => {
													return(
														<TableCell key={index1}>
															{ col.value === 'assignedQuantity'
																? rowData.requestedQuantity === rowData.preAssignedQuantity
																	? null
																	:	<InputGroup style={{ marginTop: '1em' }}>
																		{
																			rowData.requestedQuantity === 0 || rowData.availableQuantity === 0
																			?
																				<>
																					<Button>-</Button>
																					<Button>{rowData[col.value]}</Button>
																					<Button>+</Button>
																				</>
																			: 
																			PERMISSIONS.SPAREPARTS_ASSIGNMENT.includes(getRole())
																			?
																				<>
																					<Button 
																						onClick={() => {handleAssignmentDecrease(index)}}
																						color="primary"
																					>
																						-
																					</Button>
																					<Button color="primary">
																						{rowData[col.value]}
																					</Button>
																					<Button
																						color="primary"
																						onClick={() => {handleAssignmentIncrease(index)}}
																					>
																						+
																					</Button>
																				</>
																			:
																				<>
																					<Button 
																						color="secondary"
																					>
																						-
																					</Button>
																					<Button color="secondary">
																						{rowData[col.value]}
																					</Button>
																					<Button
																						color="secondary"
																					>
																						+
																					</Button>
																				</>
																			}
																		</InputGroup> 
																: col.value === 'tempAvailableQty'
																	&& rowData.requestedQuantity === rowData.preAssignedQuantity
																? null
																: col.value === 'orderItemId'
																?
																	rowData.assignStatus === "Completed"
																	? rowData.selectedOrderIds.map((id, ind) => {
																			return <div key={ind}>{id}</div>
																		})
																	:
																	<>
																		<div style={{ width: '20em' }}>
																			<Select
																				isMulti
																				multi={true}
																				options={
																					disableAssign || disableAssignButton(assignReqData)
																					?
																					rowData.orderItemIds
																					: []
																				}
																				className="basic-multi-select"
																				classNamePrefix="select"
																				placeholder="Order Item Ids"
																				onChange={(itemId) => handleSerialNumber(itemId, index)}
																				isDisabled={rowData.assignedQuantity===0}
																				closeMenuOnSelect={false}
																			/>
																		</div>
																		
																		{
																			errorMessage.includes(rowData.sparePartId)
																			? <div style={{ color: 'red' }}>
																					<br/>Invalid Order Item Id
																				</div>
																			: null
																		}
																	</>
																:	rowData[col.value] 
															}
														</TableCell>
													)
												})
											}
										</TableRow>
									)
								})
							}
						</TableBody>
					</Table>
					<br/>
					{
						PERMISSIONS.SPAREPARTS_ASSIGNMENT.includes(getRole())
						?
						<>
							<Button
								color="success"
								type="button"
								className="rounded no-margin"
								onClick={handleConfirm}
								style={{ float: 'right', margin: '1em'  }}
								disabled={disableConfirm}
							>
									Confirm
							</Button>
							<Button
								color="success"
								type="button"
								className="rounded no-margin"
								onClick={handleAssign}
								style={{ float: 'right', margin: '1em'  }}
								disabled={disableAssign || disableAssignButton(assignReqData)}
							>
									Assign
							</Button>
							<Button
								color={cprButtonActive ? 'success' : 'secondary'}
								type="button"
								className="rounded no-margin"
								onClick={cprButtonActive ? handleCPRRequest : dummyClick}
							>
									Create Parts Requisition
							</Button>
						</>
						: null
					}
					
					<Link
						className="btn btn-secondary rounded no-margin"
						to="/sparePartsAssignment"
						style={{ float: 'right', margin: '1em'  }}
					>
						Cancel
					</Link>
					<br/>
				</CardBody>
				<CardBody>
					<Header toWrite='Assignment History'/>
					<AssignmentHistoryTable data={historyData}/>
				</CardBody>
			</Card>
		</div>
	)
}

export default RepairRequest;