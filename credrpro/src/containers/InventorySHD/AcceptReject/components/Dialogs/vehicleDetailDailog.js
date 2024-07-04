import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { getKmsDrivenComma, getAmount, getRange, getYear } from '../../../../../core/utility'
import Divider from '@material-ui/core/Divider'
import './dialog.scss'
import edit from '../../../../../shared/img/icons/editwhite.svg'
import SelectField from '../../../../../shared/components/redux-form/SelectFieldOutline'
import Select from '@material-ui/core/Select';
import TextField from '../../../../../shared/components/redux-form/TextFieldOutline'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import MenuItem from '@material-ui/core/MenuItem'
import { connect } from 'react-redux'
import { getMakes, getModels, getVariant, updateVehicleDetails } from '../../../../../core/services/inventoryServices'
import { useDispatch } from 'react-redux'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../../../redux/actions/loaderAction'
import { change,reset } from "redux-form";

const validate = values => {
    const errors = {}
    if (!values.reason) {
        errors.reason = '* Please Select Reason'
    }
    if (!values.cc) {
        errors.cc = '* Please Enter CC'
    }
    if (!values.kmsDriven) {
        errors.kmsDriven = '* Please Enter KmsDriven'
    }
    if (!values.bikeMake) {
        errors.bikeMake = '* Please Select Make'
    }
    if (!values.bikeModel) {
        errors.bikeModel = '* Please Select Model'
    }
    if (!values.bikeVariant) {
        errors.bikeVariant = '* Please Select Variant'
    }
    if (!values.year) {
        errors.year = '* Please Select Year'
    }
    if (!values.ownerType) {
        errors.ownerType = '* Please Select OwnerType'
    }
    return errors
}

const OwnerTypeList = [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: 'NA', label: 'NA' }]

const getYears = () => {
    const date = new Date()
    const currentYear = date.getFullYear()
    return getRange(currentYear - 20, currentYear).reverse()
}

