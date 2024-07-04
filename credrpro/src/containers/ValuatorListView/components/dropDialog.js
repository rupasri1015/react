import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import Divider from '@material-ui/core/Divider';
import { getUserID } from '../../../core/services/rbacServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { dropLead } from '../../../core/services/valuatorServices'
import { useDispatch } from "react-redux"

const DropDialog = ({ onClose, openDrop, data }) => {

    const dispatch = useDispatch()

    const droppingLead = () => {
        const payload = {
            crmStatus: 'Drop',
            updatedBy: getUserID(),
            crmLeadId: data.leadId
        }
        dispatch(showLoader())
        dropLead(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    dispatch(hideLoader())
                    onClose()
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
            open={openDrop}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <h2 style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '20px' }}> Dropping Lead <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></h2>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText style={{ fontSize: "18px", fontFamily: 'ProximaNovaSemibold', color: '#333' }}>
                You are dropping the lead with lead id {data && data.leadId}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button onClick={onClose} style={{ border: '1px solid rgb(123, 123, 123)', backgroundColor: 'rgb(123, 123, 123)', color: '#fff', padding: '8px 20px', borderRadius: '22px', marginRight: '10px', marginBottom: '15px', fontFamily: 'ProximaNovaSemibold' }}>CANCEL</button>
                <button onClick={droppingLead} style={{ marginRight: 15, color: '#ffffff', padding: '8px 20px', borderRadius: '22px', backgroundColor: '#da2128', border: '1px solid #da2128', marginBottom: '15px', fontFamily: 'ProximaNovaSemibold' }}>
                   DROP
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default DropDialog