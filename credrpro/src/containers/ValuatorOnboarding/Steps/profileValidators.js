import { EMAIL_REGEX } from '../../../core/constants/settings'

const validate = values => {
  const errors = {}

  if (!values.firstName) errors.firstName = "* Please Enter First Name"
  if (!values.lastName) errors.lastName = "* Please Enter First Name"
  if (!values.gender) errors.gender = "* Please Select Gender"
  if (!values.cityId) errors.cityId = "* Please Select City"
  if (!values.contactNumber) errors.contactNumber = "* Please Enter Contact Number"
  else if (values.contactNumber.length < 10) errors.contactNumber = "* Please Enter Valid Number"
  if (values.emailId && !EMAIL_REGEX.test(values.emailId)) errors.emailId = "* Please Enter Valid Email ID"

  return errors
}

export default validate