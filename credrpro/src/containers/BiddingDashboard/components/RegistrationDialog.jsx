import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import { updateRegistrationNumber } from '../../../core/services/biddingServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { reduxForm, Field } from 'redux-form'
import { isRegistrationNumber } from '../../../core/utility'

const validate = values => {
  const errors = {}
  if (!values.newRegNum) {
    errors.newRegNum = '* Please Enter New Registartion Number'
  }
  else if (!isRegistrationNumber(values.newRegNum)) {
    errors.newRegNum = '* Please Enter Valid Registartion Number'
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

const upperCase = value => {
  if (value) {
    return value.toUpperCase()
  }
}

class RegistrationDialog extends Component {

  componentDidMount() {
    const { data, initialize } = this.props
    const initialData = { newRegNum: data.registrationNumber }
    initialize(initialData)
  }

  changeRegistrationNumber = (formData) => {
    const { data, dispatch, onRefreshPage, onClose } = this.props
    dispatch(showLoader())
    formData.gatepassId = data.gatePassId
    formData.oldRegNum = data.registrationNumber
    formData.inventoryId = data.leadId
    updateRegistrationNumber(formData)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'SUCCESS', 'Registration Number Changed'))
        }
        else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
        onRefreshPage()
        onClose()
      })
  }

  render() {
    const { openRegistration, onClose, handleSubmit } = this.props
    return (
      <Dialog
        open={openRegistration}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(this.changeRegistrationNumber)}>
          <DialogTitle>
            Change Registration Number <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
          </DialogTitle>
          <DialogContent>
            <Field
              name="newRegNum"
              component={RenderTextField}
              label="Enter Registartion Number"
              normalize={upperCase}
            />
          </DialogContent>
          <DialogActions>
            <button className="icon-btn gray" type="button" onClick={onClose}>Cancel</button>
            <button className="icon-btn">Change</button>
          </DialogActions>
        </form>
      </Dialog >
    )
  }
}

export default reduxForm({
  form: 'change-registration',
  validate
})(RegistrationDialog)