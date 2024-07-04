import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import DeliveryFilter from './components/WarehouseDeliveryFilter'
import DeliveryTable from './components/WarehouseDeliveryDataTable'
import DeliveryHeader from './components/WarehouseDeliveryHeader'
import ConfirmDelivery from './components/ConfirmDelivery'
import RegistrationSearch from './components/RegistrationSearch'
import DeliveryTAT from './components/DeliveryTat'
import isEqual from 'lodash/isEqual'
import { geWarehouseData } from '../../../redux/actions/franchiseWarehouseDeliveryAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { updateWarehouseDeliveryStatus, warehouseExportToExel, listCoordinators } from '../../../core/services/logisticServices'
import { getRole, getCityID } from '../../../core/services/rbacServices'
import { isRegistrationNumber } from '../../../core/utility'
import { listStores } from '../../../core/services/miscServices'
import { getFranchiseRunners } from '../../../core/services/franchiseLogisticsServices'

const initialState = {
  isModalOpen: false,
  filters: {},
  status: 'ALL',
  isRegistrationSearch: false,
  dateType: null,
  fromDate: null,
  toDate: null,
  city: null,
  coordinator: null,
  coordinators: [],
  searchText: '',
  inventory: null,
  showroom: null,
  showrooms: [],
  runner: null,
  runners: []
}

class FranchiseWarehouseDelivery extends Component {

  state = initialState

  componentDidMount() {
    if (getRole() === 'LOGISTICS_COORDINATOR') {
      listCoordinators(getCityID())
        .then(apiResponse => {
          if (apiResponse.isValid) {
            this.setState({ coordinators: apiResponse.coordinatorList.map(coordinator => ({ value: coordinator.userId, label: coordinator.name })) })
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
    } else {
      listCoordinators()
        .then(apiResponse => {
          if (apiResponse.isValid) {
            this.setState({ coordinators: apiResponse.coordinatorList.map(coordinator => ({ value: coordinator.userId, label: coordinator.name })) })
          }
        })
    }
    getFranchiseRunners()
    .then(apiResponse => {
      if (apiResponse.isValid) {
        this.setState({runners: apiResponse.runners.map(runner => ({value: runner.id, label: runner.name}))})
      } 
    })
  }

  applyFilter = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    if (!isEqual(prevFilters, filters)) {
      if (filters.searchKeyword) {
        const isRegistrationSearch = isRegistrationNumber(filters.searchKeyword.toUpperCase())
        if (isRegistrationSearch) {
          this.setState({ filters, status: 'ALL', isRegistrationSearch }, () => {
            window.scrollTo(0, 0)
            dispatch(geWarehouseData({ ...filters, pageNumber: 1, vehicleStatus: 'ALL', requestType: 'wareHouseDelivery', cityId: 1 }))
          })
        } else {
          this.setState({ filters }, () => {
            window.scrollTo(0, 0)
            dispatch(geWarehouseData({ ...filters, pageNumber: 1, vehicleStatus: this.state.status, requestType: 'wareHouseDelivery', cityId: 1 }))
          })
        }
      } else {
        this.setState({ filters }, () => {
          window.scrollTo(0, 0)
          dispatch(geWarehouseData({ ...filters, pageNumber: 1, vehicleStatus: this.state.status, requestType: 'wareHouseDelivery', cityId: 1 }))
        })
      }
    }
  }

  get getInitialState() {
    if (getRole() === 'LOGISTICS_COORDINATOR') {
      const { coordinators } = this.state
      return { ...initialState, coordinators }
    }
    return initialState
  }

  refreshData = () => {
    const { filters, status } = this.state
    const { dispatch, pageNumber } = this.props
    window.scrollTo(0, 0)
    dispatch(geWarehouseData({ ...filters, pageNumber, vehicleStatus: status, requestType: 'wareHouseDelivery', cityId: 1 }))
  }

  clearFilters = () => {
    this.setState({
      dateType: null,
      fromDate: null,
      toDate: null,
      city: null,
      coordinator: null,
      coordinators: [],
      showroom: null,
      showrooms: [],
      runner: null,
      runners: []
    })
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    if (Object.keys(prevFilters).length) {
      this.setState({ ...this.getInitialState, status }, () => {
        window.scrollTo(0, 0)
        dispatch(geWarehouseData({ pageNumber: 1, vehicleStatus: status, requestType: 'wareHouseDelivery', cityId: 1 }))
      })
    }
  }

  updateStatus = (vehicleStatus) => {
    const { dispatch } = this.props
    this.setState({ ...this.getInitialState, status: vehicleStatus })
    let payload = { pageNumber: 1, vehicleStatus, requestType: 'wareHouseDelivery', cityId: 1 }
    window.scrollTo(0, 0)
    dispatch(geWarehouseData(payload))
  }

  updateTabStatus = (status) => {
    this.setState({ status, isRegistrationSearch: false })
  }

  confirmDeliveryHandler = inventory => {
    this.setState({ inventory, isModalOpen: true })
  }

  closeForm = () => {
    this.setState({ inventory: null, isModalOpen: false })
  }

  handlePageChange = pageNumber => {
    const { dispatch } = this.props
    const { filters, status } = this.state
    let payload = { vehicleStatus: status }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters, pageNumber, requestType: 'wareHouseDelivery', cityId: 1 }
    } else {
      payload = { ...payload, pageNumber, requestType: 'wareHouseDelivery', cityId: 1 }
    }
    window.scrollTo(0, 0)
    dispatch(geWarehouseData(payload))
  }

