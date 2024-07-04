import { EMAIL_REGEX } from '../../../core/constants/settings'

const validate = (values, { formType }) => {
  const errors = {}

  if (formType === 'fhd' && !values.userType) errors.userType = "* Please Select User Type"
  if (!values.userName) errors.userName = "* Please Enter First Name"
  if (!values.contactNumber) errors.contactNumber = "* Please Enter Contact Number"
  else if (values.contactNumber.length < 10) errors.contactNumber = "* Please Enter Valid Number"
  if (!values.emailId) errors.emailId = "* Please Enter Email ID"
  else if (!EMAIL_REGEX.test(values.emailId)) errors.emailId = "* Please Enter Valid Email ID"
  if (!values.activeStatus) errors.activeStatus = "* Please Select Status"

  return errors
}

export default validate