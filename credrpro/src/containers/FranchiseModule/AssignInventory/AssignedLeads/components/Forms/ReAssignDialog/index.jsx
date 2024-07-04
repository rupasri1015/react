import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Slide from '@material-ui/core/Slide'
import SelectField from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import { reduxForm, Field } from 'redux-form'
import validate from './validate'
import { getFranchiseCities, getFranchiseStores } from '../../../../../../../core/services/franchiseServices'
import { setNotification } from '../../../../../../../redux/actions/notificationAction'
import MenuItem from '@material-ui/core/MenuItem'
import { SubmissionError } from 'redux-form'
import { getRole, PERMISSIONS, getUserID } from '../../../../../../../core/services/rbacServices'
import { connect } from 'react-redux'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

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
  let onlyNumberValue = value.replace(/[^\d]/g, '')
  onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
  return onlyNumberValue.startsWith('0') ? '' : onlyNumberValue.slice(0, 10)
}

class ReAssignBikeDialog extends Component {

  state = {
    prevData: null,
    cityList: [],
    storeList: []
  }

  componentDidMount() {
    const { data, dispatch, initialize } = this.props
    if (data) {
      const { cfp, crp, cityID, storeID } = data
      const formData = {}
      if (cityID) {
        getFranchiseStores(cityID)
          .then(apiResponse => {
            if (apiResponse.isValid) {
              this.setState({ storeList: apiResponse.storesbyCityId }, () => {
              })
            } else {
              const { message } = apiResponse
              dispatch(setNotification('danger', 'No Records', message))
            }
          })
        formData.cityId = Number(cityID)
      }
      if (cfp) {
        formData.cfp = Number(cfp)
      }
      if (storeID) {
        formData.storeIds = Number(storeID)
      }
      if (crp) {
        formData.crp = Number(crp)
      }
      else {
        formData.crp = 0
      }
      this.setState({ prevData: formData })
      initialize(formData)
    }
    getFranchiseCities()
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({ cityList: apiResponse.cityList }, () => {
          })
        } else {
          const { message } = apiResponse
          dispatch(setNotification('danger', 'No Records', message))
        }
      })
  }

  submitForm = formdata => {
    const { valid, data, onReAssignForm } = this.props
    if (valid) {
      const isValid = this.validateReleaseDate(data.createdDate)
      if (isValid && data.cfp && Number(data.cfp) === 0) {
        return
      }
      else {
        if (!isValid && formdata.cfp === "0") {
          throw new SubmissionError({ cfp: 'CFP Cannot be Zero' })
        }
      }
      onReAssignForm(formdata)
    }
  }

  changeCity = (city) => {
    const { dispatch, change } = this.props
    change('storeIds', '')
    getFranchiseStores(city)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({ storeList: apiResponse.storesbyCityId }, () => {
          })
        } else {
          const { message } = apiResponse
          dispatch(setNotification('danger', 'No Records', message))
        }
      })
  }

  validateReleaseDate = (assignedDate) => {
    if (Number(getUserID()) === 205366 || Number(getUserID()) === 158971) return false
    if (assignedDate) {
      let changedDate = new Date(assignedDate)
      let releaseDate = new Date("2020-01-16 19:30:0")
      if (changedDate.getTime() > releaseDate.getTime()) return true
    }
    return false
  }

  render() {
    const { open, handleSubmit, onClose, data } = this.props
    const { cityList, storeList } = this.state
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(this.submitForm)}>
          <DialogTitle style={{ textAlign: "center" }}>Reassign Showroom<span className="float-right" style={{ cursor: 'pointer' }} onClick={onClose} >&#10005;</span></DialogTitle>
          <DialogContent>
            <div className="row">
              {
                !PERMISSIONS.FRANCHISE.includes(getRole()) &&
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
              }
              <div className="col-sm-6 mt-2">
                <Field
                  name="storeIds"
                  component={RenderSelectField}
                  label="Assign Showroom"
                >
                  {
                    Boolean(storeList && storeList.length) &&
                    storeList.map(store => <MenuItem value={store.storeId} key={store.storeId}>{store.storeNomenclature}</MenuItem>)
                  }
                </Field>
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="cfp"
                  component={RenderTextField}
                  label="CredR Franchise Price"
                  normalize={onlyNumber}
                  disabled={this.validateReleaseDate(data.createdDate)}
                />
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="crp"
                  component={RenderTextField}
                  label="CredR Right Price"
                  normalize={onlyNumber}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button className="icon-btn" >Submit</button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

const mapStateToProps = (state) => ({
  storeList: state.franchiseStores.storeListByCityId
})

ReAssignBikeDialog = connect(mapStateToProps)(ReAssignBikeDialog)

export default reduxForm({
  form: 're-assign-bike-form',
  validate
})(ReAssignBikeDialog)