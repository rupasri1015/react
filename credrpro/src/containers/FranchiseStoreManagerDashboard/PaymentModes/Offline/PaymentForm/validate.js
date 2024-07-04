const validate = values => {
  const errors = {}
  if (!values.paymentAmount) {
    errors.paymentAmount = '* Please enter Amount'
  }

  if (!values.storeIds) {
    errors.storeIds = '* Please Select SHD'
  }

  if (!values.updateUTR) {
    errors.updateUTR = '* Please Enter UTR Number'
  }

  return errors
}

export default validate