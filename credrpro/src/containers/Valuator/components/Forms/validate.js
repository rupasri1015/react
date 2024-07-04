const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = '* Please Enter First Name'
  }
  if (!values.lastName) {
    errors.lastName = '* Please Enter Last Name'
  }

  if (!values.mobileNo) {
    errors.mobileNo = '* Please Enter Phone Number'
  } else if (values.mobileNo.length !== 10) {
    errors.mobileNo = '* Please Valid Phone Number'
  }

  if (!values.cityId) {
    errors.cityId = '* Please Select City'
  }

  if (!values.storeIds) {
    errors.storeIds = '* Please Select SHD'
  } else if (values.storeIds && values.storeIds.length === 0) {
    errors.storeIds = '* Please Select SHD'
  }
  return errors
}

export default validate