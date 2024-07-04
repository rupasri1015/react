import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import Divider from '@material-ui/core/Divider'
import TextField from '../../../shared/components/redux-form/TextField'
import SelectField from '../../../shared/components/redux-form/SelectField'
import RadioField from '../../../shared/components/redux-form/RadioField'
import DateField from '../../../shared/components/redux-form/MaterialDateField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import GreenRadio from '../../../shared/components/form/RadioGreen'
import validate from './profileValidators'
import MenuItem from '@material-ui/core/MenuItem'
import { getDatePayload } from '../../../core/utility/stringUtility'
import { mobileNumber } from '../../../core/utility/inputNormalizers'
import './style.scss'
class Profile extends Component {

  handleForm = formData => {
    const { valid, onSubmitForm } = this.props
    const data = { ...formData }
    if (valid) {
      if (data.dob) data.dob = getDatePayload(data.dob)
      onSubmitForm(data)
    }
  }

  render() {
    const { handleSubmit, cities } = this.props
    return (
      <form className='profileDetails' onSubmit={handleSubmit(this.handleForm)}>
        <p className="form-title">Profile Details</p>
        <Divider />
        <div className="field-container">
          <div className="form-field">
            <Field
              name="firstName"
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
              name="emailId"
              label="Email ID"
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
              name="altNumber"
              label="Alternate Number"
              component={TextField}
              normalize={mobileNumber}
            />
          </div>
          <div className="form-field">
            <Field
              name="dob"
              label="DOB"
              max={new Date()}
              showMonth
              showYear
              component={DateField}
            />
          </div>
          <div className="form-field">
            <Field
              name="gender"
              label="Gender"
              component={RadioField}
            >
              <FormControlLabel value="MALE" control={<GreenRadio />} label="Male" />
              <FormControlLabel value="FEMALE" control={<GreenRadio />} label="Female" />
            </Field>
          </div>
          <div className="form-field">
            <Field
              name="cityId"
              label="Select City"
              component={SelectField}
            >
              {
                Boolean(cities.length) &&
                cities.map(city => <MenuItem value={city.cityId} key={city.cityId}>{city.cityName}</MenuItem>)
              }
            </Field>
          </div>
        </div>
        <div className="cta-container">
          <button className="icon-btn">CONTINUE</button>
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
  cities: state.cities.cityList
})

Profile = connect(mapStateToProps)(Profile)

export default reduxForm({
  form: 'valuator-profile',
  validate,
  destroyOnUnmount: false
})(Profile)