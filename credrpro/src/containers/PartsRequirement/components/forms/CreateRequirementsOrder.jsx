import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Select from 'react-select';
import Header from '../Header';
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction';
import { setNotification } from '../../../../redux/actions/notificationAction';
import {
	getRunnerList,
	getVendorList,
	createOrder
} from '../../../../core/services/partsRequirementServices';
import {
	parseForDropDown,
	isPositiveInt
} from '../../../LiveInventoryUnit/components/forms/utils';
import { unselectAll } from '../../../../redux/actions/partRequirementTableAction'

const columns = [
	{label: 'Parts Request ID', value:'requestIds'},
	{label: 'Section', value:'section'},
	{label: 'Category', value:'category'},
	{label: 'Part Name', value:'sparePartName'},
	{label: 'MMV-Year', value:'mmvYearRanges'},
	{label: 'Requested Qty', value:'requestedQuantity'},
	{label: 'Estimated Unit Price', value:'estimatedUnitPrice'},
];

const CreateRequirementsOrder = ({ history }) => {
	const dispatch = useDispatch();
	const [runnerList, setRunnerList] = useState([]);
	const [vendorList, setVendorList] = useState([]);
	const [runner, setRunner] = useState('');
	const [vendor, setVendor] = useState('');
	const aggregateDataInit = useSelector(state => state.tableCheckBox.aggregateData);
	const warehouseId = useSelector(state => state.partsRequirement.warehouseId);
	const warehouseName = useSelector(state => state.partsRequirement.warehouseName);
	const [expandedRow, setExpandedRow] = useState(-1);
	const [aggregateData, setAggregateData ] = useState(aggregateDataInit || []);

	useEffect(() => {
		dispatch(showLoader());
		getRunnerList(warehouseId)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setRunnerList(parseForDropDown(apiResponse.runners));
			} else {
				setRunnerList([]);
			}
			dispatch(hideLoader());
		})

		getVendorList(warehouseId)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setVendorList(parseForDropDown(apiResponse.data));
			} else {
				setVendorList([]);
				dispatch(unselectAll({pageNumber: 0}));
			}
			dispatch(hideLoader());
		})
	}, [])

	if (runnerList.length !== 0 && vendorList.length !== 0) {
		dispatch(hideLoader());
	}

	const handleExpandMMV = (rowId) => {
		expandedRow === rowId ? setExpandedRow(-1) : setExpandedRow(rowId);
	}

	const handleGoBack = () => {
		dispatch(unselectAll({pageNumber: 0}));
		history.push('/partsRequirement')
	}

	const handleUnitPrice = (val, index) => {
		let tempAggregateData = JSON.parse(JSON.stringify(aggregateData));
		if((isPositiveInt(val) || val === '') && val !== '0') {
			tempAggregateData[index].estimatedUnitPrice = val;
			setAggregateData(tempAggregateData);
		}
	}

	const allUnitPriceFilled = () => {
		const unfilledRows = aggregateData.filter((data) => data.estimatedUnitPrice === '');
		return unfilledRows.length === 0
	}

	const handleCreateOrder = () => {
		const payload = {
			runnerId: Number(runner.value),
			runnerMobile: runner.mobileNumber,
			runnerName: runner.label,
			vendorId: vendor.value,
			vendorName: vendor.label,
			warehouseId,
			warehouseName,
			aggregatedItems: aggregateData
		}

		dispatch(showLoader());
		createOrder(payload)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				dispatch(unselectAll({pageNumber: 0}));
				dispatch(hideLoader());
				dispatch(setNotification('success', 'Order Created Successfully', ''));
				history.push('/partsRequirement');
			} else {
				dispatch(unselectAll({pageNumber: 0}));
				dispatch(setNotification('danger', 'Problem Creating Order', apiResponse.message));
				dispatch(hideLoader());
			}
		})
		
	}

	const dummyClick = () => {}

	if(runnerList.length !== 0 && vendorList.length !== 0) {
		dispatch(hideLoader());
	}

	return(
		<>
			<Header toWrite='Create Order and Assign to Runner'/>
			<div style={{ display: 'flex', flexDirection: 'row' }}> 
				<div style={{ width: '33%', marginRight: '0.5em'}}>
					<Select
						classNamePrefix="city-dropdown"
						value={{value: warehouseId, label: warehouseName}}
					/>
				</div>
				<div style={{ width: '33%', marginRight: '0.5em'}}>
					<Select
						float='right'
						options={runnerList}
						classNamePrefix="city-dropdown"
						placeholder="Select Runner Name"
						onChange={val => setRunner(val)}
						value={runner}
					/>
				</div>
				<div style={{ width: '33%'}}>
					<Select
						float='right'
						options={vendorList}
						classNamePrefix="city-dropdown"
						placeholder="Select Vendor List"
						onChange={val => setVendor(val)}
						value={vendor}
					/>
				</div>
			</div>
			
			<br/>
			
			<div className="table-wraper">
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
							aggregateData.map((rowData, index) => {
								return(
									<TableRow key={index}>
										{
											columns.map((col, index1) => {
												return(
													col.value === 'mmvYearRanges'
													?
													<TableCell key={index1}>
														{rowData.mmvYearRanges && rowData.mmvYearRanges.length !== 0
															? rowData.mmvYearRanges.length === 1
																? rowData.mmvYearRanges[0]
																: expandedRow === index
																? <div
																		onClick={ () => handleExpandMMV(index) }
																		style={{ cursor: 'pointer', color: 'teal', height: '9.3em', overflow: 'scroll' }}
																	>
																		{
																			rowData.mmvYearRanges.map((mmvYear, mmvIndex) => {
																				return(
																					<div
																						key={ mmvIndex }
																						style={{
																							border: '1px solid gray',
																							borderRadius: '3px',
																							marginBottom: '0.1em'
																						}}
																					>
																						{ 
																							mmvYear
																							? <div>
																										{ mmvYear.slice(0, mmvYear.length - 9) }
																										<br/>
																										{ mmvYear.slice(mmvYear.length - 9, mmvYear.length) }
																								</div>
																							: null
																						}
																					</div>
																				)
																			})
																		}
																	</div>
																:	<div>
																		{ rowData.mmvYearRanges[0].slice(0, rowData.mmvYearRanges[0].length - 9) }
																		<br/>
																		{ rowData.mmvYearRanges[0]
																				.slice(rowData.mmvYearRanges[0].length -9, rowData.mmvYearRanges[0].length)
																		} { ' ' }
																		<span 
																			onClick={ () => handleExpandMMV(index) }
																			style={{ cursor: 'pointer', color: 'blue' }}
																		>
																			+({rowData.mmvYearRanges.length-1})
																		</span> 
																	</div>
															: null
														}
													</TableCell>
													: col.value === 'estimatedUnitPrice'
													?
														<TableCell key={index1}>
															<input
																type='text'
																value={aggregateData[index].estimatedUnitPrice}
																onChange={(event) => handleUnitPrice(event.target.value, index)}
															/>
														</TableCell>
													:	col.value === 'requestIds'
													? 
														<TableCell key={index1}>
															{
																rowData[col.value].map((id, index2) => <ul key={index2}>{id}</ul>)
															}
														</TableCell>
													:	
														<TableCell key={index1}>
															{rowData[col.value]}
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
			</div>
			<Button
				color={ allUnitPriceFilled() && runner && vendor ? "success" : "secondary"}
				type="button"
				className="rounded no-margin"
				onClick={ allUnitPriceFilled() ? handleCreateOrder : dummyClick}
				style={{ float: 'right', margin: '1em'  }}
			>
				Create Order
			</Button>
			<Button
				className="rounded no-margin"
				type="button"
				style={{ margin: '1em'  }}
				onClick={handleGoBack}
			>
				Back
			</Button>
		</>
	)
}

export default CreateRequirementsOrder;
