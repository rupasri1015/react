
const validate = (formData, props) => {
  const ERRORS = {}
  if (!formData.status) {
    ERRORS.status = 'Please Select Status'
  }
    if (!formData.fromDate) {
      ERRORS.fromDate = 'Please Select Date'
    }
    if (!formData.time) {
      ERRORS.time = 'Please Select Time'
    }
    if (!formData.address) {
      ERRORS.address = 'Please Enter Address'
    }
    if(!formData.pincode) {
      ERRORS.pincode = 'Please Select Pincode'
    }
    if(!formData.cityId) {
      ERRORS.cityId = 'Please Select City'
    }
  if (!formData.reasonId) {
    ERRORS.reasonId = "Please Select Reason"
  }
  if (formData.comments && formData.comments.length > 255) {
    ERRORS.comments = `Please enter comments less than 255 characters. (Char length ${formData.comments.length})`
  }
  return ERRORS
}

export default validate