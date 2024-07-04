import React, { useState, FC } from 'react'
import { Modal, Grid, Button } from 'rsuite'

const Error = ({ children }) => <p style={{ margin: 0, color: 'red' }}>{children}</p>

export default function OTPPopup({ onClose, onVerifyOtp, open, leadData, wrongOtp, onClearWrongOTP }) {

    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState(false)

    const verifyOtp = () => {
        if(otp === ''){
            setOtpError(true)
        }
        else
        onVerifyOtp(otp, leadData)
    }

    const saveOtp = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setOtpError(false)
            setOtp(e.target.value.slice(0, 4))
            onClearWrongOTP()
        }
    }

    const closePopup = () => {
        onClose()
        setOtpError(false)
        setOtp('')
    }

    return (
        <Modal onHide={closePopup} show={open} size="xs" style={{ top: '140px', bottom: '100px' }}>
            <Modal.Header closeButton style={{ textAlign: 'center' }}>
                <Modal.Title style={{ fontWeight: 'bolder' }}>Confirm with OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ paddingBottom: 0 }}>
                <Grid fluid>
                    <p>{`Enter 4 digit otp to confirm`}<input style={{ fontWeight: 'bolder', marginLeft: '3px' }} onChange={(e) => saveOtp(e)} autoFocus value={otp}></input></p>
                    {
                        otpError && <p style={{ color: 'red', marginLeft: '165px' }}>Please enter otp</p>
                    }
                    {
                        wrongOtp && <p style={{ color: 'red', marginLeft: '165px' }}>Please enter correct otp</p>
                    }
                </Grid>
            </Modal.Body>
            <br />
            <Modal.Footer>
                <Button appearance="subtle" onClick={closePopup}>Cancel</Button>
                <Button color="blue" onClick={verifyOtp}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}
