import React, { useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { Button, Card, CardBody } from 'reactstrap';
import SearchField from '../../../shared/components/form/Search';
import getSPMData from '../../../redux/actions/sparePartsMasterAction';

const dropdownOptions = [
	{label: 'Spare Part Name', value:  'sparePartName'},
	{label: 'Section', value:  'section'},
	{label: 'Category', value:  'category'},
	{label: 'Spare Part ID', value:  'id'},
	{label: 'HSN', value:  'hsn'}
]

const SPMFilter = () => {
	const dispatch = useDispatch()
	const [filter, changeFilter] = useState('');
	const [searchText, setSearchText] = useState('');
	const [legthError, setLengthError] = useState(false);

	const clearFilters = () => {
		setLengthError(false);
		changeFilter('');
		setSearchText('');
		dispatch(getSPMData({ pageNum:1, filter: '', searchText: '' }))
	}

	const submitSPMSearch = () => {
		if(searchText.length >= 3){
			dispatch(getSPMData({ pageNum:1, filter: filter.value, searchText }));
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
						placeholder="Search by Name/ Part ID/ HSN"
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
					? <div style={{ color: '#c00' }}>
							Please enter three or more characters for search
						</div>
					: null
				}
			</CardBody>
		</Card>
	)
}

export default SPMFilter;
