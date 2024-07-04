import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import DatePicker from '../../../shared/components/form/DatePicker'
import CityDropDown from '../../../shared/components/form/CityDropDown'
import DropDown from '../../../shared/components/form/DropDown'
import { getDatePayload } from '../../../core/utility'
import { setNotification } from '../../../redux/actions/notificationAction'
import MultiSelect from '../../../shared/components/form/MultiSelect'
import { getBufferPriceData } from '../../../core/services/bufferSellServices'
//import { getUserID, getRole } from '../../../../core/services/rbacServices'

class BufferOnlineFilters extends Component {

  state = {
    fromDate: null,
    toDate: null,
    city: null,
    cityList: [],
    leadStatus: [],
    status: ''
  }

  componentDidUpdate() {
    const { setClearFilter, isClearFilter } = this.props
    if (isClearFilter) {
      setClearFilter()
      this.setState({
        fromDate: null,
        toDate: null,
        city: null,
        leadStatus: []
      })
    }
  }

  fromDateChange = (fromDate) => {
    this.setState({ fromDate })
  }

  toDateChange = (toDate) => {
    this.setState({ toDate })
  }

  clearFilters = () => {
    const { onClearFilters } = this.props
    this.setState({
      fromDate: null,
      toDate: null,
      city: null,
      inspector: null,
      status: ''
    })
    onClearFilters()
  }

  cityChange = (city) => {
    const { dispatch } = this.props
    this.setState({ city, inspector: null })
  }

  applyFilter = () => {
    const { onApplyFilter, dispatch } = this.props
    const { fromDate, toDate, city, inspector, leadStatus, status } = this.state
    const payload = {}
    let isValid = true

    if (city && city.value) {
      payload.cityId = Number(city.value)
    }

    if (status) {
      payload.leadStatus = status.value
    }
    if (fromDate && toDate) {
      payload.fromDate = getDatePayload(fromDate)
      payload.toDate = getDatePayload(toDate)
      // payload.dateType = 'RequestedDate'
    } else
      if (fromDate || toDate) {
        isValid = false
        if (fromDate) {
          dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'))
        } else {
          dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'))
        }
      }
    if (Object.keys(payload).length) {
      onApplyFilter(payload)
    }

  }

  setBufferStatus = (status) => {
    this.setState({
      status: status
    })
  }

  render() {
    const { statusLists } = this.props
    const { fromDate, toDate, city, inspector, cityList, leadStatus, status } = this.state
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
        {/* {
          getRole() !== 'PRO_PUBLISH' ?
            <CityDropDown
              //onCityChange={this.cityChange}
              value={city}
              className="dropdown-wraper"
            /> :
            <DropDown
              placeholder="Select City"
              //onChange={this.cityChange}
              options={cityList}
              value={city}
              className="dropdown-wraper"
            />
        } */}
        <CityDropDown
          onCityChange={this.cityChange}
          value={city}
          className="dropdown-wraper"
        />
        <DropDown
          className="dropdown-wraper mr"
          options={statusLists}
          value={status}
          placeholder="Select Status"
          onChange={this.setBufferStatus}
        />
        <Button color="success" type="button" className="rounded no-margin" onClick={this.applyFilter}>Apply</Button>
        <Button className="rounded no-margin" type="button" onClick={this.clearFilters}>Clear</Button>
      </div>
    )
  }
}

export default connect()(BufferOnlineFilters)