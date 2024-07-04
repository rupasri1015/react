import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Button, Card, CardBody } from 'reactstrap'
import SearchField from '../../../shared/components/form/Search'
import getLiveInventoryUnitData from '../../../redux/actions/liveInventoryUnitAction'
import Select from 'react-select'

const dropdownOptions = [
	{label: 'Part Name', value: 'sparePartName'},
	{label: 'Section', value: 'section'},
	{label: 'Category', value: 'category'},
	{label: 'Model Number', value: 'modelNumber'},
	{label: 'Vendor Name', value: 'vendorName'}
]

const LIUnitFilter = (props) => {
	const dispatch = useDispatch()
	const [filter, changeFilter] = useState('');
	const [searchText, setSearchText] = useState('');
	const [legthError, setLengthError] = useState(false);

	const clearFilters = () => {
		setLengthError(false);
		changeFilter('');
		setSearchText('');
		dispatch(getLiveInventoryUnitData({
			pageNum:1,
			filter: '',
			searchText: '',
			warehouseNum: props.warehouseNum
		}))
	}

	const submitSPMSearch = () => {
		if(searchText.length >= 3){
			dispatch(getLiveInventoryUnitData({
				pageNum:1,
				filter: filter.value,
				searchText,
				warehouseNum: props.warehouseNum
			}));
			setLengthError(false);
		}
		else {
			setLengthError(true);
		}
	}

	return (
		<Card className="pending-inventory-header">
			<CardBody className="card-shadow square-border">
				<div className='pending-inventory-filter-container'>
					<div className="filter-title">Filters</div>
					<div style={{ width: '220px' }}>
						<Select
							options={dropdownOptions}
							classNamePrefix="city-dropdown"
							placeholder="Select Filter"
							onChange={changeFilter}
							value={filter}
						/>
					</div>
					<SearchField
						className="number-search with-margin"
						placeholder="Search by Name / Section / Category / Model No / Vendor Name"
						value={searchText}
						onSearch={setSearchText}
					/>
					<Button
						color="success"
						type="button"
						className="rounded no-margin"
						onClick = { submitSPMSearch }
					>
						Apply
					</Button>
					<Button
						className="rounded no-margin"
						type="button"
						onClick={ clearFilters }
					>
						Clear
					</Button>
				</div>
				{
					legthError
					? <div style={{ color: '#c00' }}>Please enter three or more characters for search</div>
					: null
				}
			</CardBody>
		</Card>
	)
}

export default LIUnitFilter;
