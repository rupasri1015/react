import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import { rejectInventory } from '../../../../../core/services/inventoryServices'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../../../redux/actions/loaderAction'
import { useDispatch } from 'react-redux'
import { reduxForm, Field } from 'redux-form'


const validate = values => {
  const errors = {}
  if (!values.remarks) {
    errors.remarks = '* Please Enter Reason'
  }
  return errors
}

const RenderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
    <FormControl className='w-100'>
      <TextField
        label={label}
        error={touched && Boolean(error)}
        {...input}
        {...custom}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )


const RejectDialog = ({ data, onClose, open, handleSubmit, onRefreshPage }) => {
  const dispatch = useDispatch()
  const rejectBike = formData => {
    dispatch(showLoader())
    const payload = {
      dateOfManufacturing: data.manufactureDate,
      inspectedBikeDetailId: data.id,
      inventoryType: 'SHD',
      remarks: formData.remarks,
      status: 'REJECTED',
      vehicleRegNum: data.registrationNumber,
      updatedBy: "124848"
    }
    rejectInventory(payload)
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
      <form onSubmit={handleSubmit(rejectBike)}>
        <DialogTitle>
          Reject Bike <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
        </DialogTitle>
        <DialogContent>
          <Field
            name="remarks"
            component={RenderTextField}
            label="Reason for rejection"
          />
        </DialogContent>
        <DialogActions>
          <button className="icon-btn" type="button" onClick={onClose}>Cancel</button>
          <button className="icon-btn">Reject</button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default reduxForm({
  form: 'reject-bike',
  validate
})(RejectDialog)
