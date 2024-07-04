import React, { useState } from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Header from '../Header';
import Divider from '@material-ui/core/Divider'
import EditableRow from './EditableRow';
import { isPositiveInt, isPositiveFloat, isTableFilled, roundUptoTwoDecimal } from './utils';

const sourceTypeOptions = [
	{label: 'None', value: 'none', data: 'asdf'},
	{label: 'OEM', value: 'oem', data: 'asdf'},
	{label: 'After Market', value: 'afterMarket', data: 'asdf'},
]

const FormPageOne = (props) => {

	const [tableData, setTableData] = useState(props.tableData);
	const wareHouseList = props.wareHouseList.filter((wareHouse) => {
		return wareHouse.value !== 0
	})

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

	const setSourceType = (sourceType, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		tempTableData[rowId].sourceType = sourceType;
		setTableData(tempTableData);
	}

	const setQty = (qty, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		if(isPositiveInt(qty) || qty === '') {
			tempTableData[rowId].qty = qty;
		}
		setTableData(tempTableData);
	}

	const setUnitPrice = (unitPrice, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		if(isPositiveFloat(unitPrice) || unitPrice === '') {
			tempTableData[rowId].unitPrice = roundUptoTwoDecimal(unitPrice);
		}
		setTableData(tempTableData);
	}

	const setModelNo = (modelNo, rowId) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		tempTableData[rowId].modelNo = modelNo;
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
			sourceType: '',
			qty: '',
			unitPrice: '',
			modelNo: '',
		});
		setTableData(tempTableData);
	}

	const handleDelete = (rowNo) => {
		let tempTableData  = JSON.parse(JSON.stringify(tableData));
		const tempTableData1 = tempTableData.filter((data, index) => index !== rowNo );
		setTableData(tempTableData1);
	}

	const handleDummyClick = () => {}

	return(
		<>
			<Header toWrite='Fulfil Spare Part Details'/>
			<Card className="pending-inventory-header">
				<div style={{ marginBottom: '2em', width: '25%' }}>
					<Select
							options={wareHouseList}
							classNamePrefix="city-dropdown"
							placeholder="Select Warehouse"
							onChange={props.setWarehouse}
							value={props.wareHouse}
					/>
					{
						props.wareHouse === ''
							? <div style={{ color: '#c00' }}> * Please Select a warehouse to add parts</div>
							: null
					}
				</div>

				<CardBody className="card-shadow square-border">
					Part Details
					<Button
						style={{ float: 'right', marginRight: '0' }}
						color={props.wareHouse === '' ? 'secondary' : "success"}
						type="button"
						className="rounded no-margin"
						onClick = { props.wareHouse === '' ? handleDummyClick : handleAddAnotherPage }
					>
						Add Another Part
					</Button>

					<Divider style={{ margin: '2em 0' }}/>
					<div style={{ display: 'flex', flexDirection: 'row', marginLeft: tableData.length === 1 ? '0' : '2em' }}>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '0.5%', width: '9%' }}>Section *</div>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '0.5%', width: '11%' }}>Category *</div>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '0.5%', width: '12%' }}>Part Name *</div>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '0.5%', width: '27%' }}>Applicable MMVs *</div>
						<div style={{ paddingLeft:'0.25em', fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '1%', width: '11%' }}>Source Type</div>
						<div style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '1%', width: '7%' }}>Quantity *</div>
						<div style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray', marginRight: '1%', width: '8%' }}>Unit Price*</div>
						<div style={{ fontSize: '14px', fontWeight: 'bold', color: 'gray', width: '10%' }}>Part Model No</div>
					</div>
					<Divider style={{ margin: '0.5em 0' }}/>

					{
						tableData.map((rowData, index) => {
							return(
								<EditableRow
									key={index}
									rowId={index}
									rowData={rowData}
									setSection={setSection}
									setCategory={setCategory}
									setSourceType={setSourceType}
									setQty={setQty}
									setUnitPrice={setUnitPrice}
									setModelNo={setModelNo}
									mmvList={props.mmvList}
									setMMVYearRange={setMMVYearRange}
									partNameList={sourceTypeOptions}
									setPartName={setPartName}
									sourceTypeOptions={sourceTypeOptions}
									isDisabled={props.wareHouse === ''}
									totalNoOfRows={tableData.length}
									deleteRow={handleDelete}
									sparePartList={ props.sparePartList }
									allPartsWithSection={props.allPartsWithSection}
									categoryList={props.categoryList}
									setMMVSearchInput={setMMVSearchInput}
								/>
							)
						})
					}

					<Link className="btn btn-success rounded no-margin" to="/liveInventoryUnit">Back</Link>
					<Button
						color={ isTableFilled(tableData) ? 'success' : 'secondary' }
						type="button"
						className="rounded no-margin"
						style={{ float: 'right' }}
						onClick = { isTableFilled(tableData) ? () => props.goToNextPage(tableData) : handleDummyClick }
					>
						Continue
					</Button>
				</CardBody>
			</Card>
		</>
	)
}

export default FormPageOne;
