import React, { useState } from 'react'
import { Button, Card, CardBody } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select'
import SearchField from '../../../shared/components/form/Search'
import getRequisitionAggregateData from '../../../redux/actions/requisitionAggregateAction'

const filterDropdownOptions = [
	{label: 'Part Request Id', value: 'requestIds'},
	{label: 'Section', value: 'section'},
	{label: 'Category', value: 'category'},
	{label: 'Part Name', value: 'sparePartName'},
	{label: 'MMV Year', value: 'mmv'},
]

const RequisitionAggregateFilter = () => {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('');
  const [lenError, setLenError] = useState(false);
  const warehouseId = useSelector(state => state.requisitionAggregate.warehouseId);
  
  const applyFilter = () => {
    const payload = {
      searchText,
      filter: filter.value,
      pageNumber: 1,
      warehouseId,
    }

    if(searchText.length < 3) {
      setLenError(true);
    }
    else {
      dispatch(getRequisitionAggregateData(payload));
    }
  }

  const clearFilters = () => {
    setLenError(false);
    setSearchText('');
    setFilter('');
    const payload = {
      searchText: '',
      pageNumber: 1,
      warehouseId,
    }
		dispatch(getRequisitionAggregateData(payload))
  }

  return (
      <Card className="pending-inventory-header">
        <CardBody className="card-shadow square-border">
          <div className='pending-inventory-filter-container mt-3'>
            <div className="filter-title">Filters</div>
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
          </div>
          {
            lenError
            ? <div style={{ color: '#c00' }}>
                * Please Enter atleast THREE characters to search
              </div>
            : null
          }
        </CardBody>
      </Card>
  )
}

export default RequisitionAggregateFilter;