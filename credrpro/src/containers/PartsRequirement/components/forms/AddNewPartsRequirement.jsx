import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { parseForDropDown, parseForMMVDropDown } from '../../../LiveInventoryUnit/components/forms/utils';
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction';
import Header from '../Header';
import { Button, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Divider from '@material-ui/core/Divider'
import EditableRow from './EditableRow';
import { getUserID } from '../../../../core/services/rbacServices';
import { submitPartRequirementDetails } from '../../../../core/services/partsRequirementServices'
import { setNotification } from '../../../../redux/actions/notificationAction';
import { unselectAll } from '../../../../redux/actions/partRequirementTableAction'
import {
	isPositiveInt,
	isTableFilled,
} from '../../../LiveInventoryUnit/components/forms/utils';
import {
	getAllWarehouses,
	getAllSparePartNames,
	getAllMMVYearRange,
	getAllSparePartNamesWithSection,
	getAllCategories
} from '../../../../core/services/liveInventoryUnitServices';
import { getWarehouseID, getWarehouseName } from '../../../../core/services/rbacServices';

const AddNewPartsRequirement = ({ history }) => {
	const dispatch = useDispatch();
	const [sparePartList, setSparePartList] = useState([]);
	const [categoryList, setCategoryList] = useState([]);
	const [allPartsWithSection, setAllPartsWithSection] = useState([]);
	const [mmvList, setMMVList] = useState([]);
	const [wareHouseList, setWarehouseList] = useState([]);
	const [wareHouse, setWarehouse] = useState('');
	const [tableData, setTableData] = useState([{
		section: '',
		category: '',
		partName: '',
		mmvYearRange: '',
		qty: '',
	}]);

	useEffect(() => {
		dispatch(showLoader());
		dispatch(unselectAll({pageNumber: 0}));
		getAllCategories()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setCategoryList(apiResponse.data);
			}
		})

		const userWarehouseId = getWarehouseID();
		if(userWarehouseId === 0){
			getAllWarehouses()
			.then(apiResponse => {
				if (apiResponse.isValid) {
					let warehouses = parseForDropDown(apiResponse.data);
					setWarehouseList(warehouses.filter((wareHouse) => {
						return wareHouse.value !== 0
					}));
				}
			})
		} else {
			setWarehouseList([{value: userWarehouseId, label: getWarehouseName()}]);
			setWarehouse({value: userWarehouseId, label: getWarehouseName()});
		}

		getAllSparePartNames()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setSparePartList(apiResponse.data);
			}
		})

		getAllSparePartNamesWithSection()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setAllPartsWithSection(apiResponse.data);
			}
		})

		getAllMMVYearRange()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setMMVList(parseForMMVDropDown(apiResponse.data));
			}
		})
	}, [])

	const setSection = (section, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		tempTableData[rowId].section = section;
		tempTableData[rowId].category = '';
		tempTableData[rowId].partName = '';
		setTableData(tempTableData);
	}

	const setCategory = (category, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		tempTableData[rowId].category = category;
		tempTableData[rowId].partName = '';
		if(category.section) {
			tempTableData[rowId].section = category.section;
		}
		setTableData(tempTableData);
	}

	const setPartName = (partName, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		tempTableData[rowId].partName = partName;
		if(partName.section) {
			tempTableData[rowId].section = partName.section;
		}
		if(partName.category) {
			tempTableData[rowId].category = partName.category;
		}
		setTableData(tempTableData);
	}

	const setQty = (qty, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		if(isPositiveInt(qty) || qty === '') {
			tempTableData[rowId].qty = qty;
		}
		setTableData(tempTableData);
	}

	const setMMVYearRange = (mmvYearRange, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		tempTableData[rowId].mmvYearRange = mmvYearRange;
		setTableData(tempTableData);
	}

	const setMMVSearchInput = (mmvSearchInput, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		tempTableData[rowId].mmvSearchInput = mmvSearchInput;
		setTableData(tempTableData);
	}

	const handleAddAnotherPage = () => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		tempTableData.push({
			section: '',
			category: '',
			partName: '',
			mmvYearRange: '',
			qty: '',
		});
		setTableData(tempTableData);
	}

	const handleDelete = (rowNo) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		const tempTableData1 = tempTableData.filter((data, index) => index !== rowNo );
		setTableData(tempTableData1);
	}

	const handleDummyClick = () => {}

	const generatePayload = () => {
		return(
			{
				"warehouseName": wareHouse.label,
				"warehouseId": wareHouse.value,
				"userId": getUserID(),
				"partDetails": tableData.map((rowData) => {
					return(
						{
							"section": rowData.section.value,
							"category": rowData.category.value,
							"sparePartName": rowData.partName.label,
							"sparePartId": rowData.partName.value,
							"requestedQuantity": rowData.qty,
							"mmvYearRanges":
								rowData.mmvYearRange
									? rowData.mmvYearRange.map((mmv) => {
											return mmv.value
										})
									: []
						}
					)
				})
			}
		)
	}

	const handleSubmit = () => {
		const payload = generatePayload();
    dispatch(showLoader());
		submitPartRequirementDetails(payload)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				dispatch(hideLoader());
				dispatch(setNotification('success', 'Data Added Successfully', ''));
				history.push('/partsRequirement');
			}
			else {
				dispatch(setNotification('danger', 'Data is not added', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}

	if(categoryList.length !== 0
		&& sparePartList.length !== 0
		&& allPartsWithSection.length !== 0
		&& mmvList.length !== 0
		&& wareHouseList.length !== 0) {
				dispatch(hideLoader());
		}

	return(
		<>
			<Header toWrite='Create New Spare Part(s) Requisition'/>
			<Card className="pending-inventory-header">
			<div style={{ marginBottom: '2em', width: '30%' }}>
					<Select
							options={wareHouseList}
							classNamePrefix="city-dropdown"
							placeholder="Select Warehouse"
							onChange={setWarehouse}
							value={wareHouse}
					/>
					{
						wareHouse === ''
							? <div style={{ color: '#c00' }}>
									* Select a warehouse to create a new Spare Part Requisition
								</div>
							: null
					}
				</div>
				<CardBody className="card-shadow square-border">
					Part Requisition Details
					<Button
						style={{ float: 'right', marginRight: '0' }}
						color={wareHouse === '' ? 'secondary' : "success"}
						type="button"
						className="rounded no-margin"
						onClick = { wareHouse === '' ? handleDummyClick : handleAddAnotherPage }
					>
						Add Another Part
					</Button>
					<Divider style={{ margin: '2em 0' }}/>
					<div style={{ display: 'flex', flexDirection: 'row', marginLeft: tableData.length === 1 ? '0' : '2em' }}>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', margin: '0 0.5%', width: '17%' }}>Section *</div>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '0.5%', width: '17%' }}>Category *</div>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '0.5%', width: '17%' }}>Part Name *</div>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '0.5%', width: '30%' }}>Applicable MMVs</div>
						<div style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '1%', width: '15%' }}>Quantity *</div>
					</div>
					<Divider style={{ margin: '0.5em 0' }}/>

					{
						categoryList.length !== 0
						&& sparePartList.length !== 0
						&& allPartsWithSection.length !== 0
						&& mmvList.length !== 0
						&& wareHouseList.length !== 0
						?
							tableData.map((rowData, index) => {
								return(
									<EditableRow
										key={index}
										rowId={index}
										rowData={rowData}
										setSection={setSection}
										setCategory={setCategory}
										setPartName={setPartName}
										sparePartList={ sparePartList }
										allPartsWithSection={ allPartsWithSection }
										categoryList={ categoryList }
										setQty={setQty}
										mmvList={mmvList}
										setMMVYearRange={setMMVYearRange}
										isDisabled={wareHouse === ''}
										totalNoOfRows={tableData.length}
										deleteRow={handleDelete}

										setMMVSearchInput={setMMVSearchInput}
									/>
								)
							})
						: null
					}

					<Link className="btn btn-success rounded no-margin" to="/partsRequirement">Cancel</Link>
					<Button
						color={ isTableFilled(tableData) ? 'success' : 'secondary' }
						type="button"
						className="rounded no-margin"
						style={{ float: 'right' }}
						onClick = { isTableFilled(tableData)
							? handleSubmit
							: handleDummyClick
						}
					>
						Submit
					</Button>
				</CardBody>
			</Card>
		</>
	)
}

export default AddNewPartsRequirement;
