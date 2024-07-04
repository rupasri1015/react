import React, { Component } from 'react'
import { Card, CardBody } from 'reactstrap'
import { destroy } from 'redux-form'
import { connect } from 'react-redux'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import { VALUATOR_STEPS } from '../../core/constants/settings'
import ProfileDetails from './Steps/Profile'
import DocumentDetails from './Steps/Documents'
import OutletDetails from './Steps/OutletDetails'
import { onboardValuator } from '../../core/services/valuatorServices'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { setNotification } from '../../redux/actions/notificationAction'

class AddValuator extends Component {

  state = {
    activeStep: 0,
    profileDetails: null,
    valuatorDocuments: null,
    cityId: null
  }

  getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return (
          <ProfileDetails
            onSubmitForm={this.handleProfileForm}
          />
        )
      case 1:
        return (
          <DocumentDetails
            onClickBack={this.goToPreviousStep}
            onSubmitForm={this.handleDocumentForm}
          />
        )
      case 2:
        return (
          <OutletDetails
            cityId={this.state.cityId}
            onClickBack={this.goToPreviousStep}
            onSubmitForm={this.handleOutletForm}
          />
        )
      default:
        return 'Unknown stepIndex'
    }
  }

  handleProfileForm = profileDetails => {
    if (profileDetails) {
      this.setState({ profileDetails, cityId: profileDetails.cityId })
      this.goToNextStep()
    }
  }

  handleDocumentForm = valuatorDocuments => {
    if (valuatorDocuments) {
      this.setState({ valuatorDocuments })
      this.goToNextStep()
    }
  }

  handleOutletForm = outletId => {
    const { dispatch, history } = this.props
    const { valuatorDocuments, profileDetails } = this.state
    dispatch(showLoader())
    const payload = { valuatorDocuments, profileDetails, outletId, userType: 'valuator' }
    onboardValuator(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message))
          dispatch(destroy('valuator-profile'))
          dispatch(destroy('valuator-outlet-details'))
          dispatch(destroy('valuator-document'))
          history.push('/valuator')
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
        <h3>Valuator Details</h3>
        <Stepper
          activeStep={activeStep}
          classes={{ root: 'steper-header' }}
          alternativeLabel
        >
          {
            VALUATOR_STEPS.map(label =>
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

export default connect()(AddValuator)