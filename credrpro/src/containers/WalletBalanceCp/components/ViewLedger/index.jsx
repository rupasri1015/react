import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { getAmount, getDate, renderString, getDatePayload } from '../../../../core/utility';
import { reduxForm } from 'redux-form';
import { connect, useDispatch, useSelector } from 'react-redux'
// import { BankIcon, CalenderIcon, RefreshIconWhite } from '../../../../core/utility/iconHelper';
import { getShdTransactions } from '../../../../redux/actions/shdTransactionAction'
import './walletDb.scss'
import { CloseIconLedger, ExportToExcel } from '../../../../core/utility/iconHelper'
import DropDown from '../../../../shared/components/form/DropDown'
// import DatePicker from '../../../../shared/components/DatePicker'
import { Button } from 'reactstrap'
import SearchRegNumber from '../../../../shared/components/form/SearchRegNumber'
// import { exportToExcelCP, getManualFetch } from '../../../../core/services/shdPaymentServices'
import FormHelperText from '@material-ui/core/FormHelperText'
// import RefundToBankDialog from '../RefundToBankDialog/index'
// import OTPPopUp from '../OTPPopUp/index'
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from "@material-ui/core";
import { setNotification } from '../../../../redux/actions/notificationAction';
import { hideLoader, showLoader } from '../../../../redux/actions/loaderAction';
import DatePicker from '../../../PerformanceDashboard/components/DatePicker';

function generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'abcdefghijklmnopqrstuvwxyz0123456789';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    const dataURI = canvas.toDataURL('image/jpeg');
    const b64 = dataURI.replace(/^data:image\/(png|jpg);base64,/, "");
    let hash = 0;
    for (let i = 0; i < b64.length; i++) {
        const char = b64.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

const ViewLedger = ({ closeLegderModal, list }) => {

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [city, setCity] = useState(null);
    const [searchText, setSearchText] = useState('')
    const [statusType, setStatusType] = useState('')
    const [error, setError] = useState(false)
    const dispatch = useDispatch()
    const gridRef = useRef();
    const [isOpenModelRefund, setIsOpenModelRefund] = useState(false);
    const [isOTPPopUp, setIsOTPPopUp] = useState(false);
    const [apiSelect, setApiSelect] = useState('');
    const [payload, setPayload] = useState({});
    const [dataOTP, setDataOTP] = useState([]);

    const [refreshPage, setRefreshPage] = useState(1);

    const useStylesBootstrap = makeStyles((theme) => ({
        arrow: {
            color: theme.palette.common.black,
        },
        tooltip: {
            backgroundColor: theme.palette.common.black,
            maxWidth: '175px',
            marginRight: '20px'
        },
    }));

    function BootstrapTooltip(props) {
        const classes = useStylesBootstrap();

        return <Tooltip arrow classes={classes} {...props} />;
    }


    console.log("generateFingerprint", generateFingerprint())


    useEffect(() => {
        if (list && list.storeId) {
            const payload = {
                storeId: list.storeId
            }
            dispatch(getShdTransactions(payload))
        }
    }, [refreshPage])

    const ledgerInfo = useSelector((state) => state.shdTransaction.shdTransactionsList);
    const shdWalletBalance = useSelector((state) => state.shdTransaction.shdWalletBalance)

    const propData = {}

    propData.personalAccountNumber = useSelector((state) => state.shdTransaction.personalAccountNumber);
    propData.personalIfscCode = useSelector((state) => state.shdTransaction.personalIfscCode);
    propData.storeId = list.storeId
    propData.walletId = list.walletId

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        const updateData = (data) => params.api.setRowData(data);
    };

    const getRowHeight = params => params.node.group ? 50 : 50;

    const setHeaderHeight = params => params.node.group ? 50 : 60;


    const renderDate = (item) => {
        return (
            <>
                {getDate(item.value)}
            </>
        )
    }

    const renderUtrNumber = (item) => {
        return (
            <>
                {renderString(item.value).toString()}
            </>
        )
    }
    const renderComments = (item) => {
        return (
            <BootstrapTooltip title={renderString(item.value).toString()}>
                <span>{"View Comments"}</span>
            </BootstrapTooltip>
        )
    }

    const renderStatus = (item) => {
        return (
            <>
                <p className={getClassName(item.value)} > {renderString(item.value)} </p>
            </>
        )
    }

    const renderPayentType = (item) => {
        return (
            <div>
                <button className={getPaymentClass(item.value)}> {item.value} </button>

            </div>
        )
    }

    const renderPayentAgainst = (item) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <button className={getPaymentAgainstClass(item.value)}> {item.value} </button><br />
                {item.data.creditUsageMessage && <span style={{ fontSize: "10px" }}>{item.data.creditUsageMessage}</span>}
            </div>
        )
    }

    const getClassName = (value) => {
        if (value === 'SUCCESS' || value === 'PROCESSED') return 'S'
        if (value === 'PENDING' || value === 'INITIATED') return 'P'
        if (value === 'FAILED') return 'F'
        if (value === 'PROCESSING') return 'Pcg'
    }

    const getPaymentClass = (type) => {
        if (type === 'CREDIT') return 'creditCl'
        if (type === 'DEBIT') return 'debitCl'
        if (type === 'REFUND' || type === 'WALLET REFUND' || type === 'BANK REFUND') return 'refundCl'
    }
    const getPaymentAgainstClass = (type) => {
        // if (type === 'CREDIT') return 'creditCl'
        // if (type === 'DEBIT') return 'debitCl'
        if (type === 'BANK REFUND' || type === 'WALLET REFUND') return 'refundPaymentAgainst'
        else {
            return 'paymentAgainst'
        }
    }

    const renderPayentAmountType = (item) => {
        return (
            <>
                <p className={(item.data.paymentType === 'CREDIT' || item.data.paymentType === 'WALLET REFUND') ? 'creditClText' : 'debitClText'}>{(item.data.paymentType === 'CREDIT' || item.data.paymentType === 'WALLET REFUND') ? '+' : '-'} {getAmount(item.value)} </p>
            </>
        )
    }

    const onStatusChange = (value) => {
        setStatusType(value)
    }

    const searchHandler = (searchText) => {
        let payload = {
            search: searchText,
            storeId: list.storeId
        }
        dispatch(getShdTransactions(payload))
    }

    const onSearchTypeHandler = (text) => {
        setSearchText(text)
    }

    const clearSearch = () => {
        setSearchText('')
        const payload = {
            storeId: list.storeId,
            pageNum: 1
        }
        dispatch(getShdTransactions(payload))
    }

    const applyFilter = () => {
        const payload = getPayload()
        dispatch(getShdTransactions(payload))
    }

    const clearFilter = () => {
        setFromDate(null)
        setToDate(null)
        setCity(null)
        setStatusType(null)
        setSearchText('')
        const payload = {
            storeId: list.storeId,
            pageNum: 1
        }
        dispatch(getShdTransactions(payload))
    }


    const getPayload = () => {
        let payload = {}
        if (city) payload.cityId = city.value
        if (fromDate) payload.fromDate = getDatePayload(fromDate)
        if (toDate) payload.toDate = getDatePayload(toDate)
        if (searchText) payload.search = searchText
        if (statusType) payload.paymentStatus = statusType.value
        if (list && list.storeId)
            payload.storeId = list.storeId
        payload.pageNum = 1

        return payload
    }

    const handleOpenModel = () => {
        setIsOpenModelRefund(true)
    }

    const callRefresh = () => {
        // dispatch(showLoader())
        // getManualFetch(list.walletId).
        //     then(apiResponse => {
        //         if (apiResponse.isValid) {
        //             dispatch(hideLoader())
        //             setRefreshPage(Math.random())
        //         } else {
        //             dispatch(hideLoader())
        //         }
        //     })
    }

    const openOTPPopPup = (dataOTP, payload, apiS) => {
        console.log(payload, dataOTP, apiS)
        setApiSelect(apiS)
        setPayload(payload)
        setDataOTP(dataOTP)
        setIsOpenModelRefund(false)
        setIsOTPPopUp(true)
    }


    const exportToExcel = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);

    return (
        <>
            <div className='create-bulk-wrap' style={{ overflowX: 'hidden' }}>
                <div className='headerLedger'>
                    <h4 className='headerInfo'>Wallet Balance: {getAmount(shdWalletBalance)}

                        <span>
                            <img
                                className="closeLedger"
                                src={CloseIconLedger}
                                onClick={closeLegderModal}
                                alt="X"
                                style={{ width: '14px' }}
                            />
                        </span>
                        {/* <button className='refreshButton' onClick={() => callRefresh()}>
                            <img src={RefreshIconWhite} className="btn-icon-square" alt="Download" />
                            Refresh
                        </button>
                        <button className='purpleButton' onClick={handleOpenModel}>
                            <img src={BankIcon} className="btn-icon-square" alt="Download" />
                            Refund in bank
                        </button> */}

                    </h4>
                </div>
                {
                    error && <FormHelperText style={{ color: '#FFFFFF' }}></FormHelperText>
                }
                <div className='pending-inventory-filter-container viewLeader_filter' style={{}}>
                    <div className="from-date-ledger" style={{ marginLeft: '18px' }}>
                        <p>{`From\u00a0Date`}</p>
                        <DatePicker
                            onDateChange={setFromDate}
                            max={toDate}
                            startDate={fromDate}
                            placeholder={"Select Date"}
                        />
                    </div>
                    <div className="from-date-ledger" style={{ marginLeft: '18px' }}>
                        <p>{`To\u00a0Date`}</p>
                        <DatePicker
                            onDateChange={setToDate}
                            min={fromDate}
                            startDate={toDate}
                            placeholder={"Select Date"}
                        />
                    </div>
                    <div className="from-date" style={{ marginLeft: '18px', maxWidth: '280px' }}>
                        <p style={{ marginLeft: '7px' }}>{`Payment\u00a0Status`}</p>
                        <DropDown
                            className="form-group ml-2"
                            style={{ margin: 0 }}
                            options={[{ value: "Debit", label: "Debit" }, { value: "Credit", label: "Credit" }, { value: "Refund", label: "Refund" }]}
                            onChange={onStatusChange}
                            placeholder="Select Status"
                            value={statusType}
                        />
                    </div>
                    <Button color="success" type="button" className="rounded no-margin ml-5" onClick={applyFilter}>Apply</Button>
                    <Button className="rounded no-margin" type="button" onClick={clearFilter}>Clear</Button>
                    <div className="regNumberSearch regNumberSearch_WalletCP" style={{ maxWidth: '300px' }}>
                        <SearchRegNumber
                            onSearch={searchHandler}
                            searchText={searchText}
                            onClearSearch={clearSearch}
                            onSearchType={onSearchTypeHandler}
                            placeHolder='Search by UTR Number/Wallet Txn ID'
                            withButton={true}
                            fromLedger={true}
                            onEnter={searchHandler}
                        />
                    </div>
                    <div className="exportToExcleLedger" onClick={exportToExcel} style={{}}>
                        <img
                            className="exportLedger"
                            src={ExportToExcel}
                            alt="X"
                            style={{ height: '13px', position: 'absolute', marginLeft: '-11px' }}
                        />
                        <span style={{ fontSize: '15px', marginLeft: '20px' }}> Export to excel </span>
                    </div>
                </div>
                { ledgerInfo.length > 0 && 
                <>
                    <div className='ww'>
                        <div className="ag-theme-alpine" style={{ height: 850, width: '100%' }}>
                            <div style={{ width: '100%', height: '100%' }}>
                                <div
                                    id="myGrid"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                    className="ag-theme-alpine"
                                >
                                    
                                    <AgGridReact
                                        ref={gridRef}
                                        reactUi="true"
                                        defaultColDef={{
                                            initialWidth: 170,
                                            sortable: true,
                                            resizable: true,
                                            editable: true,
                                            filter: true,
                                            headerClass: "gridHeader",
                                        }}
                                        getRowHeight={getRowHeight}
                                        rowData={ledgerInfo}
                                        setHeaderHeight={setHeaderHeight}
                                        rowSelection={'single'}
                                        // pagination={true}
                                        // paginationPageSize={10}
                                        editable={true}
                                        onGridReady={onGridReady}
                                        enableCellTextSelection={true}
                                    >
                                        <AgGridColumn field="leadId" wrapText={true} autoHeight={true} editable={false} headerName='Lead ID' cellRenderer={renderUtrNumber} />
                                        <AgGridColumn field="wallettxnId" wrapText={true} autoHeight={true} editable={false} headerName='Wallet Txn ID' cellRenderer={renderUtrNumber} />
                                        <AgGridColumn field="utrNumber" wrapText={true} autoHeight={true} editable={false} headerName='UTR Number' cellRenderer={renderUtrNumber} />
                                        <AgGridColumn field="createdDate" wrapText={true} autoHeight={true} editable={false} headerName='Created Date' cellRenderer={renderDate} />
                                        <AgGridColumn field="txnPaymentId" wrapText={true} autoHeight={true} editable={false} headerName='Transaction ID' cellRenderer={renderUtrNumber} />
                                        <AgGridColumn field="txnAmount" wrapText={true} autoHeight={true} editable={false} headerName='Transaction Amount' cellRenderer={renderPayentAmountType} />
                                        <AgGridColumn field="paymentType" wrapText={true} autoHeight={true} editable={false} headerName='Transaction Type' cellRenderer={renderPayentType} />
                                        <AgGridColumn field="paymentAgainst" wrapText={true} autoHeight={true} editable={false} headerName='Payment Against' cellRenderer={renderPayentAgainst} />
                                        <AgGridColumn field="transferredFrom" wrapText={true} autoHeight={true} editable={false} headerName='Transferred From' cellRenderer={renderUtrNumber} />
                                        <AgGridColumn field="txnMessage" wrapText={true} autoHeight={true} editable={false} headerName='Payment Details' cellRenderer={renderUtrNumber} />
                                        <AgGridColumn field="paymentStatus" wrapText={true} autoHeight={true} editable={false} headerName='Payment Status' cellRenderer={renderStatus} />
                                        <AgGridColumn field="refundPaymentStatus" wrapText={true} autoHeight={true} editable={false} headerName='Refund Payment Status' cellRenderer={renderStatus} />
                                        <AgGridColumn field="refundPayoutId" wrapText={true} autoHeight={true} editable={false} headerName='Refund Payout ID' cellRenderer={renderUtrNumber} />
                                        <AgGridColumn field="comments" wrapText={true} autoHeight={true} editable={false} headerName='Comments' cellRenderer={renderComments} />
                                    </AgGridReact>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
}
                {/* {isOpenModelRefund && (
                    <RefundToBankDialog
                        userData={propData}
                        walletBalance={shdWalletBalance}
                        open={isOpenModelRefund}
                        onClose={() => setIsOpenModelRefund(false)}
                        openOTPPopPup={openOTPPopPup}
                    // refreshPage={false}
                    />
                )} */}
                {/* {isOTPPopUp && (
                    <OTPPopUp
                        apiSelect={apiSelect}
                        payload={payload}
                        dataOTP={dataOTP}
                        open={isOTPPopUp}
                        onClose={() => setIsOTPPopUp(false)}
                    // openModel={handleOpenModel}
                    // editLimit={this.editLimit}
                    // refreshPage={false}
                    />
                )} */}
            </div>
        </>
    );
};

const ReduxForm = reduxForm({
    form: 'bulk-sale-form',
})(ViewLedger)

export default connect()(ReduxForm)

