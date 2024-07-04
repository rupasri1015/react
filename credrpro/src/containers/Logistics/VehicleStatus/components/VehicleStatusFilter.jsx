import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from '../../../../shared/components/form/DatePicker'
import DropDown from '../../../../shared/components/form/DropDown'
import CityDropDown from '../../../../shared/components/form/CityDropDown'
import { getDatePayload } from '../../../../core/utility'
import { setNotification } from '../../../../redux/actions/notificationAction'
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

const allDateTypes = [
  {
    value: 'ASSIGN_DATE',
    label: 'Assigned Date'
  },
  {
    value: 'SCHEDULE_DATE',
    label: 'Scheduled Date'
  },
  {
    value: 'PICKEDUP_DATE',
    label: 'Pickup Date'
  },
  {
    value: 'DELIVERED_DATE',
    label: 'Delivered Date'
  }
]

const assignedDateTypes = [
  {
    value: 'ASSIGN_DATE',
    label: 'Assigned Date'
  },
  {
    value: 'QC_DATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const unAssignedDateTypes = [
  {
    value: 'QCAPPROVED_DATE',
    label: 'QC Approved Date'
  },
  {
    value: 'ASSIGNMENT_DEADLINE_DATE',
    label: 'Assignment Deadline Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const pendingPickupDateTypes = [
  {
    value: 'SCHEDULE_DATE',
    label: 'Scheduled Pickup Date'
  },
  {
    value: 'ASSIGN_DATE',
    label: 'Assigned Date'
  },
  {
    value: 'QC_DATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const pickupDisputeDateTypes = [
  {
    value: 'PICKEDUP_DATE',
    label: 'Pickup Date'
  },
  {
    value: 'ASSIGN_DATE',
    label: 'Assigned Date'
  },
  {
    value: 'QC_DATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const intransitDateTypes = [
  {
    value: 'PICKEDUP_DATE',
    label: 'Pickup Date'
  },
  {
    value: 'ASSIGN_DATE',
    label: 'Assigned Date'
  },
  {
    value: 'QC_DATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const deliveredDateTypes = [
  {
    value: 'DELIVERED_DATE',
    label: 'Delivered Date'
  },
  {
    value: 'PICKEDUP_DATE',
    label: 'Pickup Date'
  },
  {
    value: 'ASSIGN_DATE',
    label: 'Assigned Date'
  },
  {
    value: 'QC_DATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const pendingConfirmationDateTypes = [
  {
    value: 'DELIVERED_DATE',
    label: 'Delivered Date'
  },
  {
    value: 'PICKEDUP_DATE',
    label: 'Pickup Date'
  },
  {
    value: 'ASSIGN_DATE',
    label: 'Assigned Date'
  },
  {
    value: 'QC_DATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const deliveryDisputeDateTypes = [
  {
    value: 'DISPUTE_DATE',
    label: 'Dispute Date'
  },
  {
    value: 'ASSIGN_DATE',
    label: 'Assigned Date'
  },
  {
    value: 'QC_DATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]


const VehicleStatusFilter = ({
  onApplyFilters,
  onClearFilters,
  onDateTypeChange,
  onToDateChange,
  onFromDateChange,
  onCityChange,
  onConversionChange,
  onOutletChange,
  onRunnerChange,
  outlet,
  outlets,
  runner,
  runners,
  toDate,
  fromDate,
  conversionCategory,
  dateType,
  city,
  status
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


  const getDateType = () => {
    switch (status.toLowerCase()) {
      case 'all': return allDateTypes
      case 'assigned': return assignedDateTypes
      case 'pending_assignment': return unAssignedDateTypes
      case 'pending': return pendingPickupDateTypes
      case 'pickup_dispute': return pickupDisputeDateTypes
      case 'intransit': return intransitDateTypes
      case 'delivered': return deliveredDateTypes
      case 'pending_confirmation': return pendingConfirmationDateTypes
      case 'delivery_dispute': return deliveryDisputeDateTypes
      default: return []
    }
  }

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
      payload.city = [city.value]
    }
    if (conversionCategory) {
      payload.conversionCategory = [conversionCategory.value]
    }
    if (outlet) {
      payload.outlet = [outlet.value]
    }
    if (runner) {
      payload.runner = [runner.value]
    }
    if (Object.keys(payload).length && isValid) {
      onApplyFilters(payload)
    }
  }

  return (
    <div className='assign-runner-filter-container mb-3'>
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
        options={getDateType()}
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
        className="dropdown-wraper"
      />
      <DropDown
        placeholder="Select Runner"
        options={runners}
        onChange={onRunnerChange}
        value={runner}
        className="dropdown-wraper"
      />
      <Button color="success" type="button" className="rounded no-margin" onClick={applyFilter}>Apply</Button>
      <Button className="rounded no-margin" type="button" onClick={onClearFilters}>Clear</Button>
    </div>
  )
}

export default VehicleStatusFilter