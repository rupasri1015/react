const validate = values => {
  const errors = {}
  if (!values.inventoryPrice) {
    errors.inventoryPrice = '* Please Enter Price'
  }

  if (!values.storeId) {
    errors.storeId = '* Please Select Store'
  }

  return errors
}

export default validate