import React, { useState } from 'react'
import { Field, reduxForm } from 'redux-form'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

const validate = values => {
  const errors = {}
  if (!values.mobile) {
    errors.mobile = '* Please Enter User Name'
  } else
    if (values.mobile.length !== 10) {
      errors.mobile = '* Please Enter Valid User Name'
    }

  if (!values.password) {
    errors.password = '* Please Enter Password'
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

const RenderPasswordField = ({
  input,
  label,
  onPasswordShow,
  showPassword,
  type,
  meta: { touched, error },
  ...custom
}) => (
    <FormControl className='w-100'>
      <InputLabel error={touched && Boolean(error)}>{label}</InputLabel>
      <Input
        error={touched && Boolean(error)}
        type={type}
        {...input}
        {...custom}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={onPasswordShow}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }

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
  return onlyNumberData.slice(0, 10)
}

const LogInForm = ({ handleSubmit, onSubmit }) => {

  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = formdata => {
    formdata.type = 'pro'
    onSubmit(formdata)
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="row mb-3">
        <div className="col-12">
          <Field
            name="mobile"
            label="User Name"
            component={RenderTextField}
            normalize={onlyNumber}
          />
        </div>
        <div className="col-12">
          <Field
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            showPassword={showPassword}
            onPasswordShow={() => setShowPassword(!showPassword)}
            component={RenderPasswordField}
          />
        </div>
      </div>
      <button className="btn-outline blue">Sign In</button>
    </form>
  )
}

export default reduxForm({
  form: 'login-form',
  validate
})(LogInForm)
