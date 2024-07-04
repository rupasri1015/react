import React, { Component, Fragment } from 'react'
import CommissionHeader from './components/Header'
import CommissionTable from './components/Table'
import ShdDialog from './components/Dialogs/shdDetails'
import VehicleDialog from './components/Dialogs/vehicleDialog'
import { addShdCommission, getShdDetailsById } from '../../core/services/shdServices'
import { getUserID } from '../../core/services/rbacServices'
import { getShdCommission } from '../../redux/actions/shdCommissionAction'
import { connect } from 'react-redux'
import { autoShdCommissionRefresh, stopShdRefresh } from '../../core/utility'
import ViewCommission from './components/Dialogs/view_commission'
import Commission from './components/Dialogs/edit_commisson'
import AddCommission from './components/Dialogs/add_commission'
import { getOrderDeductions } from '../../core/services/shdServices'
import { setNotification } from '../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'

class SHDCommission extends Component {

    state = {
        status: 'LIVE',
        showVehicleDetails: false,
        showShdInfo: false,
        showAddCommission: true,
        shdInformation: {},
        viewData: {},
        shdInfo: {},
        viewAll: false,
        isOpen: false,
        action: "",
        leadID: null,
        enableForm: true,
        userId: null,
        openAdd: false
    }
    componentDidMount() {
        autoShdCommissionRefresh(this.refreshShdCommission())
    }

    componentWillMount() {
        stopShdRefresh()
    }

    refreshShdCommission() {
        const { dispatch } = this.props
        const { status } = this.state
        let payload = {
            status: status,
            userId: getUserID(),
            pageNum: 1
        }
        dispatch(getShdCommission(payload))
    }

