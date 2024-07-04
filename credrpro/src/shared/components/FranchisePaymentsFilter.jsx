import React, { Component } from 'react'
import { Button } from 'reactstrap'
import SearchField from './form/Search'
import Dropdown from '../../shared/components/form/DropDown'
import CityDropDown from '../../shared/components/form/CityDropDown'
import { PERMISSIONS, getRole, getCityID } from '../../core/services/rbacServices'
import { setNotification } from '../../redux/actions/notificationAction'
import { connect } from 'react-redux'
import DatePicker from '../../shared/components/form/DatePicker'
import { getDatePayload } from '../../core/utility/stringUtility'
import { getStoresList } from '../../redux/actions/storeListAction'
import { withRouter } from 'react-router-dom'

const initialState = {
  city: '',
  store: '',
  searchText: '',
  fromDate: null,
  toDate: null,
}

class PaymentFilter extends Component {

  state = initialState

  componentDidMount() {
    const { dispatch } = this.props
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      dispatch(getStoresList(getCityID()))
    }
  }

  componentDidUpdate() {
    const { setClearFilter, isClearFilter } = this.props
    if (isClearFilter) {
      setClearFilter()
      this.setState({ ...initialState })
    }
  }

  cityChange = (city) => {
    const { dispatch } = this.props
    this.setState({ city, store: null })
    dispatch(getStoresList(city.value, false))
  }

  storeOnChange = (storeValue) => {
    this.setState({
      store: storeValue
    })
  }

  setSearchText = (value) => {
    this.setState({
      searchText: value
    })
  }

  setFromDate = (value) => {
    this.setState({
      fromDate: value
    })
  }

  setToDate = (value) => {
    this.setState({
      toDate: value
    })
  }

  applyFilter = () => {
    const { onApplyFilter, dispatch } = this.props
    const { city, store, fromDate, toDate, searchText } = this.state
    let isValid = true
    const payload = {}
    if (city && city.value) {
      payload.cityID = Number(city.value)
    }
    if (store && store.value) {
      payload.storeID = store.value
    }
    if (searchText) {
      payload.mmv = searchText
    }
    if (fromDate && toDate) {
      payload.startDate = getDatePayload(fromDate)
      payload.endDate = getDatePayload(toDate)
    } else if (fromDate || toDate) {
      isValid = false
      if (fromDate) {
        dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'))
      } else {
        dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'))
      }
    }
    if (Object.keys(payload).length && isValid) {
      onApplyFilter(payload)
    }
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

  clearFilter = () => {
    const { onClearFilter } = this.props
    this.setState({
      ...initialState
    })
    onClearFilter()
  }

  applySearch = () => {
    const { onApplySearch, dispatch } = this.props
    const { city, store, fromDate, toDate, searchText, dateType } = this.state
    let isValid = true
    const payload = {}
    if (city && city.value) {
      payload.cityID = Number(city.value)
    }
    if (store && store.value) {
      payload.storeID = store.value
    }
    if (searchText) {
      payload.mmv = searchText
    }
    if (fromDate && toDate) {
      payload.startDate = getDatePayload(fromDate)
      payload.endDate = getDatePayload(toDate)
      payload.dateType = dateType
    } else if (fromDate || toDate) {
      isValid = false
      if (fromDate) {
        dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'))
      } else {
        dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'))
      }
      if (PERMISSIONS.FRANCHISE.includes(getRole())) {
        this.setState({
          searchText: '',
          city: '',
          store: ''
        })
      }
      else {
        this.setState({
          searchText: '',
          city: '',
          store: '',
          storeList: ''
        })
      }
    }
    if (Object.keys(payload).length && isValid) {
      onApplySearch(payload)
    }
  }

  render() {
    const { city, store, searchText, toDate, fromDate } = this.state
    const { storeList } = this.props
    return (

      <div className='pending-inventory-filter-container mt-3'>
        <div className="filter-title">Filters</div>
        {
          (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) && <div className="from-date">
            <CityDropDown
              onCityChange={this.cityChange} value={city} />
          </div>
        }
        {
          Boolean(city && storeList.length) && <Dropdown
            className="dropdown-wraper"
            options={this.getStoresBasedOnCityId()}
            placeholder="Select Store"
            onChange={this.storeOnChange}
            value={store}
            searchable={false}
          />
        }
        {
          Boolean(getCityID() && storeList.length) && <Dropdown
            className="dropdown-wraper"
            options={this.getStoresBasedOnCityId()}
            placeholder="Select Store"
            onChange={this.storeOnChange}
            value={store}
            searchable={false}
          />
        }
        <div className="from-date">
          <p>From</p>
          <DatePicker
            onDateChange={this.setFromDate}
            max={toDate}
            startDate={fromDate}
          />
        </div>
        <div className="from-date">
          <p>To</p>
          <DatePicker
            onDateChange={this.setToDate}
            min={fromDate}
            startDate={toDate}
          />
        </div>
        <div className="from-date">
          <SearchField
            placeholder='Search by MMV'
            className="number-search with-margin"
            value={searchText}
            onSearch={this.setSearchText}
            onEnter={this.applySearch}
          />
        </div>
        <Button color="success" type="button" className="rounded no-margin ml-3" onClick={this.applyFilter}>Apply</Button>
        <Button className="rounded no-margin" type="button" onClick={this.clearFilter}>Clear</Button>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  storeList: state.storeList.storeListByCityId
})
export default withRouter(connect(mapStateToProps)(PaymentFilter))
