import React from 'react'
import { Button } from 'reactstrap'
import { useDispatch } from 'react-redux'
import DatePicker from '../../../../shared/components/form/DatePicker'
import DropDown from '../../../../shared/components/form/DropDown'
import CityDropDown from '../../../../shared/components/form/CityDropDown'
import { getDatePayload } from '../../../../core/utility'
import { setNotification } from '../../../../redux/actions/notificationAction'
import { PERMISSIONS, getRole } from '../../../../core/services/rbacServices'

const allDateTypes = [
  {
    value: 'ASSIGNDATE',
    label: 'Assigned Date'
  },
  {
    value: 'SCHEDULEDATE',
    label: 'Scheduled Date'
  },
  {
    value: 'PICKEDUPDATE',
    label: 'Pickup Date'
  },
  {
    value: 'DELIVEREDDATE',
    label: 'Delivered Date'
  }
]

const assignedDateTypes = [
  {
    value: 'ASSIGNDATE',
    label: 'Assigned Date'
  },
  {
    value: 'QCDATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const pendingPickupDateTypes = [
  {
    value: 'SCHEDULEDATE',
    label: 'Scheduled Pickup Date'
  },
  {
    value: 'ASSIGNDATE',
    label: 'Assigned Date'
  },
  {
    value: 'QCDATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const pickupDisputeDateTypes = [
  {
    value: 'PICKEDUPDATE',
    label: 'Pickup Date'
  },
  {
    value: 'ASSIGNDATE',
    label: 'Assigned Date'
  },
  {
    value: 'QCDATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const intransitDateTypes = [
  {
    value: 'PICKEDUPDATE',
    label: 'Pickup Date'
  },
  {
    value: 'ASSIGNDATE',
    label: 'Assigned Date'
  },
  {
    value: 'QCDATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const deliveredDateTypes = [
  {
    value: 'DELIVEREDDATE',
    label: 'Delivered Date'
  },
  {
    value: 'PICKEDUPDATE',
    label: 'Pickup Date'
  },
  {
    value: 'ASSIGNDATE',
    label: 'Assigned Date'
  },
  {
    value: 'QCDATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const pendingConfirmationDateTypes = [
  {
    value: 'DELIVEREDDATE',
    label: 'Delivered Date'
  },
  {
    value: 'PICKEDUPDATE',
    label: 'Pickup Date'
  },
  {
    value: 'ASSIGNDATE',
    label: 'Assigned Date'
  },
  {
    value: 'QCDATE',
    label: 'Qc Date'
  },
  {
    value: 'EXCHANGE',
    label: 'Exchange Date'
  }
]

const deliveryDisputeDateTypes = [
  {
    value: 'DISPUTEDATE',
    label: 'Dispute Date'
  },
  {
    value: 'ASSIGNDATE',
    label: 'Assigned Date'
  },
  {
    value: 'QCDATE',
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
  onShowroomChange,
  onRunnerChange,
  showrooms,
  showroom,
  runner,
  runners,
  toDate,
  fromDate,
  dateType,
  city,
  status
}) => {

  const dispatch = useDispatch()

  const getDateType = () => {
    switch (status.toLowerCase()) {
      case 'all': return allDateTypes
      case 'assigned': return assignedDateTypes
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
      payload.cityId = city.value
    }
    if (showroom) {
      payload.storeId = showroom.value
    }
    if (runner) {
      payload.runner = runner.value
    }
    if (Object.keys(payload).length && isValid) {
      onApplyFilters(payload)
    }
  }

  return (
    <div className='assign-runner-filter-container mb-3'>
      <div className="filter-title">Filters</div>
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
        placeholder="Select Showroom"
        options={showrooms}
        onChange={onShowroomChange}
        value={showroom}
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