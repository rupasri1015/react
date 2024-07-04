import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import call from '../../../shared/img/icons/call.svg'
import Divider from '@material-ui/core/Divider';
import { getMobile, getUserID } from '../../../core/services/rbacServices'
import { hideLoader, showLoader } from '../../../redux/actions/loaderAction'
import { useDispatch } from 'react-redux'
import { callToCareCustomer } from '../../../core/services/shdServices'
import { setNotification } from '../../../redux/actions/notificationAction'

const DropDialog = ({ onClose, callOpen, rowData, onRefreshPage,callerType }) => {

    const dispatch = useDispatch()

    const callToCustomer = () => {
        const payload = {
            fromNumber: getMobile(),
            toNumber: rowData.bidderNumber,
            userId: getUserID(),
            leadId: rowData.bidderLeadId
        }
        dispatch(showLoader())
        callToCareCustomer(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    dispatch(hideLoader())
                    onClose()
                    onRefreshPage()
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
            open={callOpen}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            // className='dialogWrap'
        >
            <DialogTitle>
                <h2 style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '20px' }}> Call To {callerType?"Bidding Dealer":"Customer"}  <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></h2>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText style={{ fontSize: "18px", fontFamily: 'ProximaNovaSemibold', color: '#333' }}>
                    {`Are you sure you want call ${rowData && rowData.bidderName}?`}
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