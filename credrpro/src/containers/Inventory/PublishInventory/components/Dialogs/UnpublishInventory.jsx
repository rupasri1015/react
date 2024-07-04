import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'

const UnpublishInventory = ({ inventory, open, onClose, onUnpublish }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Unpublish Inventory<span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
      <DialogContent>
        <DialogContentText>{`Vehicle ${inventory.registrationNumber} will be unpublished from website.`}</DialogContentText>
        <DialogActions>
          <button className="icon-btn" onClick={onClose}>Cancel</button>
          <button className="icon-btn" onClick={onUnpublish}>Unpublish</button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default UnpublishInventory