import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import DatePicker from '../../../../../shared/components/form/DatePicker'
import CityDropDown from '../../../../../shared/components/form/CityDropDown'
import DropDown from '../../../../../shared/components/form/DropDown'
import { getDatePayload } from '../../../../../core/utility'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import { getStoresList } from '../../../../../redux/actions/storeListAction'
import { getInspectorsList } from '../../../../../redux/actions/inspectorListAction'
import { getDocQcCities } from '../../../../../core/services/miscServices'
import { getUserID, getRole } from '../../../../../core/services/rbacServices'


class InventoryFilters extends Component {

  state = {
    fromDate: null,
    toDate: null,
    city: null,
    inspector: null,
    store: null,
    cityList: []
  }

  componentDidUpdate() {
    const { setClearFilter, isClearFilter } = this.props
    if (isClearFilter) {
      setClearFilter()
      this.setState({
        fromDate: null,
        toDate: null,
        city: null,
        inspector: null,
        store: null,
      })
    }
  }

  componentDidMount() {
    if (getRole() === 'PRO_PUBLISH') {
      let getCityList = []
      getDocQcCities(getUserID())
        .then(apiResponse => {
          if (apiResponse.isValid && apiResponse.cityList && apiResponse.cityList.length) {
            getCityList = apiResponse.cityList.map(city => {
              return {
                value: city.cityId,
                label: city.cityName
              }
            })
            this.setState({ cityList: getCityList })
          }
        })
    }
  }

  fromDateChange = (fromDate) => {
    this.setState({ fromDate })
  }

  toDateChange = (toDate) => {
    this.setState({ toDate })
  }

  cityChange = (city) => {
    const { dispatch } = this.props
    this.setState({ city, store: null, inspector: null })
    dispatch(getStoresList(city.value, false))
    dispatch(getInspectorsList(city.value, false))
  }

  onInspectoreChange = (inspector) => {
    this.setState({ inspector })
  }

  onStoreChange = (store) => {
    this.setState({ store })
  }

  clearFilters = () => {
    const { onClearFilters } = this.props
    this.setState({
      fromDate: null,
      toDate: null,
      city: null,
      inspector: null
    })
    onClearFilters()
  }

  getStores = () => {
    const { storeList } = this.props
    let stores = []
    if (storeList && storeList.length) {
      stores = storeList.map(store => {
        const { storeId, storeRefarenceName } = store
        return {
          value: storeId,
          label: storeRefarenceName
        }
      })
    }
    return stores
  }

  getInspectors = () => {
    const { inspectorList } = this.props
    let inspectors = []
    if (inspectorList && inspectorList.length) {
      inspectors = inspectorList.map(inspector => {
        const { inspectorId, inspectorName } = inspector
        return {
          value: inspectorId,
          label: inspectorName
        }
      })
    }
    return inspectors
  }

  applyFilter = () => {
    const { onApplyFilter, dispatch } = this.props
    const { fromDate, toDate, searchText, city, store, inspector } = this.state
    const payload = {}
    let isValid = true

    if (city && city.value) {
      payload.cityId = Number(city.value)
    }
    if (searchText) {
      payload.regNum = searchText
    }
    if (store && store.value) {
      payload.storeId = store.value
    }
    if (inspector && inspector.value) {
      payload.inspectorId = inspector.value
    }
    if (fromDate && toDate) {
      payload.fromDate = getDatePayload(fromDate)
      payload.toDate = getDatePayload(toDate)
    } else
      if (fromDate || toDate) {
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

  render() {
    const { fromDate, toDate, city, store, inspector, cityList } = this.state
    const { storeList, inspectorList } = this.props
    return (
      <div className='pending-inventory-filter-container mt-3'>
        <div className="filter-title">Filters</div>
        <div className="from-date">
          <p>From</p>
          <DatePicker
            onDateChange={this.fromDateChange}
            max={toDate}
            startDate={fromDate}
          />
        </div>
        <div className="from-date">
          <p>To</p>
          <DatePicker
            onDateChange={this.toDateChange}
            min={fromDate}
            startDate={toDate}
          />
        </div>
        {
          getRole() !== 'PRO_PUBLISH' ?
            <CityDropDown
              onCityChange={this.cityChange}
              value={city}
              className="dropdown-wraper"
            /> :
            <DropDown
              placeholder="Select City"
              onChange={this.cityChange}
              options={cityList}
              value={city}
              className="dropdown-wraper"
            />
        }
        {
          Boolean(city && storeList.length) && (
            <DropDown
              className="dropdown-wraper"
              options={this.getStores()}
              placeholder="Select Store"
              onChange={this.onStoreChange}
              value={store}
            />
          )
        }
        {
          Boolean(city && inspectorList.length) && (
            <DropDown
              options={this.getInspectors()}
              className="dropdown-wraper"
              placeholder="Select Inspector"
              value={inspector}
              onChange={this.onInspectoreChange}
            />
          )
        }
        <Button color="success" type="button" className="rounded no-margin" onClick={this.applyFilter}>Apply</Button>
        <Button className="rounded no-margin" type="button" onClick={this.clearFilters}>Clear</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  storeList: state.storeList.storeListByCityId,
  inspectorList: state.inspectorList.inspectorList
})

export default withRouter(connect(mapStateToProps)(InventoryFilters))