let VehicleDetailDialog = ({ data, onClose, showVehicleInfo, handleSubmit, initialize, editDirect }, props) => {
    const dispatch = useDispatch()
    const [disableReason, setDisableReason] = useState(true)
    const [years, setYears] = useState([])
    const [year, setYear] = useState('')
    const [allmakes, setAllMakes] = useState([])
    const [allModels, setAllModels] = useState([])
    const [allVariant, setAllVariant] = useState([])
    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [variant, setVariant] = useState('')
    const [ownerType, setOwnerType] = useState('')
    const [kmDriven, setKMdriven] = useState('')
    const [CC, setCC] = useState('')
    const [makeData, setMakeData] = useState('')
    const [modelData, setModelData] = useState('')

    useEffect(() => {
        const { cc, bikeMake, bikeModel, bikeVariant, kmsDriven, manufactureDate, noOfOwners, bikeMakeId, bikeModelId, bikeVariantId } = data
        const payload = data.cityId
        const today = new Date()
        const lastYears = getRange(today.getFullYear() - 10, today.getFullYear())
        setYears(lastYears.map(yrs => ({ label: yrs, value: yrs })).reverse())

        getMakes(payload)
            .then(apiRes => {
                if (apiRes.isValid) {
                    setAllMakes(apiRes.sellOnlyResponse)
                }
            })
        getModels(bikeMake, data.cityId)
            .then(apiRes => {
                if (apiRes.isValid) {
                    setAllModels(apiRes.modelList)
                }
            })
        getVariant(bikeModel)
            .then(apiRes => {
                if (apiRes.isValid) {
                    setAllVariant(apiRes.modelList)
                }
            })

        if (editDirect) {
            setDisableReason(false)
        }
        let formData = {}
        if (data) {
            if (data.cc || data.cc === 0) {
                formData.cc = cc
            }
            if (data.kmsDriven) {
                formData.kmsDriven = getKmsDrivenComma(kmsDriven)
            }
            if (data.bikeMake) {
                formData.bikeMake = bikeMakeId
            }
            if (data.bikeModel) {
                formData.bikeModel = bikeModelId
            }
            if (data.bikeVariant) {
                formData.bikeVariant = bikeVariantId
            }
            if (data.noOfOwners) {
                formData.noOfOwners = noOfOwners
            }
            if (data.manufactureDate) {
                formData.manufactureDate = getYear(manufactureDate)
            }
        }
        initialize(formData)
    }, [])

    const handleEdit = () => {
        setDisableReason(false)
    }

    const handleMakeChange = (make) => {
        setMake(make)
        
        // setModel('')
        // setVariant('')
    }

    const handleModelChange = (model) => {
        setModel(model)

    }

    const handleVariantChange = (variant) => {
        setVariant(variant)
    }

    const handleYearChange = (year) => {
        setYear(year)
    }

    const handleOwnerChange = (owner) => {
        setOwnerType(owner)
    }

    const handleCC = (e) => {
        const ccVal = e.target.value
        setCC(ccVal)
    }

    const handleKMDriven = (e) => {
        const kmDrivenVal = e.target.value
        setKMdriven(kmDrivenVal)
    }

    const onlyNumbers = (value) => {
        if (!value) {
            return value
        }
        let onlyNumberValue = value.replace(/[^\d]/g, '')
        onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
        return onlyNumberValue.slice(0, 7)
    }

    const handleUpdateVehicleDetail = () => {
        const { cc, kmsDriven, manufactureDate, noOfOwners, id, bikeMakeId, bikeModelId, bikeVariantId } = data
        const payload = {
            bmId: make ? make :bikeMakeId ,
            bmodelId: model ?model:bikeModelId,
            bvId: variant ?variant:bikeVariantId,
            cc: CC ? CC :cc,
            ibdId: id,
            kmsDriven: kmDriven ? kmDriven : kmsDriven,
            ownerType: ownerType ? ownerType : noOfOwners,
            year: year ?year :getYear(manufactureDate)
        }
        // if (payload.bmId && payload.bmodelId && payload.bvId && payload.cc && payload.ibdId && payload.kmsDriven && payload.ownerType && payload.year) {
            dispatch(showLoader())
            updateVehicleDetails(payload)
                .then(apiRes => {
                    if (apiRes.valid || apiRes.isValid) {
                        onClose()
                        dispatch(setNotification('success', 'SUCCESS', 'Updated'))
                    }
                    else {
                        dispatch(setNotification(
                            'danger',
                            'Error',
                            apiRes.message
                        ))
                    }
                    dispatch(hideLoader())
                })
        // }
    }

    const handleClickMake = (e) => {
        const makeValue = e.target.innerText
        setMakeData(makeValue)
        getModels(makeValue, data.cityId)
            .then(apiRes => {
                if (apiRes.isValid) {
                    dispatch(change('inventory-shd-vehicle','bikeModel',null))
                    dispatch(change('inventory-shd-vehicle','bikeVariant',null))

                    setAllModels(apiRes.modelList)
                    setAllVariant([])
                }
            })
    }

    const handleClickModel = (e) => {
        const modelValue = e.target.innerText
        setModelData(modelValue)
        getVariant(modelValue)
            .then(apiRes => {
                if (apiRes.isValid) {
                    setVariant('')
                    dispatch(change('inventory-shd-vehicle','bikeVariant',null))
                    setAllVariant(apiRes.modelList)
                }
            })
    }

    return (
        <Dialog
            open={showVehicleInfo}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            className='wrap'
        >
           
            <DialogTitle>
                Vehicle Info
                {
                    editDirect ? <></> :
                        (
                            disableReason === true &&
                            <button className='btn-edit' onClick={() => handleEdit()}> <img src={edit} style={{ width: '15px', marginRight: '5px' }} /> Enable Editing</button>
                        )
                }
                <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
            </DialogTitle>
            <Divider />
            <form  onSubmit={handleSubmit(handleUpdateVehicleDetail)}>
                <DialogContent>
                    <DialogContentText style={{ fontSize: "14px", color: '#333333' }}>
                        <div className="row">
                            <div className="col-4">
                                <p style={{ fontFamily: 'ProximaNovaSemibold' }}>Vehicle Number</p>
                            </div>
                            <div className="col-8">
                                <p style={{ fontFamily: 'ProximaNovaRegular' }}> {data.registrationNumber && data.registrationNumber} </p>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold' }}>Brand</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <Field
                                        name="bikeMake"
                                        component={SelectField}
                                        disabled={disableReason}
                                        onChange={handleMakeChange}
                                    >
                                        {
                                            allmakes && Boolean(allmakes.length) && allmakes.map(makes => 
                                                <MenuItem key={makes.makeId} value={makes.makeId} onClick={(event) => handleClickMake(event)}> {makes.make} </MenuItem>
                                            )
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '15px' }}>Model</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <Field
                                        name="bikeModel"
                                        component={SelectField}
                                        disabled={disableReason}
                                        onChange={handleModelChange}
                                    >
                                        {
                                            allModels && Boolean(allModels.length) && allModels.map(model => 
                                            <MenuItem key={model.modelId} value={model.modelId} onClick={(event) => handleClickModel(event)}> {model.model} </MenuItem>)
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '15px' }}>Variant</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <Field
                                        name="bikeVariant"
                                        component={SelectField}
                                        disabled={disableReason}
                                        onChange={handleVariantChange}
                                    >
                                        {
                                            allVariant && Boolean(allVariant.length) && allVariant.map(variant => <MenuItem key={variant.variantId} value={variant.variantId} > {variant.variant} </MenuItem>)
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '15px' }}>Year</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <Field
                                        name="manufactureDate"
                                        component={SelectField}
                                        disabled={disableReason}
                                        onChange={handleYearChange}
                                    >
                                        {
                                            getYears().map(year => <MenuItem value={year} key={year}>{year}</MenuItem>)
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '15px' }}>Owner Type</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <Field
                                        name="noOfOwners"
                                        component={SelectField}
                                        disabled={disableReason}
                                        onChange={handleOwnerChange}
                                    >
                                        {
                                            OwnerTypeList && Boolean(OwnerTypeList.length) && OwnerTypeList.map(owner => <MenuItem key={owner.value} value={owner.value}> {owner.label} </MenuItem>)
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '15px' }}>KM’s Driven</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <Field
                                        type='text'
                                        name="kmsDriven"
                                        component={TextField}
                                        variant="outlined"
                                        id="outlined-required"
                                        disabled={disableReason}
                                        onChange={handleKMDriven}
                                        normalize={onlyNumbers}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '15px' }}>CC</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <Field
                                        type='text'
                                        name="cc"
                                        component={TextField}
                                        variant="outlined"
                                        id="outlined-required"
                                        disabled={disableReason}
                                        normalize={onlyNumbers}
                                        onChange={handleCC}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '15px' }}>Expected Price</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <p> {data.price ? getAmount(data.price) : 'NA'} </p>
                                </div>
                            </div>
                            <div className="col-4">
                                <div style={{ marginTop: '20px' }}>
                                    <p className='align-self-center' style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '15px' }}>Display Price</p>
                                </div>
                            </div>
                            <div className="col-8">
                                <div style={{ width: '100%', maxWidth: '254px', marginTop: '15px' }}>
                                    <p> {data.price ? getAmount(data.displayPrice) : 'NA'} </p>
                                </div>
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
            
            <DialogActions>
                {
                    disableReason ?
                        <button className="icon-btn" disabled style={{ backgroundColor: 'rgba(171, 171, 171, 0.3)', color: 'rgba(51, 51, 51, 0.42)', padding: '5px 30px' }}>Save</button>
                        :
                        <button className="icon-btn" style={{ backgroundColor: '#4DBD74', padding: '5px 30px' }} >Save</button>
                }
            </DialogActions>
</form>
        </Dialog>
    )
}

VehicleDetailDialog = reduxForm({
    form: 'inventory-shd-vehicle',
    validate
})(VehicleDetailDialog)

const selector = formValueSelector('inventory-shd-vehicle')

const mapStateToprops = state => {
    return {
        reasonField: selector(state, 'reason')
    }
}

export default connect(mapStateToprops)(VehicleDetailDialog)