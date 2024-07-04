import { Button, IconButton } from "@material-ui/core";
import React, { Fragment, useRef, useState } from "react";
import { renderString } from "../../../core/utility";
import edit from '../../../shared/img/icons/edit-icon.svg';
import styles from '../styles.module.scss'
import RefreshIcon from '@material-ui/icons/Refresh';
import uploadIcon from '../../../shared/img/icons/upload.svg';
import removeicon from '../../../shared/img/icons/ic_remove.svg';
import dropDownIcon from '../../../shared/img/icons/drop_down_2.svg';
import greenTicketIcon from '../../../shared/img/icons/green_tick.svg';
import pendingIcon from '../../../shared/img/icons/red_pending.svg';
import { useDispatch } from "react-redux";
import { getUserID } from '../../../core/services/rbacServices';
import { editBankDetails, editRazorpayName, getDetailsByFundId, updateBankDetailStatus } from '../../../core/services/documentQcServices';
import { setNotification } from '../../../redux/actions/notificationAction';
import { useEffect } from "react";
import Viewer from "react-viewer";

export const BankVerificationDropDown = ({accountStatus,fundAccountType ,refreshRazorpay, openDocument, setOpenDocument, vehicle, refreshData, isEdit, handleStatus, handleCompareName }) => {
    const bool = vehicle.customerUpi ? false : true
    const dispatch = useDispatch();
    const [rcName, setRcName] = useState();
    const [enableRcName, setEnableRcName] = useState(false);
    const inputRcName = useRef(null);

    const [accHolderName, setAccHolderName] = useState()
    const [enableAccName, setEnableAccName] = useState(false)
    const inputAccName = useRef(null);

    const [customerName, setCustomerName] = useState()
    const [enableCustomerName, setEnableCustomerName] = useState(false)
    const inputCustomerName = useRef(null);

    const [ifsc, setIfsc] = useState()
    const [enableIfsc, setEnableIfsc] = useState(false)
    const inputIfsc = useRef(null)

    const [accNum, setAccNum] = useState()
    const [enableAccNum, setEnableAccNum] = useState(false)
    const inputAccNum = useRef(null)

    const [isSameName, setIsSameName] = useState()
    const [bankVerificationStatus, setBankVerificationStatus] = useState()

    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [isImageOpen, setImageOpen] = useState(false);

    const [isApprove,setIsApprove] =useState();
    const [validAcc,setValidAcc] = useState();

    useEffect(() => {
        setRcName(vehicle.rcName)
        setAccHolderName(vehicle.accountHolderName)
        setCustomerName(vehicle.customerName)
        setIfsc(vehicle.ifscCode)
        setAccNum(vehicle.customerAccountNumber)
        setIsSameName(vehicle.rcName === vehicle.customerName && vehicle.accountHolderName === vehicle.customerName &&
            vehicle.razorpayName === vehicle.customerName)
        setBankVerificationStatus(vehicle.bankVerificationStatus)
        setIsApprove(!vehicle.rcName || !vehicle.customerName || !vehicle.accountHolderName || !vehicle.razorpayName )
    }, [vehicle])

    const nameCompare = () => {
        setIsSameName(rcName === customerName && accHolderName === customerName)
        handleCompareName(rcName === customerName && accHolderName === customerName)
    }
    const handleApprove = () => {
        setIsApprove(!rcName || !vehicle.customerName || !vehicle.accountHolderName || !vehicle.razorpayName)    
    }
    const onInputRcName = (e) => {
        if (e.keyCode === 13) {
            const payload = {
                leadId: vehicle.leadId,
                userId: getUserID(),
                rcName: e.target.value,
            };
            editBankDetails(payload).then((apiResponse) => {
                if (apiResponse.isValid) {
                    dispatch(setNotification('success', 'Success', apiResponse.message));
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message));
                }
                setEnableRcName(false);
            });
        }
        nameCompare()
        handleApprove();
    }
    const onInputAccHolderName = (e) => {
        if (e.keyCode === 13) {
            const payload = {
                leadId: vehicle.leadId,
                userId: getUserID(),
                accountHolderName: e.target.value,
            }
            editBankDetails(payload).then((apiResponse) => {
                if (apiResponse.isValid) {
                    dispatch(setNotification('success', 'Success', apiResponse.message));
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message));
                }
                setEnableAccName(false);
            });
        }
        nameCompare()
    }

    const onInputCustomerName = (e) => {
        if (e.keyCode === 13) {
            const payload = {
                leadId: vehicle.leadId,
                userId: getUserID(),
                customerName: e.target.value,
            }
            editBankDetails(payload).then((apiResponse) => {
                if (apiResponse.isValid) {
                    dispatch(setNotification('success', 'Success', apiResponse.message));
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message));
                }
                setEnableCustomerName(false);
            });
        }
        nameCompare()
    }

    const onInputIfsc = (e) => {
        if (e.keyCode === 13) {
            const payload = {
                leadId: vehicle.leadId,
                userId: getUserID(),
                ifscCode: e.target.value,
            }
            editBankDetails(payload).then((apiResponse) => {
                if (apiResponse.isValid) {
                    dispatch(setNotification('success', 'Success', apiResponse.message));
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message));
                }
                setEnableIfsc(false);
            });
        }
    }
    const onInputAccNum = (e) => {
        if (e.keyCode === 13) {
            const payload = {
                leadId: vehicle.leadId,
                userId: getUserID(),
                accountNumber: e.target.value,
            }
            editBankDetails(payload).then((apiResponse) => {
                if (apiResponse.isValid) {
                    dispatch(setNotification('success', 'Success', apiResponse.message));
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message));
                }
                setEnableAccNum(false);
            });
        }
    }

    const handleBankStatus = (BankDetailStatus) => {
        const payload = {
            leadId: vehicle.leadId,
            userId: getUserID(),
            status: BankDetailStatus
        }
        updateBankDetailStatus(payload).then((apiResponse) => {
            if (apiResponse.isValid) {
                dispatch(setNotification('success', 'Success', apiResponse.message));
            } else {
                dispatch(setNotification('danger', 'Error', apiResponse.message));
            }
        })
        handleStatus(BankDetailStatus)
        setBankVerificationStatus(BankDetailStatus)
    }

    const refreshRazorpayName = (accType) => {
        if(fundAccountType){
        const payload = {
            leadId: vehicle.leadId,
            accountType: `${fundAccountType === 'bank_account' ? "IMPS" : "VPA"}`
        }
        getDetailsByFundId(payload)
        .then(apiResponse => {
            if (apiResponse) {
                setValidAcc(apiResponse.createValidationResponse.results.accountStatus)
            }
        })
        refreshRazorpay(vehicle.leadId)
    }}
    const closeImageViewer = () => {
        setImageOpen(false);
        setCurrentIndex(0);
      };

    const statusIcon = bankVerificationStatus === "MISMATCHED" ? pendingIcon : greenTicketIcon;

    if (openDocument)
        return (
            <div
                className={styles.dropDownContainer}
                onClick={() => setOpenDocument(!openDocument)}
            >
                <span style={{ fontSize: 15 }}>
                    <span style={{ fontSize: 15, textTransform: 'capitalize' }}>
                        Bank Verification Details
                    </span>
                    {true && (
                        <span style={{ marginLeft: 6, fontSize: 18, color: 'red' }}>
                            *
                        </span>
                    )}
                </span>
                <div className="flex">
                    <img
                        src={statusIcon}
                        alt="open"
                        className={styles.documentStatusIcon}
                    />
                    <img
                        src={dropDownIcon}
                        alt="open"
                        className={styles.dropdownIcon}
                    />
                </div>
            </div>
        );

    return (
        <div>
            <div
                className={styles.expandedDropDown}
                onClick={() => setOpenDocument(!openDocument)}
            >
                <span style={{ fontSize: 15 }}>
                    <span
                        style={{
                            padding: '8px 15px',
                            background: '#FFDEC7',
                            width: '220px',
                            color: '#98360C',
                            letterSpacing: '0.05ch',
                            borderTopLeftRadius: '5px',
                        }}
                    >
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>Bank Verification Details</span>
                    </span>
                    {true && (
                        <span style={{ marginLeft: 6, fontSize: 18, color: 'red' }}>
                            *
                        </span>
                    )}
                </span>
                <div className="flex">
                    <img
                        src={statusIcon}
                        alt="open"
                        className={styles.documentStatusIcon}
                    />
                    <img
                        src={dropDownIcon}
                        alt="open"
                        className={styles.dropdownIcon}
                    />
                </div>
            </div>
            <Fragment>
                <div className="data-row">
                    <p className="bold-text title">RC&nbsp;Name</p>
                    <p className="data">
                        <input
                            style={{
                                height: '30px',
                                width: '175px',
                                border: '1px solid rgba(160, 160, 160, 0.5)',
                            }}
                            ref={inputRcName}
                            disabled={!enableRcName}
                            value={rcName}
                            onChange={(e) => setRcName(e.target.value)}
                            onKeyDown={(e) => onInputRcName(e)}
                        />
                        {isEdit && <img
                            src={edit}
                            alt="Edit No Of Owners"
                            role="button"
                            className="action-icon"
                            style={{ marginLeft: 10 }}
                            onClick={(e) => setEnableRcName(true)}
                        />}
                    </p>
                </div>
                <div className="data-row">
                    <p className="bold-text title">Account&nbsp;Holder&nbsp;Name</p>
                    <p className="data">
                        <input
                            style={{
                                height: '30px',
                                width: '175px',
                                border: '1px solid rgba(160, 160, 160, 0.5)',
                            }}
                            ref={inputAccName}
                            disabled={!enableAccName}
                            value={accHolderName}
                            onChange={(e) => setAccHolderName(e.target.value)}
                            onKeyDown={(e) => onInputAccHolderName(e)}
                        />
                        {/* <img
                            src={edit}
                            alt="Edit No Of Owners"
                            role="button"
                            className="action-icon"
                            style={{ marginLeft: 10 }}
                            onClick={(e) => setEnableAccName(true)}
                        /> */}
                    </p>
                </div>
                <div className="data-row">
                    <p className="bold-text title">Customer&nbsp;Name</p>
                    <p className="data">
                        <input
                            style={{
                                height: '30px',
                                width: '175px',
                                border: '1px solid rgba(160, 160, 160, 0.5)',
                            }}
                            ref={inputCustomerName}
                            disabled={!enableCustomerName}
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            onKeyDown={(e) => onInputCustomerName(e)}
                        />
                        {/* <img
                            src={edit}
                            alt="Edit No Of Owners"
                            role="button"
                            className="action-icon"
                            style={{ marginLeft: 10 }}
                            onClick={(e) => setEnableCustomerName(true)}
                        /> */}
                    </p>
                </div>
                <div className="data-row">
                    <p className="bold-text title">Account&nbsp;Name&nbsp;(Razorpay)</p>
                    <input 
                    style={{
                        height: '30px',
                        width: '175px',
                        border: '1px solid rgba(160, 160, 160, 0.5)',
                    }}
                    value={vehicle.razorpayName}
                    disabled
                    />
                        {isEdit && <IconButton style={{ padding:'0px' ,marginLeft:8}} disableRipple disabled={(vehicle.razorpayName || vehicle.razorpayName !== 'null') ? false : true}>
                            <RefreshIcon style={{ color: '#1292F9c9', cursor: 'pointer' }} onClick={() => refreshRazorpayName(vehicle.customerUpi)} />
                        </IconButton>}
                </div>
                {bool ? <div className="data-row">
                    <p className="bold-text title">IFSC&nbsp;Code</p>
                    <p className="data">
                        <input
                            style={{
                                height: '30px',
                                width: '175px',
                                border: '1px solid rgba(160, 160, 160, 0.5)',
                            }}
                            ref={inputIfsc}
                            disabled={!enableIfsc}
                            value={ifsc}
                            onChange={(e) => setIfsc(e.target.value)}
                            onKeyDown={(e) => onInputIfsc(e)}
                        />
                        {/* <img
                            src={edit}
                            alt="Edit No Of Owners"
                            role="button"
                            className="action-icon"
                            style={{ marginLeft: 10 }}
                            onClick={(e) => setEnableIfsc(true)}
                        /> */}
                    </p>
                </div> :
                    <div className="data-row">
                        <p className="bold-text title">UPI&nbsp;ID</p>
                        <p className="data">{vehicle.customerUpi}</p>
                    </div>
                }
                {bool ? <div className="data-row">
                    <p className="bold-text title">Account&nbsp;Number</p>
                    <p className="data">
                        <input
                            style={{
                                height: '30px',
                                width: '175px',
                                // border: '1px solid rgba(160, 160, 160, 0.5)',
                                border: `${isEdit && accountStatus !=='active' ? `1px solid red`:`1px solid rgba(160, 160, 160, 0.5)` }`,
                                color:`${isEdit && accountStatus !=='active' ? `red` :`black` }`
                            }}
                            ref={inputAccNum}
                            disabled={!enableAccNum}
                            value={accNum}
                            onChange={(e) => setAccNum(e.target.value)}
                            onKeyDown={(e) => onInputAccNum(e)}
                        />
                        {/* <img
                            src={edit}
                            alt="Edit No Of Owners"
                            role="button"
                            className="action-icon"
                            style={{ marginLeft: 10 }}
                            onClick={(e) => setEnableAccNum(true)}
                        /> */}
                        {isEdit && accountStatus !=='active' ? <p style={{color:'red'}}>Invalid Account Number</p> :<></> }
                    </p>
                </div> :
                    <></>
                }
                <div className="data-row">
                    <p className="bold-text title">Account&nbsp;Type</p>
                    <p className="data">{renderString(fundAccountType)}</p>
                </div>
                {bool ? <div className="data-row">
                    <p className="bold-text title">Cheque&nbsp;Image</p>
                    <div
                        className="doc-preview"
                        style={{ height: '84px', width: '72px',marginBottom:'2rem' }}
                        onClick={() => (
                            setImageOpen(true)
    )}
                    >
                        <img
                            src={`${vehicle.customerCheque}`}
                            alt='cheque image'
                        />
                    </div>
                </div> : <></>}
                {isEdit && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Button variant='contained' color="primary" disableElevation style={{ backgroundColor: '#FF4861', borderRadius: '3rem', margin: '0.5rem' }} onClick={() => handleBankStatus("MISMATCHED")} >Reject</Button>
                    <Button variant='contained' color="primary" disableElevation style={{ backgroundColor: '#28a745', borderRadius: '3rem', margin: '0.5rem' }} onClick={() => handleBankStatus("APPROVED")} disabled={isApprove} >Approve</Button>
                </div>}
            </Fragment>
            <Viewer
                visible={isImageOpen}
                images={[{
                    src:
                    `${vehicle.customerCheque}`
                  }]}
                activeIndex={currentIndex}
                onClose={closeImageViewer}
            />
        </div>
    );
}
export default BankVerificationDropDown
