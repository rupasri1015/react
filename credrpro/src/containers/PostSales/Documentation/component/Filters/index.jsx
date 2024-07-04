
import React, { Component } from 'react'
import { Button } from 'reactstrap'
import Dropdown from '../../../../../shared/components/form/DropDown'
import CityDropDown from '../../../../../shared/components/form/CityDropDown'
import { PERMISSIONS, getRole, getCityID } from '../../../../../core/services/rbacServices'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import { connect } from 'react-redux'
import DatePicker from '../../../../../shared/components/form/DatePicker'
import { getDatePayload } from '../../../../../core/utility/stringUtility'
import { getStoresList } from '../../../../../redux/actions/storeListAction'
import { withRouter } from 'react-router-dom'

const initialState = {
  city: '',
  store: '',
  mmv: '',
  fromDate: null,
  toDate: null,
  // rcStatus:null
}
class DocumentationFilter extends Component {

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
    dispatch(getStoresList(city.value))
  }

  storeOnChange = (storeValue) => {
    this.setState({
      store: storeValue
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

  // setRcStatus=(value)=>{
  //     this.setState({
  //       rcStatus:value
  //     })
  // }

  applyFilter = () => {
    const { onApplyFilter, dispatch } = this.props
    const { city, store, fromDate, toDate } = this.state
    let isValid = true
    const payload = {}
    if (city && city.value) {
      payload.cityId = Number(city.value)
    }
    if (store && store.value) {
      payload.storeId = store.value
    }
    // if(rcStatus){
    //   payload.rcStatus = rcStatus.value
    // }
    if (fromDate && toDate) {
            payload.fromDate = getDatePayload(fromDate)
            payload.toDate = getDatePayload(toDate)
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
    onClearFilter()
    this.setState({ ...initialState })
  }

  render() {
    const { city, store,  toDate, fromDate } = this.state
    // const {storeList} =this.props
    return (

      <div className='pending-inventory-filter-container mt-3'>
        <div className="filter-title">Filters</div>
        {(PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) && <div className="from-date">
          <CityDropDown
            onCityChange={this.cityChange} value={city} />
        </div>}
       <Dropdown
          className="dropdown-wraper"
          options={this.getStoresBasedOnCityId()}
          placeholder="Select Store"
          onChange={this.storeOnChange}
          value={store}
          searchable={false}
        />
         {/* <div className="from-date mr-2">
            <Dropdown
              className="dropdown-wraper"
              options={[{ label: 'RC Status', value: 'rcStatus' }]}
              placeholder="Select Status"
              onChange={this.setRcStatus} 
              value={rcStatus}
              searchable={false}
            />
          </div> */}
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
        <Button color="success" type="button" className="rounded no-margin ml-3" onClick={this.applyFilter}>Apply</Button>
        <Button className="rounded no-margin" type="button" onClick={this.clearFilter}>Clear</Button>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  storeList: state.storeList.storeListByCityId
})
export default withRouter(connect(mapStateToProps)(DocumentationFilter))
