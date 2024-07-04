import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardBody, Label, Input } from 'reactstrap'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '../../../shared/components/redux-form/TextField'
import edit from '../../../shared/img/icons/edit-icon.svg'
import SelectField from '../../../shared/components/redux-form/SelectField'
import './gstPage.scss'
import { reduxForm, Field } from 'redux-form'
import { getEntites, getHsnList, generateOtp } from '../../../core/services/franchiseServices'
import { userTypeDetails } from '../../../core/services/authenticationServices';
import BusinessEntityPopUp from '../components/BusinessEntityPopUp'
import OTPPopUp from './OtpPopUp'
import validate from './validate'
import { getStates, getCities, addRecipient, getWarranty, getServicePlans } from '../../../core/services/franchiseServices'
import { getUserID } from '../../../core/services/rbacServices'
import DatePicker from 'react-datepicker';
import moment from 'moment'
import WarningIcon from '@material-ui/icons/Warning'
import { getAmount } from '../../../core/utility'
import { CalenderIcon } from '../../../core/utility/iconHelper';
import { FormHelperText } from '@material-ui/core'
import { getRefrrelSource } from '../../../core/services/franchiseServices'
const Checkbox = ({ input, meta: { touched, error } }) => (
    <div style={{ border: touched && error ? "1px solid red" : "none" }}>
        <input type="checkbox" style={{ marginLeft: '-10px' }} {...input} />
        <label style={{ fontWeight: 'bold', marginLeft: '3px' }}>I have a GST number <span style={{ fontWeight: 'lighter' }}> (Optional) </span></label>
    </div>
)

const CalenderInput = React.forwardRef((props, ref) => (
    <div
        className="date-picker-input-container"
        ref={ref}
        onClick={props.onClick}
    >
        <input
            type="text"
            className="date-picker-input"
            placeholder={props.label || 'Select Date'}
            value={props.value}
            readOnly
        />
        <img src={CalenderIcon} className="calender-icon" alt="calender-icon" />
    </div>
));

class GSTPage extends Component {

    state = {
        storeId: userTypeDetails().userType.storeId,
        checkTo: false,
        billerList: [],
        hsnList: [],
        stateList: [],
        cityList: [],
        open: false,
        otpPayload: {},
        formInfo: {},
        valueSelected: false,
        showHsn: false,
        amount: 0,
        saleLead: false,
        showPtandHsnInfo: false,
        ptAmount: 0,
        hsnValue: 0,
        docChargesTo: {},
        disableValue: true,
        warrantyDetails: [],
        warrantyCode: '',
        startTime: new Date(),
        servicePlans: [],
        planValue: '',
        serviceHsn: {},
        servicePlanName: '',
        planName: '',
        planAmount: '',
        showServiceHsnCode: false,
        showPtHsnCode: false,
        showhsnCode: false,
        newServicePlans: [],
        refrrelList: [],
        refType:''
    }

