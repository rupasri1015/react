import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody } from 'reactstrap'
import SearchField from '../../../shared/components/form/Search'
import getVendorManagementData from '../../../redux/actions/vendorManagementAction'
import Select from 'react-select'

const dropdownOptions = [
	{label: 'Vendor Name', value: 'vendorName'},
	{label: 'Phone Number', value: 'phoneNumber'},
	{label: 'PIN Code', value: 'pincode'},
	{label: 'Payment Method', value: 'paymentMethod'},
	{label: 'Payment TAT', value: 'paymentTAT'}
]

const VendorManagementFilter = () => {
	const dispatch = useDispatch()
	const [filter, changeFilter] = useState('');
	const [searchText, setSearchText] = useState('');
	const [legthError, setLengthError] = useState(false);
	const warehouseId = useSelector(state => state.vendorManagement.warehouseId);

	const clearFilters = () => {
		setLengthError(false);
		changeFilter('');
		setSearchText('');
		dispatch(getVendorManagementData({ pageNumber:1, filter: '', searchText: '', warehouseId }))
	}

	const submitVendorSearch = () => {
		if(searchText.length >= 3){
			dispatch(getVendorManagementData({ pageNumber:1, filter: filter.value, searchText, warehouseId }));
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
						placeholder="Search"
						value={searchText}
						onSearch={setSearchText}
					/>
					<Button
						color="success"
						type="button"
						className="rounded no-margin"
						onClick = { submitVendorSearch }
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

export default VendorManagementFilter;
