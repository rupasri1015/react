import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import DialogActions from '@material-ui/core/DialogActions'
import { fetchMmvByRegNum, getBikeStatus } from '../../../../core/services/franchiseServices'
import { userTypeDetails } from '../../../../core/services/authenticationServices';
import validate from './validate'
import './LeadForm.scss'
import { getCityID } from '../../../../core/services/rbacServices'

const RenderTextField = ({
    input,
    label,
    id,
    required,
    style,
    meta: { touched, error },
    ...custom
}) => (
    <FormControl className='w-100'>
        <TextField
            label={label}
            id={id}
            required={required}
            error={touched && Boolean(error)}
            {...input}
            {...custom}
        />
        <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
)

const onlyNumberMobile = (value) => {
    if (!value) {
        return value
    }
    let regex = /^[6-9]\d{9}$/gi
    let onlyContactNumbers = value.replace(/[^\d]/g, '')
    onlyContactNumbers.replace(/(?!^)+/g, '')
    if (onlyContactNumbers.startsWith('6') || onlyContactNumbers.startsWith('7') || onlyContactNumbers.startsWith('8') || onlyContactNumbers.startsWith('9'))
        return onlyContactNumbers.slice(0, 10)
}

const onlyNumber = (value) => {
    if (!value) {
        return value
    }
    let onlyNumberValue = value.replace(/[^\d]/g, '')
    onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
    return onlyNumberValue.startsWith('0') ? '' : onlyNumberValue.slice(0, 8)
}

const onlyAlphaNumeric = (value) => {
    if (!value) {
        return value
    }
    let onlyNumberValue = value.replace(/^[a-z\d\-_\s]+$/g, '')
    onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
    return onlyNumberValue
}

const onlyAlphabets = (value) => {
    if (!value) {
        return value
    }
    let onlyNumberValue = value.replace(/[^A-Za-z ]/g, '')
    onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
    return onlyNumberValue
}

const onlyRegistration = (value) => {
    if (!value) {
        return value
    }
    let checkReg = value.replace(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{5}$/g, '')
    // checkReg = checkReg.replace(/(?!^)+/g, '')
    return checkReg
}

class CreateLead extends Component {

    state = {
        registrationNumber: '',
        MMVList: [],
        bikeStatusMessage: false
    }

    componentDidMount() {
        this.props.change('userName', '')
        this.props.change('mobileNumber', '')
        this.props.change('customerExpectedPrice', '')
    }

    getMMVbyRegNum = () => {
        const { registrationNumber } = this.state
        const payload = {
            regNumber: registrationNumber,
            storeID: userTypeDetails().userType.storeId
        }
        fetchMmvByRegNum(payload)
            .then(mmvResponse => {
                if (mmvResponse.isValid) {
                    this.setState({ MMVList: mmvResponse.bikeDetails })
                }
            })
    }

    submitForm = formdata => {
        const { onCreateLead } = this.props
        const { MMVList } = this.state
        let payload = {}
        payload = {
            ...formdata,
            cityId: getCityID(),
            storeId: userTypeDetails().userType.storeId,
            make: (MMVList && MMVList.length && MMVList[0].make) === 0 ? '' : MMVList && MMVList.length && MMVList[0].make,
            model: (MMVList && MMVList.length && MMVList[0].model) === 0 ? '' : MMVList && MMVList.length && MMVList[0].model,
            variant: (MMVList && MMVList.length && MMVList[0].varient) === 0 ? '' : MMVList && MMVList.length && MMVList[0].varient,
            inventoryId: MMVList && MMVList.length && MMVList[0].inventoryID
        }
        setTimeout(() => {
            this.props.change('userName', '')
            this.props.change('mobileNumber', '')
            this.props.change('customerExpectedPrice', '')
        }, 300)
        onCreateLead(payload)
    }

    hanleRegNumChange = (e) => {
        const inputValue = e.target.value.toUpperCase()
        this.setState({ registrationNumber: inputValue })
    }

