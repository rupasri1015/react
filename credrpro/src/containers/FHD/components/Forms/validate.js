const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = '* Please Enter Name'
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
  }

  if (!values.userType) {
    errors.userType = '* Please Select Employee Type'
  }

  return errors
}

export default validate