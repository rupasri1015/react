import React, { useState } from 'react';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import {
	getSectionCategoryDropdown,
	getPartNameFromSection,
	getPartFromCategory
} from './utils';

const EditableRow = (props) => {
	const [categoryDropDown, setCategoryDropDown] = useState(props.categoryList);
	const [partNameDropdown, setPartNameDropdown] = useState(props.allPartsWithSection);
	const sectionDropDown = getSectionCategoryDropdown(props.sparePartList);

	const handleSection = (section, rowId) => {
		setCategoryDropDown(() => getSectionCategoryDropdown(section.data));
		setPartNameDropdown(() => getPartNameFromSection(section.data));
		props.setSection(section, rowId);
	}

	const handleCategory = (category, rowId) => {
		if(category.data){
			setPartNameDropdown(() => getPartFromCategory(category.data))
		}
		else{
			setPartNameDropdown(category.parts)
		}
		  
		props.setCategory(category, rowId);
	}

	const handlePartName = (partName, rowId) => {
		props.setPartName(partName, rowId);
	}

	return(
		<div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2em' }}>
			{
				props.totalNoOfRows === 1
				? null
				: <DeleteIcon
						color={props.isDisabled ? 'gray' : 'secondary'}
						style={{ marginTop: '0.25em', cursor: 'pointer' }}
						onClick={() => props.deleteRow(props.rowId)}
					/> 
			}
			
			<div style={{ width: '9%', marginRight: '0.5%' }}>
				<Select
					options={sectionDropDown}
					placeholder="Section*"
					onChange={(section) => handleSection(section, props.rowId)}
					value={props.rowData.section}
					className="basic-multi-select"
					classNamePrefix="select"
					isDisabled={props.isDisabled}
				/>
			</div>
			<div style={{ width: '11%', marginRight: '0.5%' }}>
				<Select
					options={
						props.rowData.section === '' && props.rowData.partName === ''
						? props.categoryList
						: categoryDropDown
					}
					placeholder="Category*"
					onChange={(category) => handleCategory(category, props.rowId)}
					value={props.rowData.category}
					className="basic-multi-select"
					classNamePrefix="select"
					isDisabled={props.isDisabled}
					/>
			</div>
			<div style={{ width: '12%', marginRight: '0.5%' }}>
				<Select
					options={
						props.rowData.section === '' && props.rowData.category === ''
						? props.allPartsWithSection
						: partNameDropdown
					}
					placeholder="Part Name*"
					onChange={(part) => handlePartName(part, props.rowId)}
					value={props.rowData.partName}
					className="basic-multi-select"
					classNamePrefix="select"
					isDisabled={props.isDisabled}
					/>
			</div>
			<div style={{ width: '27%', marginRight: '0.5%' }}>
				<Select
					isMulti
					multi={true}
					options={props.mmvList}
					className="basic-multi-select"
					classNamePrefix="select"
					placeholder="Applicable MMVs*"
					onChange={(mmv) => props.setMMVYearRange(mmv, props.rowId)}
					value={props.rowData.mmvYearRange}
					isDisabled={props.isDisabled}
					closeMenuOnSelect={false}
					inputValue={props.rowData.mmvSearchInput}
					onInputChange={(searchInput) => props.setMMVSearchInput(searchInput, props.rowId)}
					/>
			</div>
			<div style={{ width: '11%', marginRight: '1%' }}>
				<Select
					options={props.sourceTypeOptions}
					className="basic-multi-select"
					classNamePrefix="select"
					placeholder="Source Type"
					onChange={(type) => props.setSourceType(type, props.rowId)}
					value={props.rowData.sourceType}
					isDisabled={props.isDisabled}
					/>
			</div>
			<div style={{ width: '7%', marginRight: '1%' }}>
				<TextField
					value={props.rowData.qty}
					margin="dense"
					placeholder='Quantity*'
					onChange={(event) => props.setQty(event.target.value, props.rowId)}
					disabled={props.isDisabled}
				/>
			</div>
			<div style={{ width: '8%', marginRight: '1%' }}>
			<TextField
					value={props.rowData.unitPrice}
					margin="dense"
					placeholder='Unit Price*'
					onChange={(event) => props.setUnitPrice(event.target.value, props.rowId)}
					disabled={props.isDisabled}
					/>
			</div>
			<div style={{ width: '10%' }}>
			<TextField
					value={props.rowData.modelNo}
					margin="dense"
					placeholder='Part Model No.'
					onChange={(event) => props.setModelNo(event.target.value, props.rowId)}
					disabled={props.isDisabled}
					/>
			</div>
			
		</div>
	)
}

export default EditableRow;