    changeStatus = (status) => {
        this.setState({ status })
        const { dispatch } = this.props
        let payload = {
            status: status,
            pageNum: 1,
            userId: getUserID()
        }
        dispatch(getShdCommission(payload))
    }
    showVehicleDialog = (shdData) => {
        this.setState({ showVehicleDetails: true, shdInformation: shdData })
    }
    showShdDetails = (shdData) => {
        this.setState({ showShdInfo: true, shdInformation: shdData })
        getShdDetailsById(shdData.transactionId)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ shdInfo: apiResponse.shdwininfo })
                }
            })
    }
    closeVehicleDialog = () => {
        this.setState({ showVehicleDetails: false })
    }
    closeShdDialog = () => {
        this.setState({ showShdInfo: false })
    }
    submitCommission = (commission, shdData) => {
        let payload = {
            leadId: shdData.leadId,
            commission,
            userId: shdData.userId,
            loginId: getUserID()
        }
        addShdCommission(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.refreshShdCommission()
                }
            })
    }
    handlePageChange = (pageNum) => {
        const { status } = this.state
        const { dispatch } = this.props
        let payload = {
            status,
            pageNum,
            userId: getUserID()
        }
        dispatch(getShdCommission(payload))
    }

    searchByKeyword = (search) => {
        const { status } = this.state
        const { dispatch } = this.props
        let payload = {
            status,
            pageNum: 1,
            userId: getUserID(),
            searchString: search
        }
        dispatch(getShdCommission(payload))
    }
    viewShdCom = (id) => {
        let formData = {}
        const { dispatch } = this.props
        getOrderDeductions(id)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ viewData: apiResponse.orderDeductionsResponse })
                    formData.commission = apiResponse.orderDeductionsResponse.extraShdCommission
                    formData.cityLevelCommission = apiResponse.orderDeductionsResponse.cityLevelCommission
                    formData.userTrafficChalan = apiResponse.orderDeductionsResponse.userDeductions.userTrafficChalan
                    formData.shdTrafficChalan = apiResponse.orderDeductionsResponse.shdDeductions.shdTrafficChalan
                    formData.userHpRtoCharges = apiResponse.orderDeductionsResponse.userDeductions.userHpRtoCharges
                    formData.shdHpRtoCharges = apiResponse.orderDeductionsResponse.shdDeductions.shdHpRtoCharges
                    formData.userNocCharges = apiResponse.orderDeductionsResponse.userDeductions.userNocCharges
                    formData.shdNocCharges = apiResponse.orderDeductionsResponse.shdDeductions.shdNocCharges
                    formData.userVehicleCondition = apiResponse.orderDeductionsResponse.userDeductions.userVehicleCondition
                    formData.shdVehicleCondition = apiResponse.orderDeductionsResponse.shdDeductions.shdVehicleCondition
                    formData.userMiscellaneous = apiResponse.orderDeductionsResponse.userDeductions.userMiscellaneous
                    formData.shdMiscellaneous = apiResponse.orderDeductionsResponse.shdDeductions.shdMiscellaneous
                    formData.comments = apiResponse.orderDeductionsResponse.comments
                    formData.credrPlusAmount = apiResponse.orderDeductionsResponse.credrPlusAmount
                    formData.highestBid = apiResponse.orderDeductionsResponse.highestBid
                    formData.docQc2Deductions = apiResponse.orderDeductionsResponse.docQc2Deductions
                    this.setState({ viewData: formData })
                    this.setState({ viewAll: true })
                }
                else {
                    dispatch(setNotification('danger', 'Error', 'Network error'))
                }
            })

    }
    add = (cityCom, leadID, userId, bidAmount, csm, rto, challan) => {
        this.setState({ leadID: leadID })
        this.setState({ userId: userId })
        const { dispatch } = this.props
        let formData = {
            extraShdCommission: "",
            cityLevelCommission: "",
            traffic_challan: "",
            hp_rto: "",
            noc: "",
            vehicle_condition: "",
            miscellaneous: "",
            comments: "",
            credrPlusAmount: "",
            highestBid: "",
            userTrafficChalan:""
        }
        formData.credrPlusAmount = csm
        formData.cityLevelCommission = cityCom
        formData.highestBid = bidAmount
        formData.userTrafficChalan = challan
        formData.hp_rto = rto
        this.setState({ openAdd: true })
        this.setState({ action: "Add" })
        this.setState({ viewData: formData })
        this.setState({ enableForm: false })
    }

    edit = (orderId, leadID, userId) => {
        this.setState({ leadID: leadID })
        this.setState({ userId: userId })
        const { dispatch } = this.props
        let formData = {}
        getOrderDeductions(leadID)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    formData.commission = apiResponse.orderDeductionsResponse.extraShdCommission
                    formData.cityLevelCommission = apiResponse.orderDeductionsResponse.cityLevelCommission
                    formData.userTrafficChalan = apiResponse.orderDeductionsResponse.userDeductions.userTrafficChalan
                    // formData.shdTrafficChalan = apiResponse.orderDeductionsResponse.shdDeductions.shdTrafficChalan
                    formData.userHpRtoCharges = apiResponse.orderDeductionsResponse.userDeductions.userHpRtoCharges
                    // formData.shdHpRtoCharges = apiResponse.orderDeductionsResponse.shdDeductions.shdHpRtoCharges
                    formData.userNocCharges = apiResponse.orderDeductionsResponse.userDeductions.userNocCharges
                    // formData.shdNocCharges = apiResponse.orderDeductionsResponse.shdDeductions.shdNocCharges
                    formData.userVehicleCondition = apiResponse.orderDeductionsResponse.userDeductions.userVehicleCondition
                    // formData.shdVehicleCondition = apiResponse.orderDeductionsResponse.shdDeductions.shdVehicleCondition
                    formData.userMiscellaneous = apiResponse.orderDeductionsResponse.userDeductions.userMiscellaneous
                    // formData.shdMiscellaneous = apiResponse.orderDeductionsResponse.shdDeductions.shdMiscellaneous
                    formData.comments = apiResponse.orderDeductionsResponse.comments
                    formData.credrPlusAmount = apiResponse.orderDeductionsResponse.credrPlusAmount
                    formData.highestBid = apiResponse.orderDeductionsResponse.highestBid
                    formData.docQc2Deductions = apiResponse.orderDeductionsResponse.docQc2Deductions
                    this.setState({ viewData: formData })
                    this.setState({ isOpen: true })
                    this.setState({ action: "Edit" })
                    this.setState({ enableForm: true })
                }
                else {
                    dispatch(setNotification('danger', 'Error', 'Network error'))
                }

            })



    }
    enableEditing = () => {
        this.setState({ enableForm: !this.state.enableForm })
    }
    closeView = () => {
        this.setState({ viewAll: false })
    }
    closeForm = () => {
        this.setState({ isOpen: false })
    }
    closeAddForm = () => {
        this.setState({ openAdd: false })
    }
    onSubmit = (payload) => {
        const { leadID, userId } = this.state
        const { dispatch } = this.props
        dispatch(showLoader())
        payload.leadId = leadID
        payload.loginId = getUserID()
        payload.userId = userId
        delete payload.shdHpRtoCharges
        delete payload.shdMiscellaneous
        delete payload.shdNocCharges
        delete payload.shdTrafficChalan
        delete payload.shdVehicleCondition
        delete payload.userMiscellaneous
        delete payload.userNocCharges
        delete payload.userVehicleCondition
        payload.rtoCharges = payload.userHpRtoCharges
        payload.challanCharges = payload.userTrafficChalan
        payload.shdAdditionalCommission = payload.commission
        payload.docMissingCharges = payload.docQc2Deductions
        delete payload.userHpRtoCharges
        delete payload.userTrafficChalan
        delete payload.commission
        delete payload.docQc2Deductions
        addShdCommission(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ openAdd: false, isOpen: false })
                    dispatch(setNotification('success', 'Success', apiResponse.message))
                }
                else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message))

                }
            })
        this.refreshShdCommission()
        setTimeout(() => {
            dispatch(hideLoader())
        }, 4000)
    }

    clearSearch = () => {
        const { status } = this.state
        let payload = {
            status,
            pageNum: 1,
            userId: getUserID(),
        }
        const { dispatch } = this.props
        dispatch(getShdCommission(payload))
    }

    render() {
        const { status, viewData, isOpen, action, enableForm, viewAll, showVehicleDetails, showShdInfo, showAddCommission, shdInformation, shdInfo, openAdd } = this.state
        return (
            <Fragment>
                <div>
                    <h4>Commission Details</h4>
                    <CommissionHeader
                        status={status}
                        onChangeStatus={this.changeStatus}
                        onSearch={this.searchByKeyword}
                        onClearSearch={this.clearSearch}
                    />
                    <CommissionTable
                        status={status}
                        onVehicleDetails={this.showVehicleDialog}
                        onShdDetails={this.showShdDetails}
                        onSubmitCommission={this.submitCommission}
                        showAddCommission={showAddCommission}
                        onView={this.viewShdCom}
                        onAdd={this.add}
                        onEdit={this.edit}
                        onPageChange={this.handlePageChange}
                    />
                </div>
                {
                    showShdInfo &&
                    <ShdDialog
                        open={showShdInfo}
                        shdInformation={shdInformation}
                        onClose={this.closeShdDialog}
                        shdInfo={shdInfo}
                    />
                }
                {
                    showVehicleDetails &&
                    <VehicleDialog
                        open={showVehicleDetails}
                        onClose={this.closeVehicleDialog}
                    />
                }
                {
                    viewAll &&
                    <ViewCommission
                        open={viewAll}
                        viewData={viewData}
                        close={this.closeView}>
                        </ViewCommission>
                }
                {
                    isOpen &&
                    <Commission
                        open={isOpen}
                        viewData={viewData}
                        action={action}
                        close={this.closeForm}
                        onSubmit={this.onSubmit}
                        enableForm={enableForm}
                        enableEditing={this.enableEditing}>
                    </Commission>
                }
                {
                    openAdd &&
                    <AddCommission
                        open={openAdd}
                        viewData={viewData}
                        action={action}
                        close={this.closeAddForm}
                        onSubmit={this.onSubmit}
                        enableForm={enableForm}
                        enableEditing={this.enableEditing}>
                    </AddCommission>
                }
            </Fragment>
        )

    }
}

export default connect()(SHDCommission)