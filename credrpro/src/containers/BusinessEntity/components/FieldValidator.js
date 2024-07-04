import { EMAIL_REGEX } from '../../../core/constants/settings'

export const validate = values => {
  const errors = {}

  if (!values.firstName) errors.firstName = "* Please Enter First Name"
  if (!values.lastName) errors.lastName = "* Please Enter Last Name"
  if (!values.email) errors.email = "* Please Enter Email"
  if (!values.dob) errors.dob = "* Please Enter Date Of Birth"

  // if (!values.alternateMobile) errors.alternateMobile = "* Please Provide Alternate Number"
  // else if (values.alternateMobile.length < 10) errors.alternateMobile = "* Please Enter Valid Number"
  if (values.email && !EMAIL_REGEX.test(values.email)) errors.email = "* Please Enter Valid Email ID"

  return errors
}
export default validate

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
export const maxLength30 = maxLength(30)
export const gstnum = maxLength(13)

export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined

export const minLength3 = minLength(3)

var panregex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
var acct = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
var IFSCregex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
var gstregex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
var pinregex = /^[1-9][0-9]{5}$/;
var mnoMin = /^\d{10}$/;

export const mobileNum = value =>
  value && !mnoMin.test(value)
    ? 'Invalid Number'
    : undefined

export const panNum = value =>
  value && !panregex.test(value)
    ? 'Please provide Vaild PAN number'
    : undefined
export const pinCode = value =>
  value && !pinregex.test(value)
    ? 'Please provide Vaild Pin Code'
    : undefined
export const GSTval = value =>
  value != 'NA' && !gstregex.test(value)
    ? 'Please provide Vaild GST number'
    : undefined
export const acctNum = value =>
  value && !acct.test(value)
    ? 'Please provide Vaild Account number'
    : undefined

export const IFSCNum = value =>
  value && !IFSCregex.test(value)
    ? 'Please provide Vaild IFSC Code'
    : undefined

export const alpha = value =>
  value && /[^a-zA-Z ]/i.test(value)
    ? 'Enter Only alphabatic characters'
    : undefined

export const alphaNumeric = value =>
  value && /[^0-9a-zA-Z]/i.test(value)
    ? 'Enter Only alphabatic characters'
    : undefined