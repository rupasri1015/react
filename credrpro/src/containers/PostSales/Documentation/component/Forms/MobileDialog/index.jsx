import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import { reduxForm, Field } from 'redux-form'

const validate = value => {
  const errors = {}
  if (!value.mobilenumber) {
    errors.mobilenumber = "Enter Mobile Number"
  } else if (value.mobilenumber.length < 10) {
    errors.mobilenumber = "Enter Valid Mobile Number"
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

const onlyNumber = (value) => {
  if (!value) {
    return value
  }
  let onlyNumberData = value.replace(/[^\d]/g, '')
  onlyNumberData = onlyNumberData.replace(/(?!^)+/g, '')
  return onlyNumberData.startsWith('0') ? '' : onlyNumberData.slice(0, 10)
}

const ChangeMobileNumber = ({ onClose, open, data, handleSubmit, onUpdateMobileNumber, invalid }) => {

  const updateMobileNumber = formData => {
    formData.userId = data.leadId
    onUpdateMobileNumber(formData)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit(updateMobileNumber)}>
        <DialogTitle>
          Alternate Mobile Number
        </DialogTitle>
        <DialogContent>
          <div className="row">
            <div className="col-sm-6">
              <Field
                name="mobilenumber"
                component={RenderTextField}
                label="Enter Alternate Mobile Number"
                normalize={onlyNumber}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button className="icon-btn gray" type="button" onClick={onClose}>Cancel</button>
          <button className="icon-btn" disabled={invalid}>Update</button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default reduxForm({
  form: 'update-mobile-number',
  validate
})(ChangeMobileNumber)
