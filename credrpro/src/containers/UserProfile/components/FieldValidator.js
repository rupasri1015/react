import { PROFILE_EMAIL_REGEX } from '../../../core/constants/settings'

export const validate = values => {
  const errors = {}

  if (!values.firstName) errors.firstName = "* Please Enter First Name"
  if (!values.lastName) errors.lastName = "* Please Enter Last Name"
  if (!values.email) errors.email = "* Please Enter Email"
  if (!values.dob) errors.dob = "* Please Enter Date Of Birth"

  // if (!values.alternateMobile) errors.alternateMobile = "* Please Provide Alternate Number"
  // else if (values.alternateMobile.length < 10) errors.alternateMobile = "* Please Enter Valid Number"
  if (values.email && !PROFILE_EMAIL_REGEX.test(values.email)) errors.email = "* Please Enter Valid Email ID"

  return errors
}
export default validate

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
export const maxLength30 = maxLength(30)
export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
export const minLength3 = minLength(3)
export const alphaNumeric = value =>
  value && /[^a-zA-Z ]/i.test(value)
    ? 'Only alphabatic characters'
    : undefined