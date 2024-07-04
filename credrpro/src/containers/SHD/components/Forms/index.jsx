import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Slide from '@material-ui/core/Slide';
import SelectField from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import { reduxForm, Field } from 'redux-form'
import validate from './validate'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { fhdShdStores, resetFhdShdStores } from '../../../../redux/actions/fhdShdStoreListAction'
import MenuItem from '@material-ui/core/MenuItem'
import isEqual from 'lodash/isEqual'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      <InputLabel style={{ color: error && touched ? '#c00' : '' }} >{label}</InputLabel>
      <SelectField
        label={label}
        error={touched && Boolean(error)}
        {...input}
        onChange={(event) => input.onChange(event.target.value)}
        children={children}
        {...custom}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

const onlyNumber = (value) => {
  if (!value) {
    return value
  }
  let onlyNumberData = value.replace(/[^\d]/g, '')
  onlyNumberData = onlyNumberData.replace(/(?!^)+/g, '')
  return onlyNumberData.startsWith('0') ? '' : onlyNumberData.slice(0, 10)
}

class AddShd extends Component {

  state = {
    prevData: null
  }

  componentDidMount() {
    const { initialValues, dispatch, initialize } = this.props

    if (initialValues) {
      const { userFirstName, userMobileNumber, cityId, groupName, storeId } = initialValues
      const payload = { storeTypeId: 2 }
      const formData = {}
      if (cityId) {
        payload.cityId = cityId
        dispatch(fhdShdStores(payload))
        formData.cityId = cityId
      }
      if (userFirstName) {
        formData.firstName = userFirstName
      }
      if (userMobileNumber) {
        formData.mobileNo = userMobileNumber
      }
      if (groupName) {
        formData.userType = groupName
      }
      if (storeId) {
        formData.storeIds = storeId
      }
      this.setState({ prevData: formData })
      initialize(formData)
    }

  }

  submitForm = formdata => {
    const { valid, onUpdateForm, onAddForm, initialValues, onClose, dispatch } = this.props
    const { prevData } = this.state
    if (valid) {
      const isSame = isEqual(formdata, prevData)
      formdata.storeIds = [formdata.storeIds]
      if (initialValues) {
        if (isSame) {
          onClose()
        } else {
          formdata.userId = initialValues.userId
          onUpdateForm(formdata)
        }
      }
      else {
        onAddForm(formdata)
      }
      dispatch(resetFhdShdStores())
    }
  }

  closeForm = () => {
    const { dispatch, onClose } = this.props
    dispatch(resetFhdShdStores())
    onClose()
  }

  changeCity = (city) => {
    const { dispatch } = this.props
    const payload = {
      cityId: city,
      storeTypeId: 2
    }
    dispatch(fhdShdStores(payload))
  }

  render() {
    const { handleSubmit, open, storeList, cityList, initialValues } = this.props
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
                  label="Enter Name"
                />
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="mobileNo"
                  component={RenderTextField}
                  label="Enter Mobiel Number"
                  normalize={onlyNumber}
                />
              </div>
              {
                initialValues ? 
                (<div className="col-sm-6 mt-2">
                <Field
                  name="cityId"
                  component={RenderSelectField}
                  label="Select City"
                  onChange={this.changeCity}
                  disabled={true}
                >
                  {
                    Boolean(cityList && cityList.length) &&
                    cityList.map(city => <MenuItem value={city.cityId} key={city.cityId}>{city.cityName}</MenuItem>)
                  }
                </Field>
              </div>) : 
              (<div className="col-sm-6 mt-2">
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
              </div>)
              }
              {
                initialValues ? 
                (<div className="col-sm-6 mt-2">
                <Field
                  name="storeIds"
                  component={RenderSelectField}
                  label="Select SHD"
                  disabled={true}
                >
                  {
                    Boolean(storeList && storeList.length) &&
                    storeList.map(store => <MenuItem value={store.storeId} key={store.storeId}>{store.storeName}</MenuItem>)
                  }
                </Field>
              </div>) : 
              (<div className="col-sm-6 mt-2">
                <Field
                  name="storeIds"
                  component={RenderSelectField}
                  label="Select SHD"
                >
                  {
                    Boolean(storeList && storeList.length) &&
                    storeList.map(store => <MenuItem value={store.storeId} key={store.storeId}>{store.storeName}</MenuItem>)
                  }
                </Field>
              </div>)
              }
              <div className="col-sm-6 mt-2">
                <Field
                  name="userType"
                  component={RenderSelectField}
                  label="Employee Type"
                >
                  {/* <MenuItem value="SHD_Manager"> SHD_Manager </MenuItem>
                  <MenuItem value="SHD_Sales_Executive"> SHD_Sales_Executive </MenuItem>
                  <MenuItem value="SHD_OWNER"> SHD_OWNER </MenuItem> */}
                  <MenuItem value="SHD"> SHD </MenuItem>
                </Field>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button type="button" className="icon-btn gray" onClick={this.closeForm}>Cancel</button>
            <button className="icon-btn" >Submit</button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

const mapStateToProps = (state) => ({
  storeList: state.storeListFhdShd.storeListByCityId,
  cityList: state.cities.cityList
})

AddShd = connect(mapStateToProps)(withRouter(AddShd))

export default reduxForm({
  form: 'add-shd-form',
  validate
})(AddShd)