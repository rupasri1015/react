import React, { Component, Fragment } from 'react'
import AssignedTable from './components/Table'
import { getCityID, PERMISSIONS, getRole, getUserID } from '../../../../core/services/rbacServices'
import { getAssignedBikesReports, reAssignToFranchise } from '../../../../core/services/franchiseServices'
import { getPendingAssignList } from '../../../../redux/actions/pendingAssignListAction'
import PaymentFilter from '../../../../shared/components/FranchisePaymentsFilter'
import isEqual from 'lodash/isEqual'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import { setNotification } from '../../../../redux/actions/notificationAction'
import { connect } from 'react-redux'
import SearchRegNumber from '../../../../shared/components/SearchRegNum'
import ReAssignDialog from './components/Forms/ReAssignDialog'

class AssignedLeads extends Component {

  state = {
    filters: {},
    searchText: '',
    isClearFilter: false,
    open: false,
    data: null
  }

  changePage = (page) => {
    const { dispatch } = this.props
    const { filters } = this.state
    let payload = { page, acceptedStatus: "ACCEPTED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(getPendingAssignList(payload))
  }

  applyFilter = (filters) => {
    const { dispatch } = this.props
    let payload = { page: 1, acceptedStatus: "ACCEPTED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (!isEqual(filters,
    )) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        dispatch(getPendingAssignList({ ...filters, ...payload }))
      })
    }
  }

  clearFilter = () => {
    const { filters } = this.state
    const { dispatch } = this.props
    const payload = { page: 1, acceptedStatus: "ACCEPTED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      this.setState({ ...filters, ...payload }, () => {
        window.scrollTo(0, 0)
        dispatch(getPendingAssignList(payload))
      })
    }
  }

  searchHandler = registrationNumber => {
    const { dispatch } = this.props
    let payload = { page: 1, acceptedStatus: "ACCEPTED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (registrationNumber) {
      this.setState({ isClearFilter: true, filters: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(getPendingAssignList({ registrationNumber, ...payload }))
      })
    }
  }

  clearSearch = () => {
    this.setState({
      searchText: ''
    })
    this.refreshData()
  }

  refreshData = () => {
    const { filters } = this.state
    const { dispatch } = this.props
    let payload = { page: 1, acceptedStatus: "ACCEPTED" }
    if (Object.keys(filters).length) {
      payload = { ...filters }
    }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    window.scrollTo(0, 0)
    dispatch(getPendingAssignList(payload))
  }

  onSearchTypeHandler = searchText => {
    this.setState({ searchText })
  }

  applySearch = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    let payload = { page: 1, acceptedStatus: "ACCEPTED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (!isEqual(prevFilters,
    )) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        dispatch(getPendingAssignList({ ...filters, ...payload }))
      })
    }
  }

  exportData = () => {
    const { dispatch } = this.props
    dispatch(showLoader())
    const payload = {}
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    getAssignedBikesReports(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { url } = apiResponse
          window.location.href = url
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

  reAssignToStore = (reAssignData) => {
    this.setState({
      open: true,
      data: reAssignData
    })
  }

  closeDialog = () => {
    this.setState({
      data: null,
      open: false
    })
  }

  reAssignForm = (formData) => {
    const { dispatch, page } = this.props
    const { data } = this.state
    const { orderID } = data
    dispatch(showLoader())
    const payload = {
      orderid: orderID,
      storeid: formData.storeIds,
      assignedCrp: formData.crp,
      updatedBy: getUserID(),
      cityId: formData.cityId
    }
    reAssignToFranchise(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.closeDialog()
          this.refreshData(page)
          dispatch(setNotification('success', 'Success', apiResponse.message))
        }
        else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
      })
    dispatch(hideLoader())
  }

  render() {
    const { searchText, isClearFilter, open, data } = this.state
    return (
      <Fragment>
        <div> <h3> Assigned Inventory Details</h3> </div>
        <PaymentFilter
          onClearFilter={this.clearFilter}
          onApplyFilter={this.applyFilter}
          onApplySearch={this.applySearch}
          isClearFilter={isClearFilter}
          setClearFilter={() => this.setState({ isClearFilter: false })}
        />
        <SearchRegNumber
          onSearch={this.searchHandler}
          searchText={searchText}
          onClearSearch={this.clearSearch}
          onSearchType={this.onSearchTypeHandler}
          onExport={this.exportData}
          onShowExport={true}
        />
        <AssignedTable
          onPageChange={this.changePage}
          onReAssignToStore={this.reAssignToStore}
        />
        {
          open &&
          <ReAssignDialog
            open={open}
            data={data}
            onClose={this.closeDialog}
            onReAssignForm={this.reAssignForm}
          />
        }
      </Fragment>
    )
  }
}
export default connect(state => ({
  page: state.pending.page
}))(AssignedLeads)
