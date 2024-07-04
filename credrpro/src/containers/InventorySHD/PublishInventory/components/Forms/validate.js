const validate = values => {
    const errors = {}
    if (!values.rePublishedPrice) {
      errors.rePublishedPrice = '* Please Enter Price'
    }
  
    if (!values.storeId) {
      errors.storeId = '* Please Select Store'
    }
  
    return errors
  }
  
  export default validate