import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { FormHelperText } from '@material-ui/core'
import { DialogActions } from '@material-ui/core'
import { resendOTP, verifyStoreOtp, getInvoicees } from '../../../../core/services/franchiseServices'
import { setNotification } from '../../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import '../gstPage.scss'
import { getUserID } from '../../../../core/services/rbacServices'


class OTPPopUp extends Component {

    state = {
        valueOne: '',
        valueTwo: '',
        valueThree: '',
        valueFour: '',
        valueFive: '',
        valueSix: '',
        autoFocusSecond: false,
        textOnResend: false,
        showWrongOtp: false,
        invoices: {}
    }

    onValueOneChange = (e) => {
        this.setState({ valueOne: e.target.value, autoFocusSecond: true })
    }

    onValueTwoChange = (e) => {
        this.setState({ valueTwo: e.target.value, showWrongOtp: false })
    }

    onValueThreeChange = (e) => {
        this.setState({ valueThree: e.target.value, showWrongOtp: false })
    }

    onValueFourChange = (e) => {
        this.setState({ valueFour: e.target.value, showWrongOtp: false })
    }

    onValueFiveChange = (e) => {
        this.setState({ valueFive: e.target.value, showWrongOtp: false })
    }

    onValueSixChange = (e) => {
        this.setState({ valueSix: e.target.value, showWrongOtp: false })
    }

    inputfocus = (elmnt) => {
        if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
            const next = elmnt.target.tabIndex - 2;
            if (next > -1) {
                elmnt.target.form.elements[next].focus()
            }
        }
        else {
            const next = elmnt.target.tabIndex;
            if (next < 6) {
                elmnt.target.form.elements[next].focus()
            }
        }
    }

    handleSubmit(event) {
        const data = new FormData(event.target)
        event.preventDefault()
    }

    resendOtp = () => {
        this.setState({
            valueOne: '',
            valueTwo: '',
            valueThree: '',
            valueFour: '',
            valueFive: '',
            valueSix: '',
        })
        const { otpPayload } = this.props
        const payload = {
            otpType: 'RESEND',
            leadID: otpPayload.leadId
        }
        resendOTP(payload)
            .then(resendOTPResponse => {
                if (resendOTPResponse.isValid) {
                    this.setState({ textOnResend: true })
                }
            })
    }

    verifyAndProceed = () => {
        const { otpPayload, formInfo, dispatch, amount, history, saleLead, docChargesTo, rowInfo, fromSales, warrantyCode, startTime, planValue, serviceHsn } = this.props
        const { valueOne, valueTwo, valueThree, valueFour, valueFive, valueSix } = this.state
        let inputValue = valueOne + valueTwo + valueThree + valueFour + valueFive + valueSix
        const payload = {
            leadID: otpPayload.leadId,
            otp: inputValue,
            updatedBy: getUserID()
        }
        let otherCharges = {}
        if (planValue !== 0) {
            let serviceName = ''
            if (planValue === 1199)
                serviceName = 'Annual Serivce Plan'
            else
                serviceName = 'One-Time Service Plan'
            otherCharges = {
                chargeName: serviceName,
                amount: planValue,
                hsnId: serviceHsn && serviceHsn.hsnId
            }
        }

        dispatch(showLoader())
        verifyStoreOtp(payload).
            then(verifyResponse => {
                if (verifyResponse.isValid) {
                    const payload = {
                        billerId: formInfo.billerId,
                        hsnId: formInfo.hsnDetails ? formInfo.hsnDetails : null,
                        leadId: Number(otpPayload.leadId),
                        amount: amount,
                        invId: saleLead ? Number(otpPayload.invId) : Number(otpPayload.inventoryID),
                        docTransferAmt: docChargesTo.docTransferAmt,
                        docTransferHsnId: docChargesTo.docTransferHsnId,
                    }

                    rowInfo.referralId=formInfo.referralId
                    this.setState({ showWrongOtp: false })
                    if(planValue === 0){
                        history.push({
                            pathname: '/franchise-store/download-invoices',
                            state: {
                                invoicePayload: payload, rowInfo: rowInfo, fromSales, wrntyCode: warrantyCode,
                                startTime: startTime, otherCharges: false
                            }
                        }) 
                    }
                    else{
                        history.push({
                            pathname: '/franchise-store/download-invoices',
                            state: {
                                invoicePayload: payload, rowInfo: rowInfo, fromSales, wrntyCode: warrantyCode,
                                startTime: startTime, otherCharges: otherCharges
                            }
                        })
                    }
                }
                else {
                    this.setState({ showWrongOtp: true })
                }
                dispatch(hideLoader())
            })
    }


    isNumeric(evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[0-9]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    render() {
        const { open, onClose, formInfo, serviceHsn, planValue } = this.props
        const { valueOne, valueTwo, valueThree, valueFour, valueFive, valueSix, textOnResend, showWrongOtp, secondaryInvoice } = this.state
        return (
            <Dialog
                open={open}
                maxWidth="xs"
                fullWidth
                onClose={onClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle style={{ textAlign: 'center' }}>
                    OTP Verification <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
                </DialogTitle>
                <Divider style={{ height: '1px' }} />
                <DialogContent>
                    <br />
                    <p style={{ textAlign: 'center' }}> Please enter the verification code </p> <p style={{ textAlign: 'center', marginTop: '0px' }}>send to your registred number </p>
                    <br />
                    <form onSubmit={this.handleSubmit}>
                        <p style={{ textAlign: 'center' }}>
                            <input maxLength='1' autoComplete="off" value={valueOne} onChange={this.onValueOneChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', textAlign: 'center' }} tabIndex="1" autoFocus onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric}></input>
                            <input maxLength='1' autoComplete="off" value={valueTwo} onChange={this.onValueTwoChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', marginLeft: '9px', textAlign: 'center' }} tabIndex="2" onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric} disabled={valueOne ? false : true}></input>
                            <input maxLength='1' autoComplete="off" value={valueThree} onChange={this.onValueThreeChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', marginLeft: '9px', textAlign: 'center' }} tabIndex="3" onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric} disabled={valueTwo ? false : true}></input>
                            <input maxLength='1' autoComplete="off" value={valueFour} onChange={this.onValueFourChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', marginLeft: '9px', textAlign: 'center' }} tabIndex="4" onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric} disabled={valueThree ? false : true}></input>
                            <input maxLength='1' autoComplete="off" value={valueFive} onChange={this.onValueFiveChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', marginLeft: '9px', textAlign: 'center' }} tabIndex="5" onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric} disabled={valueFour ? false : true}></input>
                            <input maxLength='1' autoComplete="off" value={valueSix} onChange={this.onValueSixChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', marginLeft: '9px', textAlign: 'center' }} tabIndex="6" onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric} disabled={valueFive ? false : true}></input>
                        </p>
                        {
                            showWrongOtp && <FormHelperText style={{ color: 'red', float: 'right' }}> Enter correct OTP </FormHelperText>
                        }
                        <br />
                    </form>
                    <p style={{ textAlign: 'right', fontWeight: 'lighter' }}> {textOnResend ? `OTP has been sent again` : `Didn't Recieve OTP`}  <button style={{ color: 'red', border: 'none', backgroundColor: 'white', marginLeft: '0px' }} onClick={() => this.resendOtp()}> RESEND OTP </button> </p>
                </DialogContent>
                <DialogActions>
                    <button className="verifyButton" color="success" onClick={this.verifyAndProceed}>
                        <span>{`VERIFY\u00a0&\u00a0PROCEED`}</span>
                    </button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withRouter(connect()(OTPPopUp))