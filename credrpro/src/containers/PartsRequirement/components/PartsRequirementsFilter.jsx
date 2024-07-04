import React, { useState } from 'react'
import { Button, Card, CardBody } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select'
import DatePicker from '../../../shared/components/form/DatePicker'
import SearchField from '../../../shared/components/form/Search'
import getPartsRequirementData from '../../../redux/actions/partsRequirementAction'
import { unselectAll } from '../../../redux/actions/partRequirementTableAction'

const filterDropdownOptions = [
	{label: 'Type', value: 'type'},
	{label: 'Request Reason', value: 'requestReason'},
	{label: 'Section', value: 'section'},
	{label: 'Category', value: 'category'},
	{label: 'Part Name', value: 'sparePartName'},
	{label: 'MMV Year', value: 'mmv'},
]

const PartsRequirementFilter = () => {
  const dispatch = useDispatch()
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('');
  const [lenError, setLenError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const warehouseId = useSelector(state => state.partsRequirement.warehouseId);
  const warehouseName = useSelector(state => state.partsRequirement.warehouseName);
  const status = useSelector(state => state.partsRequirement.status);
  
  const applyFilter = () => {
    const payload = {
      fromDate,
      toDate,
      searchText,
      filter: filter.value,
      pageNumber: 1,
      warehouseName,
      warehouseId,
      status
    }
    if(fromDate * !toDate + !fromDate * toDate) {
      setDateError(true);
      setLenError(false);
    }
    else if(fromDate && toDate && (searchText.length === 1 || searchText.length === 2)) {
      setLenError(true);
      setDateError(false);
    }else if (fromDate && toDate && searchText.length === 0) {
      setLenError(false);
      setDateError(false)
      dispatch(unselectAll({pageNumber: 0}));
      dispatch(getPartsRequirementData(payload));
    } 
    else if(searchText.length < 3) {
      setLenError(true);
      setDateError(false);
    } 
    else {
      setLenError(false);
      setDateError(false);
      dispatch(unselectAll({pageNumber: 0}));
      dispatch(getPartsRequirementData(payload));
    }
  }

  const clearFilters = () => {
    setLenError(false);
    setDateError(false);
    setSearchText('');
    setFromDate('');
    setToDate('');
    setFilter('');
    dispatch(unselectAll({pageNumber: 0}));
    const payload = {
      fromDate: '',
      toDate: '',
      searchText: '',
      pageNumber: 1,
      warehouseName,
      warehouseId,
      status
    }
		dispatch(getPartsRequirementData(payload))
  }

  return (
    <>
      <div className='pending-inventory-filter-container mt-3'>
        <div className="filter-title">Filters</div>
      </div>
      <Card className="pending-inventory-header">
        <CardBody className="card-shadow square-border">
          <div className='pending-inventory-filter-container mt-3'>
            <div className="from-date" style={{ width: '300px' }}>
              <p>From</p>
              <DatePicker
                onDateChange={setFromDate}
                max={toDate}
                startDate={fromDate}
                placeholder= 'Select Request Date'
              />
            </div>
            <div className="from-date">
              <p>To</p>
              <DatePicker
                onDateChange={setToDate}
                min={fromDate}
                startDate={toDate}
                placeholder= 'Select Request Date'
              />
            </div>
            <div style={{ width: '225px', marginLeft: '10px'}}>
              <Select
                options={filterDropdownOptions}
                classNamePrefix="city-dropdown"
                placeholder="Select Filter"
                onChange={(filter) => { setFilter(filter)}}
                value={filter}
              />
            </div>
            <SearchField
              value={searchText}
              onSearch={setSearchText}
              placeholder="Search By Keywords"
              className="number-search with-margin"
            />
            <Button
              color="success"
              type="button"
              className="rounded no-margin"
              onClick={applyFilter}
              style={{ float: 'right', marginLeft: '10px'  }}
            >
              Apply
            </Button>
            <Button
                className="rounded no-margin"
                type="button"
                onClick={clearFilters}
                style={{ float: 'right'}}
              >
                Clear
            </Button>
            {
              lenError
              ? <div style={{ float: 'right', color: '#c00' }}>
                  * Please Enter atleast THREE characters to search
                </div>
              : null
            }
            {
              dateError
              ? <div style={{ float: 'right', color: '#c00' }}>
                  * Please enter both the date fields to apply filter
                </div>
              : null
            }
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default PartsRequirementFilter