import React, { Component, Fragment } from 'react'
import PendingData from './components/PendingAssignmentData'
import AssignBikeDialog from './components/Forms/AssignBikeDialog'
import { getPendingAssignList } from '../../../../redux/actions/pendingAssignListAction'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import { setNotification } from '../../../../redux/actions/notificationAction'
import { assignToFranchise } from '../../../../core/services/franchiseServices'
import { getRole, PERMISSIONS, getCityID, getUserID } from '../../../../core/services/rbacServices'
import { getCredrMargin } from '../../../../core/utility'
import { connect } from 'react-redux'
import PendingFilter from './components/Filters'
import { getPendingInventoryReports } from '../../../../core/services/franchiseServices'
import isEqual from 'lodash/isEqual'
import SearchRegNumber from '../../../../shared/components/SearchRegNum'

class PendingAssignInventory extends Component {

  state = {
    bikeForm: false,
    data: null,
    filters: {},
    searchText: '',
    isClearFilter: false,
    showMultiButton: false,
    open: false,
    clear: true,
    closeAssignShowroom: true
  }

  assignBikeToStore = assignData => {
    this.setState({
      bikeForm: true,
      data: assignData
    })
  }

  closeBikeDialog = () => {
    this.setState({
      bikeForm: false,
      data: null
    })
  }

  changePage = (page) => {
    const { dispatch } = this.props
    const { filters } = this.state
    let payload = { page, acceptedStatus: "PENDING" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(getPendingAssignList(payload))
  }

  assignForm = (formData) => {
    const { dispatch, page } = this.props
    const { data } = this.state
    const { orderID, voucherPrice } = data
    const payload = {
      orderId: orderID,
      storeId: formData.storeId.storeId,
      assignedCfp: formData.cfp,
      assignedCrp: formData.crp,
      assigneeId: getUserID(),
      actualMargin: getCredrMargin(formData.cfp, voucherPrice),
      cityId: formData.cityId
    }
    dispatch(showLoader())
    assignToFranchise(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.closeBikeDialog()
          this.refreshData(page)
          dispatch(setNotification('success', 'Success', 'Bike Assigned to Showroom Successfully'))
        }
        else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
      })
    setTimeout(() => {
      dispatch(hideLoader())
    }, 4000)
  }

  applyFilter = (filters) => {
    if(filters.cityID){
      this.setState({ showMultiButton: true })
    }
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    let payload = { page: 1, acceptedStatus: "PENDING" }
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

  clearFilter = () => {
    const { filters } = this.state
    const { dispatch } = this.props
    this.setState({ showMultiButton: false, open: false })
    const payload = { page: 1, acceptedStatus: "PENDING" }
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

  applySearch = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    let payload = { page: 1, acceptedStatus: "PENDING" }
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

  searchHandler = registrationNumber => {
    const { dispatch } = this.props
    let payload = { page: 1, acceptedStatus: "PENDING" }
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

  refreshData = (pageNumber = 1) => {
    const { filters } = this.state
    const { dispatch } = this.props
    let payload = { page: pageNumber, acceptedStatus: "PENDING" }
    if (Object.keys(filters).length) {
      payload = { ...filters }
    }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    dispatch(getPendingAssignList(payload))
  }

  onSearchTypeHandler = searchText => {
    this.setState({ searchText })
  }

  exportData = () => {
    const { dispatch } = this.props
    dispatch(showLoader())
    const payload = {}
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    getPendingInventoryReports(payload)
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

  assignLotBikes = (ids) => {
    const { dispatch } = this.props
    const { filters } = this.state
      dispatch(showLoader())
      assignToFranchise(ids)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            this.setState({ open: false, showMultiButton: false, isClearFilter: true, closeAssignShowroom: false })
            dispatch(setNotification('success', 'Success', 'Bike Assigned to Showroom Successfully'))
            this.refreshData()
            this.clearFilter()
          } 
          else {
            this.setState({ open: false, showMultiButton: false })
            dispatch(setNotification('danger', 'Error', apiResponse.message))
          }
        })
        setTimeout(() => {
          dispatch(hideLoader())
        }, 400)
        this.setState({ isClearFilter: true })
  }

  checkBoxStatus = (status) => {
    this.setState({ open: status })
  }

  render() {
    const { bikeForm, data, searchText, isClearFilter, showMultiButton, filters, open, closeAssignShowroom } = this.state
    return (
      <Fragment>
        <div> <h3> Pending Inventory Details </h3> </div>
        <PendingFilter
          onApplyFilter={this.applyFilter}
          onClearFilter={this.clearFilter}
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
        <PendingData
          onAssignBikeToStore={this.assignBikeToStore}
          onPageChange={this.changePage}
          showMultiButton={showMultiButton}
          onAssignLotBikes={this.assignLotBikes}
          cityId={filters.cityID}
          onCheckBox={this.checkBoxStatus}
          open={open}
          closeAssignShowroom={closeAssignShowroom}
        />
        {
          bikeForm &&
          <AssignBikeDialog
            open={bikeForm}
            data={data}
            onClose={this.closeBikeDialog}
            onAssignBikeForm={this.assignForm}
          />
        }
      </Fragment>
    )
  }
}

export default connect(state => ({ page: state.pending.page }))(PendingAssignInventory)