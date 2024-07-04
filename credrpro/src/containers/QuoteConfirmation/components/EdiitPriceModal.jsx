import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import call from '../../../shared/img/icons/call.svg'
import Divider from '@material-ui/core/Divider';
import { getMobile, getUserID } from '../../../core/services/rbacServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { updateCustomerExpectedPrice } from '../../../core/services/miscServices'
import { useDispatch } from "react-redux"
import { updateBidAmt } from '../../../core/services/biddingServices'

const onlyContactNumber = (value) => {
    if (!value) {
        return value
    }
    let onlyContactNumbers = value.replace(/[^\d]/g, '')
    onlyContactNumbers.replace(/(?!^)+/g, '')
    return onlyContactNumbers.slice(0, 7)
}


const CustomerEPEditDialog = ({ onClose, editPrice, priceVal, onRefreshPage, leadId, tabValue, bidData, rowData }) => {

    const dispatch = useDispatch()
    const [price, setPrice] = useState(priceVal)
    const [priceErr, setPriceErr] = useState(false)
    const [priceConditionError, setPriceConditionError] = useState(false)

    const handleUpdatePrice = (tabValue) => {
        if (tabValue === 'Bidding History') {
            if (price) {
                setPriceErr(false)
                dispatch(showLoader())
                let payload = {}
                payload.bidId = rowData.bidId
                payload.bidderLeadId = rowData.bidderLeadId
                payload.value = price
                payload.bidderUserId = rowData.bidderUserId
                payload.loginUserId = rowData.loginUserId
                updateBidAmt(payload)
                    .then(apiResponse => {
                        // if (apiResponse.isValid) {
                        //     setErrorMgs(apiResponse.message)
                        //     setColor("success")
                        //     setIsError(true)

                        //     setBidIds('')
                        //     setComfirm(false)
                        //     setAmt("")
                        //     setLeadId('')
                        //     setShowDialoge(false)
                        //     refreshData(actionId)
                        //     onRefreshPage()
                        // }
                        // else {
                        //     setErrorMgs(apiResponse.message)
                        //     setColor("error")
                        //     setIsError(true)

                        // }
                        if (apiResponse.isValid) {
                            dispatch(hideLoader())
                            onClose()
                            onRefreshPage()
                            dispatch(setNotification('success', 'SUCCESS', apiResponse.message))
                        }
                        else {
                            dispatch(hideLoader())
                            onClose()
                            dispatch(setNotification('danger', 'ERROR', apiResponse.message))
                        }
                    })
            } else setPriceErr(true)
        }
        else {

            const payload = {
                leadId: leadId,
                leadCustomerExpectedPrice: `${price}`
            }
            let seventyPercent = 0.7 * priceVal
            if (price) {
                if(price >= seventyPercent){
                    setPriceErr(false)
                    dispatch(showLoader())
                    updateCustomerExpectedPrice(payload)
                        .then(apiResponse => {
                            if (apiResponse.isValid) {
                                dispatch(hideLoader())
                                onClose()
                                onRefreshPage()
                                dispatch(setNotification('success', 'SUCCESS', apiResponse.message))
                            }
                            else {
                                dispatch(hideLoader())
                                onClose()
                                dispatch(setNotification('danger', 'ERROR', apiResponse.message))
                            }
                        })
                }
                else{
                    setPriceConditionError(true)
                }
            }
            else {
                setPriceErr(true)
            }
        }
    }

    const handlePriceedit = (e) => {
        setPriceConditionError(false)
        const regexp = /^[0-9\b]+$/;
        if (e.target.value === '' || regexp.test(e.target.value)) {
            let value = onlyContactNumber(e.target.value)
            setPrice(value)
            setPriceErr(false)
        }
        else {
            setPriceErr(true)
        }
    }

    const getSeventyPercent = (amount) => {
        return 0.7 * amount
    }

    return (
        <Dialog
            open={editPrice}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            className='dialogWrap'
        >
            <DialogContent>
                <h2 style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '20px', color: '#19865f', marginBottom: '40px' }}> {tabValue === 'Bidding History' ? 'Edit Bidding Price' : 'Edit Customer Expected Price'} <span className="float-right" onClick={onClose} style={{ cursor: 'pointer', color: '#333' }}>&#10005;</span></h2>
                <div className="row">
                    <div className='col-6'>
                        <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px' }}>{tabValue === 'Bidding History' ? 'Update Bidding Price :' : 'Customer ExpectedPrice :'}</p>
                    </div>
                    <div className='col-6'>
                        <input autoFocus value={price} style={{ border: '1px solid #f5f0f0', backgroundColor: '#fff', fontFamily: 'ProximaNovaSemibold', padding: '6px 10px', width: '100%' }} onChange={handlePriceedit}></input>
                        {
                            priceErr && <span style={{ color: '#da2128', fontFamily: 'ProximaNovaRegular', fontSize: '12px' }}>{tabValue === 'Bidding History' ? '* Please Enter Bidding Price' : '* Please Enter Customer Expected Price'}</span>
                        }
                        {
                            priceConditionError && <span style={{ color: '#da2128', fontFamily: 'ProximaNovaRegular', fontSize: '12px' }}>{`Price Shouldn't be less than ${getSeventyPercent(priceVal)}`}</span>
                        }
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button onClick={() => handleUpdatePrice(tabValue)} style={{ border: '1px sloid #70bbfd', backgroundColor: '#70bbfd', color: '#333333', padding: '8px 53px', borderRadius: '6px', marginBottom: '15px', fontFamily: 'ProximaNovaSemibold', }}>Update</button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomerEPEditDialog