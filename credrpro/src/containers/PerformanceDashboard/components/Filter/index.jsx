import React, { Component, Fragment } from 'react'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SearchField from '../../../../shared/components/form/Search'
import DropDown from '../../../../shared/components/form/DropDown'
import Datepicker from '../DatePicker'
import { Picky } from 'react-picky';
import 'react-picky/dist/picky.css';
import { getDatePayload } from '../../../../core/utility/stringUtility'
import { getAllCities } from '../../../../redux/actions/cityListAction'
import { setNotification } from '../../../../redux/actions/notificationAction'
import { pdStoreList, getDocQcCities } from '../../../../core/services/miscServices'
import { getValuatorData } from '../../../../core/services/performanceDashboard'
import { Card, CardBody } from 'reactstrap'
import { getUserID, getRole } from '../../../../core/services/rbacServices'

const initialState = {
  searchText: '',
  fromDate: null,
  toDate: null,
  city: null,
  inspector: null,
  store: null,
  dateType: null,
  cities: [],
  outlet: [],
  storeId: [],
  cityId: [],
  storeIds: [],
  valuator: [],
  valuatorList: [],
  outletStatus: true,
  valuatorStatus: true,
  paymentStatus: null,
  storeType: "",
  storeSelected: [],
  valuatorId: [],
  cityList: [],
  citySelected: []
}

class Filters extends Component {

  state = initialState

  componentDidUpdate(prevProps) {
    const { location, onClearFilters } = this.props
    if (prevProps.location.pathname !== location.pathname) {
      this.setState({ ...initialState })
      onClearFilters()
    }

  }
  componentDidMount() {
    //  this.props.dispatch(fhdPaymenStoretList())
    if (getRole() === 'PRO_BID') {
      let getCityList = []
      getDocQcCities(getUserID())
        .then(apiResponse => {
          if (apiResponse.isValid && apiResponse.cityList && apiResponse.cityList.length) {
            getCityList = apiResponse.cityList.map(city => {
              return {
                cityId: city.cityId,
                cityName: city.cityName
              }
            })
            this.setState({ cityList: getCityList })
          }
        })
    }
    else {
      this.props.dispatch(getAllCities())
    }
  }

  searchHandler = searchKeyWord => {
    this.setState({
      searchText: searchKeyWord
    })
  }
  clearSearch = () => {
    this.setState({
      searchText: ''
    })
    this.props.onClearFilter()
  }

  fromDateChange = (fromDate) => {
    this.setState({ fromDate })
  }

  toDateChange = (toDate) => {
    this.setState({ toDate })
  }

  selectMultipleCities = (value) => {
    const cityId = value.map(city => city.cityId)
    const payload = {
      "cityId": cityId,
      "storeType": "3"
    }

    pdStoreList(payload).then(apiresponse => {
      this.setState({
        outletStatus: true
      })
      if (apiresponse.isValid) {
        const storeList = apiresponse.cityAndStoreList
        this.setState({
          outlet: storeList,
          outletStatus: false,
          valuatorStatus: false
        })
      }
      payload.storeId = this.state.outlet
    })
    getValuatorData(payload).then(apiresponse => {
      this.setState({
        valuatorStatus: true
      })
      if (apiresponse.isValid) {
        const valuatorList = apiresponse.valuatorDetails
        this.setState({
          valuatorList,
          valuatorStatus: false
        })
      }
    }
    )
    this.setState({ cities: value, outletStatus: false, cityId: cityId });
  }

