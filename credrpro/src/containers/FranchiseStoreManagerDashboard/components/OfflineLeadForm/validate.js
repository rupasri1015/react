import { REGESTRATION_REGEX, ALPHA_NUMERIC } from '../../../../core/constants/settings'

const validate = values => {
    const errors = {}
    if (!values.userName) {
      errors.userName = '* Please enter name'
    }

    // else if(values.userName && !ALPHA_NUMERIC.test(values.userName) ) {
    //   errors.userName = '* Please enter correct name'
    // }
  
    if (!values.mobileNumber) {
      errors.mobileNumber = '* Please enter phone number'
    }

    else if(values.mobileNumber && values.mobileNumber.length !== 10) {
      errors.mobileNumber = '* Please enter 10 digits phone number'
    }

    if (values.registrationNumber && !REGESTRATION_REGEX.test(values.registrationNumber)) {
      errors.registrationNumber = '* Please enter valid registration number'
    }
  
    return errors
  }
  
  export default validate