    componentDidMount() {
        const { storeId } = this.state
        const { state } = this.props.location
        const { initialize } = this.props
        let formData = {}

        if (state.fromSales) {
            if (state.rowDataa.customerName) {
                formData.name = state.rowDataa.customerName
            }
            if (state.rowDataa.customerMobileName) {
                formData.mobileNo = state.rowDataa.customerMobileName
            }
        }
        else {
            if (state.rowDataa.name) {
                formData.name = state.rowDataa.name
            }
            if (state.rowDataa.number) {
                formData.mobileNo = state.rowDataa.number
            }
        }
        initialize(formData)
        getEntites(storeId)
            .then(entityResponse => {
                if (entityResponse.isValid) {
                    if (entityResponse.listBusinessEntity.length) {
                        this.setState({ billerList: entityResponse.listBusinessEntity })
                        let billerListInfo = entityResponse.listBusinessEntity.map(list => {
                            return {
                                billerName: list.store_Name,
                                billerId: list.billerId,
                                gstType: list.gst_Regis_type,
                                gstNumber: list.gst_Regis_No,
                            }
                        })
                        this.setState({ billerList: billerListInfo })
                    }
                }
                else {
                    this.setState({ checkTo: true })
                }
            })

        getStates()
            .then(stateResponse => {
                if (stateResponse.isValid) {
                    let states = stateResponse.stateIdName.map(state => {
                        return {
                            stateName: state.stateName,
                            stateId: state.stateId
                        }
                    })
                    this.setState({ stateList: states })
                }
            })

        getWarranty().
            then(warrantyResponse => {
                if (warrantyResponse.isValid) {
                    let warrantyList = warrantyResponse.warrantyDetails.map(war => {
                        return {
                            warrCode: war.warrCode,
                            warrDesc: war.warrDesc
                        }
                    })
                    this.setState({ warrantyDetails: warrantyList })
                }
            })
        getServicePlans().
            then(servicePlansResponse => {
                if (servicePlansResponse.isValid) {
                    let servicePlns = servicePlansResponse.serviceList.map(plan => {
                        return {
                            planId: plan.plandId,
                            planName: plan.planName,
                            planDesc: plan.planDesc,
                            amount: plan.amount
                        }
                    })
                    let noPlans = { planId: 0, planName: 'Not Intersted', planDesc: '', amount: 0 }
                    servicePlns.push(noPlans)
                    this.setState({ servicePlans: servicePlns })
                }
            })
        getRefrrelSource()
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    let list = apiResponse.listOfReferralSource.map((item) => {
                        return {
                            value: item.rsId,
                            label: item.rsType
                        }
                    })
                    this.setState({ refrrelList: apiResponse.listOfReferralSource })
                }
            })
    }

    onlyNumber = (value) => {
        if (!value) {
            return value
        }
        let onlyNumberValue = value.replace(/[^\d]/g, '')
        onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
        return onlyNumberValue.startsWith('0') ? '' : onlyNumberValue.slice(0, 10)
    }

    onlySixDigitNumber = (value) => {
        if (!value) {
            return value
        }
        let onlyNumberValue = value.replace(/[^\d]/g, '')
        onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
        return onlyNumberValue.startsWith('0') ? '' : onlyNumberValue.slice(0, 6)
    }

    closePopUp = () => {
        this.setState({ checkTo: false })
    }

    goToBusinessEntity = () => {
        const { history } = this.props
        history.push('/viewEntity')
    }

    getAllHnsList = (billerInfo) => {
        this.setState({ hsnValue: '' })
        if (billerInfo.gstType === "UNREGISTERED") {
            this.setState({ showHsn: false, showPtandHsnInfo: false })
            this.props.change("paper", "")
            this.props.change('hsn', '')
            this.props.change('serviceHsn', '')
            this.props.change('servicePlan', '')
        }
        else {
            this.setState({ showHsn: true, showPtandHsnInfo: false })
            this.props.change("paper", "")
            this.props.change('hsn', '')
            this.props.change('serviceHsn', '')
            this.props.change('servicePlan', '')
        }
        this.setState({ valueSelected: true })
        getHsnList(billerInfo.billerId).
            then(hsnResponse => {
                if (hsnResponse.isValid) {
                    let hsnListInfo = hsnResponse.hsnList.map(list => {
                        return {
                            hsnDescp: list.hsnDescp,
                            hsnId: list.hsnId,
                            hsnCode: list.hsnCode
                        }
                    })
                    this.setState({ hsnList: hsnListInfo })
                }
            })
    }

    getAllCities = (id) => {
        getCities(id)
            .then(cityResponse => {
                if (cityResponse.isValid) {
                    let cities = cityResponse.cityIdName.map(city => {
                        return {
                            cityId: city.cityId,
                            cityName: city.cityName
                        }
                    })
                    this.setState({ cityList: cities })
                }
            })
    }

    handleForm = (formData) => {
        const { startTime,refType } = this.state
        let docCharges = {}
        if (formData.hsn || formData.paper) {
            if (formData.hsn && formData.paper) {
                docCharges = {
                    docTransferAmt: formData.paper,
                    docTransferHsnId: formData.hsn.hsnId
                }
            }
            else if (formData.hsn) {
                docCharges = {
                    docTransferAmt: formData.paper,
                    docTransferHsnId: formData.hsn.hsnId
                }
            }
            else if (formData.paper) {
                docCharges = {
                    docTransferAmt: formData.paper
                }
            }
        }

        this.setState({ docChargesTo: docCharges })
        const { state } = this.props.location
        const { disableValue, planValue } = this.state
        let newFormData = {}
        newFormData = {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            cityId: formData.cityName,
            gstinCode: formData.gstNo,
            hsnDetails: formData.hsnDetails,
            mobileNo: formData.mobileNo,
            name: formData.name,
            pincode: formData.pincode,
            stateId: formData.stateId,
            leadId: state.rowDataa.leadId,
            billerId: formData.gstinCode.billerId,
            docTransferAmt: formData.paper,
            referralId:refType,
            docTransferHsnId: formData.hsn && formData.hsn.hsnId,
            createdDate: moment(startTime).format('YYYY-MM-DD HH:mm:ss')
        }
        this.setState({ formInfo: newFormData })
        addRecipient(newFormData)
            .then(recipientResponse => {
                if (recipientResponse.isValid) {
                    let payload = {}
                    if (state.fromSales) {
                        payload = {
                            name: formData.name,
                            cutomerMobileNumber: state.rowDataa.customerMobileName,
                            createdBy: getUserID(),
                            regNum: state.rowDataa.regnum,
                            make: state.rowDataa.make,
                            model: state.rowDataa.model,
                            variant: state.rowDataa.varient,
                            leadId: state.rowDataa.leadId,
                            amountPaid: state.finalAmount
                        }
                    }
                    else {
                        payload = {
                            name: formData.name,
                            cutomerMobileNumber: state.rowDataa.number,
                            createdBy: getUserID(),
                            regNum: state.rowDataa.regnum,
                            make: state.rowDataa.make,
                            model: state.rowDataa.model,
                            variant: state.rowDataa.variant,
                            leadId: state.rowDataa.leadId,
                            amountPaid: state.finalAmount
                        }
                    }
                    generateOtp(payload).
                        then(otpResponse => {
                            if (otpResponse.isValid) {
                                this.setState({ open: true, otpPayload: state.rowDataa, showWrongOtp: false, amount: state.finalAmount, saleLead: state.fromSales ? true : false, serviceHsn: formData.serviceHsn, servicePlan: planValue })
                            }
                            else {
                                this.setState({ showWrongOtp: true })
                            }
                        })
                }
            })
    }

    closOtpPopUp = () => {
        this.setState({ open: false })
    }

    open = () => {
        this.setState({ valueSelected: false })
    }

    close = () => {
        this.setState({ valueSelected: true })
    }

    showPtandHsn = () => {
        if (this.state.ptAmount)
            this.setState({ showPtandHsnInfo: true })
    }

    savePtAmount = (event) => {
        const regex = /^[0-9\b]+$/;
        const value = event.target.value;
        if (value === '' || regex.test(value)) {
            this.setState({ ptAmount: event.target.value })
        }
    }

    selectedHsn = hsn => {
        this.setState({ hsnValue: hsn.hsnCode })
    }

    showPrevPtandHsn = () => {
        this.setState({ showPtandHsnInfo: false })
    }

    enableBuyerGst = () => {
        const { disableValue } = this.state
        if (disableValue) {
            this.props.change("gstNo", "")
            this.setState({ disableValue: false })
        }
        else {
            this.props.change("gstNo", "")
            this.setState({ disableValue: true })
        }
    }

    onWarrantyChange = (warrCode) => {
        this.setState({ warrantyCode: warrCode })
    }

    onServicePlanChange = (plan) => {
        this.setState({ planValue: plan.planId, planName: plan.planName, planAmount: plan.amount })
    }

    handleFromDateChange = (fromDate) => {
        this.setState({ startTime: fromDate })
    }

    getTotal = () => {
        const { ptAmount, planAmount } = this.state
        const { state } = this.props.location
        let totalAmount = Number(ptAmount)
        totalAmount = Number(totalAmount) + Number(planAmount)
        totalAmount = totalAmount + Number(state.finalAmount)
        if (totalAmount)
            return totalAmount
        else return '-'
    }
    setRefSrc=(val)=>{
this.setState({refType:val.rsId})
    }
    render() {
        const { checkTo, billerList, refrrelList, hsnList, stateList, cityList, open, otpPayload, formInfo, valueSelected, showHsn, amount, saleLead, showPtandHsnInfo, ptAmount, hsnValue, docChargesTo, disableValue, warrantyDetails, warrantyCode, startTime, servicePlans, planValue, planName, planAmount, serviceHsn, showServiceHsnCode, showPtHsnCode, showhsnCode, newServicePlans } = this.state
        const { handleSubmit } = this.props
        const { state } = this.props.location
        return (
            <>
                <div className='row' style={{ marginTop: '30px' }}>
                    <div className='col-5'>
                        <Card >
                            <CardBody style={{ backgroundColor: "#FAFAFA" }}>
                                <form name="recipient-form" onSubmit={handleSubmit(this.handleForm)}>
                                    <div className="row">
                                        <div className="col-8  mb-3 legal" >
                                            <label style={{ fontWeight: 'bolder', marginBottom: '25px' }}>Referral Source</label>
                                            <Field
                                                className="materialUiWrap"
                                                component={SelectField}
                                                name="refType"
                                                label="Select Referral Source"
                                                variant="outlined"
                                                onChange={this.setRefSrc}
                                                // onOpen={this.open}
                                                // onClose={this.close}
                                            >
                                                {

                                                    Boolean(refrrelList && refrrelList.length) &&
                                                    refrrelList.map(ref => <MenuItem className='hoverStyle' value={ref} key={ref.rsId}> {ref.rsType} </MenuItem>)
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-8  mb-3 legal" >
                                            <label style={{ fontWeight: 'bolder', marginBottom: '25px' }}>Business Entity Details</label>
                                            <Field
                                                className="materialUiWrap"
                                                component={SelectField}
                                                name="gstinCode"
                                                label="Business Legal Name"
                                                variant="outlined"
                                                onChange={this.getAllHnsList}
                                                onOpen={this.open}
                                                onClose={this.close}
                                            >
                                                {
                                                    !valueSelected ?
                                                        Boolean(billerList && billerList.length) &&
                                                        billerList.map(biller => <MenuItem className='hoverStyle' value={biller} key={biller.billerId}> {`${biller.billerName} - ${biller.gstType}`} <br className='stylee' /> {`${biller.gstNumber}`} </MenuItem>)
                                                        :
                                                        Boolean(billerList && billerList.length) &&
                                                        billerList.map(biller => <MenuItem className='hoverStyle' value={biller} key={biller.billerId}> {`${biller.billerName} - ${biller.gstType}`} </MenuItem>)
                                                }
                                            </Field>
                                        </div>
                                    </div>
                                    {
                                        showHsn &&
                                        <div className="row">
                                            <div className="col-sm-6 mb-3 legal" id='legal' style={{ width: '100%', maxWidth: '340px' }}>
                                                <label style={{ fontWeight: 'bolder' }}>HSN Details</label>
                                                <Field
                                                    className="materialUiWrap"
                                                    component={SelectField}
                                                    name="hsnDetails"
                                                    label="Bike HSN Details"
                                                    variant="outlined"
                                                    style={{ maxWidth: '189px' }}
                                                    onOpen={() => this.setState({ showhsnCode: false })}
                                                    onClose={() => this.setState({ showhsnCode: true })}
                                                >
                                                    {
                                                        !showhsnCode ?
                                                            Boolean(hsnList && hsnList.length) &&
                                                            hsnList.map(hsn => <MenuItem value={hsn.hsnId} key={hsn.hsnId} >{hsn.hsnDescp} - <p style={{ fontWeight: 'bolder' }}>{hsn.hsnCode}</p></MenuItem>)
                                                            :
                                                            Boolean(hsnList && hsnList.length) &&
                                                            hsnList.map(hsn => <MenuItem value={hsn.hsnId} key={hsn.hsnId} ><p style={{ fontWeight: 'bolder' }}>{hsn.hsnCode}</p></MenuItem>)
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                    }
                                    <div className="row">
                                        <div className='col-sm-12 mb-2'>
                                            <label style={{ fontWeight: 'bolder' }}>Buyer Info</label>
                                        </div>
                                        <div className="col-sm-12 mb-1 ml-2 mt-2" style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field name="gstCheck" component={Checkbox} onChange={() => this.enableBuyerGst()} style={{ marginLeft: '-15px' }} />
                                        </div>
                                        <div className="col-sm-6 mb-3" style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field
                                                type='text'
                                                component={TextField}
                                                name="gstNo"
                                                label="Buyer GST No"
                                                variant="outlined"
                                                autoComplete='off'
                                                className="materialUiWrapText"
                                                disabled={disableValue}
                                            >
                                            </Field>
                                        </div>
                                        <div className="col-sm-6 mb-3" style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field
                                                type='text'
                                                component={TextField}
                                                name="name"
                                                label="Buyer Name"
                                                variant="outlined"
                                                autoComplete='off'
                                                className="materialUiWrapText"
                                            >
                                            </Field>
                                        </div>
                                        <div className="col-sm-6 mb-3" style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field
                                                type='text'
                                                component={TextField}
                                                name="mobileNo"
                                                label="Buyer Mobile Number"
                                                variant="outlined"
                                                normalize={this.onlyNumber}
                                                autoComplete='off'
                                                className="materialUiWrapText"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-sm-6 mb-3" style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field
                                                type='text'
                                                component={TextField}
                                                name="addressLine1"
                                                label="Address Line 1"
                                                variant="outlined"
                                                autoComplete='off'
                                                className="materialUiWrapText"
                                            />
                                        </div>
                                        <div className="col-sm-6 mb-3" style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field
                                                type='text'
                                                component={TextField}
                                                name="addressLine2"
                                                label="Address Line 2"
                                                variant="outlined"
                                                autoComplete='off'
                                                className="materialUiWrapText"
                                            />
                                        </div>
                                        <div className="col-sm-6 mb-3 legal" id='legal' style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field
                                                type='text'
                                                component={SelectField}
                                                name="stateId"
                                                label="Select State"
                                                variant="outlined"
                                                onChange={this.getAllCities}
                                                className="materialUiWrap"
                                            >
                                                {
                                                    Boolean(stateList && stateList.length) &&
                                                    stateList.map(state => <MenuItem value={state.stateId} key={state.stateId}>{state.stateName}</MenuItem>)
                                                }
                                            </Field>
                                        </div>
                                        <div className="col-sm-6 mb-3 legal" id='legal' style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field
                                                component={SelectField}
                                                name="cityName"
                                                label="Select City"
                                                variant="outlined"
                                                className="materialUiWrap"
                                            >
                                                {
                                                    Boolean(cityList && cityList.length) &&
                                                    cityList.map(city => <MenuItem value={city.cityId} key={city.cityId}>{city.cityName}</MenuItem>)
                                                }
                                            </Field>
                                        </div>
                                        <div className="col-sm-6 mb-3 legal" id='legal' style={{ width: '100%', maxWidth: '340px' }}>
                                            <Field
                                                component={TextField}
                                                name="pincode"
                                                label="Enter Zipcode"
                                                variant="outlined"
                                                normalize={this.onlySixDigitNumber}
                                                className="materialUiWrapText"
                                                autoComplete='off'
                                            />
                                        </div>
                                    </div>
                                    <button className="addbtn" color="success" style={{ float: 'right' }}>
                                        <span>{`Generate\u00a0Inovice`}</span>
                                    </button>
                                </form>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='col-7' >
                        <div className='row'>
                            <div className='col-12 pl-0'>
                                <Card >
                                    <CardBody style={{ backgroundColor: "#FAFAFA" }}>
                                        <div className='row'>
                                            <div className='col-5'>
                                                <p style={{ fontWeight: 'bolder', marginBottom: '10px' }}>Bike Details</p>
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <p style={{ fontWeight: 'bolder' }}>Sale Date</p>
                                                        <DatePicker
                                                            selected={startTime}
                                                            onChange={this.handleFromDateChange}
                                                            dateFormat="dd-MMMM-yyyy"
                                                            dropDownMode="select"
                                                            maxDate={new Date()}
                                                            customInput={<CalenderInput label={'Select Date'} />}
                                                        />
                                                    </div>
                                                    <div className='col-12 mt-3'>
                                                        <p>Bike Name</p>
                                                        {
                                                            state.fromSales ?
                                                                <p   ><b> {`${state.rowDataa.mmv}`} </b></p>
                                                                :
                                                                <p className='mt-0'><b> {`${state.rowDataa.make}`} - {`${state.rowDataa.model}`} - {`${state.rowDataa.variant}`}</b> </p>
                                                        }
                                                    </div>
                                                    <div className='col-12 mt-3'>
                                                        <p>Bike Registration Numer</p>
                                                        {
                                                            state.fromSales ?
                                                                <p className='mt-0'> <b>{`${state.rowDataa.registrationNumber}`}</b> </p> :
                                                                <p className='mt-0'> <b>{`${state.rowDataa.regnum}`}</b> </p>
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-7'>
                                                <div className='pricebrkupWrap'>
                                                    <p style={{ fontFamily: 'ProximaNovaSemibold', marginBottom: '8px' }}>Price Break-up</p>
                                                    <div className='row'>
                                                        <div className='col-sm-7'>
                                                            <p style={{ fontSize: '12px', marginBottom: '5px' }}>Bike Price</p>
                                                        </div>
                                                        <div className='col-sm-5'>
                                                            <p style={{ fontSize: '12px', marginBottom: '5px' }}>{`${getAmount(state.finalAmount)}`}</p>
                                                        </div>
                                                        <div className='col-sm-7'>
                                                            <p style={{ fontSize: '12px', marginBottom: '5px' }}>{planName && planName !== 'Not Intersted' ? planName : 'Service Plan'}</p>
                                                        </div>
                                                        <div className='col-sm-5'>
                                                            <p style={{ fontSize: '12px', marginBottom: '5px' }}>{planAmount ? getAmount(planAmount) : 'NA'}</p>
                                                        </div>
                                                        <div className='col-sm-7'>
                                                            <p style={{ fontSize: '12px', marginBottom: '5px' }}>Paper Transfer Charges</p>
                                                        </div>
                                                        <div className='col-sm-5'>
                                                            <p style={{ fontSize: '12px', marginBottom: '5px' }}>{ptAmount ? getAmount(ptAmount) : '-'}</p>
                                                        </div>
                                                        <div className='col-sm-12'><hr style={{ marginBottom: '7px', marginTop: '7px', border: '1px solid #333' }} /></div>
                                                        <div className='col-sm-7'>
                                                            <p style={{ fontFamily: 'ProximaNovaSemibold', marginBottom: '8px' }}>Total</p>
                                                        </div>
                                                        <div className='col-sm-5'>
                                                            <p style={{ fontFamily: 'ProximaNovaSemibold', marginBottom: '8px' }}>{getAmount(this.getTotal())}</p>
                                                        </div>
                                                    </div>
                                                    <div className='warning'><WarningIcon style={{ fontSize: 13 }} /> Prices displayed above are inclusive of Taxes <p style={{ color: 'black', marginLeft: '16px', }}>(if applicable).</p></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p></p>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className='col-12 pl-0'>
                                <Card>
                                    <CardBody style={{ backgroundColor: "#FAFAFA" }}>
                                        <p style={{ fontWeight: 'bolder', marginLeft: '2px', marginBottom: '15px' }}>Add-ons</p>
                                        {/* <div className="mb-3 addOns" id='legal' style={{width: '100%', maxWidth: '300px'}} >
                                        <Field
                                            component={SelectField}
                                            name="warrantyCard"
                                            label=" Select Warranty Plan"
                                            variant="outlined"
                                            className="materialUiWrap"
                                            onChange={this.onWarrantyChange}
                                        >
                                            {
                                                Boolean(warrantyDetails && warrantyDetails.length) &&
                                                warrantyDetails.map(war => <MenuItem value={war.warrCode} key={war.warrCode}>{war.warrDesc}</MenuItem>)
                                            }
                                        </Field>
                                        </div> */}
                                        <div className='row'>
                                            <div className="col-12 mb-3 addOns" id='legal'>
                                                <Field
                                                    component={SelectField}
                                                    name="warrantyCard"
                                                    label=" Select Warranty Plan"
                                                    variant="outlined"
                                                    className="materialUiWrap"
                                                    onChange={this.onWarrantyChange}
                                                    style={{
                                                        maxWidth: '300px',
                                                        width: '100%'
                                                    }}
                                                >
                                                    {
                                                        Boolean(warrantyDetails && warrantyDetails.length) &&
                                                        warrantyDetails.map(war => <MenuItem value={war.warrCode} key={war.warrCode}>{war.warrDesc}</MenuItem>)
                                                    }
                                                </Field>
                                            </div>
                                            <div className="col-6 mb-3 addOns" id='legal' style={{ width: '100%', maxWidth: '330px' }}>
                                                <Field
                                                    component={SelectField}
                                                    name="servicePlan"
                                                    label="Select Service Plan"
                                                    variant="outlined"
                                                    className="materialUiWrap"
                                                    onChange={this.onServicePlanChange}
                                                >
                                                    {
                                                        Boolean(servicePlans && servicePlans.length) &&
                                                        servicePlans.map(plan => <MenuItem value={plan} key={plan.planId}>{plan.planName} - {plan.amount}</MenuItem>)
                                                    }
                                                </Field>
                                            </div>
                                            {
                                                planName !== 'Not Intersted' &&
                                                    showHsn ?
                                                    <div className="col-6 mb-3 addOns" id='legal' style={{ width: '100%', maxWidth: '330px' }}>
                                                        <Field
                                                            className="materialUiWrap"
                                                            component={SelectField}
                                                            onChange={this.selectedHsn}
                                                            name="serviceHsn"
                                                            label="Service HSN"
                                                            variant="outlined"
                                                            style={{ maxWidth: '330px' }}
                                                            value={hsnValue}
                                                            onOpen={() => this.setState({ showServiceHsnCode: false })}
                                                            onClose={() => this.setState({ showServiceHsnCode: true })}
                                                        >
                                                            {
                                                                planName !== 'Not Interested' &&
                                                                    !showServiceHsnCode ?
                                                                    Boolean(hsnList && hsnList.length) &&
                                                                    hsnList.map(hsn => <MenuItem value={hsn} key={hsn.hsnId} > {hsn.hsnDescp} - <p style={{ fontWeight: 'bolder' }}>{hsn.hsnCode}</p></MenuItem>)
                                                                    :
                                                                    Boolean(hsnList && hsnList.length) &&
                                                                    hsnList.map(hsn => <MenuItem value={hsn} key={hsn.hsnId} > <p style={{ fontWeight: 'bolder' }}>{hsn.hsnCode}</p></MenuItem>)
                                                            }
                                                        </Field>
                                                    </div>
                                                    :
                                                    <div className="col-6 mb-3 addOns"></div>
                                            }
                                            {/* <div className='row'> */}
                                            <div className="col-6 mb-3 addOns" id='legal' style={{ width: '100%', maxWidth: '330px' }}>
                                                <Field
                                                    type='text'
                                                    component={TextField}
                                                    name="paper"
                                                    label="Paper transfer amount"
                                                    variant="outlined"
                                                    autoComplete='off'
                                                    className="materialUiWrapText"
                                                    normalize={this.onlyNumber}
                                                    onChange={this.savePtAmount}
                                                />
                                            </div>
                                            {
                                                showHsn ?
                                                    <div className="col-6 mb-3 addOns" id='legal' style={{ width: '100%', maxWidth: '330px' }}>
                                                        <Field
                                                            className="materialUiWrap"
                                                            component={SelectField}
                                                            onChange={this.selectedHsn}
                                                            name="hsn"
                                                            label="Paper Transfer HSN"
                                                            variant="outlined"
                                                            style={{ maxWidth: '330px' }}
                                                            onOpen={() => this.setState({ showPtHsnCode: false })}
                                                            onClose={() => this.setState({ showPtHsnCode: true })}
                                                        >
                                                            {
                                                                !showPtHsnCode ?
                                                                    Boolean(hsnList && hsnList.length) &&
                                                                    hsnList.map(hsn => <MenuItem value={hsn} key={hsn.hsnId} >{hsn.hsnDescp} - <p style={{ fontWeight: 'bolder' }}>{hsn.hsnCode}</p></MenuItem>)
                                                                    :
                                                                    Boolean(hsnList && hsnList.length) &&
                                                                    hsnList.map(hsn => <MenuItem value={hsn} key={hsn.hsnId} ><p style={{ fontWeight: 'bolder' }}>{hsn.hsnCode}</p></MenuItem>)
                                                            }
                                                        </Field>
                                                    </div>
                                                    :
                                                    <div className="col-6 mb-3 addOns"></div>
                                            }
                                            {/* </div> */}
                                            {/* </div> */}
                                            {/* </div> */}
                                            <FormHelperText style={{ color: 'red', marginLeft: '15px' }}> *Please Select HSN Codes Carefully</FormHelperText>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div >
                {
                    checkTo &&
                    <BusinessEntityPopUp
                        open={checkTo}
                        onClose={this.closePopUp}
                        onCreateBusinessEntity={this.goToBusinessEntity}
                    />
                }
                {
                    open &&
                    <OTPPopUp
                        open={open}
                        onClose={this.closOtpPopUp}
                        otpPayload={otpPayload}
                        formInfo={formInfo}
                        amount={amount}
                        saleLead={saleLead}
                        docChargesTo={docChargesTo}
                        rowInfo={this.props.location.state}
                        fromSales={this.props.location.state.fromSales}
                        warrantyCode={warrantyCode}
                        startTime={startTime}
                        serviceHsn={serviceHsn}
                        planValue={planAmount}
                    />
                }
            </>
        )
    }
}

const mapStateToProps = (state) => ({
})

GSTPage = connect(mapStateToProps)(GSTPage)

export default reduxForm({
    form: 'gst-form',
    validate
})(GSTPage)