import React, { Component, Fragment } from 'react'
import VehicleStatusData from './components/VehicleStatusDataTable'
import VehicleStatusFilter from './components/VehicleStatusFilter'
import RegistrationSearch from './components/RegistrationSearch'
import { connect } from 'react-redux'
import VehicleStatusHeader from './components/VehicleStatusHeader'
import { getVehicleStatusData } from '../../../redux/actions/franchiseVehicleStatusAction'
import isEqual from 'lodash/isEqual'
import { exportToExel } from '../../../core/services/logisticServices'
import { getRunnersForFilters } from '../../../core/services/logisticServices'
import { getCityID, getRole } from '../../../core/services/rbacServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { isRegistrationNumber } from '../../../core/utility'
import { listStores } from '../../../core/services/miscServices'

const initialState = {
  filters: {},
  status: 'ALL',
  isRegistrationSearch: false,
  runner: null,
  runners: [],
  dateType: null,
  fromDate: null,
  toDate: null,
  city: null,
  conversionCategory: null,
  searchText: '',
  showroom: null,
  showrooms: [],
}

class FranchiseVehicleStatus extends Component {

  state = initialState

  componentDidMount() {
    if (getRole() === 'LOGISTICS_COORDINATOR') {
      getRunnersForFilters({ cityList: [getCityID()] })
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const runners = apiResponse.runnerList.map(runner => ({ label: runner.userName, value: runner.userId }))
            this.setState({ runners })
          }
        })
        listStores(getCityID())
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const stores = apiResponse.storeListByCityId.map(store => ({
              value: store.storeId,
              label: store.storeName
            }))
            this.setState({showrooms: stores})
          }
        })
    } 
  }

  get getInitialState() {
    if (getRole() === 'LOGISTICS_COORDINATOR') {
      const { outlets, runners } = this.state
      return { ...initialState, outlets, runners }
    }
    return initialState
  }

  applyFilter = filters => {
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    if (!isEqual(prevFilters, filters)) {
      if (filters.registrationNumber) {
        const isRegistrationSearch = isRegistrationNumber(filters.registrationNumber.toUpperCase())
        if (isRegistrationSearch) {
          this.setState({ filters, status: 'ALL', isRegistrationSearch }, () => {
            window.scrollTo(0, 0)
            dispatch(getVehicleStatusData({ ...filters, pageNumber: 1, vehicleStatus: 'ALL' }))
          })
        } else {
          this.setState({ filters }, () => {
            window.scrollTo(0, 0)
            dispatch(getVehicleStatusData({ ...filters, pageNumber: 1, vehicleStatus: status }))
          })
        }
      } else {
        this.setState({ filters }, () => {
          window.scrollTo(0, 0)
          dispatch(getVehicleStatusData({ ...filters, pageNumber: 1, vehicleStatus: status }))
        })
      }
    }
  }

  changeStatus = (status) => {
    if (status) {
      this.setState({ status: status.toUpperCase(), isRegistrationSearch: false })
    }
  }

  handleCityChange = selectedCity => {
    this.setState({ city: selectedCity, outlets: [], runners: [] })
    listStores(selectedCity.value)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const stores = apiResponse.storeListByCityId.map(store => ({
              value: store.storeId,
              label: store.storeName
            }))
            this.setState({showrooms: stores})
          }
        })
    getRunnersForFilters({ cityList: [selectedCity.value] })
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const runners = apiResponse.runnerList.map(runner => ({ label: runner.userName, value: runner.userId }))
          this.setState({ runners })
        }
      })
  }

  updateStatus = (status) => {
    const { filters } = this.state
    const { dispatch } = this.props
    let payload = { vehicleStatus: status, pageNumber: 1 }
    this.setState({ status })
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(getVehicleStatusData(payload))
  }

  handlePageChange = pageNumber => {
    const { dispatch } = this.props
    const { filters, status } = this.state
    let payload = { vehicleStatus: status }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters, pageNumber }
    } else {
      payload = { ...payload, pageNumber }
    }
    window.scrollTo(0, 0)
    dispatch(getVehicleStatusData(payload))
  }

  clearFilters = () => {
    this.setState({
      dateType: null,
      fromDate: null,
      toDate: null,
      city:null,
      conversionCategory: null,
      showroom: null,
      showrooms: []
    })
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    if (Object.keys(prevFilters).length) {
      this.setState({ ...this.getInitialState, status }, () => {
        window.scrollTo(0, 0)
        dispatch(getVehicleStatusData({ vehicleStatus: 'ALL', pageNumber: 1 }))
      })
    }
  }

  handleClearFilter = () => {
    this.setState({ searchText: '' })
    if (this.state.filters.registrationNumber) {
      this.clearFilters()
    }
  }

  handleSearch = () => {
    if (this.state.searchText) {
      this.applyFilter({ registrationNumber: this.state.searchText })
    }
  }

  exportFile = () => {
    const { dispatch, pageNum } = this.props
    const { filters, status } = this.state
    dispatch(showLoader())
    let payload = { vehicleStatus: status, pageNum }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    exportToExel(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { downloadUrl } = apiResponse
          window.location.href = downloadUrl
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  handleViewDetails = inventoryId => {
    const { history } = this.props
    history.push(`/franchise-logistics/bike-details/${inventoryId}`)
  }

  render() {
    const {
      status,
      isRegistrationSearch,
      city,
      toDate,
      fromDate,
      dateType,
      runner,
      runners,
      searchText,
      showroom,
      showrooms
    } = this.state
    return (
      <Fragment>
        <h3> Vehicle Status Details </h3>
        <VehicleStatusHeader
          status={status}
          onChangeStatus={this.updateStatus}
        />
        <VehicleStatusFilter
          onApplyFilters={this.applyFilter}
          onClearFilters={this.clearFilters}
          onCityChange={this.handleCityChange}
          onDateTypeChange={dateTypeValue => this.setState({ dateType: dateTypeValue })}
          onFromDateChange={fromDateVale => this.setState({ fromDate: fromDateVale })}
          onToDateChange={toDateValue => this.setState({ toDate: toDateValue })}
          onRunnerChange={runnerValue => this.setState({ runner: runnerValue })}
          onShowroomChange={showroomValue => this.setState({ showroom: showroomValue })}
          showrooms={showrooms}
          showroom={showroom}
          toDate={toDate}
          status={status}
          fromDate={fromDate}
          dateType={dateType}
          city={city}
          runner={runner}
          runners={runners}
        />
        <RegistrationSearch
          onInput={searchTextValue => this.setState({ searchText: searchTextValue })}
          onClearSearch={this.handleClearFilter}
          value={searchText}
          onSearch={this.handleSearch}
          onExportFile={this.exportFile}
        />
        <VehicleStatusData
          isRegistrationSearch={isRegistrationSearch}
          onStatusChange={this.changeStatus}
          status={status}
          onPageChange={this.handlePageChange}
          onViewDetails={this.handleViewDetails}
        />
      </Fragment>
    )
  }
}

export default connect(state => ({ pageNum: state.vehicleStatus.pageNumber }))(FranchiseVehicleStatus)