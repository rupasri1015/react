import React, { Component, Fragment } from 'react'
import DocumentationFilter from './component/Filters'
import SearchRegNumber from '../../../shared/components/SearchRegNum'
import DocumentationTable from './component/Table'
import { getCityID, PERMISSIONS, getRole, getUserID } from '../../../core/services/rbacServices'
import isEqual from 'lodash/isEqual'
import { getDocumentationList } from '../../../redux/actions/documentationListAction'
import { connect } from 'react-redux'
import { hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { updateAlternateMobileNumber } from '../../../core/services/postSalesServices'
import DetailsDialog from './component/Forms/DetailsDialog'
import ChangeMobileNumber from './component/Forms/MobileDialog'

class Documentation extends Component {

  state = {
    filters: {},
    searchText: '',
    openDetails: false,
    openMobile: false,
    data: null,
    isClearFilter: false
  }

  changePage = (page) => {
    const { dispatch, orderBy } = this.props
    const { filters } = this.state
    let payload = { page: page, orderBy: orderBy }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(getDocumentationList(payload))
  }

  applyFilter = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch, orderBy } = this.props
    let payload = { page: 1, orderBy: orderBy }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    if (!isEqual(prevFilters,
    )) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        dispatch(getDocumentationList({ ...filters, ...payload }))
      })
    }
  }

  refreshData = () => {
    const { filters } = this.state
    const { page, dispatch } = this.props
    let payload = { page: 1 }
    if (Object.keys(filters).length) {
      payload = { ...filters, page }
    }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    dispatch(getDocumentationList(payload))
  }

  handleSorting = () => {
    const { filters } = this.state
    const { orderBy } = this.props
    let payload = { page: 1, orderBy: orderBy === 'asc' ? 'desc' : 'asc' }
    const { dispatch } = this.props
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(getDocumentationList(payload))
  }

  clearFilter = () => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    let payload = { orderBy: 'desc', page: 1 }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    if (Object.keys(prevFilters).length) {
      this.setState({ filters: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(getDocumentationList(payload))
      })
    }
  }

  searchHandler = vehicalNumber => {
    const { dispatch } = this.props
    let payload = { page: 1 }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    if (vehicalNumber) {
      this.setState({ isClearFilter: true, filters: {} }, () => {
        dispatch(getDocumentationList({ vehicalNumber, ...payload }))
      })
    }
  }
  onSearchTypeHandler = searchText => {
    this.setState({ searchText })
  }

  updateMobileNumber = (leadDetails) => {
    let payload = { ...leadDetails }
    payload.updatedBy = getUserID()
    const { dispatch } = this.props
    updateAlternateMobileNumber(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message))
          this.setState({
            openMobile: false,
            data: null
          })
          this.refreshData()
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  showDetails = (leadDetails) => {
    this.setState({
      openDetails: true,
      data: leadDetails
    })
  }

  changeMobileNumber = (leadDetails) => {
    this.setState({
      openMobile: true,
      data: leadDetails
    })
  }

  closeDetailsDialog = () => {
    this.setState({
      openDetails: false,
      data: null
    })
  }

  closeMobileDialog = () => {
    this.setState({
      openMobile: false
    })
  }

  clearSearch = () => {
    this.setState({
      searchText: ''
    })
    this.refreshData()
  }

  render() {
    const { searchText, openDetails, openMobile, data, isClearFilter } = this.state
    const { orderBy } = this.props
    return (
      <Fragment>
        <h3>Documentation Details</h3>
        <DocumentationFilter
          onApplyFilter={this.applyFilter}
          onClearFilter={this.clearFilter}
          isClearFilter={isClearFilter}
          setClearFilter={() => this.setState({ isClearFilter: false })}
        />
        <SearchRegNumber
          onSearch={this.searchHandler}
          searchText={searchText}
          onClearSearch={this.clearSearch}
          onSearchType={this.onSearchTypeHandler}
          onShowExport={false}
        />
        <DocumentationTable
          onPageChange={this.changePage}
          handleSorting={this.handleSorting}
          direction={orderBy}
          updateAlternateNumber={this.updateAlternateNumber}
          onShowDetails={this.showDetails}
          onChangeMobile={this.changeMobileNumber}
        />
        {
          openDetails &&
          <DetailsDialog
            open={openDetails}
            data={data}
            onClose={this.closeDetailsDialog}
          />
        }

        {
          openMobile &&
          <ChangeMobileNumber
            open={openMobile}
            data={data}
            onClose={this.closeMobileDialog}
            onUpdateMobileNumber={this.updateMobileNumber}
          />
        }
      </Fragment>
    )
  }
}
const mapStateToProps = (state) => ({
  orderBy: state.documentationList.orderBy
})
export default connect(mapStateToProps)(Documentation)