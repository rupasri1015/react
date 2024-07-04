import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Divider } from '@material-ui/core'
import './refund.scss'

const RefundConfirmPopup = ({ open, onClose, onConfirm }) => {

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
            onClose={onClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle style={{ textAlign: "center" }}>
                Refund confirmation
                <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <p>Are you sure you want to confirm refund?</p>
            </DialogContent>
            <DialogActions>
                <button color="primary" className='cancelButton rounded no-margin btn btn-secondary' onClick={onClose}>Cancel</button>
                <button color="success" className='confirmButton rounded no-margin btn btn-success' onClick={onConfirm}>Refund</button>
            </DialogActions>
        </Dialog>
    )
}

export default RefundConfirmPopup