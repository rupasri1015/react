import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, formValueSelector, getFormMeta } from 'redux-form'
import Divider from '@material-ui/core/Divider'
import SelectField from '../../../shared/components/redux-form/SelectField'
import MenuItem from '@material-ui/core/MenuItem'
import validate from './documentsValidators'
import { ID_PRROFS } from '../../../core/constants/settings'
import { uploadDocuments } from '../../../core/services/valuatorServices'
import { hideLoader, showLoader } from '../../../redux/actions/loaderAction'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import FileUpload from '../../../shared/components/form/Upload'
import ImagePreview from '../../../shared/components/ImagePreview'
import './style.scss'
class Documents extends Component {

  handleForm = formData => {
    const { valid, onSubmitForm } = this.props
    if (valid) {
      onSubmitForm(formData)
    }
  }

  uploadValuatorDocument = files => {
    const formData = new FormData()
    files.forEach(file => formData.append('file', file))
    return uploadDocuments(formData)
      .then(res => {
        if (res.isValid) {
          return res.userDocUrls
        } else {
          return null
        }
      })
  }

  uploadAddressProof = (files) => {
    const { addressUrl, change, touch, dispatch } = this.props
    dispatch(showLoader())
    this.uploadValuatorDocument(files)
      .then(docs => {
        if (docs) {
          if (addressUrl && addressUrl.length) {
            change('addressProfImageUrl', [...docs, ...addressUrl])
            touch('addressProfImageUrl')
          }
          else {
            change('addressProfImageUrl', [...docs])
            touch('addressProfImageUrl')
          }
        }
        dispatch(hideLoader())
      })
  }

  removeIdProof = index => {
    const { idUrl, change } = this.props
    const urls = [].concat(idUrl)
    urls.splice(index, 1)
    change('idProfImageUrl', urls)
  }

  removeAddressProof = index => {
    const { addressUrl, change } = this.props
    const urls = [].concat(addressUrl)
    urls.splice(index, 1)
    change('addressProfImageUrl', urls)
  }


  uploadIdProof = (files) => {
    const { idUrl, change, touch, dispatch } = this.props
    dispatch(showLoader())
    this.uploadValuatorDocument(files)
      .then(docs => {
        if (docs) {
          if (idUrl && idUrl.length) {
            change('idProfImageUrl', [...docs, ...idUrl])
            touch('idProfImageUrl')
          }
          else {
            change('idProfImageUrl', [...docs])
            touch('idProfImageUrl')
          }
          dispatch(hideLoader())
        }
      })
  }

  validateFields = () => {
    const { touch } = this.props
    touch('addressProfImageUrl')
    touch('idProfImageUrl')
  }

  render() {
    const { handleSubmit, onClickBack, idUrl, addressUrl, formMeta } = this.props
    return (
      <form className='docDetails' onSubmit={handleSubmit(this.handleForm)}>
        <p className="form-title">Documents Details</p>
        <Divider />
        <div className="field-container">
          <div className="form-field">
            <Field
              name="idProf"
              label="Select ID Proof"
              component={SelectField}
            >
              {
                ID_PRROFS.map(proof => <MenuItem value={proof.value} key={proof.value}>{proof.name}</MenuItem>)
              }
            </Field>
          </div>
          <div className="form-field">
            <FormControl className='w-100' style={{ marginTop: 20 }}>
              <FileUpload
                accept="image/*"
                onFileChange={this.uploadIdProof}
                name="Upload ID Proof"
              />
              <FormHelperText style={{ color: '#c00' }}>{!Boolean(idUrl && idUrl.length) && formMeta.idProfImageUrl && formMeta.idProfImageUrl.touched && '* Please Uppload ID Proofs'}</FormHelperText>
            </FormControl>
          </div>
          <div style={{ width: '100%', padding: '15px 0' }}>
            {
              idUrl && Boolean(idUrl.length) &&
              idUrl.map((url, index) => <ImagePreview className="float-left" key={url} onRemove={() => this.removeIdProof(index)} url={url} />)
            }
          </div>
          <div className="form-field" style={{ marginRight: 55 }}>
            <Field
              name="addressProf"
              label="Select Address Proof"
              component={SelectField}
            >
              {
                ID_PRROFS.map(proof => <MenuItem value={proof.value} key={proof.value}>{proof.name}</MenuItem>)
              }
            </Field>
          </div>
          <div className="form-field">
            <FormControl className='w-100' style={{ marginTop: 20 }}>
              <FileUpload
                accept="image/*"
                onFileChange={this.uploadAddressProof}
                name="Upload Address Proof"
              />
              <FormHelperText style={{ color: '#c00' }}>{!Boolean(addressUrl && addressUrl.length) && formMeta.addressProfImageUrl && formMeta.addressProfImageUrl.touched && '* Please Uppload Address Proofs'}</FormHelperText>
            </FormControl>
          </div>
          <div style={{ width: '100%', padding: '15px 0' }}>
            {
              addressUrl && Boolean(addressUrl.length) &&
              addressUrl.map((url, index) => <ImagePreview className="float-left" key={url} url={url} onRemove={() => this.removeAddressProof(index)} />)
            }
          </div>
        </div>
        <div className="cta-container">
          <button type="button" className="btn-outline blue" onClick={onClickBack}>BACK</button>
          <button className="icon-btn" onClick={this.validateFields}>CONTINUE</button>
        </div>
      </form>
    )
  }
}

Documents = reduxForm({
  form: 'valuator-document',
  validate,
  destroyOnUnmount: false
})(Documents)

const selector = formValueSelector('valuator-document')

const mapStateToprops = state => {
  const { addressProfImageUrl, idProfImageUrl } = selector(state, 'addressProfImageUrl', 'idProfImageUrl')
  return {
    idUrl: idProfImageUrl,
    addressUrl: addressProfImageUrl,
    formMeta: getFormMeta('valuator-document')(state)
  }
}

export default connect(mapStateToprops)(Documents)