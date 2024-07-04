import React, { Component } from 'react'
import { destroy } from 'redux-form'
import { connect } from 'react-redux'
import { Card, CardBody } from 'reactstrap'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import { FHD_SHD_STEPS, SHD_USER_TYPES } from '../../core/constants/settings'
import OutletDetails from '../../shared/components/FhdShdForm/OutletDetails'
import ProfileDetails from '../../shared/components/FhdShdForm/ProfileDetails'
import BankDetails from '../../shared/components/FhdShdForm/BankDetails'
import { addSHD } from '../../core/services/shdServices'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { setNotification } from '../../redux/actions/notificationAction'

class AddSHD extends Component {

  state = {
    activeStep: 0,
    oemInfo: null,
    registeredAddress: null,
    mailingAddress: null,
    loginDetails: null
  }

  getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return (
          <OutletDetails
            formType="shd"
            onSubmitForm={this.handleOutletForm}
          />
        )
      case 1:
        return (
          <ProfileDetails
            formType="shd"
            userTypes={SHD_USER_TYPES}
            onClickBack={this.goToPreviousStep}
            onSubmitForm={this.handleProfileForm}
          />
        )
      case 2:
        return (
          <BankDetails
            onClickBack={this.goToPreviousStep}
            onSubmitForm={this.handleBankForm}
          />
        )
      default:
        return 'Unknown stepIndex'
    }
  }

  handleOutletForm = outletFormData => {
    if (outletFormData) {
      const { oemInfo, registeredAddress, mailingAddress } = outletFormData
      this.setState({ oemInfo, registeredAddress, mailingAddress })
      this.goToNextStep()
    }
  }

  handleProfileForm = profileFormData => {
    if (profileFormData) {
      this.setState({ loginDetails: profileFormData })
      this.goToNextStep()
    }
  }

  handleBankForm = bankInfo => {
    const { dispatch, history } = this.props
    const { oemInfo, mailingAddress, registeredAddress, loginDetails } = this.state
    const payload = { oemInfo, mailingAddress, registeredAddress, loginDetails, bankInfo, storeType: 'SHD' }
    dispatch(showLoader())
    addSHD(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message))
          dispatch(destroy('outlet-details'))
          dispatch(destroy('profile-details'))
          dispatch(destroy('bank-details'))
          history.push('/shd')
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
          dispatch(hideLoader())
        }
      })
  }

  goToNextStep = () => {
    this.setState(prevState => ({ activeStep: prevState.activeStep + 1 }))
  }

  goToPreviousStep = () => {
    this.setState(prevState => ({ activeStep: prevState.activeStep - 1 }))
  }

  render() {
    const { activeStep } = this.state
    return (
      <div className="form-conatiner">
        <h3>SHD Details</h3>
        <Stepper
          activeStep={activeStep}
          classes={{ root: 'steper-header' }}
          alternativeLabel
        >
          {
            FHD_SHD_STEPS.map(label =>
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            )
          }
        </Stepper>
        <Card className="form-card">
          <CardBody>
            {
              this.getStepContent(activeStep)
            }
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default connect()(AddSHD)