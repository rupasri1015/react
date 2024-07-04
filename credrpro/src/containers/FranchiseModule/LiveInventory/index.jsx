import React, { Component, Fragment } from 'react'
import { liveInventoryList } from '../../../redux/actions/franchiseOpsLiveInventoryAction'
import { getRole, PERMISSIONS, getCityID } from '../../../core/services/rbacServices'
import { getLiveInventoryReports } from '../../../core/services/franchiseServices'
import { connect } from 'react-redux'
import { setNotification } from '../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import PaymentFilter from '../../../shared/components/FranchisePaymentsFilter'
import LiveInventory from './components/Table'
import isEqual from 'lodash/isEqual'
import SearchRegNumber from '../../../shared/components/SearchRegNum'

class FranchiseLiveInventory extends Component {
  state = {
    filters: {},
    searchText: '',
    isClearFilter: false
  }

  changePage = (page) => {
    const { dispatch } = this.props
    const { filters } = this.state
    let payload = { page, deliveryStatus: "DELIVERED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID() 
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(liveInventoryList(payload))
  }

  clearFilter = () => {
    const { dispatch } = this.props
    const { filters } = this.state
    const payload = { page: 1, deliveryStatus: "DELIVERED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      window.scrollTo(0, 0)
      this.setState({
        ...filters, ...payload
      });
      dispatch(liveInventoryList(payload))
    }
  }

  applyFilter = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    let payload = { page: 1, deliveryStatus: "DELIVERED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (!isEqual(prevFilters,
    )) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        dispatch(liveInventoryList({ ...filters, ...payload }))
      })
    }
  }

  applySearch = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    let payload = { page: 1, deliveryStatus: "DELIVERED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (!isEqual(prevFilters,
    )) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        dispatch(liveInventoryList({ ...filters, ...payload }))
      })
    }
  }

  searchHandler = registrationNumber => {
    const { dispatch } = this.props
    let payload = { page: 1, deliveryStatus: "DELIVERED" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (registrationNumber) {
      this.setState({ isClearFilter: true, filters: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(liveInventoryList({ registrationNumber, ...payload }))
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
    const { page, dispatch } = this.props
    let payload = { page: 1, deliveryStatus: "DELIVERED" }
    if (Object.keys(filters).length) {
      payload = { ...filters, page }
    }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    window.scrollTo(0, 0)
    dispatch(liveInventoryList(payload))
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
    getLiveInventoryReports(payload)
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

  render() {
    const { searchText, isClearFilter } = this.state
    return (
      <Fragment>
        <div> <h3> Live Inventory Details </h3> </div>
        <PaymentFilter
          onClearFilter={this.clearFilter}
          onApplyFilter={this.applyFilter}
          onApplySearch={this.applySearch}
          setClearFilter={() => this.setState({ isClearFilter: false })}
          isClearFilter={isClearFilter}
        />
        <SearchRegNumber
          onSearch={this.searchHandler}
          searchText={searchText}
          onClearSearch={this.clearSearch}
          onSearchType={this.onSearchTypeHandler}
          onExport={this.exportData}
          onShowExport={true}
        />
        <LiveInventory
          onPageChange={this.changePage}
        />
      </Fragment>
    )
  }
}

export default connect(state => ({ page: state.pending.page }))(FranchiseLiveInventory)