// profile fields Updation form
// @author Raghavendra

import React, { Component, useEffect } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import Divider from '@material-ui/core/Divider'
import TextField from '../../../shared/components/redux-form/TextField'
import DateField from '../../../shared/components/redux-form/MaterialDateField'
import { validate, maxLength30, minLength3, alphaNumeric } from './FieldValidator'
import { getDatePayload } from '../../../core/utility/stringUtility'
import { mobileNumber } from '../../../core/utility/inputNormalizers'
import { Card, CardBody } from 'reactstrap'
import { getFirstName, getLastName, getEmail, getAltNumber, getImage, getDob, saveUserInfo } from '../../../core/services/userInfoStorageServices'

class UpdateProfile extends Component {

  state = {
    prevData: null,
    imageurls: ""
  }

  initialState = {}
  componentDidMount() {
    this.initialState = {
      firstName: getFirstName(),
      lastName: getLastName(),
      email: getEmail(),
      alternateMobile: getAltNumber(),
      dob: getDob(),
    }

    const { initialize } = this.props
    if (this.initialState) {
      const { firstName, lastName, alternateMobile, dob, email } = this.initialState
      const formData = {}
      if (firstName == 'undefined' || firstName == 'null') {
        formData.firstName = ""

      }
      else {
        formData.firstName = firstName

      }
      if (lastName == 'undefined' || lastName == 'null') {
        formData.lastName = ""

      }
      else {
        formData.lastName = lastName

      }
      if (alternateMobile == 'undefined' || alternateMobile == 'null') {
        formData.alternateMobile = ""

      }
      else {
        formData.alternateMobile = alternateMobile

      }
      if (dob == 'undefined' || dob == 'null') {
        formData.dob = ""

      }
      else {
        formData.dob = dob

      }

      if (email == 'undefined' || email == 'null') {
        formData.email = ""
      }
      else {
        formData.email = email
      }

      this.setState({ prevData: formData })
      initialize(formData)
    }
  }

  handleForm = formData => {
    const { valid, onSubmitForm } = this.props
    const data = { ...formData }
    if (valid) {
      if (data.dob) data.dob = getDatePayload(data.dob)
      onSubmitForm(data)

      // history.push('./UserProfile/UpdateProfile');
    }
  }


  render() {

    const { handleSubmit, cities, imageurls } = this.props;

    return (

      <Card className="form-container" style={{ margin: 'auto', marginTop: "50px", maxWidth: 900 }} variant="outlined">

        <CardBody>

          <form onSubmit={handleSubmit(this.handleForm)}>
            <h4 className="form-title">Profile Details</h4>
            <Divider />
            <div className="field-container" style={{marginTop:"15px"}}>


              <div className="form-field">
                <div className="row">
                  <div className="col-sm-6">
                    <Field
                      name="firstName"
                      label="First Name"
                      component={TextField}
                      validate={[maxLength30, minLength3, alphaNumeric]}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Field
                      name="lastName"
                      label="Last Name"
                      component={TextField}
                      validate={[maxLength30, minLength3, alphaNumeric]}
                    />
                  </div>
                </div>

              </div>

              <div className="form-field">
                <div className="row">
                  <div className="col-sm-6">
                    <Field
                      name="email"
                      label="Email ID"
                      component={TextField}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Field
                      name="alternateMobile"
                      label="Alternate Number"
                      component={TextField}
                      normalize={mobileNumber}
                    />
                  </div>
                </div>

              </div>
              {/* <div className="form-field">
                <div className="row">
                  <div className="col-sm-6">
                    <Field
                      name="dob"
                      label="DOB"
                      max={new Date()}
                      showMonth
                      showYear
                      component={DateField}
                    />
                  </div>

                </div>

              </div> */}
            </div>
            <div className="cta-container">
              <button type="submit" className="icon-btn pull-right">Update</button>
            </div>
          </form>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = (state) => ({
  cities: state.cities.cityList
})

UpdateProfile = connect(mapStateToProps)(UpdateProfile)

export default reduxForm({
  form: 'valuator-profile',
  validate,
  destroyOnUnmount: false
})(UpdateProfile)