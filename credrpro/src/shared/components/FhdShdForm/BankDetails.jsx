import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import Divider from '@material-ui/core/Divider'
import TextField from '../redux-form/TextField'
import validate from './bankFormValidators'
import { upperCase } from '../../../core/utility/inputNormalizers'

class BankDetails extends Component {

  handleForm = formData => {
    const { valid, onSubmitForm } = this.props
    if (valid) {
      onSubmitForm(formData)
    }
  }

  render() {
    const { handleSubmit, onClickBack } = this.props
    return (
      <form onSubmit={handleSubmit(this.handleForm)}>
        <p className="form-title">Bank Details</p>
        <Divider />
        <div className="field-container">
          <div className="form-field">
            <Field
              name="beneficiaryName"
              label="Benificiary Name"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="accountNumber"
              label="Account Number"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="branch"
              label="Branch Name"
              component={TextField}
            />
          </div>
          <div className="form-field">
            <Field
              name="ifscCode"
              label="IFSC Code"
              component={TextField}
              normalize={upperCase}
            />
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
  form: 'bank-details',
  validate,
  destroyOnUnmount: false
})(BankDetails)