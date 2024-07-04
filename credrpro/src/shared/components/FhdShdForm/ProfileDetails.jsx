import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import Divider from '@material-ui/core/Divider'
import TextField from '../redux-form/TextField'
import SelectField from '../redux-form/SelectField'
import RadioField from '../redux-form/RadioField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import GreenRadio from '../form/RadioGreen'
import validate from './profileFormValidators'
import MenuItem from '@material-ui/core/MenuItem'
import { mobileNumber } from '../../../core/utility/inputNormalizers'

class ProfileDetails extends Component {

  handleForm = formData => {
    const { valid, onSubmitForm } = this.props
    if (valid) {
      onSubmitForm(formData)
    }
  }

  render() {
    const { handleSubmit, onClickBack, userTypes } = this.props
    return (
      <form onSubmit={handleSubmit(this.handleForm)}>
        <p className="form-title">Profile Details</p>
        <Divider />
        <div className="field-container">
          <div className="form-field">
            <Field
              name="userType"
              label="Select Type"
              component={SelectField}
            >
              {
                userTypes.map(user => <MenuItem value={user.value} key={user.value}>{user.name}</MenuItem>)
              }
            </Field>
          </div>
          <div className="form-field">
            <Field
              name="userName"
              label="First Name"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="lastName"
              label="Last Name"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="contactNumber"
              label="Contact Number"
              component={TextField}
              normalize={mobileNumber}
            />
          </div>
          <div className="form-field">
            <Field
              name="emailId"
              label="Email ID"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="activeStatus"
              label="Status"
              component={RadioField}
            >
              <FormControlLabel value="ACTIVE" control={<GreenRadio />} label="Active" />
              <FormControlLabel value="INACTIVE" control={<GreenRadio />} label="Inactive" />
            </Field>
          </div>
        </div>
        <div className="cta-container">
          <button type="button" className="btn-outline blue" onClick={onClickBack}>BACK</button>
          <button className="icon-btn">CONTINUE</button>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form: 'profile-details',
  validate,
  destroyOnUnmount: false
})(ProfileDetails)