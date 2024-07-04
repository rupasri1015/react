import React, { useState } from 'react'
import { Button, Card, CardBody } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select'
import DatePicker from '../../../shared/components/form/DatePicker'
import SearchField from '../../../shared/components/form/Search'
import getPartsOrderHistoryData from '../../../redux/actions/partsOrderHistoryAction'

const filterDropdownOptions = [
	{label: 'Order Id', value: 'orderId'},
	{label: 'Vendor Name', value: 'vendorName'},
	{label: 'Assigned To', value: 'runnerName'},
]

const PartsOrderHistoryFilter = () => {
  const dispatch = useDispatch()
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('');
  const [lenError, setLenError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const runnerId = useSelector(state => state.partsOrderHistory.runnerId);
  const warehouseId = useSelector(state => state.partsOrderHistory.warehouseId);
  const warehouseName = useSelector(state => state.partsOrderHistory.warehouseName);
  const status = useSelector(state => state.partsOrderHistory.status);
  
  const applyFilter = () => {
    const payload = {
      fromDate,
      toDate,
      searchText,
      filter: filter.value,
      pageNumber: 1,
      warehouseName,
      warehouseId,
      runnerId,
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
      dispatch(getPartsOrderHistoryData(payload));
    } 
    else if(searchText.length < 3) {
      setLenError(true);
      setDateError(false);
    } 
    else {
      setLenError(false);
      setDateError(false);
      dispatch(getPartsOrderHistoryData(payload));
    }
  }

  const clearFilters = () => {
    setLenError(false);
    setDateError(false);
    setSearchText('');
    setFromDate('');
    setToDate('');
    setFilter('');
    const payload = {
      fromDate: '',
      toDate: '',
      searchText: '',
      pageNumber: 1,
      warehouseName,
      warehouseId,
      runnerId,
      status
    }
		dispatch(getPartsOrderHistoryData(payload))
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

export default PartsOrderHistoryFilter