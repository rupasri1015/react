import React, { Component, Fragment } from 'react'
import LeadsTable from './components/Table'
import LeadsFilter from './components/Filters'
import { getStoreLeads } from '../../../redux/actions/manageLeadsAction'
import { getRole, PERMISSIONS, getCityID } from '../../../core/services/rbacServices'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import SearchByKeyword from './components/SearchData'
import { getFranchiseStores } from '../../../core/services/franchiseServices'
import { setNotification } from '../../../redux/actions/notificationAction'


class ManageLeads extends Component {

  state = {
    filters: {},
    storeList: [],
    searchValues: null
  }

  componentDidMount = () => {
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      this.getFranchiseStoresByCity(getCityID())
    }
  }

  changePage = (page) => {
    const { dispatch, orderType } = this.props
    const { filters, searchValues } = this.state
    let payload = { pageNum: page, orderType: orderType }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      const { pageNum, ...rest } = filters
      payload = { ...payload, ...rest }
    }
    if (searchValues) {
      payload = { ...payload, ...searchValues }
    }
    window.scrollTo(0, 0)
    dispatch(getStoreLeads(payload))
  }

  applyFilter = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch, orderType } = this.props
    if (!isEqual(prevFilters, filters)) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        const payload = { ...filters, pageNum: 1, orderType: orderType }
        if (PERMISSIONS.FRANCHISE.includes(getRole())) {
          payload.cityID = getCityID()
        }
        dispatch(getStoreLeads(payload))
      })
    }
  }

  clearFilter = () => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    if (Object.keys(prevFilters).length) {
      this.setState({ filters: {} }, () => {
        const payload = { pageNum: 1, orderType: 'desc' }
        window.scrollTo(0, 0)
        if (PERMISSIONS.FRANCHISE.includes(getRole())) {
          payload.cityID = getCityID()
        }
        dispatch(getStoreLeads(payload))
      })
    }
  }

  getFranchiseStoresByCity = (id) => {
    const { dispatch } = this.props
    getFranchiseStores(id)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({ storeList: apiResponse.storesbyCityId }, () => {
          })
        } else {
          const { message } = apiResponse
          dispatch(setNotification('danger', 'No Records', message))
        }
      })
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
      payload.cityID = getCityID()
    }
    dispatch(getStoreLeads(payload))
  }

  handleSorting = () => {
    const { filters } = this.state
    const { orderType, dispatch } = this.props
    let payload = { pageNum: 1, orderType: orderType === 'asc' ? 'desc' : 'asc' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(getStoreLeads(payload))
  }

  clearSearch = () => {
    const { name, regNum, mobileNumber, otp, ...rest } = this.state.filters
    this.applyFilter({ ...rest })
    const payload = { pageNum: 1, orderType: 'desc' }
    const { dispatch } = this.props
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    dispatch(getStoreLeads(payload))
  }

  getInitialData = () => {
    const { dispatch } = this.props
    const payload = { pageNum: 1, orderType: "desc" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    dispatch(getStoreLeads(payload))
  }

  render() {
    const { orderType } = this.props
    return (
      <Fragment>
        <div> <h3> Showroom Lead Details </h3> </div>
        <LeadsFilter
          onApplyFilter={this.applyFilter}
          onClearFilter={this.clearFilter}
          onDeleteChip={this.getInitialData}
        />
        <SearchByKeyword
          onApplySearch={this.applySeach}
          onClearSearch={this.clearSearch}
        />
        <LeadsTable
          onPageChange={this.changePage}
          handleSorting={this.handleSorting}
          direction={orderType}
        />
      </Fragment>
    )
  }
}
const mapStateToProps = (state) => ({
  orderType: state.manageLeads.orderType
})
export default connect(mapStateToProps)(ManageLeads)
