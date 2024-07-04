import React from 'react'
import DatePicker from '../../../../shared/components/form/DatePicker'
import CityDropDown from '../../../../shared/components/form/CityDropDown'
import DropDown from '../../../../shared/components/form/DropDown'
import { Button } from 'reactstrap'
import { setNotification } from '../../../../redux/actions/notificationAction'
import { useDispatch } from 'react-redux'
import { getDatePayload } from '../../../../core/utility'
import { PERMISSIONS, getRole } from '../../../../core/services/rbacServices'

const dateTypeOption = [
  {
    value: 'REQUISITIONDATE',
    label: 'Requisition Date'
  },
  {
    value: 'DEADLINEDATE',
    label: 'Deadline Date'
  }
]

const FranchiseRunnerFilter = ({
  onApplyFilters,
  onClearFilters,
  onDateTypeChange,
  onToDateChange,
  onFromDateChange,
  onCityChange,
  onShowroomChange,
  showroom,
  showrooms,
  toDate,
  fromDate,
  dateType,
  city,
  onCoordinatorChange,
  coordinators,
  coordinator
}) => {

  const dispatch = useDispatch()

  const applyFilter = () => {
    const payload = {}
    let isValid = true
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
    if (city) {
      payload.cityId = city.value
    }
    if (showroom) {
      payload.storeId = showroom.value
    }
    if (coordinator) {
      payload.coordinator = [coordinator.value]
    }
    if (Object.keys(payload).length && isValid) {
      onApplyFilters(payload)
    }
  }
  return (
    <div className='assign-runner-filter-container mt-3'>
      <div className="filter-title">Filters</div>
      <DropDown
        placeholder="Select Date Type"
        options={dateTypeOption}
        onChange={onDateTypeChange}
        value={dateType}
        className="dropdown-wraper"
      />
      {
        Boolean(dateType) &&
        <>
          <div className="from-date">
            <p>From</p>
            <DatePicker
              onDateChange={onFromDateChange}
              max={toDate}
              startDate={fromDate}
            />
          </div>
          <div className="from-date">
            <p>To</p>
            <DatePicker
              onDateChange={onToDateChange}
              min={fromDate}
              startDate={toDate}
            />
          </div>
        </>
      }
      {
        PERMISSIONS.LOGISTICS_CITY_FILTER.includes(getRole()) &&
        <CityDropDown
          onCityChange={onCityChange}
          value={city}
          className="dropdown-wraper"
        />
      }
      <DropDown
        placeholder="Select Showroom"
        options={showrooms}
        onChange={onShowroomChange}
        value={showroom}
        className="dropdown-wraper"
      />
       <DropDown
        placeholder="Select Coordinator"
        options={coordinators}
        onChange={onCoordinatorChange}
        value={coordinator}
        className="dropdown-wraper"
      />
      <Button color="success" type="button" className="rounded no-margin" onClick={applyFilter}>Apply</Button>
      <Button className="rounded no-margin" type="button" onClick={onClearFilters}>Clear</Button>
    </div>
  )
}

export default FranchiseRunnerFilter