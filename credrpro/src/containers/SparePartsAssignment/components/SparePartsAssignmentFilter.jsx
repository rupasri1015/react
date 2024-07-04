import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select'
import DatePicker from '../../../shared/components/form/DatePicker'
import SearchField from '../../../shared/components/form/Search'
import { getAllWarehousesAndRepairCenters } from '../../../core/services/sparePartsAssignmentServices'
import { getSparePartsAssignmentData, setWareHouseId, setServiceCenterName } from '../../../redux/actions/sparePartsAssignmentAction'
import { getWarehouseName, getWarehouseID } from '../../../core/services/rbacServices';

const SparePartsAssignmentFilter = () => {
  const dispatch = useDispatch()
  const [warehouseDropdownOption, setWarehouseDropdownOption] = useState([]);
  const [repairCenterDropdownOption, setRepairCenterDropdownOption] = useState([]);
  const [fullRepairCenterDropdownOption, setFullRepairCenterDropdownOption] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedRepairCenter, setSelectedRepairCenter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [lenError, setLenError] = useState(false);
	const status = useSelector(state => state.sparePartsAssignment.status);

  useEffect(() => {
		getAllWarehousesAndRepairCenters()
		.then(apiResponse => {
      const { warehouses, serviceCenters } = apiResponse.data;
			if (apiResponse.isValid) {
        setWarehouseDropdownOption(warehouses);
        setRepairCenterDropdownOption(serviceCenters);
        setFullRepairCenterDropdownOption(serviceCenters);
      }
		})
  }, [])

  const applyFilter = () => {
    const payload = {
      fromDate,
      toDate,
      searchText,
      status,
      pageNumber: 1,
      serviceCenterName: selectedRepairCenter.label,
      warehouseId: getWarehouseName() === 'All' ? (selectedWarehouse.value || 0) : getWarehouseID(),
    }
    if(searchText.length === 1 || searchText.length === 2) {
      setLenError(true);
    } else {
      setLenError(false);
      dispatch(getSparePartsAssignmentData(payload));
    }
  }

  const clearFilters = () => {
    setSelectedWarehouse('');
    setSelectedRepairCenter('');
    setRepairCenterDropdownOption(fullRepairCenterDropdownOption);
    setSearchText('');
    setFromDate('');
    setToDate('');
    const payload = {
      fromDate: '',
      toDate: '',
      searchText: '',
      status,
      pageNumber: 1,
      serviceCenterName: '',
      warehouseId: getWarehouseID(),
    }
		dispatch(getSparePartsAssignmentData(payload))
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
                options={warehouseDropdownOption}
                classNamePrefix="city-dropdown"
                placeholder="Select Warehouse"
                onChange={(warehouse) => {
                  setSelectedWarehouse(warehouse);
                  dispatch(setWareHouseId({ warehouseId: warehouse.value }));
                  setSelectedRepairCenter('');
                  setRepairCenterDropdownOption(warehouse.serviceCenters)
                }}
                value={selectedWarehouse}
              />
            </div>
            <div style={{ width: '225px', marginLeft: '10px'}}>
              <Select
                options={repairCenterDropdownOption}
                classNamePrefix="city-dropdown"
                placeholder="Select Service Center"
                onChange={(repairCenter) => {
                  setSelectedRepairCenter(repairCenter);
                  dispatch(setServiceCenterName({ serviceCenterName: repairCenter.label }));
                  if(repairCenter.warehouse) {
                    setSelectedWarehouse(repairCenter.warehouse);
                    dispatch(setWareHouseId({ warehouseId: repairCenter.warehouse.value }));
                  }
                }}
                value={selectedRepairCenter}
              />
            </div>
            <SearchField
              value={searchText}
              onSearch={setSearchText}
              placeholder="Search By Keywords"
              className="number-search with-margin"
            />
            {
              lenError
              ? <div style={{ float: 'right', color: '#c00' }}>
                  Please Enter atleast THREE characters to search
                </div>
              : null
            }
          </div>

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
        </CardBody>
      </Card>
    </>
  )
}

export default SparePartsAssignmentFilter
