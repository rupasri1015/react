import React, { Component, useState } from 'react'
import { Button } from 'reactstrap'
import CityDropDown from '../../../shared/components/form/CityDropDown'
import DropDown from '../../../shared/components/form/DropDown'
import { listStores } from '../../../core/services/miscServices'
import { getPriorityList } from '../../../core/services/bikePriorityServices'

class ListingFilter extends Component {

    state = {
        city: null,
        outlet: null,
        bikeData: null,
        storeList: [],
        bikeList: []
    }

    componentDidUpdate(prevProps) {
        if (prevProps.status !== this.props.status) {
            this.setState({ city: null, outlet: null, bikeData: null, storeList: [] })
        }
    }

    onCityChange = cityData => {
        this.setState({ city: cityData })
        const { status } = this.props
        if (status === 'CITYSTOREMODEL' || status === 'LISTVIEW' || status === 'PREVIEW') {
            listStores(cityData.value)
                .then(apiResaponse => {
                    if (apiResaponse.isValid) {
                        this.setState({ storeList: apiResaponse.storeListByCityId })
                    }
                })
        }
    }

    onOutletChange = outletData => {
        const { status } = this.props
        const { city } = this.state
        this.setState({ outlet: outletData })
        if (status === 'LISTVIEW' || status === 'PREVIEW') {
            let Payload = {
                cityStoreModelCategory: true,
                cityId: city.value,
                storeId: outletData.value
            }
            getPriorityList(Payload)
                .then(apiResponse => {
                    if (apiResponse.isValid) {
                        this.setState({
                            bikeList: apiResponse.priorityCategory.cityStoreModelCategoryDetails
                        })
                    }
                })
        }
    }

    onBikeChange = bike => {
        this.setState({ bikeData: bike })
    }

    clearFilter = () => {
        const { onClearFilter } = this.props
        this.setState({ city: null, outlet: null, bikeData: null, storeList: [] })
        onClearFilter()
    }

    applyFilter = () => {
        const { city, outlet, bikeData } = this.state
        const { onApplyFilter } = this.props
        let payload = {}
        if (city)
            payload.city = city
        if (outlet)
            payload.outlet = outlet
        if (bikeData)
            payload.bikeData = bikeData
        if (Object.keys(payload).length) {
            onApplyFilter(payload)
        }
    }

    getStores = () => {
        let stores = []
        const { storeList } = this.state
        if (storeList && storeList.length) {
            stores = storeList.map(store => {
                const { storeId, storeName } = store
                return {
                    value: storeId,
                    label: storeName
                }
            })
        }
        return stores
    }

    goToPreviousTab = (status) => {
        const { onBack, setPreviewStatus } = this.props
        if (setPreviewStatus) {
            let a = window.confirm('Your changes are Not saved. Are you sure you want to go back?')
            if (a) onBack(status)
            else console.log('check')
        }
        else onBack(status)
    }

    submitPriorities = (type) => {
        const { onSubmitPreviewPriority, previousStatus } = this.props
        onSubmitPreviewPriority(previousStatus)
    }

    getBikeList = () => {
        const { bikeList } = this.state
        if (bikeList && bikeList.length > 0) {
            let list = bikeList.map(li => {
                const { modelName, modelId } = li
                return {
                    value: modelId,
                    label: modelName
                }
            })
            return list
        }
        else return []
    }

    render() {
        const { city, outlet, bikeData } = this.state
        const { status, previousStatus } = this.props
        return (
            <div className='pending-inventory-filter-container mt-3 row'>
                {
                    status !== 'PREVIEW' &&
                    <div className="filter-title">Filter By</div>
                }
                {
                    status !== 'PREVIEW' &&
                    <CityDropDown
                        className="dropdown-wraper"
                        onCityChange={this.onCityChange}
                        value={city}
                        className="dropdown-wraper"
                    />
                }
                {
                    status !== 'CITYSTORE' && status !== 'CITYMODEL' && status !== 'PREVIEW' &&
                    <DropDown
                        placeholder="Select Store Name"
                        className="dropdown-wraper"
                        onChange={this.onOutletChange}
                        options={this.getStores()}
                        value={outlet}
                    />
                }
                {
                    status === 'LISTVIEW' &&
                    <DropDown
                        placeholder="Select Bike Model"
                        className="dropdown-wraper"
                        onChange={this.onBikeChange}
                        value={bikeData}
                        options={this.getBikeList()}
                    />
                }
                {
                    status !== 'PREVIEW' &&
                    <>
                        <Button color="success" type="button" className="rounded no-margin" onClick={this.applyFilter}> Apply</Button>
                        <Button className="rounded no-margin" type="button" onClick={this.clearFilter}>Clear</Button>
                    </>
                }
                {
                    status === 'PREVIEW' &&
                    <div style={{ marginLeft: '880px' }}>
                        <Button color="success" type="button" className="rounded no-margin" onClick={() => this.submitPriorities('SUBMIT')}> Publish</Button>
                        <Button type="button" className="rounded no-margin ml-2" onClick={() => this.goToPreviousTab(previousStatus)}> Back</Button>
                    </div>
                }
            </div>
        )
    }
}

export default ListingFilter
