import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Button } from 'reactstrap'
import Divider from '@material-ui/core/Divider'
import './popUp.scss'
import { connect } from 'react-redux'
import { sendOtp, verifyOtp } from '../../../../../core/services/paymentServices'
import { getAmount, getDate } from '../../../../../core/utility/stringUtility'
import { getUserID } from '../../../../../core/services/rbacServices'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import Timer from '../../../../../core/utility/Timer'

class ConfiramtionPopup extends Component {

    state = {
        otpCheck: '',
        showTimer: false,
        otpValue: '',
        time: 60000,
        showTimerResend: true,
        enableConfirm: false,
        invalidOtp: false,
        disableVerify: false
    }

    getOrderIds = () => {
        const { paymentsIds } = this.props
        return paymentsIds.join(", ")
    }

    otpCheckbox = (e) => {
        const { otpCheck } = this.state
        if (e.target.id == 'amount') {
            this.setState({ otpCheck: !otpCheck })
        }
    }

    getOtp = () => {
        const { otpCheck } = this.state
        const { dispatch } = this.props
        this.setState({ showTimer: true })
        if (!otpCheck) {
            sendOtp(getUserID())
                .then(otpResponse => {
                    if (otpResponse.isValid) {
                        dispatch(setNotification('success', 'SUCCESS', 'OTP Sent Successfully'))
                    }
                    else {
                        dispatch(setNotification('danger', 'ERROR', otpResponse.message))
                    }
                })
        }
    }

    onOTPValue = (e) => {
        this.setState({
            otpValue: e.target.value,
            time: this.state.time - 1000
        })
    }

    resendOtp = () => {
        const { dispatch } = this.props
        sendOtp(getUserID())
            .then(otpResponse => {
                if (otpResponse.isValid) {
                    this.setState({ showTimer: true, time: 60000 })
                    dispatch(setNotification('success', 'SUCCESS', 'OTP Sent Successfully'))
                }
                else {
                    this.setState({ otpValue: '' })
                    dispatch(setNotification('danger', 'ERROR', otpResponse.message))
                }
            })
    }

    onEnter = (e) => {
        if (e.key === 'Enter')
            this.verifyOtp()
    }

    verifyUserOtp = () => {
        this.setState({ disableVerify: false })
        const { dispatch } = this.props
        const oneTimePwd = document.getElementById('otpvalue').value
        const payload = {
            userId: getUserID(),
            otp: oneTimePwd
        }
        verifyOtp(payload)
            .then(verifyResponse => {
                if (verifyResponse.isValid) {
                    this.setState({ invalidOtp: false, openWalletPopup: false, drawerClass: 'table-drawer disable', enableConfirm: true, disableVerify: true })
                    dispatch(setNotification('success', 'SUCCESS', verifyResponse.message))
                }
                else{
                    this.setState({ invalidOtp: true })
                }
            })
    }

    useWalletMoney = () => {
        const { onlyWalletMoney } = this.props
        onlyWalletMoney()
    }

    render() {
        const { open, onClose, handleSubmit, paymentsIds, pendingPaymentAmount, walletBallance } = this.props
        const { otpCheck, showTimer, otpValue, time, showTimerResend, enableConfirm, invalidOtp, disableVerify } = this.state
        return (
            <Dialog
                open={open}
                maxWidth="xs"
                fullWidth
                onClose={onClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    Payment Details <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
                </DialogTitle>
                <Divider style={{ height: '3px' }} />
                <DialogContent>
                    <div>
                        <div style={{ marginTop: '5px' }}>
                            <p style={{ fontSize: '15px' }}>{paymentsIds.length > 1 ? `Order Ids` : 'Order Id'} :
                                <span style={{ float: 'right', marginRight: '40px' }}>{this.getOrderIds()}</span>
                            </p>
                        </div>
                        <div style={{ marginTop: '5px' }}>
                            <p style={{ fontSize: '15px' }}>Amount to be Paid :
                                <span style={{ float: 'right', marginRight: '40px' }}>{getAmount(pendingPaymentAmount)}</span>
                            </p>
                        </div>
                        <div style={{ marginTop: '5px' }}>
                            <p style={{ fontSize: '15px' }}>Payment Date :
                                <span style={{ float: 'right', marginRight: '40px' }}>{getDate(new Date)}</span>
                            </p>
                        </div>
                        <div style={{ marginTop: '5px' }}>
                            <p style={{ fontSize: '15px' }}>Existing Balance :
                                <span style={{ float: 'right', marginRight: '40px' }}>{getAmount(walletBallance)}</span>
                            </p>
                        </div>
                        <br />
                        <Divider style={{ height: '3px' }} />
                        <div style={{ marginTop: '5px' }}>
                            <p style={{ fontSize: '15px' }}>Available Balance :
                                <span style={{ float: 'right', marginRight: '40px' }}>{getAmount(walletBallance)}</span>
                            </p>
                        </div>
                        <div style={{ marginTop: '5px' }}>
                            <input type="checkbox" id="amount" name="amount" value="" checked={otpCheck} className='checkBoxWallet' onChange={(e) => this.otpCheckbox(e)} onClick={() => this.getOtp()} />
                            <label htmlFor="existingBalance" className='spaceBetween' style={{ marginLeft: '5px', marginTop: '5px' }}>Do you want to place the order? </label>
                        </div>
                        {
                            otpCheck &&
                            <div className="form-group row">
                                <div className="col-sm-7 mt-2">
                                    <input type='text' onChange={(e) => this.onOTPValue(e)} value={otpValue} className='otpInput' maxLength='10' placeholder="Please Enter OTP" id="otpvalue" required onKeyPress={(e) => this.onEnter(e)} />
                                    {
                                        showTimerResend ?
                                            showTimer ?
                                                <Timer
                                                    date={Date.now() + time}
                                                    onComplete={() => this.setState({ showTimer: false })}
                                                    className="text-right"
                                                    onEpoch={(time) => this.setState({ time })}
                                                    style={{ paddingTop: '5px' }}
                                                /> :
                                                <div className='row' style={{ paddingTop: '5px' }}>
                                                    <div className='col-sm-7'>
                                                        <p>Didn't receive OTP ?</p>
                                                    </div>
                                                    <div className="account__logo-accent bg-transparent border-0 cursor-pointer" style={{ float: 'right' }} onClick={() => this.resendOtp()}>RESEND OTP</div>
                                                </div>
                                            : ''
                                    }
                                    {
                                        invalidOtp &&
                                        <div className='row' style={{ paddingTop: '5px' }}>
                                        <div className='col-sm-7'>
                                            <p style={{ color: 'red' }}>Invalid OTP</p>
                                        </div>
                                    </div>
                                    }
                                </div>
                                <div className="col-sm-5 mt-2">
                                    <button type="button" className="btn-success btn-sm lg-3 md-4 sm-4 sx-4 ml-4" onClick={() => this.verifyUserOtp()} disabled={disableVerify}> Verify OTP </button>
                                </div>
                            </div>
                        }
                         <div className="row mt-3">
                         <div className="col-sm-6"></div>
                                 <div className="col-sm-6 modalCSS">
                                        <button type="button" className={enableConfirm ? "enableColor" : "disableColor"} onClick={() => this.useWalletMoney()} disabled={enableConfirm ? false : true}>Submit</button>
                                    </div>
                            </div>
                        <br />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

export default connect()(ConfiramtionPopup)