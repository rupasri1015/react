import React, { useEffect,Fragment, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import ConfirmationTable from './components/Table'
import { getConfirmationList } from '../../redux/actions/quoteConfirmationAction'
import { getUserID } from '../../core/services/rbacServices'
import { getAgentsList } from '../../core/services/shdServices'
import Filter from './components/Filters'
import moment from 'moment'
import { setNotification } from '../../redux/actions/notificationAction'
import isEqual from 'lodash/isEqual'
import Header from './components/Header'
import { useSelector } from 'react-redux'
import { getCityData } from '../../core/services/rbacServices'
import { getValuatorDetails } from '../../core/services/biddingServices'
import { hideLoader, showLoader } from '../../redux/actions/loaderAction'
import { getAmount } from '../../core/utility'

const CareConfirmation = () => {

  const [status, setStatus] = useState('UNASSIGNED')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [filters, setFilters] = useState({})
  const [city, setCity] = useState('')
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const [searchText, setSearchtext] = useState('')
  const [isResetRequired, setIsResetRequired] = useState(false)
  const [isRegistrationSearch, setIsRegistrationSearch] = useState(false)
  const currentPage = useSelector((state) => state.quoteConfirm.pageNum)
  const confirmList = useSelector((state) => state.quoteConfirm.shdCommissionList)
  const totalCount = useSelector((state) => state.quoteConfirm.count)
  const [dateType, setDateType] = useState('')
  const [agent, setAgent] = useState('')
  const [agentList, setAgentList] = useState([])
  const [appliedAgent, setAppliedAgent] = useState(false)
  const [onGoingStatus,setOnGoingStatus] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [onGoingStatusType,setOnGoingStatustype] = useState('')
  const getTabValue = (stat) => {
    if(stat === 'SOLD') return 'Commission'
    else return 'Lead Details'
  }
  const tabValue = getTabValue(status)
  const [value, setValue] = useState('')

  const handleValue = (newVal) => {
    setValue(newVal)
  }
  const dispatch = useDispatch()

  const cities = useSelector((state) => state.cities.cityList)

  const usersCity = getCityData().split(',').map((val) => val)

  const finalCityList = cities.filter(item => usersCity.includes(item.cityId));

  const cityList = finalCityList.map(city => {
    return {
      value: city.cityId,
      label: city.cityName
    }
  })

  const handlePageChange = (pageNumber) => {
    let filPayload = {}
    if (searchText) {
      if(filterStatus){
        filPayload.filterType = filterStatus.value
      }
      if (agent) {
        dispatch(getConfirmationList({ ...filters, pageNum: pageNumber, userId: agent.value, status, searchString: searchText, ...filPayload }))
      }
      else
        dispatch(getConfirmationList({ ...filters, pageNum: pageNumber, userId: getUserID(), status, searchString: searchText, ...filPayload }))
    }
    else {
      if(filterStatus){
        filPayload.filterType = filterStatus.value
      }
      if (agent) {
        dispatch(getConfirmationList({ ...filters, pageNum: pageNumber, userId: agent.value, status, ...filPayload }))
      }
      else
        dispatch(getConfirmationList({ ...filters, pageNum: pageNumber, userId: getUserID(), status, ...filPayload }))
    }
  }

  useEffect(() => {
    const payload = {
      status: 'UNASSIGNED',
      pageNum: 1,
      userId: getUserID()
    }
      
    dispatch(getConfirmationList(payload))

    getAgentsList().
      then(agentListResponse => {
        if (agentListResponse.isValid) {
          let agents = agentListResponse.commissionUsers.map(agt => {
            return {
              value: agt.agentId,
              label: agt.agentName
            }
          })
          setAgentList(agents)
        }
      })

  }, [])

  const getPayload = () => {
    const payload = {}
    if (dateType) {
      payload.dateType = dateType.value
    }
    if (endTime) {
      payload.toDate = moment(endTime).format("YYYY-MM-DD")
    }
    if (startTime) {
      payload.fromDate = moment(startTime).format("YYYY-MM-DD")
    }
    if (status) {
      payload.status = status
    }
    if (city) {
      payload.cityId = city.value
    }
    if (agent) {
      payload.userId = agent.value
    }
    if (filterStatus)
    payload.filterType = filterStatus.value
    return payload
  }

  const resetFilters = () => {
    const { ...rest } = filters
    setStartTime(null)
    setEndTime(null)
    setCity('')
    setDateType('')
    setFilters({})
    setAgent('')
    setAppliedAgent(false)
    setFilterStatus('')
    if (Object.keys(rest).length) {
      const payload = {
        status: status,
        pageNum: 1,
        userId: getUserID()
      }
      dispatch(getConfirmationList(payload))
    }
    refreshPage()
  }

  const handleClearFilters = () => {
    const { ...rest } = filters
    if (Object.keys(rest).length) {
      setFilters({})
      resetFilters()
      // const payload = {
      //   pageNumber: 1,
      //   userId: getUserID(),
      //   status: 'UNASSIGNED'
      // }
      // getConfirmationList(payload)
    }
  }
  const onGoingStatVal = [
    { label:'Ongoing',value:'Ongoing'},
    {label:'Auction Completed',value:'Completed'},
  ]

  const statusTypes = [
    {
      value: 'ONGOING',
      label: 'Ongoing'
    },
    {
      value: 'Completed',
      label: 'Auction Completed'
    },
    {
      value: 'CentralTaggingInspected',
      label: 'Auction Not Started'
    }
  ]

  const pendingDateType = [
    {
      value: 'AUCTIONDATE',
      label: 'Auction Date'
    },
    {
      value: 'LEADCREATEDDATE',
      label: 'Lead Created Date'
    }
  ]
  const unAssignedDateType = [
    {
      value: 'LEADCREATEDDATE',
      label: 'Lead Created Date'
    }
  ]

  const dropDateType = [
    {
      value: 'AUCTIONDATE',
      label: 'Auction Date'
    },
    {
      value: 'LEADCREATEDDATE',
      label: 'Lead Created Date'
    },
    {
      value: 'DROPDATE',
      label: 'Dropped Date'
    }
  ]
  const soldDateType = [
    {
      value: 'AUCTIONDATE',
      label: 'Auction Date'
    },
    {
      value: 'LEADCREATEDDATE',
      label: 'Lead Created Date'
    },
    {
      value: 'SOLDDATE',
      label: 'Sold Date'
    }
  ]
  const followupDateType = [
    {
      value: 'AUCTIONDATE',
      label: 'Auction Date'
    },
    {
      value: 'LEADCREATEDDATE',
      label: 'Lead Created Date'
    },
    {
      value: 'FOLLOWUPDATE',
      label: 'Follow Up Date'
    }
  ]

  const handleFromDateChange = (fromDate) => {
    setStartTime(fromDate)
  }

  const handleCityChange = (city) => {
    setCity(city)
  }

  const handleToDateChange = (toDate) => {
    setEndTime(toDate)
  }

  const handleDateType = (dateType) => {
    setDateType(dateType)
  }

  const handleStatusChange = (status) => {
    if (searchText) {
      setSearchtext(searchText)
      dispatch(getConfirmationList({ ...filters, userId: getUserID(), status, searchString: searchText, pageNum: 1}))
    }
    else {
      setStartTime(null)
      setEndTime(null)
      setCity('')
      setDateType('')
      setFilters({})
      setAgent('')
      setFilterStatus('')
      setOnGoingStatus(!onGoingStatus)
      dispatch(getConfirmationList({ userId: getUserID(), status, pageNum: 1 }))
    }
    setStatus(status)
    setIsRegistrationSearch(false)
    setValue('')
  }

  const handleOnGoingFilter = (filterVal) => {
    setOnGoingStatustype(filterVal)
  }

  // const applyOnGoingFilter = () => {
  //   if(onGoingStatusType.value){
  //     dispatch(getConfirmationList({ userId: getUserID(), status, pageNum: 1 ,filterType: onGoingStatusType.value}))
  //   }else{
  //     dispatch(setNotification('danger', 'Invalid Selection', 'Status is Required.'));
  //     isValid = false
  //   }
  // }
  
  const handleApplyFilters = () => {
    let isValid = true
    const payload = getPayload()
    if (payload.dateType || payload.fromDate || payload.toDate) {
      if (!payload.dateType) {
        dispatch(setNotification('danger', 'Invalid Selection', 'Date Type is Required.'));
        isValid = false
      }
      if (!payload.fromDate) {
        dispatch(setNotification('danger', 'Invalid Selection', 'From Date is Required'));
        isValid = false
      }
      if (!payload.toDate) {
        dispatch(setNotification('danger', 'Invalid Selection', 'To Date is Required'));
        isValid = false
      }
    }
    if (isValid && !isEqual(payload, filters)) {
      if (appliedAgent) {
        setFilters(payload)
        dispatch(getConfirmationList({ ...payload, pageNum: 1 }))
      }
      else {
        setFilters(payload)
        dispatch(getConfirmationList({ ...payload, pageNum: 1, userId: getUserID() }))
      }
    }
    if(onGoingStatusType.value){
      if(onGoingStatusType){
        dispatch(getConfirmationList({ userId: getUserID(), status, pageNum: 1 ,filterType: onGoingStatusType.value}))
      }else{
        dispatch(setNotification('danger', 'Invalid Selection', 'Status is Required.'));
        isValid = false
      }
    }
  }

  const handleSearch = (search) => {
    const searchUpper = search.toUpperCase()
    setSearchtext(searchUpper)
  }

  const searchRegKeyWord = () => {
    const searchREgex = /^[a-z0-9]+$/i
    if (searchREgex.test(searchText) && searchText.length && searchText.length <= 12) {
      dispatch(getConfirmationList({ ...filters, userId: getUserID(), status, searchString: searchText, pageNum: 1 }))
    }
    else {
      dispatch(setNotification('danger', 'Error', 'Please Enter Valid Lead Id or Registration Number'));
    }
  }

  const handleClearSearch = () => {
    setSearchtext('')
    dispatch(getConfirmationList({ ...filters, userId: getUserID(), status, pageNum: 1 }))
  }

  const refreshPage = (value) => {
    if(value === 'bidAction'){
      dispatch(getConfirmationList({ ...filters, filterType:'ONGOING', pageNum: 1, userId: getUserID(), status: "PENDING" }))
      setFilterStatus({
        value: 'ONGOING',
        label: 'Ongoing'
      })
      setStatus("PENDING")
    }
    else{
    dispatch(getConfirmationList({ ...filters, pageNum: 1, userId: getUserID(), status: status }))
  }}

  const pendingRefresh = () => {
    setStatus('PENDING')
    setFilterStatus({
      value: 'CentralTaggingInspected',
      label: 'Auction Not Started'
    })
    if(value === 'bidAction'){
      dispatch(getConfirmationList({ ...filters, filterType:'CentralTaggingInspected', pageNum: 1, userId: getUserID(), status: 'PENDING' }))
    }else{
    dispatch(getConfirmationList({ ...filters, pageNum: 1, userId: getUserID(), status: 'PENDING', filterType:'CentralTaggingInspected' }))
  }
}

const onDropRefresh = () => {
  setStatus('DROP')
  dispatch(getConfirmationList({ ...filters, pageNum: 1, userId: getUserID(), status: "DROP" }))
}
const onFollowUpRefresh = () => {
  setStatus('FOLLOWUP')
  dispatch(getConfirmationList({ ...filters, pageNum: 1, userId: getUserID(), status: "FOLLOWUP" }))
}
const onSoldRefresh = () => {
  setStatus('SOLD')
  dispatch(getConfirmationList({ ...filters, pageNum: 1, userId: getUserID(), status: "SOLD" }))
}

  const handleStatusFilter =(val) => {
    setFilterStatus(val)
  }

  const handleAgentChange = (agentData) => {
    setAppliedAgent(true)
    setAgent(agentData)
  }
  const showValuatorDetails = valuator => {
    dispatch(showLoader())
    const columns = [
      { id: 'storeName', label: 'Outlet Name' },
      { id: 'storeLocation', label: 'Outlet Location' },
      { id: 'storeContactNumber', label: 'Outlet Number' },
      { id: 'storeType', label: 'Outlet Type' },
      { id: 'storeIncentive', label: 'Store Incentive' }
    ]
    const { storeId, valuatorId } = valuator
    getValuatorDetails(storeId, valuatorId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const storeData = {
            ...apiResponse.userInfo,
            storeIncentive: getAmount(apiResponse.userInfo.storeIncentive)
          }
          this.setState({
            data: storeData,
            columns,
            isArray: false,
            title: 'Outlet Details',
            isOpen: true,
            cta: 'Close',
            check:"valuator"
          })
        } else {
          dispatch(setNotification(
            'danger',
            'Error',
            apiResponse.message
          ))
        }
        dispatch(hideLoader())
      })
  }

  const onStatusChange = (status) => {
    setFilterStatus(status)
  }

  return (
    <Fragment>
      <div className="cpp-header">
        <h3> Quote Confirmation(Care) - Customer </h3>
      </div>
      <Header
        onChangeStatus={handleStatusChange}
        status={status}
        searchText={searchText}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onSearchOfKeyword={searchRegKeyWord}
      />
      <Filter
        onGoingStatVal={onGoingStatVal}
        onGoingStatusType ={onGoingStatusType}
        onApplyOnGoing = {handleOnGoingFilter}
        onApplyFilters={handleApplyFilters}
        onEndDateChange={handleToDateChange}
        onStartDateChange={handleFromDateChange}
        onChangeCity={handleCityChange}
        onDateTypeChange={handleDateType}
        endTime={endTime}
        startTime={startTime}
        dateType={dateType}
        onClearFilters={handleClearFilters}
        isFilterLoading={isFilterLoading}
        status={status}
        city={city}
        resetFilters={resetFilters}
        pendingDateType={pendingDateType}
        followupDateType={followupDateType}
        unAssignedDateType={unAssignedDateType}
        dropDateType={dropDateType}
        soldDateType={soldDateType}
        cityList={cityList}
        onAgentChange={handleAgentChange}
        agentList={agentList}
        agent={agent}
        statusTypes={statusTypes}
        onStatusChange={onStatusChange}
        filterStatus={filterStatus}
        onValuatorDetails={showValuatorDetails}
      />
      <ConfirmationTable
        onChangePage={handlePageChange}
        status={status}
        refreshPage={refreshPage}
        currentPage={currentPage}
        confirmList={confirmList}
        totalCount={totalCount}
        value = {value ? value : tabValue}
        handleValue = {handleValue}
        handleStatusFilter={handleStatusFilter}
        onPendingRefresh={pendingRefresh}
        refreshDropPage={onDropRefresh}
        refreshFollowUpPage={onFollowUpRefresh}
        refreshSoldPage={onSoldRefresh}
      />
    </Fragment>
  )
}

export default connect()(CareConfirmation)
