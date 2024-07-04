import React, { useState, Fragment } from 'react'
import RefurbFilters from './Filters'
import RefurbHeader from './Headers'
import RefurbData from './Table'
import { getRefurbdata } from '../../redux/actions/refurbDataAction'
import { useDispatch } from 'react-redux'
import isEqual from 'lodash/isEqual'
import RegistrationSearch from './RegistrationSearch'
import { setNotification } from '../../redux/actions/notificationAction'

const RefurbDashboard = () => {

  const [refurbStatus, setRefurbStatus] = useState('QC_PENDING')
  const [isRegistrationSearch, setIsRegistrationSearch] = useState(false)
  const [isResetRequired, setIsResetRequired] = useState(false)
  const [filters, setFilters] = useState({})
  const dispatch = useDispatch()
  const [uSearch, setUniSearch] = useState(false)
  const [regNum, setRegNum] = useState('')

  const handleStatusChange = (status, uSearch) => {
    console.log(uSearch,status)
    let payload = { refurbStatus: status, pageNum: 1 }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    if(uSearch === true){
      if(regNum){
        payload = {...payload, refurbStatus: status, pageNum: 1, isUniversalSearch: true}
        payload.regNum = regNum
        setRefurbStatus(status)
      }
    }
    else {
      payload = {...payload, refurbStatus: status, pageNum: 1}
      payload.regNum = regNum
      setRefurbStatus(status)
    }
    window.scrollTo(0, 0)
    dispatch(getRefurbdata(payload))
  }

  const handlePageChange = (pageNum) => {
    let payload = { refurbStatus, pageNum }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    if (regNum) {
      payload.regNum = regNum
    }
    dispatch(getRefurbdata(payload))
  }

  const clearSearch = () => {
    setRegNum('')
    setRefurbStatus('QC_PENDING')
    refreshData()
  }

  const refreshData = () => {
    let payload = {}
    window.scrollTo(0, 0)
    payload = { refurbStatus: 'QC_PENDING', pageNum: 1 }
    dispatch(getRefurbdata(payload))
  }

  const searchHandler = (regNummber, universalCheck) => {
    setUniSearch(universalCheck)
    setIsResetRequired(true)
    setIsRegistrationSearch(true)
    setFilters({})

    if(universalCheck === true){
      const payload = {pageNum:1, refurbStatus: 'ALL', isUniversalSearch: true}
      if(regNummber.length >= 6){
        payload.regNum = regNummber
        dispatch(getRefurbdata(payload))
      }
      else{
        dispatch(setNotification('danger', 'Please Enter Correct Register Number'))
      }
    }
    else {
      const payload = {pageNum:1, refurbStatus: 'ALL'}
      if(regNummber){
        payload.regNum = regNummber
        dispatch(getRefurbdata(payload))
      }
    }
  }

  const changeRefurbStatus = status => {
    if(refurbStatus === 'ALL')
    setRefurbStatus(refurbStatus)
    else
    setRefurbStatus(status)
    setIsRegistrationSearch(false)
  }

  const handleApplyFilter = newFilters => {
    let payload = { pageNum: 1, refurbStatus: refurbStatus }
    if (!isEqual(newFilters, filters)) {
      setFilters(newFilters)
      setRegNum('')
      dispatch(getRefurbdata({ ...payload, ...newFilters }))
    }
  }

  const handleClearFilter = () => {
    setIsResetRequired(false)
    if (Object.keys(filters).length) {
      setFilters({})
      setRefurbStatus('QC_PENDING')
      refreshData({ pageNum: 1, refurbStatus })
    }
  }

  return (
    <Fragment>
      <RefurbFilters
        status={refurbStatus}
        onApplyFilter={handleApplyFilter}
        isResetRequired={isResetRequired}
        onClearFilters={handleClearFilter}
      />
      <RefurbHeader
        refurbStatus={refurbStatus}
        onRefurbStatusUpdate={handleStatusChange}
        uSearch={uSearch}
      />
      <RegistrationSearch
        onSearch={searchHandler}
        searchText={regNum}
        onClearSearch={clearSearch}
        onSearchType={setRegNum}
      />
      <RefurbData
        refurbStatus={refurbStatus}
        onPageChange={handlePageChange}
        isRegistrationSearch={isRegistrationSearch}
        onSetStatus={changeRefurbStatus}
        filters={filters}
      />
    </Fragment>
  )
}

export default RefurbDashboard