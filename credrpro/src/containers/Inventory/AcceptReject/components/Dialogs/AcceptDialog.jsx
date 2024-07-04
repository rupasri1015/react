import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { acceptInventory } from '../../../../../core/services/inventoryServices'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../../../redux/actions/loaderAction'
import { useDispatch } from 'react-redux'

const AcceptDialog = ({ data, onClose, open, onRefreshPage }) => {
  const dispatch = useDispatch()
  const acceptBike = () => {
    dispatch(showLoader())
    const payload = {
      cityId: data.cityId,
      inventoryId: data.id,
      inventoryPublishStatus: 'pending',
      regNo: data.registrationNumber
    }
    acceptInventory(payload)
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
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Accept <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ fontSize: "20px" }}>
          Do you want to Accept the Inventory ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button className="icon-btn" onClick={onClose}>Cancel</button>
        <button className="icon-btn" onClick={acceptBike}>Yes</button>
      </DialogActions>
    </Dialog>
  )
}

export default AcceptDialog