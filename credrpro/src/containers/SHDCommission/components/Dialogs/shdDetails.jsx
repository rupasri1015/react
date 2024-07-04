import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Divider } from '@material-ui/core'
import { renderString } from '../../../../core/utility'

const ShdDialog = ({ onClose, open, shdInformation, shdInfo }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle style={{ textAlign: 'center' }}>
                SHD Details <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
            </DialogTitle>
            <Divider />
            <DialogContent style={{ marginTop: '8px' }}>
                <div className="doc-image-conatiner removedbg">
                    <p className="name">SHD Name :</p>
                    <div className="doc-image" style={{ fontFamily: 'ProximaNovaSemibold' }}>
                        {shdInfo.shdName ? shdInfo.shdName : <p style={{ color: 'red' }}>Not Available</p>}
                    </div>
                </div>
                <div className="doc-image-conatiner removedbg" style={{borderRadius: 0, backgroundColor: 'transparent !important'}}>
                    <p className="name">Owner Name :</p>
                    <div className="doc-image" style={{ fontFamily: 'ProximaNovaSemibold' }}>
                        {shdInfo.shdOwnerName ? shdInfo.shdOwnerName : <p style={{ color: 'red' }}>Not Available</p>}
                    </div>
                </div>
                <div className="doc-image-conatiner removedbg">
                    <p className="name">Contact Number:</p>
                    <div className="doc-image" style={{ fontFamily: 'ProximaNovaSemibold' }}>
                        {shdInfo.shdMobileNumber ? shdInfo.shdMobileNumber : <p style={{ color: 'red' }}>Not Available</p>}
                    </div>
                </div>
                <div className="doc-image-conatiner removedbg">
                    <p className="name">Contact Address :</p>
                    <div className="doc-image" style={{ fontFamily: 'ProximaNovaSemibold' }}>
                        {shdInfo.shdAddress ? shdInfo.shdAddress : <p style={{ color: 'red' }}>Not Available</p>}
                    </div>
                </div>
            </DialogContent>
            <Divider />
            <DialogActions>
                <button className="icon-btn white" style={{ color: '#B7B7B7', border: '1px solid #B7B7B7', textTransform: 'uppercase' }} onClick={onClose} >Close</button>
            </DialogActions>
        </Dialog>
    )
}

export default ShdDialog