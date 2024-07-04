import React, { Component, Fragment } from 'react'
import VehicleStatusData from './components/VehicleStatusDataTable'
import VehicleStatusFilter from './components/VehicleStatusFilter'
import RegistrationSearch from './components/RegistrationSearch'
import { connect } from 'react-redux'
import VehicleStatusHeader from './components/VehicleStatusHeader'
import { getVehicleData } from '../../../redux/actions/vehicleStatusAction'
import isEqual from 'lodash/isEqual'
import { exportToExel } from '../../../core/services/logisticServices'
import { listStoresFhdShd } from '../../../core/services/miscServices'
import { getRunnersForFilters } from '../../../core/services/logisticServices'
import { getCityID, getRole, getUserID } from '../../../core/services/rbacServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { isRegistrationNumber } from '../../../core/utility'
import {logisticCityAction} from '../../../redux/actions/logisticCityAction'

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
  outlet: null,
  outlets: [],
  searchText: ''
}

class VehicleStatus extends Component {

  state = initialState

  componentDidMount() {
    const { dispatch } = this.props
    if (getRole() === 'LOGISTICS_COORDINATOR') {
      getRunnersForFilters({ cityList: [getCityID()] })
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const runners = apiResponse.runnerList.map(runner => ({ label: runner.userName, value: runner.userId }))
            this.setState({ runners })
          }
        })
    }
    if(getRole() === 'LOGISTICS_STATE_HEAD'){
      const payload = {
        userId: getUserID()
      }
      dispatch(logisticCityAction(payload))
    }
  }

  get getInitialState() {
    return initialState
  }

  applyFilter = filters => {
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    if (!isEqual(prevFilters, filters)) {
      if (filters.searchKeyword) {
        const isRegistrationSearch = isRegistrationNumber(filters.searchKeyword.toUpperCase())
        if (isRegistrationSearch) {
          this.setState({ filters, status: 'ALL', isRegistrationSearch }, () => {
            window.scrollTo(0, 0)
            dispatch(getVehicleData({ ...filters, pageNum: 1, vehicleStatus: 'ALL' }))
          })
        } else {
          this.setState({ filters }, () => {
            window.scrollTo(0, 0)
            dispatch(getVehicleData({ ...filters, pageNum: 1, vehicleStatus: status }))
          })
        }
      } else {
        this.setState({ filters }, () => {
          window.scrollTo(0, 0)
          dispatch(getVehicleData({ ...filters, pageNum: 1, vehicleStatus: status }))
        })
      }
    }
  }

  applySearch = (filters) => {
    const { dispatch } = this.props
      const state = { filters, status: 'ALL' }
      if (filters.searchKeyword && isRegistrationNumber(filters.searchKeyword.toUpperCase())) {
        state.isRegistrationSearch = true
      }
      this.setState(state, () => {
        window.scrollTo(0, 0)
          dispatch(getVehicleData({ ...filters, pageNum: 1, vehicleStatus: 'ALL' }))
      })
  }



  changeStatus = (status) => {
    if (status) {
      this.setState({ status: status.toUpperCase(), isRegistrationSearch: false })
    }
  }

  handleCityChange = selectedCity => {
    this.setState({ city: selectedCity, outlets: [], runners: [] })
    listStoresFhdShd({
      storeTypeId: 3,
      cityId: selectedCity.value
    })
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const stores = apiResponse.storeListByCityId.map(store => ({
            value: store.storeId,
            label: store.storeName
          }))
          this.setState({ outlets: stores })
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

  updateStatus = (vehicleStatus) => {
    const { dispatch } = this.props
    const {filters} = this.state
    let payload = { pageNum: 1, vehicleStatus }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    this.setState({ status: vehicleStatus })
    window.scrollTo(0, 0)
    dispatch(getVehicleData(payload))
  }

  handlePageChange = pageNum => {
    const { dispatch } = this.props
    const { filters, status } = this.state
    let payload = { vehicleStatus: status }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters, pageNum }
    } else {
      payload = { ...payload, pageNum }
    }
    window.scrollTo(0, 0)
    dispatch(getVehicleData(payload))
  }

  clearFilters = () => {
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    this.setState({
      runner: null,
      runners: [],
      dateType: null,
      fromDate: null,
      toDate: null,
      city: null,
      conversionCategory: null,
      outlet: null,
      outlets: [],
    })
    if (Object.keys(prevFilters).length) {
      this.setState({ ...this.getInitialState, status: 'ALL' }, () => {
        window.scrollTo(0, 0)
        dispatch(getVehicleData({ vehicleStatus: 'ALL', pageNum: 1 }))
      })
    }
  }

  handleClearFilter = () => {
    this.setState({ searchText: '' })
    if (this.state.filters.searchKeyword) {
      this.clearFilters()
    }
  }

  handleSearch = (a,universalSearch) => {
    const { dispatch } = this.props
    if(universalSearch === true){
      if (this.state.searchText) {
        if(this.state.searchText.length >= 6){
          this.applySearch({ searchKeyword: this.state.searchText, isUniversalSearch: true})
        }
        else {
          dispatch(setNotification('danger', 'Please Enter Correct Register Number'))
        }
      }
    }
    else {
      this.applySearch({ searchKeyword: this.state.searchText})
    }
  }

  // exportFile = () => {
  //   const { dispatch } = this.props
  //   const { filters, status } = this.state
  //   dispatch(showLoader())
  //   let payload = { vehicleStatus: status }
  //   if (Object.keys(filters).length) {
  //     payload = { ...payload, ...filters }
  //   }
  //   exportToExel(payload)
  //     .then(apiResponse => {
  //       if (apiResponse.isValid) {
  //         const { downloadUrl } = apiResponse
  //         window.location.href = downloadUrl
  //       } else {
  //         dispatch(setNotification('danger', 'Error', apiResponse.message))
  //       }
  //       dispatch(hideLoader())
  //     })
  // }

  handleViewDetails = inventoryId => {
    const { history } = this.props
    history.push(`/logistics/view-bike-details/${inventoryId}`)
  }
  
  render() {
    const {
      status,
      isRegistrationSearch,
      city,
      outlet,
      outlets,
      toDate,
      fromDate,
      conversionCategory,
      dateType,
      runner,
      runners,
      searchText
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
          onConversionChange={category => this.setState({ conversionCategory: category })}
          onDateTypeChange={dateTypeValue => this.setState({ dateType: dateTypeValue })}
          onFromDateChange={fromDateVale => this.setState({ fromDate: fromDateVale })}
          onToDateChange={toDateValue => this.setState({ toDate: toDateValue })}
          onOutletChange={outletValue => this.setState({ outlet: outletValue })}
          onRunnerChange={runnerValue => this.setState({ runner: runnerValue })}
          outlets={outlets}
          outlet={outlet}
          toDate={toDate}
          status={status}
          fromDate={fromDate}
          conversionCategory={conversionCategory}
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
          // onExportFile={this.exportFile}
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

export default connect(state => ({ pageNum: state.vehicle.pageNum }))(VehicleStatus)