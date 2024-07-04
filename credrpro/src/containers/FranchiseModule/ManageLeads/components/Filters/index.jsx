import React, { Component } from 'react'
import { Button } from 'reactstrap'
import DatePicker from '../../../../../shared/components/form/DatePicker'
import { getDatePayload } from '../../../../../core/utility'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import Dropdown from '../../../../../shared/components/form/DropDown'
import { PERMISSIONS, getRole, getCityID } from '../../../../../core/services/rbacServices'
import CityDropDown from '../../../../../shared/components/form/CityDropDown'
import { getStoresList } from '../../../../../redux/actions/storeListAction'
import { connect } from 'react-redux'
import Chip from '@material-ui/core/Chip'
import { getDate } from '../../../../../core/utility'


const initialState = {
  fromDate: null,
  toDate: null,
  city: null,
  dateType: null,
  store: null,
  showChip: false,
  showCity: false,
  showStore: false,
  showDates: false,
  valid: false
}

class LeadsFilter extends Component {

  state = initialState

  componentDidMount() {
    const { dispatch } = this.props
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      dispatch(getStoresList(getCityID()))
    }
  }

  clearFilters = () => {
    const { onClearFilter } = this.props
    this.setState({
      ...initialState
    })
    onClearFilter()
  }

  applyFilter = () => {
    this.setState({
      valid: true
    })
    const { fromDate, toDate, city, store, dateType } = this.state
    const { dispatch, onApplyFilter } = this.props
    let payload = {}
    let isValid = true
    if (dateType && fromDate && toDate) {
      this.setState({
        showDates: true,
        showChip: true
      })
    }
    if (city && city.value) {
      payload.cityID = Number(city.value)
    }
    if (store && store.value) {
      payload.storeID = store.value
    }
    if (fromDate && toDate && dateType) {
      payload.fromDate = getDatePayload(fromDate)
      payload.toDate = getDatePayload(toDate)
      payload.searchByParameter = dateType.value
    }
    else if (fromDate || toDate || dateType) {
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

  setStore = (value) => {
    this.setState({
      store: value,
      showChip: true,
      showStore: true
    })
  }

  setDateType = (value) => {
    this.setState({
      dateType: value,
    })
  }

  setFromDate = (value) => {
    this.setState({
      fromDate: value,
    })
  }

  setToDate = (value) => {
    this.setState({
      toDate: value,
    })
  }

  cityChange = (city) => {
    const { dispatch } = this.props
    this.setState({
      city, store: null,
      showChip: true,
      showCity: true
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

  updateDivStatus = () => {
    const { onApplyFilter } = this.props
    const payload = {}
    const { city, store, dateType, fromDate, toDate, valid } = this.state
    if (!city && !store && !dateType) {
      this.setState({
        showChip: false
      })
    }
    else {
      if (city && city.value) {
        payload.cityID = Number(city.value)
      }
      if (store && store.value) {
        payload.storeID = store.value
      }
      if (fromDate && toDate && dateType) {
        payload.fromDate = getDatePayload(fromDate)
        payload.toDate = getDatePayload(toDate)
        payload.searchByParameter = dateType.value
      }
      if (valid) {
        onApplyFilter(payload)
      }
    }
  }

  render() {
    const { city, store, dateType, fromDate, toDate, showChip, showCity, showStore, showDates } = this.state
    const { storeList } = this.props
    return (
      <div>
        <div className='pending-inventory-filter-container mt-2'>
          <div className="filter-title">Filters</div>
          {
            (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) &&
            <div className="from-date mr-2">
              <CityDropDown
                onCityChange={this.cityChange} value={city} />
            </div>
          }
          {
            Boolean(city && storeList.length) &&
            <Dropdown
              className="dropdown-wraper"
              options={this.getStoresBasedOnCityId()}
              placeholder="Select Store"
              onChange={this.setStore}
              value={store}
              searchable={false}
            />
          }
          {
            Boolean(getCityID() && storeList.length) &&
            <Dropdown
              className="dropdown-wraper"
              options={this.getStoresBasedOnCityId()}
              placeholder="Select Store"
              onChange={this.setStore}
              value={store}
              searchable={false}
            />
          }
          <div className="from-date mr-2">
            <Dropdown
              className="dropdown-wraper"
              options={[{ label: 'Lead Created Date', value: 'Lead Created Date' }]}
              placeholder='Select Date Type'
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
        </div>
        {
          showChip && <div className='pending-inventory-filter-container chips' >
            {
              showCity && city &&
              <Chip
                color="primary"
                className="m-2"
                label={(city.label)}
                onDelete={this.deleteCityChip}
              />
            }
            {
              showStore && store &&
              <Chip
                color="primary"
                className="m-2"
                label={(store.label)}
                onDelete={this.deleteStoreChip}
              />
            }
            {
              showDates && dateType &&
              <Chip
                color="primary"
                className="m-2"
                label={(dateType.value)}
                onDelete={this.deleteDateChip}
              />
            }
            {
              showDates && fromDate &&
              <Chip
                color="primary"
                className="m-2"
                label={(getDate(fromDate))}
                onDelete={this.deleteDateChip}
              />
            }
            {
              showDates && toDate &&
              <Chip
                color="primary"
                className="m-2"
                label={(getDate(toDate))}
                onDelete={this.deleteDateChip}
              />
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
export default connect(mapStateToProps)(LeadsFilter)

