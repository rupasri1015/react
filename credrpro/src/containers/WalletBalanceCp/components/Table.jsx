import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { getStoreTransactionsDetails } from '../../../redux/actions/storeTransactionListAction'
import { renderString, getAmount, getTitleCase } from '../../../core/utility/stringUtility'
import { getCityID } from '../../../core/services/authenticationServices'
import './walletBalanceStyles.scss'
import ViewLedger from './ViewLedger'
import EditCreditLimitDialog from './EditCreditLimitDialog'
import ViewCreditStatusDialog from './ViewCreditStatusDialog'
import OTPPopUp from './OTPPopUp'
import Drawer from "@material-ui/core/Drawer";
import './ViewLedger/walletDb.scss'
import { EditIcon } from '../../../core/utility/iconHelper'
import { getUserCreditLimit } from '../../../core/services/shdServices'
import { getUserCityList } from '../../../core/services/userInfoStorageServices'

const columns = [
    { id: 'storeId', label: 'Store ID' },
    { id: 'walletID', label: 'Wallet ID' },
    { id: 'storeName', label: 'Store Name' },
    { id: 'ownerName', label: 'Owner Name' },
    { id: 'storeCity', label: 'Store City' },
    { id: 'virtualId', label: 'Virtual Account ID' },
    { id: 'walletBalance', label: 'Wallet Balance' },
    { id: 'walletStatus', label: 'Wallet Status' },
    { id: 'creditLimit', label: 'Credit Limit' },
    // { id: 'action', label: 'Action' },
]

let updateReject = ''

class WalletApproveTable extends Component {

    state = {
        drawer: false,
        openSnackbar: false,
        openUndoSnackbar: false,
        snackBarType: '',
        openLedger: false,
        list: {},
        drawerInfo: {},
        isOpenModelEdit: false,
        isOpenModelView: false,
        isOTPPopUp: false,
        showEdit: false,
        editWalletID: '',
        userCredit: [],
        apiSelect: '',
        payload: {},
        dataOTP: []
    }

    componentDidMount() {
        const { dispatch } = this.props
        const payload = {
            pageNum: 1
        }
        dispatch(getStoreTransactionsDetails(payload))
    }

    pageChange = (page) => {
        const { onPageChange } = this.props
        onPageChange(page)
    }

    openDrawer = (e, list) => {
        e.stopPropagation();
        this.setState({ drawer: false, openLedger: true, list })
    }

    getCount = () => {
        const { pendingCount, approvedCount, rejectedCount, leadStatus } = this.props
        if (leadStatus === 'Pending') return pendingCount
        if (leadStatus === 'Approved') return approvedCount
        if (leadStatus === 'Rejected') return rejectedCount
    }

    onRowClick = (list) => {
        this.setState({ drawer: true, drawerInfo: list })
    }

    onSnackbarClose = () => {
        this.setState({ openSnackbar: false })
    }

    undoAction = () => {
        this.setState({ openUndoSnackbar: true, openSnackbar: false })
        clearTimeout(updateReject)
    }

    getDuration = (pickUpDate) => {
        if (pickUpDate && pickUpDate) {
            let date1 = new Date(pickUpDate)
            date1.setHours(date1.getHours());
            let pickUpTimeStamp = date1
            var d = new Date();
            var difference = d.getTime() - pickUpTimeStamp.getTime();
            let timeInMinutes = difference / 1000 / 60
            if (timeInMinutes < 60) {
                var A = new Date();
                let date2 = new Date(pickUpDate)
                let date3 = date2.setHours(date1.getHours() + 1);
                let newV = new Date().setHours(new Date().getHours())
                let sd = date3 - newV
                return `Left ${Math.round(sd / 1000 / 60)} Min`
            }
            if (timeInMinutes > 60) {
                let hours = difference / 1000 / 60 / 60
                if (hours >= 24) {
                    return `Dealyed by ${Math.round(hours / 24)}d`
                }
                return `Delayed by ${Math.round(timeInMinutes / 60)}h`
            }
        }
    }

    getActualDuration = (pickUpDate) => {
        if (pickUpDate && pickUpDate) {
            let date1 = new Date(pickUpDate)
            date1.setHours(date1.getHours());
            let pickUpTimeStamp = date1
            var d = new Date();
            var difference = d.getTime() - pickUpTimeStamp.getTime();
            let timeInMinutes = difference / 1000 / 60
            if (timeInMinutes < 60) {
                return `${Math.round(timeInMinutes)}m`
            }
            if (timeInMinutes > 60) {
                let hours = difference / 1000 / 60 / 60
                if (hours >= 24) {
                    return `${Math.round(hours / 24)}d`
                }
                return `${Math.round(timeInMinutes / 60)}h`
            }
        }
    }

    removeHiphen = (value) => {
        if (value && value < 0) {
            let newValue = value.toString().split('-')
            if (newValue)
                return newValue[1]
        }
        else return value
    }

    getClassName = (value) => {
        if (value === 'ACTIVE') {
            return 'activeIClass'
        }
        else return `inActiveClass`
    }
    getClassNameCredit = (value) => {
        if (value === 'ENABLED') {
            return 'creditStatus enabled'
        } else if (value === 'DISABLED' || value === 'EXPIRED') {
            return 'creditStatus disabled'
        } else if (value === 'PENDING') {
            return 'creditStatus pendingT'
        }
        else return ``
    }

