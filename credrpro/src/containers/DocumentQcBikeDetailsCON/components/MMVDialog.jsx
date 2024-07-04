import React, { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { getMakes, getModels, getVariant, getVariantById } from '../../../core/services/inventoryServices';
import { getCityID, getUserID } from '../../../core/services/rbacServices';
import { Button } from 'reactstrap';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';
import { updateMMVData } from '../../../core/services/documentQcServices';
import './style.scss'
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationAction';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function MMVDialog({ open, onClose, onUpdate, mmvdata, leadId, year, cityId }) {

    const [makes, setMakes] = useState([]);
    const [makeId, setMakeId] = useState('');
    const [modeld, setModeld] = useState('');
    const [varientId, setVarientId] = useState('');
    const [models, setModels] = useState([]);
    const [varients, setVarients] = useState([]);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [enableModel, setEnableModel] = useState(true);
    const [enableVariant, setEnableVariant] = useState(true);
    const [mfgYear, setMfgYear] = useState([])
    const [enableYear, setEnableYear] = useState(true);
    const dispatch = useDispatch();


    useEffect(() => {
        getMakes(getCityID())
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    let array = apiResponse.sellOnlyResponse.length && apiResponse.sellOnlyResponse.map((item) => {
                        return { label: item.make, value: item.makeId }
                    })
                    setMakes(array)
                }
            })
        setMakeId(mmvdata[0])
        setModeld(mmvdata[1])
        setVarientId(mmvdata[2])
        setMfgYear({ label: year, value: year })
    }, []);

    const setSelectedMake = (val) => {
        if (val) {
            setMakeId(val)
            getModels(val.label, getCityID())
                .then(apiResponse => {
                    if (apiResponse.isValid) {
                        let array = apiResponse.modelList.length && apiResponse.modelList.map((item) => {
                            return { label: item.model, value: item.modelId }
                        })
                        setEnableModel(false)
                        setModels(array)
                        setModeld('')
                        setVarientId('')
                    }
                })
        }
        else {
            setEnableModel(true)
            setMakeId('')
            setModeld('')
            setVarientId('')
        }

    }
    const setSelectedModel = (val) => {
        console.log(val.value, 'valvalval')
        if (val) {
            setModeld(val)
            getVariantById(val.value, getCityID())
                .then(apiResponse => {
                    if (apiResponse.isValid) {
                        let array = apiResponse.bikeVariantList.length && apiResponse.bikeVariantList.map((item) => {
                            return { label: item.bikeVariantName, value: item.bikeVariantId }
                        })
                        setEnableVariant(false)
                        setVarients(array)
                        setVarientId('')
                    }
                })
        }
        else {
            setEnableVariant(true)
            setModeld('')
            setVarientId('')
        }
    }
    const handleUpdate = () => {
        let mmv = ''
        if (!makeId) {
            setIsError(true)
            setErrorMsg("Select Make")
        }
        else if (!modeld) {
            setIsError(true)
            setErrorMsg("Select Model")
        }
        else if (!varientId) {
            setIsError(true)
            setErrorMsg("Select Varient")
        }
        else {
            setIsError(false)
            setErrorMsg("")
            mmv = makeId.label + " " + modeld.label + " " + varientId.label
            let payload = {}
            payload.makeId = makeId.value
            payload.modelId = modeld.value
            payload.variantId = `${varientId.value}`
            payload.leadId = leadId
            payload.updatedBy = getUserID()
            payload.mfgYear = mfgYear.value
            payload.leadCityId = cityId
            updateMMVData(payload)
                .then(apiResponse => {
                    if (apiResponse.isValid) {
                        dispatch(
                            setNotification('success', 'Success', apiResponse.message)
                        );
                        onUpdate(mmv)
                        onClose()
                    }
                    else {
                        dispatch(setNotification('danger', 'Error', apiResponse.message));
                    }
                })
        }

    }

    const setSelectedVarient = (val) => {
        if (val){
            setVarientId(val)
            setEnableYear(false)
        }
        else
            setVarientId('')
    }

    const setSelectedYear = (val) => {
        if (val)
            setMfgYear(val)
        else
        setMfgYear('')
    }

    const handleClose = () => {
        setIsError(false)
        setErrorMsg("")
    }

    const getYears = () => {
        const years = []
        for (let i = 2022; i >= 2000; i--) {
            years.push({ label: i.toString(), value: i.toString() });
        }
        return years
    }

    return (

        <div className='dialogDiv'>
            <Snackbar open={isError} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                // keepMounted
                // fullWidth
                // maxWidth='xs'
                onClose={onClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Update MMV"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div style={{ marginBottom: "15px" }}>
                            <Autocomplete
                                // disablePortal
                                getOptionLabel={(option) => option.label}
                                id="combo-box-demo"
                                options={makes}
                                style={{ width: "200px" }}
                                sx={{ width: 50 }}
                                defaultValue={makeId}
                                value={makeId}
                                onChange={(e, val) => setSelectedMake(val)}
                                renderInput={(params) => <TextField  {...params} label="Select Make" />}
                            />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <Autocomplete
                                // disablePortal
                                getOptionLabel={(option) => option.label}
                                id="combo-box-demo"
                                options={models}
                                style={{ width: "200px" }}
                                defaultValue={modeld}
                                value={modeld}
                                disabled={enableModel}
                                sx={{ width: 200 }}
                                onChange={(e, val) => setSelectedModel(val)}
                                renderInput={(params) => <TextField {...params} label="Select Model" />}
                            />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <Autocomplete
                                disablePortal
                                getOptionLabel={(option) => option.label}
                                id="combo-box-demo3"
                                options={varients}
                                style={{ width: "200px" }}
                                defaultValue={varientId}
                                value={varientId}
                                disabled={enableVariant}
                                sx={{ width: 200 }}
                                onChange={(e, val) => setSelectedVarient(val)}
                                renderInput={(params) => <TextField {...params} label="Select Variant" />}
                            />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <Autocomplete
                                disablePortal
                                getOptionLabel={(option) => option.label}
                                id="combo-box-demo3"
                                options={getYears()}
                                style={{ width: "200px" }}
                                defaultValue={mfgYear}
                                value={mfgYear}
                                disabled={enableYear}
                                sx={{ width: 200 }}
                                onChange={(e, val) => setSelectedYear(val)}
                                renderInput={(params) => <TextField {...params} label="Select Year" />}
                            />
                        </div>
                    </DialogContentText>
                </DialogContent>
                {/* <DialogActions> */}
                <div style={{ textAlign: "center" }}>
                    <Button onClick={onClose}>Close</Button>
                    <Button color='success' onClick={handleUpdate}>Update</Button>
                </div>

                {/* </DialogActions> */}
            </Dialog>
        </div>
    )
}
