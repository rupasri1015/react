import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ListBikesHeader from './components/header'
import ListingTable from './components/priorityTable'
import ListingFilter from './components/filters'
import { priorityList } from '../../redux/actions/bikePriorityAction'
import { priorityListFilter } from '../../redux/actions/bikePriorityActionFilter'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { submitPriorityList, previewPriorityList } from '../../core/services/bikePriorityServices'
import { setNotification } from '../../redux/actions/notificationAction'

class ListBikes extends Component {

    state = {
        status: 'CITY',
        showTables: false,
        resetFilters: false,
        filters: {},
        prevStatus: '',
        prioList: [],
        previousStatus: '',
        previewPayload: null,
        setPreviewStatus: true
    }

    componentDidMount() {
        const { status } = this.state
        if (status === 'CITY')
            this.setState({ showTables: true })
    }

    componentDidUpdate(prevPros) {
        if (prevPros.status !== this.props.status) {
            this.setState({ resetFilters: true, previewPayload: null })
        }
    }

    updateStatus = (vehicleStatus) => {
        this.setState({ status: vehicleStatus, resetFilters: true, previewPayload: null })
        const { filters } = this.state
        const { dispatch } = this.props
        let payload = {}
        if (vehicleStatus === 'CITY') {
            this.setState({ showTables: true })
            payload.cityCategory = true
            dispatch(priorityList(payload))
        }
        if (vehicleStatus === 'CITYSTORE') {
            this.setState({ showTables: false })
            if (Object.keys(filters).length)
                this.setState({ resetFilters: true })
        }
        if (vehicleStatus === 'CITYSTOREMODEL') {
            this.setState({ showTables: false })
            if (Object.keys(filters).length)
                this.setState({ resetFilters: true })
        }
        if (vehicleStatus === 'CITYMODEL') {
            this.setState({ showTables: false })
            if (Object.keys(filters).length)
                this.setState({ resetFilters: true })
        }
        if (vehicleStatus === 'LISTVIEW') {
            this.setState({ setPreviewStatus: false })
            payload.pageNum = 1
            dispatch(priorityListFilter(payload))
        }
        if (vehicleStatus === 'PREVIEW') {
            payload.pageNum = 1
            dispatch(priorityListFilter(payload))
        }
    }

    handlePageChange = (pageNum) => {
        let payload = { pageNum }
        const { dispatch } = this.props
        const { status, filters } = this.state
        if (status === 'LISTVIEW') {
            if (Object.keys(filters).length) {
                payload.cityId = filters.city && filters.city.value
                payload.storeId = filters.outlet && filters.outlet.value
                payload.pageNum = pageNum
                payload.bikeModelId = filters.bikeData && filters.bikeData.value
                payload = { ...payload }
            }
            dispatch(priorityListFilter(payload))
        }
        if (status === 'PREVIEW') {
            if (Object.keys(filters).length) {
                payload.cityId = filters.city && filters.city.value
                payload.storeId = filters.outlet && filters.outlet.value
                payload.pageNum = pageNum
                payload.bikeModelId = filters.bikeData && filters.bikeData.value
                payload = { ...payload }
            }
            dispatch(priorityList(payload))
        }
        else {
            if (Object.keys(filters).length) {
                payload = { ...payload, ...filters }
            }
            dispatch(priorityList(payload))
        }
    }

    applyFilter = (filterData) => {
        this.setState({ filters: filterData })
        const { dispatch } = this.props
        const { status } = this.state
        this.setState(prevState => ({
            previousStatus: prevState.status
        }))
        let payload = {}
        dispatch(showLoader())
        if (status === 'CITY') {
            payload.cityCategory = true
            dispatch(priorityList(payload))
        }
        if (status === 'CITYSTORE') {
            payload.cityStoreCategory = true
            payload.cityId = filterData.city.value
            dispatch(priorityList(payload))
        }
        if (status === 'CITYSTOREMODEL') {
            payload.cityStoreModelCategory = true
            payload.cityId = filterData.city.value
            payload.storeId = filterData.outlet.value
            dispatch(priorityList(payload))
        }
        if (status === 'CITYMODEL') {
            payload.cityModelCategory = true
            payload.cityId = filterData.city.value
            dispatch(priorityList(payload))
        }
        if (status === 'LISTVIEW') {
            payload.cityId = filterData.city.value
            payload.storeId = filterData.outlet && filterData.outlet.value
            payload.pageNum = 1
            payload.bikeModelId = filterData.bikeData && filterData.bikeData.value
            dispatch(priorityListFilter(payload))
        }
        if (status === 'PREVIEW') {
            payload.cityId = filterData.city.value
            payload.storeId = filterData.outlet && filterData.outlet.value
            payload.pageNum = 1
            payload.bikeModelId = filterData.bikeData && filterData.bikeData.value
            dispatch(priorityList(payload))
        }
        this.setState({ showTables: true })
    }

    clearFilter = () => {
        let payload = {}
        const { filters, status } = this.state
        const { dispatch } = this.props
        this.setState({ showTables: false, resetFilters: true })
        if (Object.keys(filters).length) {
            if (status === 'CITY') {
                payload.cityCategory = true
                dispatch(priorityList(payload))
            }
            if (status === 'CITYSTORE') {
                payload.cityStoreCategory = true
                payload.cityId = filters.city.value
                dispatch(priorityList(payload))
            }
            if (status === 'CITYSTOREMODEL') {
                payload.cityStoreModelCategory = true
                payload.cityId = filters.city.value
                payload.storeId = filters.outlet.value
                dispatch(priorityList(payload))
            }
            if (status === 'CITYMODEL') {
                payload.cityModelCategory = true
                payload.cityId = filters.city.value
                dispatch(priorityList(payload))
            }
            if (status === 'LISTVIEW') {
                payload.pageNum = 1
                dispatch(priorityListFilter(payload))
            }
            if (status === 'PREVIEW') {
                payload.pageNum = 1
                dispatch(priorityList(payload))
            }
        }
    }

