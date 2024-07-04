import React, { Component } from 'react'
import isEqual from 'lodash/isEqual'
import ValuatorListFilter from './components/Filters'
import SearchField from '../../shared/components/form/Search'
import ValuatorListHeader from './components/Header'
import ValuatorDataTable from './components/ListTable'
import { Card, CardBody } from 'reactstrap'
import RescheduleDialog from './components/rescheduleDialog'
import ReAssignDialog from './components/reAssignDialog'
import { valuatorDashbaordList } from '../../redux/actions/valuatorDasboardListAction'
import AuditTable from './components/auditRecordTable'
import { connect } from 'react-redux'
import { getAuditCalls, reAssignOrReSchedule } from '../../core/services/valuatorServices'
import { getValuatorList } from '../../core/services/valuatorServices'
import { setNotification } from '../../redux/actions/notificationAction'
import DropDialog from './components/DropReason'
import { getDropReasons } from '../../core/services/valuatorServices'
import { markItAsDropped } from '../../core/services/miscServices'

class ValuatorListView extends Component {

  state = {
    filters: {},
    isOpen: false,
    title: null,
    columns: [],
    data: null,
    isArray: false,
    open: false,
    status: 'PENDING',
    isRegistrationSearch: false,
    searchText: '',
    isSummaryOpen: false,
    openRecord: false,
    city: null,
    callRecordings: [],
    valList: [],
    removeFilters: false,
    openDrop: false,
    reasonList: []
  }


  applyFilter = (filters) => {
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    if (!isEqual(prevFilters, filters)) {
      this.setState({ filters, searchText: '' }, () => {
        window.scrollTo(0, 0)
        dispatch(valuatorDashbaordList({ ...filters, pageNum: 1, status }))
      })
    }
  }

  clearFilters = () => {
    const { filters: prevFilters, status, city } = this.state
    const { dispatch } = this.props
    if (Object.keys(prevFilters).length) {
      this.setState({ filters: {}, status: 'PENDING' }, () => {
        window.scrollTo(0, 0)
        dispatch(valuatorDashbaordList({ status: 'PENDING', pageNum: 1 }))
      })
    }
  }

  refreshData = () => {
    const { filters, status } = this.state
    const { pageNum, dispatch } = this.props
    dispatch(valuatorDashbaordList({ ...filters, status, pageNum }))
  }

  searchHandler = (e) => {
    const { dispatch } = this.props
    const { status } = this.state
    const regexp = /^[0-9\b]+$/
    this.setState({ isRegistrationSearch: true, isClearFilter: true, filters: {} }, () => {
      dispatch(valuatorDashbaordList({ pageNum: 1, leadId: this.state.searchText, status }))
    })
  }

  handleClearFilter = () => {
    const { dispatch, status } = this.props
    this.setState({ searchText: '' })
    dispatch(valuatorDashbaordList({ status: 'PENDING', pageNum: 1 }))
  }

  onChangeStatus = status => {
    const { filters } = this.state
    const { dispatch } = this.props
    let payload = { status, pageNum: 1 }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }

    if (this.state.searchText) {
      payload.leadId = this.state.searchText
    }
    this.setState({ status }, () => {
      window.scrollTo(0, 0)
      dispatch(valuatorDashbaordList(payload))
    })
  }

  updateStatusForHeader = status => {
    this.setState({ status, isRegistrationSearch: false, leadId: this.state.searchText })
  }

  onSearchTypeHandler = searchText => {
    this.setState({ searchText })
  }

  handlePageChange = (pageNum) => {
    const { dispatch } = this.props
    const { filters, status } = this.state
    let payload = { status, pageNum }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    if (this.state.searchText) {
      payload.leadId = this.state.searchText
    }
    window.scrollTo(0, 0)
    dispatch(valuatorDashbaordList(payload))
  }

  handleSummaryTableChange = () => {
    this.setState({ isSummaryOpen: true })
  }

  handleListTableChange = () => {
    this.setState({ isSummaryOpen: false })
  }

  openScheduleDialog = (auctionData) => {
    this.setState({ isOpen: true, data: auctionData })
  }

  openAssignDialog = (auctionData) => {
    this.setState({ open: true, data: auctionData })
    let payload = { pageNum: 1, userType: "valuator", cityId: auctionData.cityId }
    getValuatorList(auctionData.cityId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          let valList = apiResponse.userList.map(user => {
            return {
              value: user.userId,
              label: user.userFirstName
            }
          })
          this.setState({ valList })
        }
      })
  }

  openAuditRecordDialog = (auctionData) => {
    this.setState({ openRecord: true, data: auctionData })
    getAuditCalls(auctionData.leadId)
      .then(callResponse => {
        if (callResponse.isValid) {
          this.setState({ callRecordings: callResponse.listOfRecordings })
        }
      })
  }

  closeDialog = () => {
    this.setState({ isOpen: false, open: false, openRecord: false, openDrop: false })
  }

  reAssign = (payload) => {
    const { dispatch } = this.props
    reAssignOrReSchedule(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({ open: false })
          dispatch(setNotification('success', 'Success', apiResponse.message))
        }
        else {
          this.setState({ open: false })
          dispatch('danger', 'Error', apiResponse.message)
        }
      })
  }

  reschedule = (payload) => {
    const { dispatch } = this.props
    reAssignOrReSchedule(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({ isOpen: false })
          dispatch(setNotification('success', 'Success', apiResponse.message))
        }
        else {
          this.setState({ isOpen: false })
          dispatch('danger', 'Error', apiResponse.message)
        }
      })
  }

  handleDropped = (auctionData) => {
    this.setState({
      openDrop: true,
      data: auctionData
    })
    getDropReasons()
      .then(apiRes => {
        if (apiRes.isValid) {
          const reasonList = apiRes.reasons.map(reason => {
            return {
              value: reason.reasonId,
              label: reason.reason
            }
          })
          this.setState({ reasonList })
        }
      })
  }

  setSearchText = (value) => {
    const { dispatch } = this.props
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) {
      this.setState({ searchText: value.slice(0, 8) })
    }
    else {
      dispatch(setNotification('danger', 'Please Enter Valid Lead ID'))
    }
  }

  dropLead = (payload) => {
    const { dispatch } = this.props
    markItAsDropped(payload).
      then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message))
          dispatch(valuatorDashbaordList({ pageNum: 1, status: 'PENDING' }))
        }
        else {
          dispatch('danger', 'Error', apiResponse.message)
        }
      })
    this.setState({ openDrop: false })
  }

  render() {
    const { searchText, status, isRegistrationSearch, valList, isOpen, open, openRecord, city, data, callRecordings, openDrop, reasonList } = this.state
    return (
      <>
        <h3>Valuator List View</h3>
        <ValuatorListFilter
          currentCity={city}
          onCityChange={this.cityChangeHandler}
          onApplyFilter={this.applyFilter}
          onClearFilters={this.clearFilters}
          onChangeStatus={this.onChangeStatus}
        />
        <Card className="mt-3 mb-3" style={{ paddingBottom: 0 }}>
          <CardBody className="card-shadow square-border" style={{ display: 'flex', alignItems: 'center' }}>
            <SearchField
              value={searchText}
              onSearch={this.setSearchText}
              withButton
              onEnter={this.searchHandler}
              onClick={this.searchHandler}
              onClearInput={this.handleClearFilter}
              placeholder="Search By Lead ID"
              style={{ maxWidth: 350 }}
            />
          </CardBody>
        </Card>
        <ValuatorListHeader
          onChangeStatus={this.onChangeStatus}
          status={status}
        />
        <ValuatorDataTable
          status={status}
          onStatusChange={this.updateStatusForHeader}
          onPageChange={this.handlePageChange}
          isRegistrationSearch={isRegistrationSearch}
          onSchedule={this.openScheduleDialog}
          onAssign={this.openAssignDialog}
          onRecord={this.openAuditRecordDialog}
          onDrop={this.handleDropped}
        />
        {
          isOpen &&
          <RescheduleDialog
            isOpen={isOpen}
            onClose={this.closeDialog}
            data={data}
            onSubmitReshedule={this.reschedule}
          />
        }
        {
          open &&
          <ReAssignDialog
            open={open}
            onClose={this.closeDialog}
            data={data}
            valList={valList}
            onReAssignSubmit={this.reAssign}
          />
        }
        {
          openRecord &&
          <AuditTable
            openRecord={openRecord}
            onClose={this.closeDialog}
            callRecordings={callRecordings}
          />
        }
        {
          openDrop &&
          <DropDialog
            isOpen={openDrop}
            onClose={this.closeDialog}
            data={data}
            reasonList={reasonList}
            onDropLead={this.dropLead}
          />
        }
      </>
    )
  }
}

export default connect()(ValuatorListView)