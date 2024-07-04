import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { markAsDropped } from '../../../core/services/biddingServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { useDispatch } from 'react-redux'

const DropDialog = ({ data, onClose, openDrop, onRefreshPage }) => {

  const dispatch = useDispatch()

  const dropBike = () => {
    dispatch(showLoader())
    const payload = {
      lead_id: data.leadId,
      status: "DROPPED"
    }
    markAsDropped(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message))
        }
        else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
        onRefreshPage()
        onClose()
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
        Mark As Drop <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ fontSize: "20px" }}>
            Are you sure you want to mark this vehicle as Drop?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button className="icon-btn gray" onClick={onClose}>Cancel</button>
        <button className="icon-btn" onClick={dropBike}>Drop</button>
      </DialogActions>
    </Dialog>
  )
}

export default DropDialog