    openModel = (walletId) => {
        // To update table data After Wallet Update
        const { dispatch } = this.props
        const payload = {
            pageNum: 1
        }
        dispatch(getStoreTransactionsDetails(payload))

        getUserCreditLimit(walletId).
            then(apiResponse => {
                if (apiResponse.isValid) {
                    if (apiResponse.data.status === "CREDIT_NOT_SET") {
                        this.setState({ isOpenModelEdit: true })
                    } else {
                        this.setState({ isOpenModelView: true })
                    }
                    this.setState({ userCredit: apiResponse.data })
                }
            })
    }

    editLimit = (userInfo) => {
        this.setState({ isOpenModelView: false })
        this.setState({ isOpenModelEdit: true })

        this.setState({ userCredit: userInfo })
    }

    openOTPPopPup = (apiResponse, payloadData, apiSelector) => {
        this.setState({ apiSelect: apiSelector })
        this.setState({ payload: payloadData })
        this.setState({ dataOTP: apiResponse })
        this.setState({ isOpenModelEdit: false })
        this.setState({ isOTPPopUp: true })
    }



    render() {
        const { walletApproveList, pageNum, count } = this.props
        const { openLedger, list, isOpenModelEdit, isOpenModelView, isOTPPopUp, showEdit, userCredit, apiSelect, payload, dataOTP, editWalletID } = this.state
        return (
            <>
                <div className="table-wraper marginFranchiseTop">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {
                                    columns.map(column => (
                                        <TableCell key={column.id}>
                                            {column.label}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                // walletApproveList && Boolean(walletApproveList.length) && walletA÷pproveList.filter(record => (getUserCityList()).includes(record.storeCityId)).map((list, index) => {
                                walletApproveList && Boolean(walletApproveList.length) && walletApproveList.map((list, index) => {
                                    return (
                                        <TableRow hover tabIndex={-1} key={`${index} `} onClick={() => this.onRowClick(list)}>
                                            <TableCell>
                                                <p>{renderString(list.storeId)}</p>
                                            </TableCell>
                                            <TableCell>
                                                {renderString(list.walletId)}
                                            </TableCell>
                                            <TableCell>
                                                {renderString(list.storeName)}
                                            </TableCell>
                                            <TableCell>
                                                {renderString(list.channelPartnerName)}
                                            </TableCell>
                                            <TableCell>
                                                {renderString(list.storeCityName)}
                                            </TableCell>
                                            <TableCell>
                                                {renderString(list.virtualAccountId)}
                                            </TableCell>
                                            <TableCell>
                                                {getAmount(list.walletBalance)}
                                                {list.walletBalance < 0 && <span className='balanceOut'>{`OUTSTANDING\u00a0BALANCE`}</span>}
                                            </TableCell>

                                            <TableCell>
                                                <button className={this.getClassName(list.walletStatus)}>{renderString(list.walletStatus)}</button>
                                            </TableCell>
                                            <TableCell>
                                                <span style={{display:"flex", justifyContent:"space-between", alignItems:'center'}}>
                                                <span className={this.getClassNameCredit(list.creditOfferStatus)}></span>
                                                    {getTitleCase(list.creditOfferStatus)}
                                                {list.walletStatus === "ACTIVE" &&
                                                    <a className="icon_edit" onClick={() => this.openModel(list.walletId)} style={{ cursor: 'pointer', marginLeft:'5px' }}
                                                    > <img src={EditIcon} id={list.orderID} alt="Edit Credit Limit" /></a>}
                                                </span>
                                                
                                                {/* {list.creditOfferStatus} */}

                                            </TableCell>
                                            {/* <TableCell>
                                                <button className="viewLedger" onClick={(e) => this.openDrawer(e, list)}>View Ledger</button>
                                            </TableCell> */}
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                    <div className="table-paginator">
                        {
                            walletApproveList && Boolean(walletApproveList.length) ?
                                <Pagination
                                    className="float-right"
                                    current={pageNum}
                                    total={count}
                                    pageSize={10}
                                    locale={localeInfo}
                                    onChange={this.pageChange}
                                />
                                :
                                <Fragment />
                        }
                    </div>
                    {/* {
                        <Drawer
                            variant="temporary"
                            anchor="bottom"
                            open={openLedger}
                            onClose={this.closePayout}
                            className='ledgerDb'
                        >
                            <ViewLedger list={list} closeLegderModal={() => this.setState({ openLedger: false })} />
                        </Drawer>
                    } */}
                    {isOpenModelEdit && (
                        <EditCreditLimitDialog
                            userCredit={userCredit}
                            open={isOpenModelEdit}
                            onClose={() => this.setState({ isOpenModelEdit: false })}
                            openOTPPopPup={this.openOTPPopPup}
                        />
                    )}

                    {isOpenModelView && (
                        <ViewCreditStatusDialog
                            userCredit={userCredit}
                            open={isOpenModelView}
                            onClose={() => this.setState({ isOpenModelView: false })}
                            editLimit={this.editLimit}
                            openOTPPopPup={this.openOTPPopPup}
                        />
                    )}

                    {isOTPPopUp && (
                        <OTPPopUp
                            apiSelect={apiSelect}
                            dataOTP={dataOTP}
                            payload={payload}
                            open={isOTPPopUp}
                            onClose={() => this.setState({ isOTPPopUp: false })}
                            openModel={this.openModel}
                        />
                    )}
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    walletApproveList: state.storeTrans.storeTransactionsList,
    count: state.storeTrans.count,
    pageNum: state.storeTrans.pageNum
})

export default connect(mapStateToProps)(WalletApproveTable)