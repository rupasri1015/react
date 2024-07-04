import React, { useState } from 'react'
import { setNotification } from '../../redux/actions/notificationAction'
import { useDispatch } from 'react-redux'
import isEqual from 'lodash/isEqual'
import PaperTransferTable from './components/Table'
import PaperTransferFilters from './components/PaperTransferFilters'
import PaperTransferHeader from './components/PaperTransferHeader'
import { getPaperData } from '../../redux/actions/paperTransferAction'

const PaperTransfer = ({history}) => {

  const [ptStatus, setptStatus] = useState('PENDING')
  const [isRegistrationSearch, setIsRegistrationSearch] = useState(false)
  const [isResetRequired, setIsResetRequired] = useState(false)
  const [filters, setFilters] = useState({})
  const dispatch = useDispatch()
  const [regNum, setRegNum] = useState('')

  const handleStatusChange = (status, universalCheck) => {
    let payload = { ptStatus: status, pageNum: 1 }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    if(universalCheck === true){
       payload = {...payload, ptStatus: status, pageNum: 1, isUniversalSearch: true}
      if (regNum) {
        payload.regNum = regNum
      }
      dispatch(getPaperData(payload))
    }
    else {
       payload = {...payload, ptStatus: status, pageNum: 1}
      if (regNum) {
        payload.regNum = regNum
      }
      dispatch(getPaperData(payload))
    }
    setptStatus(status)
    window.scrollTo(0, 0)
  }

  const handlePageChange = (pageNum) => {
    let payload = { ptStatus, pageNum }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    if (regNum) {
      payload.regNum = regNum
    }
    refreshData(payload)
  }

  const goToViewSummaryPage = (ptListDetails) => {
    history.push({
      pathname: `/paperTransfer/bikedetails/${ptListDetails.leadId}`,
      state: { detail: ptListDetails }
    })
  }

  const goToViewPage = (ptListDetails) => {
    history.push({
      pathname: `/paperTransfer/viewdetails/${ptListDetails.leadId}`,
      state: {detail: ptListDetails}
    })
  }

  const goToRTOPage = (ptListDetails) => {
    history.push({
      pathname: `/paperTransfer/rtoDetails/${ptListDetails.leadId}`,
      state: {detail: ptListDetails}
    })
  }

  const goToVaahanPage = (ptListDetails) => {
    history.push({
      pathname: `/paperTransfer/vaahanDetails/${ptListDetails.leadId}`,
      state: {detail: ptListDetails}
    })
  }

  const goToRecivedPage = (ptListDetails) => {
    history.push({
      pathname: `/paperTransfer/receivedDetails/${ptListDetails.leadId}`,
      state: {detail: ptListDetails}
    })
  }

  const goToDelievredPage = (ptListDetails) => {
    history.push({
      pathname: `/paperTransfer/deliveredDetails/${ptListDetails.leadId}`,
      state: {detail: ptListDetails}
    })
  }

  const clearSearch = () => {
    setRegNum('')
    setptStatus('PENDING')
    refreshData()
  }

  const refreshData = (payload = { ptStatus: 'PENDING', pageNum: 1  }) => {
    window.scrollTo(0, 0)
    dispatch(getPaperData(payload))
  }

  const searchHandler = (regNummber, universalSearch) => {
    setIsResetRequired(true)
    setIsRegistrationSearch(true)
    setFilters({})
    if(universalSearch === true) {
      if(regNummber.length >= 6) {
        const payload = { pageNum: 1, isUniversalSearch: true, ptStatus: 'ALL' }
        payload.regNum = regNummber
        refreshData(payload)
      }
      else{
        dispatch(setNotification('danger', 'Please Enter Correct Register Number'))
      }
    }
    else {
      let payload = { pageNum: 1, ptStatus: 'ALL' }
      if (regNummber) {
        payload.regNum = regNummber
        refreshData(payload)
      }
    }
  }

  const changeptStatus = status => {
    setptStatus(status)
    setIsRegistrationSearch(false)
  }

  const handleApplyFilter = newFilters => {
    let payload = { pageNum: 1, ptStatus }
    if (!isEqual(newFilters, filters)) {
      setFilters(newFilters)
      setRegNum('')
      refreshData({ ...payload, ...newFilters })
    }
  }

  const handleClearFilter = () => {
    setIsResetRequired(false)
    if (Object.keys(filters).length) {
      setFilters({})
      setptStatus('PENDING')
      refreshData({ pageNum: 1, ptStatus: 'PENDING' })
    }
  }


  return (
    <>
    <h3>Paper Transfer</h3>
      <PaperTransferFilters
        status={ptStatus}
        onApplyFilter={handleApplyFilter}
        isResetRequired={isResetRequired}
        onClearFilters={handleClearFilter}
      />
      <PaperTransferHeader
        ptStatus={ptStatus}
        onQcStatusUpdate={handleStatusChange}
        onSearch={searchHandler}
        searchText={regNum}
        onClearSearch={clearSearch}
        onSearchType={setRegNum}
      />
      <PaperTransferTable
        ptStatus={ptStatus}
        onPageChange={handlePageChange}
        onGoToSummary={goToViewSummaryPage}
        onGoToView={goToViewPage}
        onGoToRTO={goToRTOPage}
        onGoToVaahan={goToVaahanPage}
        onGoToReceived={goToRecivedPage}
        onGoToDelivered={goToDelievredPage}
        isRegistrationSearch={isRegistrationSearch}
        onSetStatus={changeptStatus}
      />
    </>
  )
}

export default PaperTransfer