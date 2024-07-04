const validate = values => {

  var gstregex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const errors = {}
  if (!values.gstinCode) {
    errors.gstinCode = '* Please select Business Legal Name'
  }
  if (values.gstCheck) {
    if (!values.gstNo) {
      errors.gstNo = '* Please enter GSTIN'
    }
    if (values.gstNo && !gstregex.test(values.gstNo))
      errors.gstNo = "* Please Enter Valid GSTIN Number"

  }

  if (!values.paper) {
    errors.paper = '* Please enter paper transfer amount'
  }

  if (!values.warrantyCard) {
    errors.warrantyCard = '* Please Select Warranty'
  }

  if (!values.hsnDetails) {
    errors.hsnDetails = '* Please select HSN'
  }

  if (!values.hsn) {
    errors.hsn = '* Please select HSN'
  }
  if (values.servicePlan && !values.serviceHsn && values.servicePlan.planName !== 'Not Intersted') {
    errors.serviceHsn = '* Please select HSN'
  }

  // if (!values.servicePlan) {
  //   errors.servicePlan = '* Please select Plan'
  // }

  if (!values.mobileNo) {
    errors.mobileNo = '* Please enter phone number'
  } else if (values.mobileNo.length !== 10) {
    errors.mobileNo = '* Please enter valid phone number'
  }

  if (!values.name) {
    errors.name = '* Please enter name'
  }

  if (!values.addressLine1) {
    errors.addressLine1 = '* Please enter address line 1'
  }

  if (!values.addressLine2) {
    errors.addressLine2 = '* Please enter address line 1'
  }

  if (!values.stateId) {
    errors.stateId = '* Please select state'
  }

  if (!values.cityName) {
    errors.cityName = '* Please select city'
  }

  if (!values.pincode) {
    errors.pincode = '* Please select pincode'
  }
  if(!values.refType){
    errors.refType="* Please Select Referral Source"
  }

  return errors
}

export default validate