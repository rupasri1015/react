import React from 'react'
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
import { callToCareCustomer } from '../../../core/services/shdServices'
import { useDispatch } from "react-redux"

const DropDialog = ({ onClose, openCall, rowData }) => {

    const dispatch = useDispatch()

    const callToCustomer = () => {
        const payload = {
            fromNumber: getMobile(),
            toNumber: rowData.customerMobileNumber,
            userId: getUserID(),
            leadId: rowData.leadId
        }
        dispatch(showLoader())
        callToCareCustomer(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    dispatch(hideLoader())
                    onClose()
                    // onRefreshPage()
                    dispatch(setNotification('success', 'SUCCESS', apiResponse.message))
                }
                else {
                    dispatch(hideLoader())
                    onClose()
                    dispatch(setNotification('danger', 'ERROR', apiResponse.message))
                }
            })
    }

    return (
        <Dialog
            open={openCall}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <h2 style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '20px' }}> Call To Customer <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></h2>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText style={{ fontSize: "18px", fontFamily: 'ProximaNovaSemibold', color: '#333' }}>
                    {`Are you sure you want call ${rowData && rowData.customerName}?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button onClick={onClose} style={{ border: '#DEDEDE', backgroundColor: '1px solid #E8E8E8', color: '#333333', padding: '8px 20px', borderRadius: '22px', marginRight: '10px', marginBottom: '15px' }}>Cancel</button>
                <button onClick={callToCustomer} style={{ marginRight: 15, color: '#ffffff', padding: '8px 20px', borderRadius: '22px', backgroundColor: '#4DBD74', border: '1px solid #35AC5E', marginBottom: '15px' }}>
                    <img src={call} alt='call' style={{ marginRight: '5px', width: '15px' }} />
                    Call
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default DropDialog