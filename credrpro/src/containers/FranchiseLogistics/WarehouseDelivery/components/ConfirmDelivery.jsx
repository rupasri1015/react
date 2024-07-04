import React, { PureComponent } from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import Upload from '../../../../shared/components/form/Upload'
import { uploadImages } from '../../../../core/services/logisticServices'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import { setNotification } from '../../../../redux/actions/notificationAction'
import ImagePreview from '../../../../shared/components/ImagePreview'

const RenderCheckBoxField = ({
  input,
  label
}) => (
    <FormControl className="w-100">
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={input.value ? true : false}
            onChange={(event) => input.onChange(event.target.checked)}
          />}
        label={label}
      />
    </FormControl>
  )

class ConfirmDelivery extends PureComponent {

  state = {
    urls: [],
    error: ''
  }

  componentDidMount() {
    this.props.initialize({ isVehicleDocumentsAvailable: false, isKeyAvailable: false })
  }

  submitForm = formData => {
    const { urls } = this.state
    const { inventory, onSubmitForm } = this.props
    formData.imgUrl = []
    if (formData.isVehicleDocumentsAvailable && formData.isKeyAvailable) {
      if (urls.length) {
        formData.leadId = inventory.leadId
        formData.imgUrl = urls
        formData.leadVehicleStatus = 'DELIVERED'
      } else {
        this.setState({ error: '*Please Upload Vehicle Documents' })
        return
      }
    } else {
      if (formData.isVehicleDocumentsAvailable) {
        if (urls.length) {
          formData.imgUrl = urls
          formData.leadId = inventory.leadId
        } else {
          this.setState({ error: '*Please Upload Vehicle Documents' })
          return
        }
      }
      formData.leadId = inventory.leadId
      formData.leadVehicleStatus = 'DISPUTE'
    }
    onSubmitForm(formData)
  }

  getButtonName = () => {
    const { doc, keys } = this.props
    if (doc && keys)
      return 'Confirm'
    return 'Dispute'
  }

  uploadImagesForDelvivery = images => {
    const { dispatch } = this.props
    this.setState({ error: '' })
    dispatch(showLoader())
    const formData = new FormData()
    images.forEach(file => {
      formData.append('file', file)
    })
    uploadImages(formData)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState(prevState => ({ urls: [...prevState.urls, ...apiResponse.urls] }))
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  removeImage = removeUrl => {
    const { urls } = this.state
    const images = [].concat(urls)
    this.setState({ urls: images.filter(url => url !== removeUrl) })
  }

  docSelected = isSeleceted => {
    if (!isSeleceted) {
      this.setState({ urls: [] })
      this.setState({ error: '' })
    }
  }

  render() {
    const { open, onClose, handleSubmit, doc } = this.props
    const { urls, error } = this.state
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Warehouse Delivery <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
        <form onSubmit={handleSubmit(this.submitForm)}>
          <DialogContent>
            <div style={{ display: "flex" }}>
              <Field
                name="isVehicleDocumentsAvailable"
                label="Vehichle Documents"
                component={RenderCheckBoxField}
                onChange={this.docSelected}
              />
              {
                doc &&
                <Upload
                  accept="image/*"
                  onFileChange={this.uploadImagesForDelvivery}
                  multiple
                />
              }
            </div>
            {
              Boolean(urls.length) &&
              urls.map(url => <ImagePreview key={url} url={url} onRemove={() => this.removeImage(url)} />)
            }
            <Field
              name="isKeyAvailable"
              label="Bike Keys"
              component={RenderCheckBoxField}
            />
            <FormHelperText style={{ color: '#c00' }}>{error}</FormHelperText>
          </DialogContent>
          <DialogActions>
            <button type="button" className="icon-btn gray" onClick={onClose}>Cancel</button>
            <button className="icon-btn">{this.getButtonName()}</button>
          </DialogActions>
        </form>
      </Dialog >
    )
  }
}

ConfirmDelivery = reduxForm({
  form: 'confirm-delivery'
})(ConfirmDelivery)

const selector = formValueSelector('confirm-delivery')

const mapStateToProps = state => ({
  doc: selector(state, 'isVehicleDocumentsAvailable'),
  keys: selector(state, 'isKeyAvailable')
})

export default connect(mapStateToProps)(ConfirmDelivery)