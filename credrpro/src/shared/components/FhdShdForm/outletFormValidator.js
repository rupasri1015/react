import { PAN_REGEX, PIN_CODE_REGEX, EMAIL_REGEX } from '../../../core/constants/settings'

const validate = (values, { formType }) => {
  const errors = {}

  if (values.oemInfo || !values.oemInfo) {
    const oemInfo = values.oemInfo || {}
    errors.oemInfo = {}
    if (!oemInfo.outletName) errors.oemInfo.outletName = 'Please Enter Outlet Name'
    if (formType === 'fhd' && !oemInfo.outletType) errors.oemInfo.outletType = "Please Select Outlet Type"
    if (!oemInfo.panNumber) errors.oemInfo.panNumber = 'Please Enter PAN'
    else if (!PAN_REGEX.test(oemInfo.panNumber)) errors.oemInfo.panNumber = 'Please Enter Valid PAN'
    if (!oemInfo.primaryContactNumber) errors.oemInfo.primaryContactNumber = 'Please Enter Contact Number'
    else if (oemInfo.primaryContactNumber.length < 10) errors.oemInfo.primaryContactNumber = 'Please Enter Valid Contact Number'
    if (!oemInfo.intrustedType) errors.oemInfo.intrustedType = "Please Select Intrested In"
    if (!oemInfo.cityId) errors.oemInfo.cityId = "Please Select City"
    if (!oemInfo.active) errors.oemInfo.active = "Please Select Status"
    if (formType === 'fhd' && !oemInfo.oem) errors.oemInfo.oem = "Please Select OEM"
    if (oemInfo.email && !EMAIL_REGEX.test(oemInfo.email)) errors.oemInfo.email = "Please Enter Valid Email ID"
  }

  if (values.registeredAddress) {
    errors.registeredAddress = {}
    const registeredAddress = values.registeredAddress
    if (!registeredAddress.regaddressline1) errors.registeredAddress.regaddressline1 = "Please Enter Address Line 1"
    if (!registeredAddress.regaddressline2) errors.registeredAddress.regaddressline2 = "Please Enter Address Line 2"
    if (!registeredAddress.reglocation) errors.registeredAddress.reglocation = "Please Enter Location"
    if (!registeredAddress.regpincode) errors.registeredAddress.regpincode = "Please Enter Pin Code"
    else if (!PIN_CODE_REGEX.test(values.registeredAddress.regpincode)) errors.registeredAddress.regpincode = "Please Enter Valid Pin Code"
  } else {
    errors.registeredAddress = {}
    errors.registeredAddress.regaddressline1 = "Please Enter Address Line 1"
    errors.registeredAddress.regaddressline2 = "Please Enter Address Line 2"
    errors.registeredAddress.reglocation = "Please Enter Location"
    errors.registeredAddress.regpincode = "Please Enter Pin Code"
  }

  if (values.mailingAddress) {
    errors.mailingAddress = {}
    const mailingAddress = values.mailingAddress
    if (!mailingAddress.addressline1) errors.mailingAddress.addressline1 = "Please Enter Address Line 1"
    if (!mailingAddress.addressline2) errors.mailingAddress.addressline2 = "Please Enter Address Line 2"
    if (!mailingAddress.location) errors.mailingAddress.location = "Please Enter Location"
    if (!mailingAddress.pincode) errors.mailingAddress.pincode = "Please Enter Pin Code"
    else if (!PIN_CODE_REGEX.test(values.mailingAddress.pincode)) errors.mailingAddress.pincode = "Please Enter Valid Pin Code"
  } else {
    errors.mailingAddress = {}
    errors.mailingAddress.addressline1 = "Please Enter Address Line 1"
    errors.mailingAddress.addressline2 = "Please Enter Address Line 2"
    errors.mailingAddress.location = "Please Enter Location"
    errors.mailingAddress.pincode = "Please Enter Pin Code"
  }

  return errors
}

export default validate