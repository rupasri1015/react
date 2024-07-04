import React, { Component, forwardRef, Fragment } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Slide from '@material-ui/core/Slide'
import Checkbox from '@material-ui/core/Checkbox'
import Chip from '@material-ui/core/Chip'
import SelectField from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import { reduxForm, Field } from 'redux-form'
import validate from './validate'
import { connect } from 'react-redux'
import { fhdShdStores, resetFhdShdStores } from '../../../../redux/actions/fhdShdStoreListAction'
import MenuItem from '@material-ui/core/MenuItem'
import Slider from 'react-slick'
import isEqual from 'lodash/isEqual'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 225
    },
  },

  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  }
}

const RenderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
    <FormControl className='w-100'>
      <TextField
        label={label}
        error={touched && Boolean(error)}
        {...input}
        {...custom}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

const RenderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
    <FormControl className='w-100'>
      <InputLabel style={{ color: error && touched ? '#c00' : '' }}>{label}</InputLabel>
      <SelectField
        label={label}
        error={touched && Boolean(error)}
        {...input}
        onChange={(event) => input.onChange(event.target.value)}
        children={children}
        {...custom}
        MenuProps={MenuProps}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

const renderValueMultiselect = (values) => {
  if (values.length < 2) {
    const store = values.map(value => value.storeName).join(', ')
    return <Chip label={store} style={{ maxWidth: 120 }} />
  }
  else
    return <Chip label={`${values.length} Stores Selected`} />
}

const RenderMultiSelect = ({
  input,
  label,
  meta: { touched, error },
  options,
  renderValue,
  renderTags,
  ...custom
}) => (
    <Autocomplete
      multiple
      id="checkboxes-stores"
      options={options}
      disableCloseOnSelect
      getOptionLabel={option => option.storeName ?  option.storeName : ''}
      getOptionSelected={(option, value) => String(option.storeId) === String(value.storeId)}
      renderTags={renderTags}
      disableClearable
      value={input.value ? input.value : []}
      onChange={(event, value) => input.onChange(value)}
      noOptionsText="No Store Found"
      renderOption={(option, { selected }) => {
        return (
          <Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.storeName}
          </Fragment>
        )
      }}
      renderInput={params => (
        <FormControl className='w-100'>
          <TextField
            {...params}
            error={touched && Boolean(error)}
            fullWidth
            label="Select Stores"
            {...custom}
          />
          <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
        </FormControl>
      )}
    />
  )

const onlyNumber = (value) => {
  if (!value) {
    return value
  }
  let onlyNumberData = value.replace(/[^\d]/g, '')
  onlyNumberData = onlyNumberData.replace(/(?!^)+/g, '')
  return onlyNumberData.startsWith('0') ? '' : onlyNumberData.slice(0, 10)
}

class AddValuator extends Component {

  state = { prevData: null, selectedStores: [] }

  componentDidMount() {
    const { initialValues, initialize } = this.props
    if (initialValues) {
      const { userFirstName,userLastName, userMobileNumber, storeCityId, storesForUser } = initialValues
      const formData = {}
      if (storeCityId) {
        formData.cityId = storeCityId
      }
      if (userFirstName) {
        formData.firstName = userFirstName
      }
      if (userLastName) {
        formData.lastName = userLastName
      }
      if (userMobileNumber) {
        formData.mobileNo = userMobileNumber
      }
      if (storesForUser) {
        formData.storeIds = storesForUser
        this.setState({ selectedStores: storesForUser })
      }
      this.setState({ prevData: formData })
      initialize(formData)
    }
  }

  submitForm = formdata => {
    const { valid, initialValues, onAddForm, onUpdateForm, onClose, dispatch } = this.props
    const { prevData } = this.state
    if (valid) {
      const isSame = isEqual(prevData, formdata)
      formdata.userType = 'Valuator'
      if (formdata.storeIds && formdata.storeIds.length) {
        formdata.storeIds = formdata.storeIds.map(store => store.storeId)
      }
      if (initialValues) {
        if (isSame) {
          onClose()
        } else {
          formdata.userId = initialValues.userId
          onUpdateForm(formdata)
        }
      } else {
        onAddForm(formdata)
      }
      dispatch(resetFhdShdStores())
    }
  }

  changeCity = (city) => {
    const { dispatch } = this.props
    const payload = {
      cityId: city,
      storeTypeId: 3
    }
    dispatch(fhdShdStores(payload))
  }

  changeStore = stores => {
    this.setState({ selectedStores: stores })
  }

  closeForm = () => {
    const { dispatch, onClose } = this.props
    dispatch(resetFhdShdStores())
    onClose()
  }

  render() {
    const { handleSubmit, open, storeList, cityList } = this.props
    const { selectedStores } = this.state
    var settings = {
      swipeToSlide: true,
      variableWidth: true,
      infinite: false,
      noRightPadding: true,
      className: 'slide-padding'
    }

    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        onClose={this.closeForm}
      >
        <form onSubmit={handleSubmit(this.submitForm)}>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <div className="row">
              <div className="col-sm-6 mt-2">
                <Field
                  name="firstName"
                  component={RenderTextField}
                  label="Enter First Name"
                />
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="lastName"
                  component={RenderTextField}
                  label="Enter Last Name"
                />
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="mobileNo"
                  component={RenderTextField}
                  label="Enter Mobile Number"
                  normalize={onlyNumber}
                />
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="cityId"
                  component={RenderSelectField}
                  label="Select City"
                  onChange={this.changeCity}
                >
                  {
                    Boolean(cityList && cityList.length) &&
                    cityList.map(city => <MenuItem value={city.cityId} key={city.cityId}>{city.cityName}</MenuItem>)
                  }
                </Field>
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="storeIds"
                  component={RenderMultiSelect}
                  options={storeList}
                  renderTags={renderValueMultiselect}
                  onChange={this.changeStore}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button type="button" className="icon-btn gray" onClick={this.closeForm}>Cancel</button>
            <button className="icon-btn" >Submit</button>
          </DialogActions>
          <Slider {...settings}>
            {
              selectedStores.length &&
              selectedStores.map(store => (
                <div key={store.storeId}>
                  <div className="status-chip Accepted margin-right">
                    <p> {`${store.storeName}`} </p>
                  </div>
                </div>
              ))
            }
          </Slider>
        </form>
      </Dialog >
    )
  }
}

const mapStateToProps = (state) => ({
  storeList: state.storeListFhdShd.storeListByCityId,
  cityList: state.cities.cityList
})

AddValuator = connect(mapStateToProps)(AddValuator)

export default reduxForm({
  form: 'add-valuator-form',
  validate
})(AddValuator)