  updateWarehouseDelivery = payload => {
    const { dispatch } = this.props
    dispatch(showLoader())
    updateWarehouseDeliveryStatus(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message))
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        this.closeForm()
        dispatch(hideLoader())
        this.refreshData()
      })
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
    const { dispatch, pageNumber } = this.props
    const { filters, status } = this.state
    dispatch(showLoader())
    let payload = { vehicleStatus: status, pageNumber }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    warehouseExportToExel(payload)
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

  handleCityChange = selectedCity => {
    this.setState({ city: selectedCity, coordinators: [], showrooms: [] })
    listCoordinators(selectedCity.value)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({
            coordinators: apiResponse.coordinatorList.map(coordinator => (
              { value: coordinator.userId, label: coordinator.name }
            ))
          })
        }
      })
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
  }

  render() {
    const {
      status,
      isRegistrationSearch,
      city,
      toDate,
      fromDate,
      dateType,
      isModalOpen,
      inventory,
      searchText,
      showroom,
      showrooms,
      runner,
      runners
    } = this.state
    return (
      <Fragment>
        <h3> Warehouse Delivery Details </h3>
        <DeliveryHeader
          status={status}
          onChangeStatus={this.updateStatus}
        />
        {status === 'DELIVERED' && <DeliveryTAT />}
        <DeliveryFilter
          onApplyFilters={this.applyFilter}
          onClearFilters={this.clearFilters}
          onCityChange={this.handleCityChange}
          onDateTypeChange={dateTypeValue => this.setState({ dateType: dateTypeValue })}
          onFromDateChange={fromDateValue => this.setState({ fromDate: fromDateValue })}
          onToDateChange={toDateValue => this.setState({ toDate: toDateValue })}
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
          onRunnerChange={runnerValue => this.setState({runner: runnerValue})}
        />
        <RegistrationSearch
          onInput={searchTextValue => this.setState({ searchText: searchTextValue })}
          onClearSearch={this.handleClearFilter}
          value={searchText}
          onSearch={this.handleSearch}
          onExportFile={this.exportFile}
        />
        <DeliveryTable
          status={status}
          isRegistrationSearch={isRegistrationSearch}
          onStatusChange={this.updateTabStatus}
          onPageChange={this.handlePageChange}
          onConfirmDelivery={this.confirmDeliveryHandler}
        />
        {
          isModalOpen &&
          <ConfirmDelivery
            open={isModalOpen}
            onClose={this.closeForm}
            inventory={inventory}
            onSubmitForm={this.updateWarehouseDelivery}
          />
        }
      </Fragment>
    )
  }
}

export default connect(state => ({ pageNumber: state.warehouse.pageNumber }))(FranchiseWarehouseDelivery)