import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { getAmount } from '../../../../../../core/utility'

const DetailsDialog = ({ data, onClose, open }) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Bike Details
      </DialogTitle>
      <DialogContent>
        <div className="row">
          <div className="col-sm-4 mb-2">
            MMV
          </div>
          <div className="col-sm-8 mb-2">
            {data.mmv}
          </div>
          <div className="col-sm-4 mb-2">
            Year
          </div>
          <div className="col-sm-8 mb-2">
            {data.mfYear}
          </div>
          <div className="col-sm-4 mb-2">
            Registration Number
          </div>
          <div className="col-sm-8 mb-2">
            {data.regNumber}
          </div>
          <div className="col-sm-4 mb-2">
            Final Sales Price
          </div>
          <div className="col-sm-8 mb-2">
            { getAmount(data.bikePrice) }
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="icon-btn" onClick={onClose}>Close</button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailsDialog