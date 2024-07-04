import React, { Component, Fragment } from 'react'
import CompletePayment from './components/Table'
import { getFranchisePaymentList } from '../../../redux/actions/franchisePaymentListAction'
import { connect } from 'react-redux'
import { setNotification } from '../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { getImages, getApprovedPaymentReports } from '../../../core/services/franchiseServices'
import ViewUTRReceipt from '../../../shared/components/form/ViewUtrReceipt'
import SearchRegNumber from '../../../shared/components/SearchRegNum'
import { PERMISSIONS, getRole, getCityID } from '../../../core/services/rbacServices'
import isEqual from 'lodash/isEqual'
import PaymentCompleteFilter from './components/Filters'

class PaymentComplete extends Component {
  state = {
    viewUtrOpen: false,
    getBikeDocs: [],
    filters: {},
    searchText: '',
    isClearFilter: false
  }

  closeViewUtrForm = () => {
    this.setState({
      viewUtrOpen: false,
      initialValues: null
    })
  }

  handlePageChange = (page) => {
    const { dispatch } = this.props
    const { filters } = this.state
    let payload = { page, paymentstatus: 'APPROVED' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      window.scrollTo(0, 0)
      payload = { ...payload, ...filters }
    }
    dispatch(getFranchisePaymentList(payload))
  }

  handleViewUTR = id => {
    const { dispatch } = this.props
    dispatch(showLoader())
    getImages(id)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({
            getBikeDocs: apiResponse.uploadImages,
            viewUtrOpen: true
          })
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  clearFilter = () => {
    const { dispatch } = this.props
    const { filters } = this.state
    const payload = { page: 1, paymentstatus: 'APPROVED' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      this.setState({
        filters: {}
      })
      window.scrollTo(0, 0)
      dispatch(getFranchisePaymentList(payload))
    }
  }

  applyFilter = (filters) => {
    const { dispatch } = this.props
    let payload = { page: 1, paymentstatus: 'APPROVED' }
    if (PERMISSIONS.FRANCHISE.includes(getRole)) {
      payload.cityID = getCityID()
    }
    if (!isEqual(filters)) {
      this.setState({
        filters
      })
      window.scrollTo(0, 0)
      dispatch(getFranchisePaymentList({ ...payload, ...filters }))
    }
  }

  applySearch = (filters) => {
    const { dispatch } = this.props
    let payload = { page: 1, paymentstatus: 'APPROVED' }
    if (PERMISSIONS.FRANCHISE.includes(getRole)) {
      payload.cityID = getCityID()
    }
    if (!isEqual(filters)) {
      this.setState({
        filters
      })
      window.scrollTo(0, 0)
      dispatch(getFranchisePaymentList({ ...filters, ...payload }))
    }
  }

  searchHandler = registrationNumber => {
    const { dispatch } = this.props
    let payload = { page: 1, paymentstatus: 'APPROVED' }
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
    let payload = { page: 1, paymentstatus: 'APPROVED' }
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
    getApprovedPaymentReports(payload)
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
    const { viewUtrOpen, getBikeDocs, searchText, isClearFilter } = this.state
    return (
      <Fragment>
        <h3> Payment Completed Details </h3>
        <PaymentCompleteFilter
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
        <CompletePayment
          onPageChange={this.handlePageChange}
          awaitingViewUtr={this.handleViewUTR}
        />
        {
          viewUtrOpen &&
          <ViewUTRReceipt
            getBikeDocs={getBikeDocs}
            open={viewUtrOpen}
            onClose={this.closeViewUtrForm}
          />
        }
      </Fragment>
    )
  }
}
export default connect(state => ({ page: state.franchisePaymentList.page }))(PaymentComplete);
