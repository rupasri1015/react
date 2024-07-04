import React, { useState, useEffect } from 'react'
import DatePicker from '../../../../shared/components/form/DatePicker'
import CityDropDown from '../../../../shared/components/form/CityDropDown'
import DropDown from '../../../../shared/components/form/DropDown'
import { Button } from 'reactstrap'
import { setNotification } from '../../../../redux/actions/notificationAction'
import { useDispatch, useSelector } from 'react-redux'
import { getDatePayload } from '../../../../core/utility'
import { PERMISSIONS, getRole, getUserID } from '../../../../core/services/rbacServices'
import { getDocQcCities } from '../../../../core/services/miscServices'

const conversionCategoryOption = [
  {
    value: 'SELL',
    label: 'Sell'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange'
  }
]

const dateTypeOption = [
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  },
  {
    value: 'DOC_ASSIGNED',
    label: 'QC Approved Date'
  }
]

const RunnerFilter = ({
  onApplyFilters,
  onClearFilters,
  onDateTypeChange,
  onToDateChange,
  onFromDateChange,
  onCityChange,
  onConversionChange,
  onOutletChange,
  outlet,
  outlets,
  toDate,
  fromDate,
  conversionCategory,
  dateType,
  city
}) => {

  const dispatch = useDispatch()
  const [cityList, setCityList] = useState([])

  useEffect(() => {
    let getCityList = []
		getDocQcCities(getUserID())
      .then(apiResponse => {
        if (apiResponse.isValid && apiResponse.cityList && apiResponse.cityList.length) {
          getCityList = apiResponse.cityList.map(city => {
            return {
              value: city.cityId,
              label: city.cityName
            }
          })
          setCityList(getCityList)
        }
      })
	}, [])

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
      payload.cityList = [city.value]
    }
    if (conversionCategory) {
      payload.conversionCategory = [conversionCategory.value]
    }
    if (outlet) {
      payload.outlet = [outlet.value]
    }
    if (Object.keys(payload).length && isValid) {
      onApplyFilters(payload)
    }
  }
  return (
    <div className='assign-runner-filter-container mt-3'>
      <div className="filter-title">Filters</div>
      {
        getRole() === 'LOGISTICS_COORDINATOR' &&
          <DropDown
            placeholder="Select City"
            onChange={onCityChange}
            options={cityList}
            value={city}
            className="dropdown-wraper"
          />
      }
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
      {/* {
        PERMISSIONS.LOGISTCS_STATE_HEAD.includes(getRole()) &&
        <DropDown
          placeholder="Select City"
          options={cities}
          onChange={onCityChange}
          value={city}
          className="dropdown-wraper"
        />
      } */}
      <DropDown
        placeholder="Select Outlet"
        options={outlets}
        onChange={onOutletChange}
        value={outlet}
        className="dropdown-wraper"
      />
      <DropDown
        placeholder="Select Conversion Category"
        options={conversionCategoryOption}
        onChange={onConversionChange}
        value={conversionCategory}
        className="dropdown-wraper-conversion"
      />
      <Button color="success" type="button" className="rounded no-margin" onClick={applyFilter}>Apply</Button>
      <Button className="rounded no-margin" type="button" onClick={onClearFilters}>Clear</Button>
    </div>
  )
}

export default RunnerFilter