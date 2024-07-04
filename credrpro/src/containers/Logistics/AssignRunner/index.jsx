import React, { useState, useEffect, Fragment } from 'react'
import RunnerData from './components/RunnerDataTable'
import RunnerFilter from './components/RunnerFilter'
import UniversalSearch from './components/UniversalSearch'
import AssignRunnerDialog from './components/AssignRunnerDialog'
import { getRunnerData } from '../../../redux/actions/assignRunnerListAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { getRunners, assignRunnerToInventory, getStateCities } from '../../../core/services/logisticServices'
import { getRole, getCityID, getUserID } from '../../../core/services/rbacServices'
import { listStoresFhdShd } from '../../../core/services/miscServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import {logisticCityAction} from '../../../redux/actions/logisticCityAction'
import isEqual from 'lodash/isEqual'
import { useDispatch, useSelector } from 'react-redux'

const AssignRunner = () => {

  const dispatch = useDispatch()
  const page = useSelector(state => state.runner.pageNumber)
  const [filters, setFilters] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [isReassignOpen, setIsReassignOpen] = useState(false)
  const [runner, setRunner] = useState(null)
  const [runners, setRunners] = useState(null)
  const [dateType, setDateType] = useState(null)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [city, setCity] = useState(null)
  const [conversionCategory, setConversionCategory] = useState(null)
  const [outlet, setOutlet] = useState(null)
  const [outlets, setOutlets] = useState([])
  const [searchText, setSeachText] = useState('')

  const applyFilter = newFilters => {
    if (!isEqual(newFilters, filters)) {
      setFilters(newFilters)
      const payload = { pageNumber: 1 }
      window.scrollTo(0, 0)
      dispatch(getRunnerData({ ...newFilters, ...payload }))
    }
  }

  const handleCityChange = selectedCity => {
    setOutlets([])
    setOutlet(null)
    setCity(selectedCity)
    if (selectedCity && selectedCity.value) {
      listStoresFhdShd({
        storeTypeId: 3,
        cityId: selectedCity.value
      })
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const stores = apiResponse.storeListByCityId.map(store => ({
              value: store.storeId,
              label: store.storeName
            }))
            setOutlets(stores)
          }
        })
    }
  }

  const refreshData = () => {
    window.scrollTo(0, 0)
    dispatch(getRunnerData({ ...filters, pageNumber: page }))
  }

  const handlePageChange = pageNumber => {
    let payload = { pageNumber }
    if (Object.keys(filters).length) {
      payload = { ...filters, pageNumber }
    }
    window.scrollTo(0, 0)
    dispatch(getRunnerData(payload))
  }

  const clearFilterState = () => {
    if (getRole() !== 'LOGISTICS_COORDINATOR') {
      setOutlets([])
    }
    setDateType(null)
    setFromDate(null)
    setToDate(null)
    setCity(null)
    setConversionCategory(null)
    setOutlet(null)
    setOutlets([])
    setRunner(null)
  }

  const clearFilters = () => {
    clearFilterState()
    if (Object.keys(filters).length) {
      setFilters({})
      window.scrollTo(0, 0)
      dispatch(getRunnerData())
    }
  }

  const handleAssignRunner = (currentunner, isReassign = false) => {
    dispatch(showLoader())
    getRunners(currentunner.leadId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          setRunner(currentunner)
          setRunners(apiResponse.runnerList)
          if (isReassign)
            setIsReassignOpen(true)
          else
            setIsOpen(true)
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  const closeForm = () => {
    setIsOpen(false)
    setRunner(null)
    setRunners(null)
    setIsReassignOpen(false)
  }

  const handleClearFilters = () => {
    setSeachText('')
    if (filters.searchKeyword) {
      dispatch(getRunnerData())
      setFilters({})
    }
  }

  const handleSearch = () => {
    if (searchText && filters.searchKeyword !== searchText) {
      clearFilterState()
      setFilters({ searchKeyword: searchText })
      dispatch(getRunnerData({ searchKeyword: searchText, pageNumber: 1 }))
    }
  }

  const assignRunner = payload => {
    dispatch(showLoader())
    assignRunnerToInventory(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message))
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
        closeForm()
        refreshData()
      })
  }

  return (
    <Fragment>
      <h3> Runner Details </h3>
      <RunnerFilter
        onApplyFilters={applyFilter}
        onClearFilters={clearFilters}
        onCityChange={handleCityChange}
        onConversionChange={setConversionCategory}
        onDateTypeChange={setDateType}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onOutletChange={setOutlet}
        outlets={outlets}
        outlet={outlet}
        toDate={toDate}
        fromDate={fromDate}
        conversionCategory={conversionCategory}
        dateType={dateType}
        city={city}
      />
      <UniversalSearch
        onInput={setSeachText}
        value={searchText}
        onClearSearch={handleClearFilters}
        onSearch={handleSearch}
      />
      <RunnerData
        onPageChange={handlePageChange}
        onAssignRunner={handleAssignRunner}
      />
      {
        isOpen &&
        <AssignRunnerDialog
          open={isOpen}
          onClose={closeForm}
          runners={runners}
          runner={runner}
          onAssignRunner={assignRunner}
        />
      }
      {
        isReassignOpen &&
        <AssignRunnerDialog
          open={isReassignOpen}
          onClose={closeForm}
          runners={runners}
          runner={runner}
          onAssignRunner={(payload) => assignRunner({ ...payload, reAssign: true })}
        />
      }
    </Fragment>
  )
}

export default AssignRunner