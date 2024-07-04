import React, { useState, useEffect, Fragment } from 'react'
import FranchiseRunnerData from './components/RunnerDataTable'
import FranchiseRunnerFilter from './components/RunnerFilter'
import UniversalSearch from './components/UniversalSearch'
import FranchiseAssignRunnerDialog from './components/AssignRunnerDialog'
import { getFranchiseRunnerData, resetRunnerList } from '../../../redux/actions/franchiseAssignRunnerListAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { getFranchiseRunners, assignRunner } from '../../../core/services/franchiseLogisticsServices'
import { getRole, getCityID } from '../../../core/services/rbacServices'
import { listStores } from '../../../core/services/miscServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { listCoordinators } from '../../../core/services/logisticServices'
import isEqual from 'lodash/isEqual'
import { useDispatch, useSelector } from 'react-redux'

const FranchiseAssignRunner = () => {

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
  const [showroom, setShowroom] = useState(null)
  const [showrooms, setShowrooms] = useState([])
  const [searchText, setSeachText] = useState('')
  const [coordinator, setCoordinator] = useState(null)
  const [coordinators, setCoordinators] = useState([])

  useEffect(() => {
    if (getRole() === 'LOGISTICS_COORDINATOR') {
      listStores(getCityID())
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const stores = apiResponse.storeListByCityId.map(store => ({
              value: store.storeId,
              label: store.storeName
            }))
            setShowrooms(stores)
          }
        })
        listCoordinators(getCityID())
        .then(apiResponse => {
          if (apiResponse.isValid) {
            setCoordinators(apiResponse.coordinatorList.map(coordinator => ({ value: coordinator.userId, label: coordinator.name})))
          }
        })
    }
    else{
      listCoordinators()
        .then(apiResponse => {
          if (apiResponse.isValid) {
            setCoordinators(apiResponse.coordinatorList.map(coordinator => ({ value: coordinator.userId, label: coordinator.name})))
          }
        })
    }
  }, [])

  const applyFilter = newFilters => {
    if (!isEqual(newFilters, filters)) {
      setFilters(newFilters)
      const payload = { pageNumber: 1 }
      window.scrollTo(0, 0)
      dispatch(getFranchiseRunnerData({ ...newFilters, ...payload, requestType:"assignRunner",vehicleStatus: 'ALL' }))
    }
  }

  const handleCityChange = selectedCity => {
    setCoordinators([])
    setShowrooms([])
    setCity(selectedCity)
    if (selectedCity && selectedCity.value) {
      listStores(selectedCity.value)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const stores = apiResponse.storeListByCityId.map(store => ({
              value: store.storeId,
              label: store.storeName
            }))
            setShowrooms(stores)
          }
        })
        listCoordinators(selectedCity.value)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            setCoordinators(apiResponse.coordinatorList.map(coordinator => ({ value: coordinator.userId, label: coordinator.name})))
          }
        })
    }
  }

  const refreshData = () => {
    window.scrollTo(0, 0)
    dispatch(getFranchiseRunnerData({ ...filters, pageNumber: page, requestType:"assignRunner", vehicleStatus: 'ALL' }))
  }

  const handlePageChange = pageNumber => {
    let payload = { pageNumber }
    if (Object.keys(filters).length) {
      payload = { ...filters, pageNumber }
    }
    window.scrollTo(0, 0)
    dispatch(getFranchiseRunnerData(payload))
  }

  const clearFilterState = () => {
    if (getRole() !== 'LOGISTICS_COORDINATOR') {
      setShowrooms([])
    }
    setDateType(null)
    setFromDate(null)
    setToDate(null)
    setCity(null)
    setShowroom(null)
    setRunner(null)
    setCoordinator(null)
    listCoordinators()
        .then(apiResponse => {
          if (apiResponse.isValid) {
            setCoordinators(apiResponse.coordinatorList.map(coordinator => ({ value: coordinator.userId, label: coordinator.name})))
          }
        })
  }

  const clearFilters = () => {
    clearFilterState()
    if (Object.keys(filters).length) {
      setFilters({})
      window.scrollTo(0, 0)
      dispatch(getFranchiseRunnerData())
    }
  }

  const handleAssignRunner = (currentunner, isReassign = false) => {
    dispatch(showLoader())
    getFranchiseRunners()
      .then(apiResponse => {
        if (apiResponse.isValid) {
          setRunner(currentunner)
          setRunners(apiResponse.runners)
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
      dispatch(getFranchiseRunnerData())
      setFilters({})
    }
  }

  const handleSearch = () => {
    if (searchText && filters.searchKeyword !== searchText) {
      clearFilterState()
      setFilters({ searchKeyword: searchText })
      dispatch(getFranchiseRunnerData({ registrationNumber: searchText, pageNumber: 1, requestType:"assignRunner", vehicleStatus: 'ALL' }))
    }
  }

  const assignFranchiseRunner = payload => {
    dispatch(showLoader())
    assignRunner(payload)
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
      <FranchiseRunnerFilter
        onApplyFilters={applyFilter}
        onClearFilters={clearFilters}
        onCityChange={handleCityChange}
        onDateTypeChange={setDateType}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onShowroomChange={setShowroom}
        onCoordinatorChange={coordinatorValue => setCoordinator(coordinatorValue)}
        showrooms={showrooms}
        showroom={showroom}
        toDate={toDate}
        fromDate={fromDate}
        dateType={dateType}
        city={city}
        coordinator={coordinator}
        coordinators={coordinators}
      />
      <UniversalSearch
        onInput={setSeachText}
        value={searchText}
        onClearSearch={handleClearFilters}
        onSearch={handleSearch}
      />
      <FranchiseRunnerData
        onPageChange={handlePageChange}
        onAssignRunner={handleAssignRunner}
      />
      {
        isOpen &&
        <FranchiseAssignRunnerDialog
          open={isOpen}
          onClose={closeForm}
          runners={runners}
          runner={runner}
          onAssignRunner={(payload) => assignFranchiseRunner({ ...payload, reAssign: false })}
        />
      }
      {
        isReassignOpen &&
        <FranchiseAssignRunnerDialog
          open={isReassignOpen}
          onClose={closeForm}
          runners={runners}
          runner={runner}
          onAssignRunner={(payload) => assignFranchiseRunner({ ...payload, reAssign: true })}
        />
      }
    </Fragment>
  )
}

export default FranchiseAssignRunner