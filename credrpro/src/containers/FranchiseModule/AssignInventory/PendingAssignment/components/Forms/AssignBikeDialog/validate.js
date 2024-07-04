const validate = values => {
    const errors = {}
    if (!values.cityId) {
      errors.cityId = '* Please Select City'
    }
  
    if (!values.storeId) {
      errors.storeId = '* Please Select Showroom'
    }

    if(!values.cfp){
      errors.cfp = '* CFP Should be more than Zero'
    }

    if(!values.crp){
      errors.crp = '* Please Enter CRP'
    }
    return errors
  }
  
  export default validate