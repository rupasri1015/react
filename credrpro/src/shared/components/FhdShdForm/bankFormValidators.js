const validate = (values) => {
  const errors = {}

  if (!values.beneficiaryName) errors.beneficiaryName = "* Please Enter First Name"
  if (!values.accountNumber) errors.accountNumber = "* Please Enter Account Number"
  if (!values.branch) errors.branch = "* Please Enter Branch Name"
  if (!values.ifscCode) errors.ifscCode = "* Please Enter IFSC"

  return errors
}

export default validate