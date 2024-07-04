import React, { Component, Fragment } from 'react'
import { reduxForm, Field } from 'redux-form'
import Divider from '@material-ui/core/Divider'
import { listStoresFhdShd } from '../../../core/services/miscServices'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Checkbox from '@material-ui/core/Checkbox'
import TextInput from '@material-ui/core/TextField'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import './style.scss'
const validate = value => {
  const error = {}
  if (!value.outletId) error.outletId = "* Please Select Outlet"
  else if (!value.outletId.length) error.outletId = "* Please Select Outlet"
  return error
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const MultiSelectCheckbox = ({
  input,
  label,
  meta: { touched, error },
  options,
  custom
}) => (
    <Autocomplete
      multiple
      onChange={(event, value) => input.onChange(value)}
      options={options}
      disableCloseOnSelect
      getOptionLabel={option => option.storeName ? option.storeName:""}
      noOptionsText="No Store Found"
      value={input.value ? input.value : []}
      getOptionSelected={(option, value) => String(option.storeId) === String(value.storeId)}
      renderOption={(option, { selected }) => (
        <Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.storeName}
        </Fragment>
      )}
      renderInput={params => (
        <FormControl className='w-100'>
          <TextInput
            {...params}
            label={label}
            error={touched && Boolean(error)}
            fullWidth
            {...custom}
          />
          <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
        </FormControl>
      )}
    />
  )

class OutletDetails extends Component {

  state = { outlets: [] }

  handleForm = formData => {
    const { valid, onSubmitForm } = this.props

    if (valid) {
      const data = { ...formData }
      data.outletId = data.outletId.map(store => store.storeId)
      onSubmitForm(data.outletId)
    }
  }

  componentDidMount() {
    const { cityId } = this.props
    const payload = {
      storeTypeId: 3,
      cityId
    }
    listStoresFhdShd(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { storeListByCityId } = apiResponse
          this.setState({ outlets: storeListByCityId })
        }
      })
  }

  render() {
    const { handleSubmit, onClickBack } = this.props
    const { outlets } = this.state
    return (
      <form className='outletDetails' onSubmit={handleSubmit(this.handleForm)}>
        <p className="form-title">Outlet Details</p>
        <Divider />
        <div className="field-container">
          <div style={{ width: '100%' }}>
            <Field
              name="outletId"
              label="Select Outlet Name"
              options={outlets}
              component={MultiSelectCheckbox}
            />
          </div>
        </div>
        <div className="cta-container">
          <button type="button" className="btn-outline blue" onClick={onClickBack}>BACK</button>
          <button className="icon-btn">CONTINUE</button>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form: 'valuator-outlet-details',
  validate,
  destroyOnUnmount: false
})(OutletDetails)