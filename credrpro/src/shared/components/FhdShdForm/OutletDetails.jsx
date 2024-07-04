import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import Divider from '@material-ui/core/Divider'
import TextField from '../redux-form/TextField'
import SelectField from '../redux-form/SelectField'
import RadioField from '../redux-form/RadioField'
import MenuItem from '@material-ui/core/MenuItem'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import GreenRadio from '../form/RadioGreen'
import validate from './outletFormValidator'
import { upperCase, postalCode, onlyNumber, mobileNumber } from '../../../core/utility/inputNormalizers'
import { OEM_LIST } from '../../../core/constants/settings'

class OutletDetails extends Component {

  handleForm = formData => {
    const { valid, onSubmitForm } = this.props
    if (valid) {
      onSubmitForm(formData)
    }
  }

  render() {
    const { handleSubmit, cities, formType } = this.props
    return (
      <form onSubmit={handleSubmit(this.handleForm)}>
        <p className="form-title">Outlet Details</p>
        <Divider />
        <div className="field-container">
          <div className="form-field">
            <Field
              name="oemInfo.outletName"
              label={formType === 'fhd' ? "Outlet Name" : "Company Name"}
              component={TextField}
            />
          </div>
          {
            formType === 'fhd' &&
            <div className="form-field">
              <Field
                name="oemInfo.outletType"
                label="Select Outlet Type"
                component={SelectField}
              >
                <MenuItem value="Manned">Manned</MenuItem>
                <MenuItem value="Unmanned">Unmanned</MenuItem>
              </Field>
            </div>
          }
          <div className="form-field">
            <Field
              name="oemInfo.tinNumber"
              label="Tin Number"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="oemInfo.cinNumber"
              label="Cin Number"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="oemInfo.serviceTaxNumber"
              label="Service Tax Number"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="oemInfo.panNumber"
              label="Pancard Number"
              component={TextField}
              normalize={upperCase}
            />
          </div>
          <div className="form-field">
            <Field
              name="oemInfo.websiteUrl"
              label="Website URL"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="oemInfo.email"
              label="Email ID"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="oemInfo.primaryContactNumber"
              label="Primary Contact/Whatsapp Number"
              component={TextField}
              normalize={mobileNumber}
            />
          </div>
          <div className="form-field">
            <Field
              name="oemInfo.altContactNumber"
              label="Alternate Contact Number"
              component={TextField}
              normalize={onlyNumber}
            />
          </div>
          <div className="form-field">
            <Field
              name="oemInfo.cityId"
              label="Select City"
              component={SelectField}
            >
              {
                Boolean(cities.length) &&
                cities.map(city => <MenuItem value={city.cityId} key={city.cityId}>{city.cityName}</MenuItem>)
              }
            </Field>
          </div>
          {
            formType === 'fhd' &&
            <div className="form-field">
              <Field
                name="oemInfo.oem"
                label="Select OEM"
                component={SelectField}
              >
                {
                  OEM_LIST.map(oem => <MenuItem value={oem} key={oem}>{oem}</MenuItem>)
                }
              </Field>
            </div>
          }
          <div className="form-field mt-3">
            <Field
              name="oemInfo.intrustedType"
              label="Intrested In"
              component={RadioField}
            >
              <FormControlLabel value="BUY" control={<GreenRadio />} label="Buy" />
              <FormControlLabel value="SELL" control={<GreenRadio />} label="Sell" />
              <FormControlLabel value="BOTH" control={<GreenRadio />} label="Both" />
            </Field>
          </div>
          <div className="form-field mt-3">
            <Field
              name="oemInfo.active"
              label="Status"
              component={RadioField}
            >
              <FormControlLabel value="ACTIVE" control={<GreenRadio />} label="Active" />
              <FormControlLabel value="INACTIVE" control={<GreenRadio />} label="Inactive" />
            </Field>
          </div>
        </div>
        <div className="field-container">
          <div className="form-field">
            <p className="form-title">Registered Address</p>
            <Field
              name="registeredAddress.regaddressline1"
              label="Address Line 1"
              component={TextField}
            />
            <Field
              name="registeredAddress.regaddressline2"
              label="Address Line 2"
              component={TextField}
            />
            <Field
              name="registeredAddress.reglocation"
              label="Location"
              component={TextField}
            />
            <Field
              name="registeredAddress.regpincode"
              label="Pin Code"
              component={TextField}
              normalize={postalCode}
            />
          </div>
          <div className="form-field">
            <p className="form-title">Mailing Address</p>
            <Field
              name="mailingAddress.addressline1"
              label="Address Line 1"
              component={TextField}
            />
            <Field
              name="mailingAddress.addressline2"
              label="Address Line 2"
              component={TextField}
            />
            <Field
              name="mailingAddress.location"
              label="Location"
              component={TextField}
            />
            <Field
              name="mailingAddress.pincode"
              label="Pin Code"
              component={TextField}
              normalize={postalCode}
            />
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

OutletDetails = connect(mapStateToProps)(OutletDetails)

export default reduxForm({
  form: 'outlet-details',
  validate,
  destroyOnUnmount: false
})(OutletDetails)