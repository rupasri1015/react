import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import styles from '.././styles.module.scss'
import { FormHelperText } from '@material-ui/core'

const AddMoney = ({ onClose, open, onInitiatePayment }) => {

    const [amount, setAmount] = useState(null)
    const [errorMessage, setErrorMessage] = useState(false)

    const initiatePayment = () => {
        if(amount)
            onInitiatePayment(amount)
        else
        setErrorMessage(true)
    }

    const initiatePaymentOnEnter = (e) => {
        if (e.key === 'Enter')
            onInitiatePayment(amount)
    }

    const onAmountChange = (e) => {
        const re = /^[0-9\b]+$/
        if (e.target.value === '' || re.test(e.target.value)){
            if(e.target.value.length <= 8){
                setAmount(e.target.value)
            }
        }
        setErrorMessage(false)
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle style={{ textAlign: "center" }}>
                Add Money to Wallet
                <span className="float-right" style={{ cursor: 'pointer' }} onClick={onClose} >&#10005;</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{ fontSize: "20px" }}>
                <span style={{position: 'relative', top: '18px'}}>{`\u20B9`}</span> <TextField id="standard-basic" label="Enter Amount" type='amount' autoFocus={true} value={amount} onChange={(e) => onAmountChange(e)} error={!!errorMessage} helperText={errorMessage ? 'Please enter Amount' : ''} required onKeyPress={(e) => initiatePaymentOnEnter(e, amount)} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className="icon-btn" onClick={initiatePayment}>Add Money</button>
                <button className="icon-btn gray" onClick={onClose}>Cancel</button>
            </DialogActions>
        </Dialog>
    )
}

export default AddMoney