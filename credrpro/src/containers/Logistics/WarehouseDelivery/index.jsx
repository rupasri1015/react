import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import DeliveryFilter from './components/WarehouseDeliveryFilter'
import DeliveryTable from './components/WarehouseDeliveryDataTable'
import DeliveryHeader from './components/WarehouseDeliveryHeader'
import ConfirmDelivery from './components/ConfirmDelivery'
import RegistrationSearch from './components/RegistrationSearch'
import DeliveryTAT from './components/DeliveryTat'
import isEqual from 'lodash/isEqual'
import { getWarehouseData } from '../../../redux/actions/warehouseDeliveryAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { updateWarehouseDeliveryStatus, warehouseExportToExel, listCoordinators } from '../../../core/services/logisticServices'
import { getRole, getCityID, getUserID } from '../../../core/services/rbacServices'
import { isRegistrationNumber } from '../../../core/utility'
import { getStateCities } from '../../../core/services/logisticServices'
import {logisticCityAction} from '../../../redux/actions/logisticCityAction'

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
  conversionCategory: null,
  searchText: '',
  inventory: null
}

class WarehouseDelivery extends Component {

  state = initialState

  componentDidMount() {
    const { dispatch } = this.props
    if (getRole() === 'LOGISTICS_COORDINATOR') {
      listCoordinators(getCityID())
        .then(apiResponse => {
          if (apiResponse.isValid) {
            this.setState({ coordinators: apiResponse.coordinatorList.map(coordinator => ({ value: coordinator.userId, label: coordinator.name })) })
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
    const payload = {
      userId: getUserID()
    }
    if (getRole() === 'LOGISTICS_STATE_HEAD') {
      dispatch(logisticCityAction(payload))
      // getStateCities(payload)
      //   .then(apiResponse => {
      //     if (apiResponse.isValid) {
      //       this.setState({ cities: apiResponse.cityList.map(city => ({ value: city.cityId, label: city.cityName })) })
      //     }
      //   })
    }
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
            dispatch(getWarehouseData({ ...filters, pageNum: 1, vehicleStatus: 'ALL' }))
          })
        } else {
          this.setState({ filters }, () => {
            window.scrollTo(0, 0)
            dispatch(getWarehouseData({ ...filters, pageNum: 1, vehicleStatus: this.state.status }))
          })
        }
      } else {
        this.setState({ filters }, () => {
          window.scrollTo(0, 0)
          dispatch(getWarehouseData({ ...filters, pageNum: 1, vehicleStatus: this.state.status }))
        })
      }
    }
  }

  get getInitialState() {
    const { coordinators } = this.state
    return { ...initialState, coordinators }
  }

  refreshData = () => {
    const { filters, status } = this.state
    const { dispatch, pageNumber } = this.props
    window.scrollTo(0, 0)
    dispatch(getWarehouseData({ ...filters, pageNumber, vehicleStatus: status }))
  }

  clearFilters = () => {
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    if (Object.keys(prevFilters).length) {
      this.setState({ ...this.getInitialState, status: 'ALL' }, () => {
        window.scrollTo(0, 0)
        dispatch(getWarehouseData({ pageNumber: 1, vehicleStatus: status }))
      })
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
          dispatch(getWarehouseData({ ...filters, pageNum: 1, vehicleStatus: 'ALL' }))
      })
  }

  updateStatus = (vehicleStatus) => {
    const { dispatch } = this.props
    const {filters} = this.state
    let payload = { pageNum: 1, vehicleStatus }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    //this.setState({ ...this.getInitialState, status: vehicleStatus })
    this.setState({ status: vehicleStatus })
    window.scrollTo(0, 0)
    dispatch(getWarehouseData(payload))
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
    dispatch(getWarehouseData(payload))
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
  //   const { dispatch, pageNum } = this.props
  //   const { filters, status } = this.state
  //   dispatch(showLoader())
  //   let payload = { vehicleStatus: status, pageNum }
  //   if (Object.keys(filters).length) {
  //     payload = { ...payload, ...filters }
  //   }
  //   warehouseExportToExel(payload)
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

  handleCityChange = selectedCity => {
    this.setState({ city: selectedCity, coordinators: [] })
    listCoordinators(selectedCity.value)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({
            coordinators: apiResponse.coordinatorList.map(coordinator => ({ value: coordinator.userId, label: coordinator.name }))
          })
        }
      })
  }

  handleViewDetails = inventoryId => {
    const { history } = this.props
    history.push(`/logistics/view-bike-details/${inventoryId}`)
  }

  render() {
    const {
      status,
      isRegistrationSearch,
      city,
      toDate,
      fromDate,
      conversionCategory,
      dateType,
      isModalOpen,
      inventory,
      searchText,
      coordinators,
      coordinator,
      cities
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
          onConversionChange={category => this.setState({ conversionCategory: category })}
          onDateTypeChange={dateTypeValue => this.setState({ dateType: dateTypeValue })}
          onFromDateChange={fromDateValue => this.setState({ fromDate: fromDateValue })}
          onToDateChange={toDateValue => this.setState({ toDate: toDateValue })}
          onCoordinatorChange={coordinatorValue => this.setState({ coordinator: coordinatorValue })}
          toDate={toDate}
          status={status}
          coordinator={coordinator}
          coordinators={coordinators}
          fromDate={fromDate}
          conversionCategory={conversionCategory}
          dateType={dateType}
          city={city}
          //cities={cities}
        />
        <RegistrationSearch
          onInput={searchTextValue => this.setState({ searchText: searchTextValue })}
          onClearSearch={this.handleClearFilter}
          value={searchText}
          onSearch={this.handleSearch}
          // onExportFile={this.exportFile}
        />
        <DeliveryTable
          status={status}
          isRegistrationSearch={isRegistrationSearch}
          onStatusChange={this.updateTabStatus}
          onPageChange={this.handlePageChange}
          onConfirmDelivery={this.confirmDeliveryHandler}
          onViewDetails={this.handleViewDetails}
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

export default connect(state => ({ pageNumber: state.warehouse.pageNum }))(WarehouseDelivery)