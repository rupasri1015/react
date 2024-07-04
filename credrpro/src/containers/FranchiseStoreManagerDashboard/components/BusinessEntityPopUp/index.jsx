import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import { Divider } from '@material-ui/core'
import PlusIcon from '@material-ui/icons/AddCircle';
import WarningIcon from '@material-ui/icons/WarningRounded'
import './businessEntity.scss'

const BusinessEntityPopUp = ({ open, onCreateBusinessEntity }) => {

    const goToBusinessEnity = () => {
        onCreateBusinessEntity()
    }

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle style={{ textAlign: "center" }}>
                No Business entity created
                <span className="float-right" style={{ cursor: 'pointer' }}  ></span>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <p>Various business entity you can create</p>
                <ol>
                    <li>GST</li>
                    <li>Compositions</li>
                    <li>Un Registered</li>
                </ol>
                <div id='warningIcon' style={{ color: "red" }}><WarningIcon style={{ color: "red" }} />Invoices cannot be generated until a business entity is created.</div>
            </DialogContent>
            <DialogActions>
                <button className="addbtn" color="success" onClick={goToBusinessEnity}>
                    <span>{`CREATE\u00a0BUSINESS\u00a0ENTITY`}</span>
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default BusinessEntityPopUp