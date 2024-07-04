import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Slide from '@material-ui/core/Slide'
import FormHelperText from '@material-ui/core/FormHelperText'
import { reduxForm, Field } from 'redux-form'
import validate from './validate'
import Upload from '../../../../../shared/components/form/Upload'
import { CalenderIcon } from '../../../../../core/utility/iconHelper'
import Preview from '../../../../../shared/components/ImagePreview'
import { connect } from 'react-redux'
import { getAmount } from '../../../../../core/utility'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CalenderInput = React.forwardRef((props, ref) => (
  <div className="date-picker-input-container" ref={ref} onClick={props.onClick}>
    <input type="text" className="date-picker-input" id={props.id} placeholder={props.inputText} value={props.value} readOnly />
    <img src={CalenderIcon} className="calender-icon" alt="calender-icon" />
  </div>
))

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

const onlyNumber = (value) => {
  if (!value) {
    return value
  }
  let onlyNumberValue = value.replace(/[^\d]/g, '')
  onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
  return onlyNumberValue.startsWith('0') ? '' : onlyNumberValue
}

class PaymentForm extends Component {

  state = {
    errorImage: false
  }

  componentDidMount() {
    const { rowData, initialize } = this.props
    let formData = {}
    if(rowData.remainingAmount){
      formData.paymentAmount = getAmount(Number(rowData.remainingAmount))
    }
    initialize(formData)
  }

  closeForm = () => {
    const { dispatch, onClose } = this.props
    onClose()
  }

  submitForm = formdata => {
    const { imageUrl, onPaymentMade, rowData } = this.props
    if (imageUrl.length === 0) {
      this.setState({ errorImage: true })
    }
    else
    onPaymentMade(formdata, rowData)
  }

  render() {
    const { handleSubmit, open, uploadFiles, imageUrl, removeImage } = this.props
    const { errorImage } = this.state
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        onClose={this.closeForm}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleSubmit(this.submitForm)}>
          <DialogContent>
            <div className="row">
              <div className="col-sm-12 mt-2">
                <span>
                  <Upload
                    onFileChange={uploadFiles}
                    multiple
                    accept="image/*"
                  // errMsg={errMsg}
                  />
                </span>
                <span className="form__form-group-label" style={{ fontWeight: 'bolder' }}>Upload Payment Proof</span>
              </div>
              {
                errorImage && <FormHelperText style={{ color: '#c00', marginLeft: '15px' }}>Please update payment proof</FormHelperText>
              }
              <div className="col-sm-12 mt-2">
                {
                  Boolean(imageUrl.length) &&
                  imageUrl.map((url, index) => <Preview url={url} key={url} onRemove={() => removeImage(index)} />)
                }
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="updateUTR"
                  component={RenderTextField}
                  label="Update UTR"
                  style={{ width: '100%', maxWidth: '260px' }}
                />
              </div>
              <div className="col-sm-6 mt-2">
                <Field
                  name="paymentAmount"
                  component={RenderTextField}
                  label="Payment Amount"
                  normalize={onlyNumber}
                />
              </div>
              <div className="col-sm-12 mt-2">
                <input className='MuiInputBase-input MuiInput-input' type="text" disabled />
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
})

PaymentForm = connect(mapStateToProps)(PaymentForm)

export default reduxForm({
  form: 'payment-form',
  validate
})(PaymentForm)