  selectMultipleoutlet = (value) => {
    const outlet = value.map(store => store.storeID)
    const payload = {
      "cityId": this.state.cityId,
      "storeId": outlet
    }
    getValuatorData(payload).then(apiresponse => {
      this.setState({
        valuatorStatus: true
      })
      if (apiresponse.isValid) {
        const valuatorList = apiresponse.valuatorDetails
        this.setState({
          valuatorList,
          valuatorStatus: false
        })
      }
    })
    this.setState({ storeSelected: value, storeIds: outlet });
  }
  selectMultipleValuator = (value) => {
    const valuator = value.map(valuator => valuator.valuatorId)
    this.setState({
      valuatorId: valuator,
      valuator: value
    })
  }
  applyFilter = () => {
    const { fromDate, toDate, searchText, cityId, dateType, valuatorId, storeIds } = this.state
    const { dispatch } = this.props
    let isValid = true
    const payload = {}
    if (dateType && dateType.value) {
      payload.dateType = dateType.value
    }
    if (fromDate && toDate) {
      payload.fromDate = getDatePayload(fromDate)
      payload.toDate = getDatePayload(toDate)
    }
    else if (fromDate || toDate || dateType) {
      isValid = false
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
    if (searchText) {
      payload.searchKeyWord = searchText
    }
    if (cityId && cityId.length) {
      payload.cityId = cityId
    }
    if (cityId && cityId.length) {
      payload.cityId = cityId
    }
    if (storeIds && storeIds.length) {
      payload.outlet = storeIds
    }
    if (valuatorId && valuatorId.length) {
      payload.valuatorId = valuatorId
    }
    if (isValid) {
      this.props.onApplyFilter(payload)
    }
  }

  clearFilter = () => {
    this.setState({ ...initialState })
    const { dateType, fromDate, toDate, valuatorStatus, outletStatus, cities } = this.state
    if (dateType || fromDate || toDate || valuatorStatus || outletStatus || cities) {
      this.props.onClearFilter()
    }
  }

  render() {
    const { searchText, dateType, cityList } = this.state
    const { getAllCities, onSearch } = this.props
    return (
      <Fragment>
        <div className='pending-inventory-filter-container mb-3'>
          <div className="filter-title">Filters</div>
          {this.props.history != null && this.props.history.location != null && this.props.history.location.pathname != null && this.props.history.location.pathname === "/TATDashboard" ?
            <DropDown className="number-search"
              options={[{ value: "leadCreatedDate", label: "Lead Date" }, { value: "exchangeDate", label: "Exchange Date" }, { value: "paymentDate", label: "Payment Date" }]}
              onChange={(dateType) => this.setState({ dateType })}
              placeholder="Select Date Type"
              value={dateType}
            />
            :
            <DropDown className="number-search"
              options={[{ value: "leadCreatedDate", label: "Lead Date" }, { value: "exchangeDate", label: "Exchange Date" }]}
              onChange={(dateType) => this.setState({ dateType })}
              placeholder="Select Date Type"
              value={dateType}
            />
          }
          <Datepicker
            dateType={this.state.dateType}
            fromDate={this.fromDateChange}
            toDate={this.toDateChange}
            fromDateValue={this.state.fromDate}
            toDateValue={this.state.toDate}
            className="number-search"
          />

          {
            getRole() !== 'PRO_BID' ?
              <Picky
                value={this.state.cities}
                options={getAllCities}
                onChange={this.selectMultipleCities}
                open={false}
                valueKey="cityId"
                labelKey="cityName"
                multiple={true}
                includeSelectAll={true}
                includeFilter={true}
                dropdownHeight={600}
                placeholder="Select Cities"
                className="number-search pl-2"
                numberDisplayed="2"
              /> :
              <Picky
                value={this.state.cities}
                options={cityList}
                onChange={this.selectMultipleCities}
                open={false}
                valueKey="cityId"
                labelKey="cityName"
                multiple={true}
                includeSelectAll={true}
                includeFilter={true}
                dropdownHeight={600}
                placeholder="Select Cities"
                className="number-search pl-2"
                numberDisplayed="2"
              />
          }
          <Picky
            value={this.state.storeSelected}
            options={this.state.outlet}
            onChange={this.selectMultipleoutlet}
            open={false}
            valueKey="storeID"
            labelKey="storeName"
            multiple={true}
            includeSelectAll={true}
            includeFilter={true}
            dropdownHeight={600}
            placeholder="Select Outlet"
            className="number-search pl-2"
            disabled={this.state.outletStatus}
            numberDisplayed="2"
          />
          <Picky
            value={this.state.valuator}
            options={this.state.valuatorList}
            onChange={this.selectMultipleValuator}
            open={false}
            valueKey="valuatorId"
            labelKey="valuatoreName"
            multiple={true}
            includeSelectAll={true}
            includeFilter={true}
            dropdownHeight={600}
            placeholder="Select Valuator"
            className="number-search pl-2"
            disabled={this.state.valuatorStatus}
            numberDisplayed="2"
          />
          <Button color="success" type="button" onClick={this.applyFilter} className="rounded no-margin ml-3" >Apply</Button>
          <Button className="rounded no-margin" onClick={this.clearFilter} type="button">Clear</Button>
        </div>
        <Card className="pending-inventory-header">
          <CardBody className="card-shadow square-border">
            <div className='pending-inventory-filter-container'>
              <h5> Search by Keywords... </h5>
              <div className="from-date ml-2">
                <SearchField
                  value={searchText}
                  onSearch={this.searchHandler}
                  withButton
                  onClick={() => onSearch(searchText)}
                  onEnter={() => onSearch(searchText)}
                  onClearInput={this.clearSearch}
                  placeholder="Search By Reg Number"
                  style={{ maxWidth: 250 }}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  getAllCities: state.cities.cityList,
  storeList: state.storeList.storeListByCityId,
  valuatorList: state.valuatorDataList.valuatorDetails,
})

export default withRouter(connect(mapStateToProps)(Filters))