import React, { Component } from 'react'
import { PERMISSIONS, getRole, getCityID } from '../../../../../core/services/rbacServices'
import CityDropDown from '../../../../../shared/components/form/CityDropDown'
import DatePicker from '../../../../../shared/components/form/DatePicker'
import { getDatePayload } from '../../../../../core/utility'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import DropDown from '../../../../../shared/components/form/DropDown'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getStoresList } from '../../../../../redux/actions/storeListAction'
import Chip from '@material-ui/core/Chip'
import { Button } from 'reactstrap'
import { getDate } from '../../../../../core/utility'

const initialState = {
  fromDate: null,
  toDate: null,
  dateType: null,
  city: null,
  store: null,
  paymentType: null,
  showChip: false,
  showCity: false,
  showStore: false,
  showDates: false,
  showPayment: false,
  valid: false
}

class SaleFilter extends Component {

  state = initialState

  componentDidMount() {
    const { dispatch } = this.props
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      dispatch(getStoresList(getCityID()))
    }
  }

  applyFilter = () => {
    this.setState({
      valid: true
    })
    const { dispatch, onApplyFilter } = this.props
    const { fromDate, toDate, dateType, paymentType, city, store } = this.state
    if (dateType && fromDate && toDate) {
      this.setState({
        showDates: true,
        showChip: true
      })
    }
    const payload = {}
    let isValid = true
    if (paymentType) {
      payload.paymentParameter = paymentType.value
    }
    if (city && city.value) {
      payload.cityId = city.value
    }
    if (store && store.value) {
      payload.storeId = store.value
    }
    if (fromDate && toDate && dateType) {
      payload.fromDate = getDatePayload(fromDate)
      payload.toDate = getDatePayload(toDate)
      payload.saleParameter = dateType.value
      if (paymentType) {
        payload.paymentParameter = paymentType.value
      }
    }
    else if (fromDate || toDate || dateType || paymentType) {
      if (fromDate && dateType) {
        dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'))
      }
      else if (toDate && dateType) {
        dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'))
      }
      else if (fromDate && toDate) {
        dispatch(setNotification('danger', 'Invalid Selection', 'Date Type is Required.'))
      }
      else {
        if (dateType) {
          dispatch(setNotification('danger', 'Invalid Selection', 'Date Range Required.'))
        }
        if (fromDate) {
          dispatch(setNotification('danger', 'Invalid Selection', 'To Date & Date Type Required .'))
        }
        if (toDate) {
          dispatch(setNotification('danger', 'Invalid Selection', 'From Date & Date Type Required.'))
        }
      }
    }
    if (Object.keys(payload).length && isValid) {
      onApplyFilter(payload)
    }
  }

  clearFilters = () => {
    const { onClearFilter } = this.props
    this.setState({
      ...initialState
    })
    onClearFilter()
  }

  setStore = (value) => {
    this.setState({
      store: value,
      showChip: true,
      showStore: true,
      valid: false
    })
  }

  setPaymentType = (value) => {
    this.setState({
      paymentType: value,
      showPayment: true,
      showChip: true,
      valid: false
    })
  }

  setDateType = (value) => {
    this.setState({
      dateType: value,
      valid: false
    })
  }

  setFromDate = (value) => {
    this.setState({
      fromDate: value,
      valid: false
    })
  }

  setToDate = (value) => {
    this.setState({
      toDate: value,
      valid: false
    })
  }

  cityChange = (city) => {
    const { dispatch } = this.props
    this.setState({
      city,
      store: null,
      showChip: true,
      showCity: true,
      valid: false
    })
    dispatch(getStoresList(city.value))
  }

  getStoresBasedOnCityId = () => {
    const { storeList } = this.props
    let getStores = []
    if (storeList && storeList.length) {
      getStores = storeList.map(store => {
        return {
          value: store.storeId,
          label: store.storeRefarenceName
        }
      })
    }
    return getStores
  }

  deleteDateChip = () => {
    const { onDeleteChip } = this.props
    const { valid } = this.state
    this.setState({
      fromDate: null,
      toDate: null,
      dateType: null
    }, () => {
      this.updateDivStatus()
    })
    if (valid)
      onDeleteChip()
  }

  deleteCityChip = () => {
    const { onDeleteChip } = this.props
    const { valid } = this.state
    this.setState({
      showCity: false,
      showStore: false,
      city: null,
      store: null
    }, () => {
      this.updateDivStatus()
    })
    if (valid)
      onDeleteChip()
  }

  deleteStoreChip = () => {
    const { onDeleteChip } = this.props
    const { valid } = this.state
    this.setState({
      showStore: false,
      store: null
    }, () => {
      this.updateDivStatus()
    })
    if (valid)
      onDeleteChip()
  }

  deletePaymentChip = () => {
    const { onDeleteChip } = this.props
    const { valid } = this.state
    this.setState({
      showPayment: false,
      paymentType: false
    }, () => {
      this.updateDivStatus()
    })
    if (valid)
      onDeleteChip()
  }

  updateDivStatus = () => {
    const { city, store, paymentType, dateType, fromDate, toDate } = this.state
    const { onApplyFilter, onClearFilter } = this.props
    if (!city && !store && !paymentType && !dateType) {
      this.setState({
        showChip: false
      })
      onClearFilter()
    }
    else {
      const payload = {}
      if (paymentType) {
        payload.paymentParameter = paymentType.value
      }
      if (city && city.value) {
        payload.cityId = city.value
      }
      if (store && store.value) {
        payload.storeId = store.value
      }
      if (fromDate && toDate && dateType) {
        payload.fromDate = getDatePayload(fromDate)
        payload.toDate = getDatePayload(toDate)
        payload.saleParameter = dateType.value
        if (paymentType) {
          payload.paymentParameter = paymentType.value
        }
      }
      onApplyFilter(payload)
    }
  }

  render() {
    const { city, store, dateType, fromDate, toDate, paymentType, showChip, showStore, showCity, showPayment, showDates } = this.state
    const { storeList } = this.props
    return (
      <div className='pending-inventory-filter-container mt-2'>
        <div className="filter-title">Filters</div>
        {
          (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) && <div className="from-date mr-2">
            <CityDropDown
              onCityChange={this.cityChange} value={city} />
          </div>
        }
        {
          Boolean(city && storeList.length) && <DropDown
            className="dropdown-wraper"
            options={this.getStoresBasedOnCityId()}
            placeholder="Select Store"
            onChange={this.setStore}
            value={store}
            searchable={false}
          />
        }
        {
          Boolean(getCityID() && storeList.length) && <DropDown
            className="dropdown-wraper"
            options={this.getStoresBasedOnCityId()}
            placeholder="Select Store"
            onChange={this.setStore}
            value={store}
            searchable={false}
          />
        }
        <div className="from-date mr-2">
          <DropDown
            className="dropdown-wraper"
            options={[{ label: 'Token', value: 'Token' }, { label: 'Full Sale', value: 'Full Sale' }]}
            placeholder="Select Payment Type"
            onChange={this.setPaymentType}
            value={paymentType}
            searchable={false}
          />
        </div>

        <div className="from-date mr-2">
          <DropDown
            className="dropdown-wraper"
            options={[{ label: 'Sale Date', value: 'Sale Date' }, { label: 'Lead Created Date', value: 'Lead Created Date' }]}
            placeholder="Select Date Type"
            onChange={this.setDateType}
            value={dateType}
            searchable={false}
          />
        </div>
        <div className="from-date">
          <p>From</p>
          <DatePicker
            onDateChange={this.setFromDate}
            max={toDate}
            startDate={fromDate}
          />
        </div>
        <div className="from-date mr-2">
          <p>To</p>
          <DatePicker
            onDateChange={this.setToDate}
            min={fromDate}
            startDate={toDate}
          />
        </div>
        <Button color="success" type="button" className="rounded no-margin" onClick={this.applyFilter}>Apply</Button>
        <Button className="rounded no-margin" type="button" onClick={this.clearFilters} >Clear</Button>
        {
          showChip &&
          <div className='pending-inventory-filter-container chips'>
            {
              showCity && city && <Chip
                color="primary"
                className="m-2"
                label={(city.label)}
                onDelete={this.deleteCityChip}></Chip>
            }
            {
              showStore && store && <Chip
                color="primary"
                className="m-2"
                label={(store.label)}
                onDelete={this.deleteStoreChip}></Chip>
            }
            {
              showPayment && paymentType && <Chip
                color="primary"
                className="m-2"
                label={(paymentType.label)}
                onDelete={this.deletePaymentChip}></Chip>
            }
            {
              showDates && dateType &&
              <Chip
                color="primary"
                className="m-2"
                label={(dateType.value)}
                onDelete={this.deleteDateChip}
              ></Chip>
            }
            {
              showDates && fromDate &&
              <Chip
                color="primary"
                className="m-2"
                label={(getDate(fromDate))}
                onDelete={this.deleteDateChip}
              ></Chip>
            }
            {
              showDates && toDate &&
              <Chip
                color="primary"
                className="m-2"
                label={(getDate(toDate))}
                onDelete={this.deleteDateChip}
              ></Chip>
            }
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  storeList: state.storeList.storeListByCityId
})

export default withRouter(connect(mapStateToProps)(SaleFilter))
