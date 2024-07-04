import React, { Component } from 'react'
import CityDropDown from '../../../../../../shared/components/form/CityDropDown'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { PERMISSIONS, getRole } from '../../../../../../core/services/rbacServices'
import DatePicker from '../../../../../../shared/components/form/DatePicker'
import SearchField from '../../../../../../shared/components/form/Search'
import { getDatePayload } from '../../../../../../core/utility'
import { setNotification } from '../../../../../../redux/actions/notificationAction'
import { getStoresList } from '../../../../../../redux/actions/franchiseStoresAction'
import Dropdown from '../../../../../../shared/components/form/DropDown'

const initialState =
{
    city: null,
    fromDate: null,
    toDate: null,
    mmv: '',
    store: null
}

class PendingAssign extends Component {
    state = initialState

    componentDidUpdate() {
        const { setClearFilter, isClearFilter } = this.props
        if (isClearFilter) {
            setClearFilter()
            this.setState({ ...initialState })
        }
    }

    cityChange = (city) => {
        this.setState({ city })
        const { dispatch } = this.props
        // dispatch(getStoresList(city.value))
    }

    applyFilter = () => {
        const { onApplyFilter, dispatch } = this.props
        const { city, fromDate, toDate, mmv, store } = this.state
        let isValid = true
        const payload = {}
        if (city && city.value) {
            payload.cityID = Number(city.value)
        }
        if (mmv) {
            payload.mmv = mmv
        }
        if (store) {
            payload.storeId = store.value
        }
        if (fromDate && toDate) {
            payload.startDate = getDatePayload(fromDate)
            payload.endDate = getDatePayload(toDate)
        }
        else if (fromDate || toDate) {
            isValid = false
            if (fromDate) {
                dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'))
            }
            if (toDate) {
                dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required'))
            }
        }
        if (Object.keys(payload).length && isValid) {
            onApplyFilter(payload)
        }
    }

    applySearch = () => {
        const { onApplySearch, dispatch } = this.props
        const { city, fromDate, toDate, mmv } = this.state
        let isValid = true
        const payload = {}
        if (city && city.value) {
            payload.cityID = Number(city.value)
        }
        if (mmv) {
            payload.mmv = mmv
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
            onApplySearch(payload)
        }
    }

    clearFilter = () => {
        const { onClearFilter } = this.props
        this.getStoresBasedOnCityId('clear')
        onClearFilter()
        this.setState({ ...initialState })
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
    setSearchText = (value) => {
        this.setState({
            mmv: value
        })
    }

    getStoresBasedOnCityId = type => {
        if (type === 'filter') {
            const { franchiseStoreList } = this.props
            let getStores = []
            if (franchiseStoreList && franchiseStoreList.length) {
                getStores = franchiseStoreList.map(store => {
                    return {
                        value: store.storeId,
                        label: store.storeRefarenceName
                    }
                })
            }
            return getStores
        }
        else{
            return []
        }
    }

    setStore = (value) => {
        this.setState({ store: value })
    }

    render() {
        const { city, fromDate, toDate, mmv, store } = this.state
        const { franchiseStoreList } = this.props
        return (
            <div className='pending-inventory-filter-container mt-3'>
                <div className="filter-title">Filters</div>
                {
                    (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) && <div className="from-date mr-2">
                        <CityDropDown
                            onCityChange={this.cityChange} value={city} />
                    </div>
                }
                {/* {
                    (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) &&
                    <div className="from-date mr-2">
                        <Dropdown
                            className="dropdown-wraper"
                            options={this.getStoresBasedOnCityId('filter')}
                            placeholder='Select Store'
                            onChange={this.setStore}
                            value={store}
                            searchable={false}
                        />
                    </div>

                } */}
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
                <SearchField
                    placeholder='Search by MMV'
                    className="number-search with-margin"
                    value={mmv}
                    onSearch={this.setSearchText}
                    onEnter={this.applySearch}
                />
                <Button color="success" type="button" className="rounded no-margin" onClick={this.applyFilter}>Apply</Button>
                <Button className="rounded no-margin" type="button" onClick={this.clearFilter}>Clear</Button>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    storeList: state.storeList.storeListByCityId,
    franchiseStoreList: state.franchiseStores.storeListByCityId
})
export default withRouter(connect(mapStateToProps)(PendingAssign))
