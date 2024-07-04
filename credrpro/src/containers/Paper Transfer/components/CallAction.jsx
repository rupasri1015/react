import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { callToValuator } from '../../../core/services/documentQcServices'
import { callingPtAgent } from '../../../core/services/paperTransferService'
import { setNotification } from '../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { useDispatch } from 'react-redux'
import { getMobile, getRole, getUserID }  from '../../../core/services/rbacServices'

const DropDialog = ({ onClose, open, valuator }) => {
  const dispatch = useDispatch()

  const callPtAgent = () => {
    dispatch(showLoader())
    callingPtAgent({toNumber: valuator.customerMobileNumber, fromNumber: getMobile()})
      .then(apiResponse => {
        if(apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', 'Call Placed Successfully'))
        }
        else {
          dispatch(setNotification('danger', 'Error', 'Call Unsuccessfull'))
        }
        dispatch(hideLoader())
        onClose()
      })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Call To Customer <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ fontSize: "20px" }}>
          {`Are you sure you want call ${valuator.customerName}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button className="icon-btn gray" onClick={onClose}>Cancel</button>
        <button className="icon-btn" onClick={callPtAgent}>Call</button>
      </DialogActions>
    </Dialog>
  )
}

export default DropDialog