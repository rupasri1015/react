import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import SelectField from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import { reduxForm, Field } from 'redux-form'
import MenuItem from '@material-ui/core/MenuItem'

const validate = values => {
  const errors = {}
  if (!values.userId) {
    errors.userId = '* Please Select a Runner'
  }
  if (!values.mode) {
    errors.mode = '* Please Select a Mode'
  }
  return errors
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 225
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  }
}

const RenderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
    <FormControl className='w-100'>
      <InputLabel style={{ color: error && touched ? '#c00' : '' }}>{label}</InputLabel>
      <SelectField
        label={label}
        error={touched && Boolean(error)}
        {...input}
        onChange={(event) => input.onChange(event.target.value)}
        children={children}
        {...custom}
        MenuProps={MenuProps}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

const AssignRunner = ({ runners, runner, open, onClose, onAssignRunner, handleSubmit }) => {

  const submitForm = formData => {
    formData.leadId = runner.leadId
    formData.brlId = runner.id
    onAssignRunner(formData)
  }

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>Assign Runner <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent>
          <Field
            name="userId"
            component={RenderSelectField}
            label="Select Runner"
          >
            {
              Boolean(runners && runners.length) &&
              runners.map(runnerDetails => <MenuItem value={runnerDetails.userId} key={runnerDetails.userId}>{runnerDetails.userName}</MenuItem>)
            }
          </Field>
          <Field
            name="mode"
            component={RenderSelectField}
            label="Select Mode"
          >
            <MenuItem value="Tempo">Tempo</MenuItem>
            <MenuItem value="Individual">Individual</MenuItem>
          </Field>
        </DialogContent>
        <DialogActions>
          <button className="icon-btn gray" type="button" onClick={onClose}>Cancel</button>
          <button className="icon-btn">Assign Runner</button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default reduxForm({
  form: 'assign-runner',
  validate
})(AssignRunner)