    goToPrevTab = (oldStatus) => {
        const { dispatch } = this.props
        const { filters } = this.state
        let payload = {}
        this.setState({ status: oldStatus, previewPayload: null })
        if (oldStatus === 'CITY') {
            payload.cityCategory = true
        }
        if (oldStatus === 'CITYSTORE') {
            payload.cityStoreCategory = true
            payload.cityId = filters.city.value
        }
        if (oldStatus === 'CITYSTOREMODEL') {
            payload.cityStoreModelCategory = true
            payload.cityId = filters.city.value
            payload.storeId = filters.outlet.value
        }
        if (oldStatus === 'CITYMODEL') {
            payload.cityModelCategory = true
            payload.cityId = filters.city.value
        }
        dispatch(priorityList(payload))
    }

    submitPriorities = (payload, type, prevStatus) => {
        this.setState({ previousStatus: prevStatus })
        const { dispatch } = this.props
        if (type === 'SUBMIT') {
            dispatch(showLoader())
            submitPriorityList(payload)
                .then(apiResponse => {
                    if (apiResponse.isValid) {
                        dispatch(setNotification('success', 'Success', apiResponse.message))
                        let listViewPayload = {
                            pageNum: 1
                        }
                        this.setState({ status: 'LISTVIEW' })
                        dispatch(priorityListFilter(listViewPayload))
                    }
                    else {
                        dispatch(setNotification('danger', 'error', apiResponse.message))
                    }
                })
        }
        if (type === 'PREVIEW') {
            this.setState({ previewPayload: payload })
            dispatch(showLoader())
            previewPriorityList(payload)
                .then(apiResponse => {
                    if (apiResponse.isValid) {
                        let listViewPayload = {
                            pageNum: 1
                        }
                        this.setState({ status: 'PREVIEW' })
                        dispatch(priorityList(listViewPayload))
                    }
                    else {
                        dispatch(setNotification('danger', 'error', apiResponse.message))
                    }
                })
        }
    }

    submitPreviewPriorities = (prevStatus) => {
        this.setState({ previousStatus: prevStatus })
        const { previewPayload, filters } = this.state
        const { dispatch } = this.props
        dispatch(showLoader())
        submitPriorityList(previewPayload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ setPreviewStatus: false })
                    dispatch(setNotification('success', 'Success', apiResponse.message))
                    let payload = {}
                    if (prevStatus === 'CITY') {
                        payload.cityCategory = true
                    }
                    if (prevStatus === 'CITYSTORE') {
                        payload.cityStoreCategory = true
                        payload.cityId = filters.city.value
                    }
                    if (prevStatus === 'CITYSTOREMODEL') {
                        payload.cityStoreModelCategory = true
                        payload.cityId = filters.city.value
                        payload.storeId = filters.outlet.value
                    }
                    if (prevStatus === 'CITYMODEL') {
                        payload.cityModelCategory = true
                        payload.cityId = filters.city.value
                    }
                    dispatch(priorityList(payload))
                    this.setState({ status: prevStatus })
                    dispatch(hideLoader())
                }
                else {
                    dispatch(setNotification('danger', 'error', apiResponse.message))
                }
                dispatch(hideLoader())
            })
    }

    render() {
        const { status, showTables, resetFilters, prioList, filters, previousStatus, previewPayload, setPreviewStatus } = this.state
        return (
            <Fragment>
                <h3> List Bike Details </h3>
                <ListBikesHeader
                    status={status}
                    onChangeStatus={this.updateStatus}
                    previewPayload={previewPayload}
                    setPreviewStatus={setPreviewStatus}
                />
                {
                    status !== 'CITY' &&
                    <ListingFilter
                        status={status}
                        onApplyFilter={this.applyFilter}
                        onClearFilter={this.clearFilter}
                        resetFilters={resetFilters}
                        previousStatus={previousStatus}
                        onBack={this.goToPrevTab}
                        onSubmitPreviewPriority={this.submitPreviewPriorities}
                        setPreviewStatus={setPreviewStatus}
                    />
                }
                <ListingTable
                    status={status}
                    showTables={showTables}
                    onPageChange={this.handlePageChange}
                    prioList={prioList}
                    onSubmitPriority={this.submitPriorities}
                    filters={filters}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    priorityBasedList: state.priorityList.priorityCategory.cityCategoryDetails,
    priorityStoreList: state.priorityList.priorityCategory.cityStoreCategoryDetails,
    priorityStoreModelList: state.priorityList.priorityCategory.cityStoreModelCategoryDetails,
    priorityCityModelList: state.priorityList.priorityCategory.cityModelCategoryDetails,
    inventoryList: state.priorityList.priorityCategory.inventoryFromDb,
    filterInventoryList: state.filterListView.priorityCategory.inventoryFromDb,
    totalCount: state.priorityList.count,
    page: state.priorityList.pageNum
})

export default connect(mapStateToProps)(ListBikes)