    getBikeStatus = () => {
        const { registrationNumber } = this.state
        getBikeStatus(registrationNumber).
            then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ bikeStatusMessage: false })
                }
                else {
                    this.setState({ bikeStatusMessage: true })
                }
            })
    }

    render() {
        const { open, onClose, handleSubmit } = this.props
        return (
            <>
                <Dialog
                    open={open}
                    maxWidth="xs"
                    fullWidth={true}
                    onClose={onClose}
                >
                    <form onSubmit={handleSubmit(this.submitForm)}>
                        <DialogContent>
                            <div className="justify-content-center" style={{ marginLeft: '20px' }}>
                                <h4 >Create Walk-in Lead Here</h4>
                                <p >Just fill out this form.</p>
                            </div>
                            <div style={{ marginLeft: '20px' }}>
                                <div style={{ marginTop: '8px', width: '100%', maxWidth: '350px' }}>
                                    <Field
                                        name="userName"
                                        component={RenderTextField}
                                        label="Enter Name"
                                        variant="outlined"
                                        normalize={onlyAlphabets}
                                    />
                                </div>
                                <div style={{ marginTop: '8px', width: '100%', maxWidth: '350px' }}>
                                    <Field
                                        name="mobileNumber"
                                        component={RenderTextField}
                                        label="Enter Mobile Number"
                                        variant="outlined"
                                        normalize={onlyNumberMobile}
                                    />
                                </div>
                                <div style={{ marginTop: '8px', width: '100%', maxWidth: '350px' }}>
                                    <Field
                                        name="customerExpectedPrice"
                                        component={RenderTextField}
                                        label="Enter Customer Expected Price"
                                        variant="outlined"
                                        normalize={onlyNumber}
                                    />
                                </div>
                                {/* {
                                MMVList && Boolean(MMVList.length) &&
                                <div className='row mt-5'>
                                    <div className='col-6 pl-0'>
                                        <div className="col-lg-12 md-12">
                                            <label>Bike Make
                                            </label>
                                            <input type="text"
                                                value={MMVList.length ? MMVList[0].make : 'NA'}
                                                readonly="readonly"
                                                className="text-left form-control"
                                                autoComplete="Attribute"
                                            />
                                        </div>
                                        <div className="col-lg-12 md-12 mt-2">
                                            <label>Bike Variant
                                            </label>
                                            <input type="text"
                                                value={MMVList.length ? MMVList[0].varient : 'NA'}
                                                readonly="readonly"
                                                className="text-left form-control"
                                                autoComplete="Attribute"
                                            />
                                        </div>
                                    </div>

                                    <div className='col-6'>
                                        <div className="col-lg-12 md-12">
                                            <label>Bike Model</label>
                                            <input type="text"
                                                value={MMVList.length ? MMVList[0].model : 'NA'}
                                                readonly="readonly"
                                                className="text-left form-control"
                                                autoComplete="Attribute"
                                            />
                                        </div>
                                        <div className="col-lg-12 md-12 mt-2">
                                            <label>Display Price</label>
                                            <input type="text"
                                                value={MMVList.length ? MMVList[0].publishedPrice : 'NA'}
                                                readonly="readonly"
                                                className="text-left form-control"
                                                autoComplete="Attribute"
                                            />
                                        </div>
                                    </div>
                                </div>
                            } */}
                            </div>
                        </DialogContent>
                        <DialogActions style={{ marginTop: '15px', marginLeft: '30px', marginBottom: '20px' }}>
                            <button type="button" className="icon-btn gray" onClick={onClose}>Cancel</button>
                            <button className="icon-btn" >Submit</button>
                        </DialogActions >
                    </form>
                </Dialog>
            </>
        )
    }
}

CreateLead = connect()(CreateLead)

export default reduxForm({
    form: 'Lead-Form',
    validate
})(CreateLead)
