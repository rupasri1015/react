import React, { Component, Fragment } from 'react'
import PendingPayment from './components/Table'
import { getFranchisePaymentList } from '../../../redux/actions/franchisePaymentListAction'
import { connect } from 'react-redux'
import { getPendingPaymentReports } from '../../../core/services/franchiseServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import PendingFilter from '../../../shared/components/FranchisePaymentsFilter'
import { getRole, PERMISSIONS, getCityID } from '../../../core/services/rbacServices'
import isEqual from 'lodash/isEqual'
import SearchRegNumber from '../../../shared/components/SearchRegNum'

class ViewPaymentPending extends Component {
  state = {
    filters: {},
    searchText: '',
    isClearFilter: false
  }

  changePage = (page) => {
    const { dispatch } = this.props
    const { filters } = this.state
    let payload = { page, paymentstatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(getFranchisePaymentList(payload))
  }

  clearFilter = () => {
    const { dispatch } = this.props
    const { filters: prevFilters } = this.state
    const payload = { page: 1, paymentstatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(prevFilters).length) {
      window.scrollTo(0, 0)
      this.setState({
        filters: {}
      });
      dispatch(getFranchisePaymentList(payload))
    }
  }

  applyFilter = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    let payload = { page: 1, paymentstatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (!isEqual(prevFilters,
    )) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        dispatch(getFranchisePaymentList({ ...filters, ...payload }))
      })
    }
  }

  applySearch = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    let payload = { page: 1, paymentstatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (!isEqual(prevFilters,
    )) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        dispatch(getFranchisePaymentList({ ...filters, ...payload }))
      })
    }
  }

  searchHandler = registrationNumber => {
    const { dispatch } = this.props
    let payload = { page: 1, paymentstatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (registrationNumber) {
      this.setState({ isClearFilter: true, filters: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(getFranchisePaymentList({ registrationNumber, ...payload }))
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
    let payload = { page: 1, paymentstatus: 'PENDING' }
    if (Object.keys(filters).length) {
      payload = { ...filters, page }
    }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    window.scrollTo(0, 0)
    dispatch(getFranchisePaymentList(payload))
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
    getPendingPaymentReports(payload)
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
        <h3> Pending Payment Details </h3>
        <PendingFilter
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
        <PendingPayment
          onPageChange={this.handlePageChange}
        />
      </Fragment>
    )
  }
}
export default connect(state => ({ page: state.franchisePaymentList.page }))(ViewPaymentPending);