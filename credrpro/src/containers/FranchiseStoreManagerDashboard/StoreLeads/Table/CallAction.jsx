import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'

const DropDialog = ({ onClose, open, onYes, name }) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Call To Valuator <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ fontSize: "20px" }}>
          {`Are you sure you want call ${name}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button className="icon-btn gray" onClick={onClose}>Cancel</button>
        <button className="icon-btn" onClick={onYes}>Call</button>
      </DialogActions>
    </Dialog>
  )
}

export default DropDialog