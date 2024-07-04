import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from '../../../shared/components/form/DatePicker'
import { getDatePayload } from '../../../core/utility'
import { setNotification } from '../../../redux/actions/notificationAction'
import DropDown from '../../../shared/components/form/DropDown'
import MultiSelect from '../../../shared/components/form/MultiSelect'

const allDateTypes = [
  {
    value: 'EXCHANGEDATE',
    label: 'Exchange Date'
  },
  {
      value: 'WAREHOUSEINWARDDATE',
      label: 'Warehouse Inward Date'
  },
  {
      value: 'REFURBQCCOMPLETEDDATE',
      label: 'Refurb QC completed Date'
  }
]

const productionStatuses = [
  {
    name: 'Assignment Pending',
    value: 'Assignment Pending'
  },
  {
    name: 'Job Card Pending',
    value: 'Job Card Pending'
  },
  {
    name: 'Job Card In Progress',
    value: 'Job Card In Progress'
  },
  {
    name: 'Outer Pending',
    value: 'Outer Pending'
  },
  {
    name: 'Outer In Progress',
    value: 'Outer In Progress'
  },
  {
    name: 'Engine Pending',
    value: 'Engine Pending'
  },
  {
    name: 'Engine In Progress',
    value: 'Engine In Progress'
  },
  {
    name: 'Inner Pending',
    value: 'Inner Pending'
  },
  {
    name: 'Inner In Progress',
    value: 'Inner In Progress'
  },
  {
    name: 'Finishing Pending',
    value: 'Finishing Pending'
  },
  {
    name: 'Finishing In Progress',
    value: 'Finishing In Progress'
  },
  {
    name: 'Fault Keeper Pending',
    value: 'Fault Keeper Pending'
  },
  {
    name: 'Fault Keeper Dispute',
    value: 'Fault Keeper Dispute'
  },
  {
    name: 'Inspection Pending',
    value: 'Inspection Pending'
  }
]

const RefurbFilters = ({
  onApplyFilter,
  onClearFilters,
  isResetRequired,
}) => {

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [city, setCity] = useState([])
  const [dateType, setDateType] = useState(null)
  const [outlet, setOutlet] = useState(null)
  const [productionStatus, setProductionStatus] = useState([])
  const cities = useSelector(state => state.cities.cityList)
  const dispatch = useDispatch()

  const clearFilters = () => {
    setFromDate(null)
    setToDate(null)
    setOutlet(null)
    setCity([])
    setDateType(null)
    setProductionStatus([])
    onClearFilters()
  }

  useEffect(() => {
    if (isResetRequired) {
      clearFilters()
    }
  })

  const applyFilter = () => {
    const payload = {}
    let isValid = true
    if (city.length) {
      payload.cityId = city.map(cityData => cityData.cityId)
    }
    if (outlet) {
      payload.storeId = [outlet.value]
    }
    if(productionStatus.length){
      payload.productionStatus = productionStatus.map(status => status.value)
    }
    if (dateType) {
      payload.dateType = dateType.value
      if (fromDate && toDate) {
        payload.fromDate = getDatePayload(fromDate)
        payload.toDate = getDatePayload(toDate)
      } else if (fromDate || toDate) {
        isValid = false
        if (fromDate) {
          dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'))
        } else {
          dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'))
        }
      }
    }
    if (Object.keys(payload).length && isValid) {
      onApplyFilter(payload)
    }
  }

  const onDateTypeChange = dateTypeData => {
    setDateType(dateTypeData)
  }

  return (
    <div className='document-qc-filter-container mb-3'>
      <div className="filter-title">Filters</div>
      <MultiSelect
        className="dropdown-wraper mr"
        options={cities}
        multiple
        value={city}
        valueKey="cityId"
        labelKey="cityName"
        placeholder="Select Cities"
        manySelectedPlaceholder="%s Cities Selected"
        onChange={setCity}
      />
      <DropDown
        placeholder="Select Date Type"
        options={allDateTypes}
        onChange={onDateTypeChange}
        value={dateType}
        className="dropdown-wraper"
      />
       {
        dateType &&
        <>
          <div className="from-date">
            <p>From</p>
            <DatePicker
              onDateChange={setFromDate}
              max={toDate}
              startDate={fromDate}
            />
          </div>
          <div className="from-date">
            <p>To</p>
            <DatePicker
              onDateChange={setToDate}
              min={fromDate}
              startDate={toDate}
            />
          </div>
        </>
      }
      <MultiSelect
        className="dropdown-wraper mr"
        options={productionStatuses}
        multiple
        value={productionStatus}
        valueKey="value"
        labelKey="name"
        placeholder="Select Production Status"
        manySelectedPlaceholder="%s Selected"
        onChange={setProductionStatus}
        includeFilter={true}
        includeSelectAll={true}
      />
      <Button color="success" type="button" className="rounded no-margin" onClick={applyFilter}>Apply</Button>
      <Button className="rounded no-margin" type="button" onClick={clearFilters}>Clear</Button>
    </div>
  )
}

export default RefurbFilters