import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import { connect, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { FormHelperText } from '@material-ui/core'
import { DialogActions } from '@material-ui/core'
// import { resendOTP, verifyStoreOtp } from '../../../../core/services/authenticationServices'
// import { getUserID, verifyOTP as verifyStoreOtp } from '../../../../core/services/authenticationServices';
import { login as resendOTP } from '../../../../core/services/authenticationServices';
import { setNotification } from '../../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import './gstPage.scss'
import { green } from '@material-ui/core/colors'
import { generateWalletOTP, updateWalletCreditLimit } from '../../../../core/services/shdServices'
import { getUserID } from '../../../../core/services/rbacServices'



class OTPPopUp extends Component {

    state = {
        valueOne: '',
        valueThree: '',
        valueTwo: '',
        valueFour: '',
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

    inputfocus = (elmnt) => {
        if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
            const next = elmnt.target.tabIndex - 2;
            if (next > -1) {
                elmnt.target.form.elements[next].focus()
            }
        }
        else {
            const next = elmnt.target.tabIndex;
            if (next < 4) {
                elmnt.target.form.elements[next].focus()
            }
        }
    }


    handleSubmit(event) {
        const data = new FormData(event.target)
        event.preventDefault()
    }

    resendOtp = () => {
        const { payload, dispatch } = this.props
        dispatch(showLoader())

        this.setState({
            valueOne: '',
            valueTwo: '',
            valueThree: '',
            valueFour: '',
        })

        generateWalletOTP(getUserID()).
            then(apiResponse => {
                if (apiResponse.isValid) {
                    dispatch(hideLoader())
                    dispatch(setNotification("success", "Success", apiResponse.message));
                    payload.otpPrimaryKey = apiResponse.otpPrimaryKey
                }
            })
    }

    wrongOTP = () => {
        this.setState({
            valueOne: '',
            valueTwo: '',
            valueThree: '',
            valueFour: '',
        })

    }
    verifyAndProceed = () => {
        const { dispatch, payload, apiSelect, openModel, onClose } = this.props
        const { valueOne, valueTwo, valueThree, valueFour } = this.state
        let inputValue = valueOne + valueTwo + valueThree + valueFour
        payload.otp = inputValue

        dispatch(showLoader())

        // if (apiSelect === "refundToBank") {
        //     sendRefundToBank(payload).
        //         then(apiResponse => {
        //             if (apiResponse.isValid) {
        //                 dispatch(setNotification("success", "Success", apiResponse.message))
        //                 onClose()
        //             } else {
        //                 if (apiResponse.isOtpVerified) {
        //                     dispatch(setNotification("danger", "Error", apiResponse.message))
        //                     onClose()
        //                 } else {
        //                     this.setState({ showWrongOtp: true })
        //                     this.wrongOTP()
        //                 }
        //             }
        //             dispatch(hideLoader())
        //         })

        // }

        if (apiSelect === "updateCreditLimit") {
            updateWalletCreditLimit(payload).
                then(apiResponse => {
                    if (apiResponse.isValid) {
                        dispatch(setNotification("success", "Success", apiResponse.message))
                        onClose()
                        openModel(payload.walletId)
                    } else {
                        if (apiResponse.isOtpVerified) {
                            dispatch(setNotification('danger', 'Error', apiResponse.message))
                            onClose()
                        } else {
                            this.setState({ showWrongOtp: true })
                            this.wrongOTP()
                        }
                    }
                    dispatch(hideLoader())
                })
        }

        // if (apiSelect === "refundToWallet") {
        //     sendRefundToWallet(payload).
        //         then(apiResponse => {
        //             if (apiResponse.isValid) {
        //                 dispatch(setNotification("success", "Success", apiResponse.message))
        //                 onClose()
        //                 openModel(payload)
        //             } else {
        //                 if (apiResponse.isOtpVerified) {
        //                     dispatch(setNotification('danger', 'Error', apiResponse.message))
        //                     onClose()
        //                 } else {
        //                     this.setState({ showWrongOtp: true })
        //                     this.wrongOTP()
        //                 }
        //             }
        //             dispatch(hideLoader())
        //         })

        // }

        // if (apiSelect === "updateCityLimit") {
        //     updateCityCreditLimit(payload).
        //         then(apiResponse => {
        //             if (apiResponse.isValid) {
        //                 dispatch(setNotification("success", "Success", apiResponse.message))
        //                 onClose()
        //                 openModel()
        //             } else {
        //                 if (apiResponse.isOtpVerified) {
        //                     dispatch(setNotification('danger', 'Error', apiResponse.message))
        //                     onClose()
        //                 } else {
        //                     this.setState({ showWrongOtp: true })
        //                     this.wrongOTP()
        //                 }
        //             }
        //             dispatch(hideLoader())
        //         })

        // }
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
        const { open, onClose, dataOTP } = this.props
        const { valueOne, valueTwo, valueThree, valueFour, textOnResend, showWrongOtp } = this.state
        return (
            <Dialog
                open={open}
                maxWidth="xs"
                fullWidth
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <div className='dialogTitle'>

                    Please Confirm OTP To Verify Your Account <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
                </div>
                <DialogContent>
                    <br />
                    <p style={{ textAlign: 'center' }}> Please enter the  verification code sent to
                        {dataOTP.otpSentTo}</p>
                    <br />
                    <form onSubmit={this.handleSubmit}>
                        <p style={{ textAlign: 'center' }}>
                            <input maxLength='1' autoComplete="off" value={valueOne} onChange={this.onValueOneChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', textAlign: 'center' }} tabIndex="1" autoFocus onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric}></input>
                            <input maxLength='1' autoComplete="off" value={valueTwo} onChange={this.onValueTwoChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', marginLeft: '9px', textAlign: 'center' }} tabIndex="2" onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric} disabled={valueOne ? false : true}></input>
                            <input maxLength='1' autoComplete="off" value={valueThree} onChange={this.onValueThreeChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', marginLeft: '9px', textAlign: 'center' }} tabIndex="3" onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric} disabled={valueTwo ? false : true}></input>
                            <input maxLength='1' autoComplete="off" value={valueFour} onChange={this.onValueFourChange} style={{ borderRight: 'none', borderLeft: 'none', borderLeft: 'none', width: '30px', borderTop: 'none', borderBottomColor: '#80808040', marginLeft: '9px', textAlign: 'center' }} tabIndex="4" onKeyUp={e => this.inputfocus(e)} onKeyPress={this.isNumeric} disabled={valueThree ? false : true}></input>
                        </p>
                        {
                            showWrongOtp && <FormHelperText style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}> Enter correct OTP </FormHelperText>
                        }
                        <br />
                    </form>
                    <p style={{ textAlign: 'center', fontWeight: 'lighter' }}> {textOnResend ? `OTP has been sent again` : `Didn't Recieve OTP`}  <button style={{ color: 'red', border: 'none', backgroundColor: 'white', marginLeft: '0px' }} onClick={() => this.resendOtp()}> RESEND OTP </button> </p>
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
