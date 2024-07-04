import React, { Component } from 'react'
import CityDropDown from '../../../shared/components/form/CityDropDown'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'
import SearchRegNumber from '../../../shared/components/form/SearchRegNumber'
import { getStoreTransactionsDetails } from '../../../redux/actions/storeTransactionListAction'
// import { getCityID } from '../../../core/services/authenticationServices'
// import { getCityCreditLimit } from '../../../core/services/shdPaymentServices'
// import { CitiCreditIcon } from '../../../core/utility/iconHelper'
// import ViewCreditLimitDialog from './ViewCreditLimitDialog'
// import EditCityLimitDialog from './EditCityLimitDialog'
import './filter.scss'
import { getUserCityList } from '../../../core/services/userInfoStorageServices'
import Select from 'react-select'
import classname from 'classnames'
import { getCityID } from '../../../core/services/rbacServices'
// import OTPPopUp from './OTPPopUp'

const initialState = {
    city: '',
    toDate: null,
    fromDate: null,
    searchText: '',
    isOpenModel: false,
    isOpenModelEdit: false,
    isOTPPopUp: false,
    cityLimits: [],
    cityData: [],
    apiSelect: '',
    payload: {},
    dataOTP: []
}



class Filters extends Component {
    state = initialState

    componentDidUpdate() {
        const { setClearFilter, isClearFilter } = this.props
        if (isClearFilter) {
            setClearFilter()
            this.setState({ ...initialState })
        }
    }


   getCities = () => {
    const { cities } = this.props

    console.log('cityList', cities, cities.filter(city => (getUserCityList()).includes(city.cityId)))

    if (cities.length) {
      return cities.filter(city => (getUserCityList()).includes(city.cityId)).map(city => {
        return {
          value: city.cityId,
          label: city.cityName
        }
      })
    }
    return []
  }

    cityChange = (city) => {
        console.log("city isty ", (getUserCityList()))
        this.setState({ city })
    }

    setFromDate = (fromDate) => {
        this.setState({ fromDate })
    }
    setToDate = (toDate) => {
        this.setState({ toDate })
    }

    storeOnChange = (value) => {
        this.setState({ store: value })
    }

    clearFilter = () => {
        const { onClearFilter } = this.props
        onClearFilter()
        this.setState({ ...initialState })
    }

    applyFilter = () => {
        const { onApplyFilter } = this.props
        const { city, searchText } = this.state
        let isValid = true
        const payload = {}
        if (city && city.value) {
            payload.cityId = Number(city.value)
        }
        if (searchText) {
            payload.search = searchText
        }
        if (Object.keys(payload).length && isValid) {
            onApplyFilter(payload)
        }
    }

    searchHandler = (sss) => {
        const { dispatch } = this.props
        const payload = {
            pageNum: 1,
            search: sss
        }
        dispatch(getStoreTransactionsDetails(payload))
    }

    clearSearch = () => {
        this.setState({ ...initialState })
        const { dispatch } = this.props
        const payload = {
            pageNum: 1
        }
        dispatch(getStoreTransactionsDetails(payload))
    }
    // citiLimitDialog = () => {
    //     getCityCreditLimit().
    //         then(apiResponse => {
    //             if (apiResponse.isValid) {
    //                 this.setState({ isOpenModel: true })
    //                 this.setState({ cityLimits: apiResponse.data })
    //             }
    //         })
    // }

    closeModel = () => {
        this.setState({ isOpenModel: false });
    };
    openEditModel = (data) => {
        this.setState({ isOpenModel: false, isOpenModelEdit: true, cityData: data })
    };

    openOTPPopPup = (apiResponse, payloadData, apiSelector) => {
        this.setState({ apiSelect: apiSelector })
        this.setState({ payload: payloadData })
        this.setState({ dataOTP: apiResponse })
        this.setState({ isOpenModelEdit: false })
        this.setState({ isOTPPopUp: true })
    }

    onSearchTypeHandler = (text) => {
        this.setState({ searchText: text })
    }

    render() {
        const { city, searchText, isOpenModel, cityLimits, isOpenModelEdit, cityData, apiSelect, payload, dataOTP, isOTPPopUp } = this.state
        return (
            <Card>
                <CardBody>
                    <div className='pending-inventory-filter-container' style={{ justifyContent: "space-evenly", height: '50px' }}>
                        <div className="wallet-filter-title">Filters</div>
                        <div className="from-date">
                            {/* <CityDropDown onCityChange={this.cityChange} value={city} /> */}

                            <div className={classname("city-dropdown-container", this.className)}>
                              <Select
                              options={this.getCities()}
                              classNamePrefix="city-dropdown"
                                 placeholder="Select City"
                              onChange={this.cityChange}
                                 value={city}
                                 />
                             </div>
                        </div>
                        <Button color="success" type="button" className="rounded no-margin ml-3" onClick={this.applyFilter}>Apply</Button>
                        <Button className="rounded no-margin" type="button" onClick={this.clearFilter}>Clear</Button>
                        <div className="regNumberSearch regNumberSearch_WalletCP" >
                            <SearchRegNumber
                                onSearch={this.applyFilter}
                                searchText={searchText}
                                onClearSearch={this.clearFilter}
                                onSearchType={this.onSearchTypeHandler}
                                placeHolder='Search by Wallet ID/Store Name/Virtual Account ID'
                                withButton={true}
                                fromCpLedger={true}
                                onEnter={this.searchHandler}
                            />
                        </div>
                        {/* <button className="icon-btn-square ml-3" onClick={this.citiLimitDialog}>
                            View Credit Limit
                            <img src={CitiCreditIcon} className="btn-icon-square" alt="Download" />
                        </button> */}
                        {/* {isOpenModel && (
                            <ViewCreditLimitDialog
                                cityLimits={cityLimits}
                                open={isOpenModel}
                                onClose={this.closeModel}
                                onEdit={this.openEditModel}
                            />
                        )} */}
                        {/* {isOpenModelEdit && (
                            <EditCityLimitDialog
                                cityData={cityData}
                                open={isOpenModelEdit}
                                onClose={() => this.setState({ isOpenModelEdit: false })}
                                openOTPPopPup={this.openOTPPopPup}
                            />
                        )} */}
                        {/* {isOTPPopUp && (
                            <OTPPopUp
                                apiSelect={apiSelect}
                                dataOTP={dataOTP}
                                payload={payload}
                                open={isOTPPopUp}
                                onClose={() => this.setState({ isOTPPopUp: false })}
                                openModel={() => this.citiLimitDialog()}
                            />
                        )} */}
                    </div>
                </CardBody>
            </Card>
        )
    }
}
const mapStateToProps = (state) => ({
    // storeList: state.storeList.storeListByCityId
    cities: state.cities.cityList
})
export default withRouter(connect(mapStateToProps)(Filters))