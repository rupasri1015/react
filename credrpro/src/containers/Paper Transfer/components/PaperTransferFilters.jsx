import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import { useDispatch } from 'react-redux'
import DatePicker from '../../../shared/components/form/DatePicker'
import { getDatePayload } from '../../../core/utility'
import { setNotification } from '../../../redux/actions/notificationAction'
import CityDropDown from '../../../shared/components/form/CityDropDown'
import DropDown from '../../../shared/components/form/DropDown'
import { listStoresFhdShd, getDocQcCities } from '../../../core/services/miscServices'
import { getRole, getUserID } from '../../../core/services/rbacServices'


const PaperTransferFilters = ({
  onApplyFilter,
  onClearFilters,
  status,
  isResetRequired
}) => {

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [city, setCity] = useState(null)
  const [dateType, setDateType] = useState(null)
  const [outlet, setOutlet] = useState(null)
  const [storeList, setStoreList] = useState([])
  const [cityList, setCityList] = useState([])
  const dispatch = useDispatch()

  const clearFilters = () => {
    setFromDate(null)
    setToDate(null)
    setOutlet(null)
    setCity(null)
    setDateType(null)
     onClearFilters()
  }

  const applyFilter = () => {
    const payload = {}
    let isValid = true
    if (city) {
      payload.cityId = city.value
    }
    if (outlet) {
      payload.storeId = outlet.value
    }
    // if (dateType) {
    //   payload.dateType = dateType.value
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
    //}
    if (Object.keys(payload).length && isValid) {
      onApplyFilter(payload)
    }
  }

  const onCityChange = cityData => {
    if (cityData) {
      listStoresFhdShd({
        storeTypeId: 3,
        cityId: cityData.value
      }).then(apiResponse => {
        if (apiResponse.isValid) {
          const stores = apiResponse.storeListByCityId.map(store => ({
            value: store.storeId,
            label: store.storeName
          }))
          setStoreList(stores)
        } else {
          setStoreList([])
        }
      })
    }
    setCity(cityData)
  }

  const onOutletChange = outletData => {
    setOutlet(outletData)
  }

  const onDateTypeChange = dateTypeData => {
    setDateType(dateTypeData)
  }

  return (
    <div className='document-qc-filter-container mb-3 mt-3'>
      <div className="filter-title">Filters</div>
      <CityDropDown
        onCityChange={onCityChange}
        value={city}
        className="dropdown-wraper"
      />

      <DropDown
        placeholder="Select Outlet"
        onChange={onOutletChange}
        options={storeList}
        value={outlet}
        className="dropdown-wraper"
      />
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
      <Button color="success" type="button" className="rounded no-margin" onClick={applyFilter}>Apply</Button>
      <Button className="rounded no-margin" type="button" onClick={clearFilters}>Clear</Button>
    </div>
  )
}

export default PaperTransferFilters