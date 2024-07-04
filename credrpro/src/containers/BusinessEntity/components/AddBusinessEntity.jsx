import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardBody } from 'reactstrap'
import { reduxForm, Field } from 'redux-form'
import TextField from '../../../shared/components/redux-form/TextField'
import './businessEntity.scss'
import SelectField from '../../../shared/components/redux-form/SelectField'
import MenuItem from '@material-ui/core/MenuItem'
import { Button } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import { panNum, acctNum, IFSCNum, alphaNumeric, alpha, mobileNum, GSTval, minLength3, pinCode } from './FieldValidator'
import { getStates, getCities, addEntity, updateEntity } from '../../../core/services/franchiseServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import { getStoreId } from '../../../core/services/authenticationServices'
import { getUserName } from '../../../core/services/rbacServices'

const onlyAlphabets = (value) => {
    if (!value) {
        return value
    }
    let onlyNumberValue = value.replace(/[^A-Za-z ]/g, '')
    onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
    return onlyNumberValue
}

class BusinessEntity extends Component {

    state = {
        states: [],
        cities: [],
        enable: true,
        enableGst: false,
        defaultGst: '',
        gstValidation: false
    }

    componentDidMount() {
        const { initialize, location } = this.props
        if (location && location.state && location.state.initialState) {
            location.state.initialState.gst_Regis_No = location.state.initialState.gst_Regis_No == "000000000000000" ? "NA" : location.state.initialState.gst_Regis_No
            initialize(location.state.initialState)
            getCities(location.state.initialState.stateId)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ cities: apiResponse.cityIdName })
                    this.setState({ enable: false })
                }
            })
        }
        getStates()
            .then(apiResponse => {
                if (apiResponse.isValid)
                    this.setState({ states: apiResponse.stateIdName })
            })
    }

    handleForm = (formData) => {
        const { dispatch, location } = this.props
        if (location.state.action == "edit") {
            const payload = {
                biller_State_Name: formData.stateId.stateName,
                store_Id: getStoreId(),
                bank_branch: formData.bank_branch,
                bank_ifsc: formData.bank_ifsc,
                biller_Address: formData.biller_Address,
                biller_Address_line_2: formData.biller_Address_line_2,
                biller_Bank_Acc_No: formData.biller_Bank_Acc_No,
                biller_City_Name: formData.biller_City_Name,
                biller_Name: formData.biller_Name,
                biller_Pan_No: formData.biller_Pan_No,
                biller_bank_Name: formData.biller_bank_Name,
                biller_email: formData.biller_email,
                biller_mobile: formData.biller_mobile,
                biller_pincode: formData.biller_pincode,
                gst_Regis_No: formData.gst_Regis_No,
                gst_Regis_type: formData.gst_Regis_type,
                stateId: formData.stateId,
                store_Name: formData.store_Name,
                updatedBy: getUserName(),
                billerId: location.state.initialState.billerId
            }
            updateEntity(payload)
                .then(apiResponse => {
                    if (apiResponse.isValid) {
                        dispatch(setNotification('success', 'Success', ' Updated Successfully'))
                        this.props.history.push('/viewEntity')
                    }
                    else
                        dispatch(setNotification('danger', 'Error', apiResponse.message))
                })
        }
        else {
            const payload = {
                biller_State_Name: formData.stateId.stateName,
                store_Id: getStoreId(),
                bank_branch: formData.bank_branch,
                bank_ifsc: formData.bank_ifsc,
                biller_Address: formData.biller_Address,
                biller_Address_line_2: formData.biller_Address_line_2,
                biller_Bank_Acc_No: formData.biller_Bank_Acc_No,
                biller_City_Name: formData.biller_City_Name,
                biller_Name: formData.biller_Name,
                biller_Pan_No: formData.biller_Pan_No,
                biller_bank_Name: formData.biller_bank_Name,
                biller_email: formData.biller_email,
                biller_mobile: formData.biller_mobile,
                biller_pincode: formData.biller_pincode,
                gst_Regis_No: formData.gst_Regis_No == "NA" ? "000000000000000" : formData.gst_Regis_No,
                gst_Regis_type: formData.gst_Regis_type,
                stateId: formData.stateId,
                store_Name: formData.store_Name
            }
            addEntity(payload)
                .then(apiResponse => {
                    if (apiResponse.isValid) {
                        dispatch(setNotification('success', 'Success', 'Added Successfully'))
                        this.props.history.push('/viewEntity')
                    }
                    else
                        dispatch(setNotification('danger', 'Error', apiResponse.message))
                })
        }
    }

    handleGst = (e) => {
        if (e == "UNREGISTERED") {
            this.setState({ enableGst: true })
            this.props.change("gst_Regis_No", "NA")
        }
        else {
            this.setState({ enableGst: false })
            this.props.change("gst_Regis_No", "")
        }
    }

    handleEnable = () => {
        const { location } = this.props
        if (location.state.initialState.biller_State_Name) return false
        else return this.state.enable
    }

    handleCites = (state) => {
        getCities(state)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({ cities: apiResponse.cityIdName })
                    this.setState({ enable: false })
                }
            })
    }

    render() {
        const { handleSubmit } = this.props
        return (
            <div id='businessEntity'>
                <Card className="customcard" >
                    <CardBody>
                        <form name="entity-form" onSubmit={handleSubmit(this.handleForm)}>
                            <h4 className="mb-3">GST Info</h4>
                            <div className="field-container" >
                                <div className="form-field" id='businessEntity'>
                                    <div className="row ">
                                        <div className="col-sm-5 mb-3">
                                            <Field
                                                type='text'
                                                name="store_Name"
                                                label="Business Legal Name"
                                                component={TextField}
                                                variant="outlined"
                                                normalize={onlyAlphabets}
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-5 mb-3">
                                            <Field
                                                name="gst_Regis_type"
                                                label="Enter GST registration type "
                                                component={SelectField}
                                                variant="outlined"
                                                required
                                                onChange={this.handleGst}
                                            >
                                                <MenuItem value="GST">GST</MenuItem>
                                                <MenuItem value="COMPOSITION">COMPOSITION</MenuItem>
                                                <MenuItem value="UNREGISTERED">UNREGISTERED</MenuItem>
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <div className="row mb-3">
                                        <div className="col-sm-5 ">
                                            <Field
                                                name="gst_Regis_No"
                                                id="gst_Regis_No"
                                                type='text'
                                                label="GST number"
                                                component={TextField}
                                                variant="outlined"
                                                validate={GSTval}
                                                disabled={this.state.enableGst}
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-5">
                                            <Field
                                                type="text"
                                                name="biller_Pan_No"
                                                label="PAN number"
                                                component={TextField}
                                                variant="outlined"
                                                validate={panNum}
                                                required
                                            />
                                        </div>
                                    </div>

                                </div>
                                <h4 className="mb-3">Bank Details</h4>
                                <div className="form-field">
                                    <div className="row mb-3">
                                        <div className="col-sm-5 ">
                                            <Field
                                                name="biller_Bank_Acc_No"
                                                type='text'
                                                label="Account Number"
                                                component={TextField}
                                                variant="outlined"
                                                validate={acctNum}
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-5">
                                            <Field
                                                type='text'
                                                name="biller_Name"
                                                label="Account holder name"
                                                component={TextField}
                                                variant="outlined"
                                                validate={[alpha, minLength3]}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <div className="row mb-3">
                                        <div className="col-sm-5 ">
                                            <Field
                                                type='text'
                                                name="biller_bank_Name"
                                                label="Bank Name"
                                                component={TextField}
                                                variant="outlined"
                                                validate={[alpha, minLength3]}
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-5">
                                            <Field
                                                type='text'
                                                name="bank_branch"
                                                label="Branch name"
                                                component={TextField}
                                                variant="outlined"
                                                validate={[alpha, minLength3]}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <div className="row mb-3">
                                        <div className="col-sm-5 ">
                                            <Field
                                                type='text'
                                                name="bank_ifsc"
                                                label="IFSC code"
                                                component={TextField}
                                                variant="outlined"
                                                validate={IFSCNum}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h4 className="mb-3">Company Details</h4>
                                <div className="form-field">
                                    <div className="row mb-3">
                                        <div className="col-sm-5 ">
                                            <Field
                                                name="biller_mobile"
                                                type='number'
                                                label="Mobile number"
                                                component={TextField}
                                                variant="outlined"
                                                required
                                                validate={mobileNum}

                                            />
                                        </div>
                                        <div className="col-sm-5">
                                            <Field
                                                name="biller_email"
                                                type='email'
                                                label="Email Id"
                                                component={TextField}
                                                variant="outlined"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <div className="row mb-3">
                                        <div className="col-sm-5 ">
                                            <Field
                                                name="biller_Address"
                                                label="Address Line 1"
                                                component={TextField}
                                                variant="outlined"
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-5">
                                            <Field
                                                name="biller_Address_line_2"
                                                label="Address Line 2"
                                                component={TextField}
                                                variant="outlined"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <div className="row mb-3">
                                        <div className="col-sm-5 ">
                                            <Field
                                                name="stateId"
                                                label="Select State"
                                                component={SelectField}
                                                variant="outlined"
                                                required
                                                onChange={this.handleCites}
                                            >
                                                {
                                                    Boolean(this.state.states && this.state.states.length) &&
                                                    this.state.states.map(state => <MenuItem value={state.stateId} key={state.stateId}>{state.stateName}</MenuItem>)
                                                }
                                            </Field>
                                        </div>
                                        <div className="col-sm-5">
                                            <Field
                                                name="biller_City_Name"
                                                label='Select City'
                                                component={SelectField}
                                                variant="outlined"
                                                required
                                                disabled={this.state.enable}
                                            >
                                                {
                                                    Boolean(this.state.cities && this.state.cities.length) &&
                                                    this.state.cities.map(city => <MenuItem value={city.cityName} key={city.cityId}>{city.cityName}</MenuItem>)
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <div className="row mb-3">
                                        <div className="col-sm-5 ">
                                            <Field
                                                name="biller_pincode"
                                                label="Select Zipcode"
                                                component={TextField}
                                                variant="outlined"
                                                validate={pinCode}
                                                required
                                            >
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                this.props.location && this.props.location.state && this.props.location.state.action && this.props.location.state.action == "add" ? <Button className="customButton float-right" color="success" >Submit</Button> : <Button className="customButton float-right" color="success" >Update</Button>
                            }
                        </form>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
BusinessEntity = connect()(BusinessEntity);
export default reduxForm({
    form: 'business-entity',
    // validate,
    destroyOnUnmount: false
})(withRouter(BusinessEntity));