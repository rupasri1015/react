const validate = values => {
  const errors = {}

  if (!values.idProf) errors.idProf = "* Please Select ID Proof"
  if (!values.idProfImageUrl) errors.idProfImageUrl = "* Please Upload ID Proof"
  else if (!values.idProfImageUrl.length) errors.idProfImageUrl = "* Please Upload ID Proof"
  if (!values.addressProf) errors.addressProf = "* Please Select Address Proof"
  if (!values.addressProfImageUrl) errors.addressProfImageUrl = "* Please Upload Address Proof"
  else if (!values.addressProfImageUrl.length) errors.addressProfImageUrl = "* Please Upload Address Proof"

  return errors
}

export default validate