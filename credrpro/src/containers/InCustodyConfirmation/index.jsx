import React, { Component, Fragment } from 'react'
import Header from './Components/Header'
import Filters from './Components/Filters'
import Table from './Components/Table'
import { connect } from 'react-redux'
import { getIncustodyList } from '../../redux/actions/logisticsInCustodyAction'
import { submitToInCustody } from '../../core/services/logisticServices'
import { getUserID } from '../../core/services/rbacServices'
import { setNotification } from '../../redux/actions/notificationAction'

class InCustodyConfirmation extends Component {

    state = {
        status: 'PENDING',
        filters: {},
        dateType: null,
        fromDate: null,
        toDate: null,
        city: null,
        source: null,
        callPopUp:false
    }

    onDateTypeChange = (value) => {
        this.setState({ dateType: value })
    }
    onFromDateChange = (date) => {
        this.setState({ fromDate: date })
    }
    onToDateChange = (date) => {
        this.setState({ toDate: date })
    }
    onCityChange = (value) => {
        this.setState({ city: value })
    }
    onShowroomChange = (value) => {
        this.setState({ source: value })
    }

    applyFilter = (payload) => {
        const { dispatch } = this.props
        this.setState({ filters: payload })
        dispatch(getIncustodyList(payload))
    }

    clearFilter = () => {
        const { dispatch } = this.props
        this.setState({ dateType: null })
        this.setState({ fromDate: null })
        this.setState({ toDate: null })
        this.setState({ city: null })
        this.setState({ source: null })
        let payload = {
            pageNum: 1,
            tabType: 'PENDING'
        }
        dispatch(getIncustodyList(payload))
    }

    onStatusChange = (status) => {
        const { dispatch } = this.props
        const { filters } = this.state
        this.setState({ status })
        let payload = {}
        if (Object(filters).length) {
            payload = { ...filters, tabType:status }
        }
        payload = { tabType: status, pageNum: 1 }
        dispatch(getIncustodyList(payload))
        this.setState({ dateType: null })
        this.setState({ fromDate: null })
        this.setState({ toDate: null })
        this.setState({ city: null })
        this.setState({ source: null })
    }

    handlePage = (page) => {
        const { dispatch } = this.props
        const { filters, status } = this.state
        let payload = {}
        if (Object(filters).length) {
            payload = { ...filters, tabType:status }
        }
        payload = { tabType:status, pageNum: page }
        dispatch(getIncustodyList(payload))
    }

    search = (searchKey,status) => {
        let payload = {}
        payload = { searchType: searchKey,tabType:status }
        const { dispatch } = this.props
        dispatch(getIncustodyList(payload))
    }

    clearSearch = () => {
        const { dispatch } = this.props
        let payload = {
            pageNum: 1,
            tabType: 'PENDING'
        }
        dispatch(getIncustodyList(payload))
    }

    inCustody = (leadId) => {
        const { dispatch } = this.props
        const payload = {
            leadId: leadId,
            userId: getUserID()
        }
        submitToInCustody(payload).
            then(apiResponse => {
                if (apiResponse.isValid) {
                    dispatch(setNotification('success', "Success", apiResponse.message))
                    let payload = {
                        pageNum: 1,
                        tabType: 'PENDING'
                    }
                    dispatch(getIncustodyList(payload))
                }
                else {
                    dispatch(setNotification('danger', "Error", apiResponse.message))
                }
            })
    }

    render() {
        const { status } = this.state
        return (
            <Fragment>
                <div>
                    <Header
                        onStatusClick={this.onStatusChange}
                        status={status}
                        onSearch={this.search}
                        onClearSearch={this.clearSearch}
                    />
                    <Filters
                        onApplyFilters={this.applyFilter}
                        onClearFilters={this.clearFilter}
                        status={status}
                        dateType={this.state.dateType}
                        fromDate={this.state.fromDate}
                        toDate={this.state.toDate}
                        city={this.state.city}
                        source={this.state.source}
                        onDateTypeChange={this.onDateTypeChange}
                        onFromDateChange={this.onFromDateChange}
                        onToDateChange={this.onToDateChange}
                        onCityChange={this.onCityChange}
                        onShowroomChange={this.onShowroomChange}
                    />
                    <Table
                        onPageChange={this.handlePage}
                        onInCustody={this.inCustody}
                        status={status}
                    />
                </div>
            </Fragment>
        )
    }
}

export default connect()(InCustodyConfirmation)