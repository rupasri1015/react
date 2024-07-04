import React, { Component } from 'react'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import { Form, Button } from 'rsuite'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import SelectField from '@material-ui/core/Select'
import AudioPlayer from 'material-ui-audio-player';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import './audiorecord.scss'
import Checkbox from '@material-ui/core/Checkbox'
import { getUserID } from '../../../core/services/rbacServices'
import { submitAuditFeedback } from '../../../core/services/miscServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import { getAuditInfo } from '../../../core/services/miscServices'

const useStyles = makeStyles((theme) => {
    return {
        root: {
            [theme.breakpoints.down('xs')]: {
                width: '40px',
            },
        },
        loopIcon: {
            color: '#3f51b5',
            '&.selected': {
                color: '#0921a9',
            },
            '&:hover': {
                color: '#7986cb',
            },
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        playIcon: {
            color: '#f50057',
            '&:hover': {
                color: '#ff4081',
            },
        },
        replayIcon: {
            color: '#e6e600',
        },
        pauseIcon: {
            color: '#0099ff',
        },
        volumeIcon: {
            color: 'rgba(0, 0, 0, 0.54)',
        },
        volumeSlider: {
            color: 'black',
        },
        progressTime: {
            color: 'rgba(0, 0, 0, 0.54)',
        },
        mainSlider: {
            color: '#3f51b5',
            '& .MuiSlider-rail': {
                color: '#7986cb',
            },
            '& .MuiSlider-track': {
                color: '#3f51b5',
            },
            '& .MuiSlider-thumb': {
                color: '#303f9f',
            },
        },
    };
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
            <InputLabel style={{ color: error && touched ? '#c00' : '' }}>{label}</InputLabel>
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

class AuditCallsForm extends Component {

    state = {
        showAuditForm: false,
        value: '',
        auditPayload: {},
        onlyIds: [],
        resetCheckBox: false,
        Info: {},
        checkBoxStatus: false
    }

    componentDidMount() {
        getAuditInfo(getUserID())
            .then(apiResonse => {
                if (apiResonse.isValid) {
                    this.setState({ Info: apiResonse.auditLeadDetailsResponse })
                }
            })
    }

    componentDidUpdate(_prevProps, prevState) {
        if (prevState.Info.leadId !== this.state.Info.leadId) {
            this.setState({ checkBoxStatus: true })
        }
    }

    callNextLead = () => {
        getAuditInfo(getUserID())
            .then(apiResonse => {
                if (apiResonse.isValid) {
                    this.setState({ Info: apiResonse.auditLeadDetailsResponse })
                }
            })
    }


    useStylesCheckBox = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        formControl: {
            margin: theme.spacing(3),
        },
    }));

    goToAuditForm = () => {
        this.setState({ showAuditForm: true })
    }

    goToAudit = () => {
        this.setState({ showAuditForm: false })
    }

    handleChange = (checked, id, leadID, userID) => {
        this.setState({ checkBoxStatus: checked })
        const { auditPayload } = this.state
        let newPayload = { ...auditPayload }
        if (checked) {
            const val = this.state.onlyIds.concat(id)
            this.setState({ onlyIds: val })
            let ids = val.map(id => {
                return {
                    auditParameterId: id
                }
            })
            newPayload = {
                leadId: leadID,
                auditParameter: ids,
                auditLeaduserId: userID,
                auditUpdateBy: getUserID()
            }
        }
        else {
            const val = this.state.onlyIds.filter(val => val !== id)
            this.setState({ onlyIds: val })
            let ids = val.map(id => {
                return {
                    auditParameterId: id
                }
            })
            newPayload = {
                leadId: leadID,
                auditParameter: ids,
                auditLeaduserId: userID,
                auditUpdateBy: getUserID()
            }
        }
        this.setState({ auditPayload: newPayload }, () => console.log('check', this.state.auditPayload))
    }

    getCheckedValue = (id) => {
        const { auditPayload } = this.state
        if (Object.keys(auditPayload).length) {
            let checkId = auditPayload.auditParameter.find(auditId => auditId.auditParameterId === id)
            if (checkId) {
                return checkId.auditParameterId
            }
            else {
                return false
            }
        }
        else {
            let checkId = auditPayload && auditPayload.auditParameter && auditPayload.auditParameter.find(auditId => auditId.auditParameterId === id)
            if (checkId) {
                return checkId.auditParameterId
            }
            else {
                return false
            }
        }
    }

    submitAuditReport = (typeOfAction, checkedStatus) => {
        const { auditPayload, remark } = this.state
        const { dispatch } = this.props
        if(remark){
            auditPayload.remark = remark
        }
        if (Object.keys(auditPayload).length && auditPayload.leadId) {
            dispatch(showLoader())
            submitAuditFeedback(auditPayload)
                .then(apiResonse => {
                    if (apiResonse.isValid) {
                        if (typeOfAction === 'next') {
                            dispatch(setNotification('success', 'SUCCESS', 'Successfully Updated'))
                            this.setState({ auditPayload: {}, resetCheckBox: true, onlyIds: [], checkedStatus: false, remark: '' })
                            this.callNextLead()
                        }
                        else {
                            dispatch(setNotification('success', 'SUCCESS', 'Successfully Updated'))
                            this.setState({ showAuditForm: false, auditPayload: {}, remark: '' })
                        }
                    }
                    else{
                        dispatch(setNotification('danger', 'ERROR', apiResonse.message))
                    }
                })
        }
        else{
            dispatch(setNotification('danger', 'ERROR', 'Please update the feedback parameters'))
        }
    }
    setRemark = (event) => {
        this.setState({ remark: event.target.value })
    }

    render() {
        const { showAuditForm, auditPayload, onlyIds, checkBoxStatus, Info, remark } = this.state
        const classes = this.useStylesCheckBox
        return (
            <div >
                {
                    !showAuditForm &&
                    <>
                        <button
                            color="green"
                            style={{
                                fontSize: 20, fontFamily: 'ProximaNovaSemibold',
                                backgroundColor: 'green', color: 'White', border: 'none',
                                padding: '11px', borderRadius: '15px', marginTop: '20px', marginRight: '22px'
                            }}
                            onClick={this.goToAuditForm}>
                            <VerifiedUserIcon /> Start Auditing
                         </button>
                    </>
                }
                {
                    showAuditForm &&
                    <div className="inspection-confirmation-form-container">
                        <Form >
                            <div className="row">
                                <div className="col-sm-6">
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px', color: 'green' }}>LeadID: {Info.leadId ? Info.leadId : 'NA'} </p>
                                </div>
                                <div className="col-sm-6" >
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px', color: 'blue' }}>Created Date: {Info.createdDate ? Info.createdDate : 'NA'} </p>
                                </div>
                                <div className="col-sm-6 mt-2" >
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px', color: 'green' }}>Type: {Info.type ? Info.type : 'NA'} </p>
                                </div>
                                <div className="col-sm-6 mt-2">
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px', color: 'blue' }}>Status: {Info.status ? Info.status : 'NA'} </p>
                                </div>
                                {
                                    Info.status === 'Drop' && Info.dropReason &&
                                    <div className="col-sm-6 mt-2">
                                        <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '16px', color: 'Red' }}>Drop Reason: {Info.dropReason} </p>
                                    </div>
                                }
                                <div className="col-sm-12 mt-5 mb-3 auditRecord">
                                    <div className='row'>
                                        <p style={{ fontFamily: 'ProximaNovaSemibold', paddingLeft: '15px', paddingRight: '15px' }}>Recording: </p>
                                        <AudioPlayer
                                            src={Info.callUrl}
                                            elevation={2}
                                            width="245px"
                                            height='45px'
                                            useStyles={useStyles}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6 mt-5 auditRecord">
                                    <FormControl component="fieldset" className={classes.formControl}>
                                        <FormLabel component="legend" style={{ color: 'purple' }}>Feedback Parameters</FormLabel>
                                        <FormGroup>
                                            {
                                                Info.auditParameter && Info.auditParameter.length &&
                                                Info.auditParameter.map(info => (
                                                    <FormControlLabel
                                                        control={<Checkbox onChange={(event) => this.handleChange(event.target.checked, info.auditParameterId, Info.leadId, Info.userId)} checked={this.getCheckedValue(info.auditParameterId)} />}
                                                        label={info.auditParameterName}
                                                    >
                                                    </FormControlLabel>
                                                ))
                                            }
                                        </FormGroup>
                                    </FormControl>
                                </div>
                                <div className="col-sm-6 mt-5 auditRecord">
                                    <TextField id="filled-multiline-flexible" label="Remarks" multiline variant="outlined" value={remark} onChange={(event) => this.setRemark(event)} />
                                </div>
                            </div>
                            <div className="submit-button-group">
                                <Button type="button" onClick={() => this.submitAuditReport('end', checkBoxStatus)}>
                                    Update and End
            </Button>
                                <Button type="submit" color="green" onClick={() => this.submitAuditReport('next', checkBoxStatus)}>
                                    Update and Next
            </Button>
                            </div>
                        </Form>
                    </div>
                }
            </div>
        )
    }
}

AuditCallsForm = connect()(AuditCallsForm)

export default reduxForm({
    form: 'audit-form',
})(AuditCallsForm)

