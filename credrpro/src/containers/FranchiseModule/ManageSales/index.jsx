import React, { Component, Fragment } from 'react'
import SalesTable from './components/Table'
import SalesFilter from './components/Filters'
import { getManageSalesReports } from '../../../core/services/franchiseServices'
import { getFranchiseSaleList } from '../../../redux/actions/franchiseSalesAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { getRole, PERMISSIONS, getCityID } from '../../../core/services/rbacServices'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import SearchByKeyword from './components/SearchData'

class FranchiseSales extends Component {

  state = {
    filters: {},
    searchValues: null,
    headerValue: 'Sale Date'
  }

  getTableHeader = () => {
    const { headerValue } = this.state
    const tableHeader = [
      { id: 'cityName', label: 'City' },
      { id: 'storeName', label: 'Showroom' },
      { id: 'regnum', label: 'Registration Number' },
      { id: 'mmvYear', label: 'MMV - Y' },
      { id: 'name', label: 'Name' },
      { id: 'rsType', label: 'Referral Source' },
      { id: 'number', label: 'Mobile Number' },
      { id: 'status', label: 'Sale Status' },
      { id: 'bikeprice', label: 'CSP' },
      { id: 'margin', label: 'Showroom Margin' },
    ]
    if (headerValue === 'Sale Date')
      tableHeader.unshift({ id: 'saleDate', label: 'Sale Date', sort: 'sort' })
    else
      tableHeader.unshift({ id: 'leadCreatedDate', label: 'Lead Created Date', sort: 'sort' })
    return tableHeader
  }

  changePage = (page) => {
    const { dispatch, orderType } = this.props
    const { filters, searchValues } = this.state
    let payload = { pageNum: page, orderType: orderType }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    if (Object.keys(filters).length) {
      const { pageNum, ...rest } = filters
      payload = { ...rest, ...filters }
    }
    if (searchValues) {
      payload = { ...payload, ...searchValues }
    }
    window.scrollTo(0, 0)
    dispatch(getFranchiseSaleList(payload))
  }

  applyFilter = (filters) => {
    const { saleParameter } = filters
    if (saleParameter) {
      this.setState({
        headerValue: saleParameter
      })
    }
    const { filters: prevFilters } = this.state
    const { dispatch, orderType } = this.props
    if (!isEqual(prevFilters, filters)) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        const payload = { ...filters, pageNum: 1, orderType: orderType }
        if (PERMISSIONS.FRANCHISE.includes(getRole())) {
          payload.cityId = getCityID()
        }
        dispatch(getFranchiseSaleList(payload))
      })
    }
  }

  clearFilter = () => {
    this.setState({
      headerValue: 'Sale Date'
    })
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    if (Object.keys(prevFilters).length) {
      this.setState({ filters: {} }, () => {
        window.scrollTo(0, 0)
        const payload = { orderType: 'desc', pageNum: 1 }
        if (PERMISSIONS.FRANCHISE.includes(getRole())) {
          payload.cityId = getCityID()
        }
        dispatch(getFranchiseSaleList(payload))
      })
    }
  }

  handleSorting = () => {
    const { filters } = this.state
    const { orderType, dispatch } = this.props
    let payload = { pageNum: 1, orderType: orderType === 'asc' ? 'desc' : 'asc' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(getFranchiseSaleList(payload))
  }

  applySeach = (search) => {
    this.setState({
      searchValues: search
    })
    const { dispatch, orderType } = this.props
    const { filters } = this.state
    let payload = { ...search, pageNum: 1, orderType: orderType }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    dispatch(getFranchiseSaleList(payload))
  }

  getInitialData = (type) => {
    this.setState({
      headerValue: 'Sale Date'
    })
    const { dispatch } = this.props
    const payload = { pageNum: 1, orderType: "desc" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    if (type) {
      payload.paymentParameter = type
    }
    window.scrollTo(0, 0)
    dispatch(getFranchiseSaleList(payload))
  }

  clearSearch = () => {
    const { name, regNumber, mobileNo, ...rest } = this.state.filters
    this.applyFilter({ ...rest })
    const { dispatch } = this.props
    const payload = { pageNum: 1, orderType: "desc" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    dispatch(getFranchiseSaleList(payload))
  }

  exportData = () => {
    const { dispatch } = this.props
    dispatch(showLoader())
    const payload = {}
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    getManageSalesReports(payload)
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
    const { orderType } = this.props
    return (
      <Fragment>
        <div> <h3> Showroom Sale Details </h3> </div>
        <SalesFilter
          onApplyFilter={this.applyFilter}
          onClearFilter={this.clearFilter}
          onDeleteChip={this.getInitialData}
        />
        <SearchByKeyword
          onApplySearch={this.applySeach}
          onClearSearch={this.clearSearch}
          onExportData={this.exportData}
        />
        <SalesTable
          onPageChange={this.changePage}
          handleSorting={this.handleSorting}
          direction={orderType}
          tableHeader={this.getTableHeader()}
        />
      </Fragment>
    )
  }
}
const mapStateToProps = (state) => ({
  orderType: state.franchiseSales.orderType
})
export default connect(mapStateToProps)(FranchiseSales)
