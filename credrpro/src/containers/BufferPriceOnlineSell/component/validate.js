const validate = values => {
    const errors = {}
    if (!values.fmPrice) {
      errors.fmPrice = '* Please Enter Price'
    }
  
    return errors
  }
  
  export default validate