import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import classNames from 'classnames';
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { renderString } from '../../../core/utility'
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment'
import { getUserID } from '../../../core/services/rbacServices'
import Select from 'react-select'
import DialogActions from '@material-ui/core/DialogActions';
import { connect } from 'react-redux';
import { FormHelperText } from '@material-ui/core';

const DropDialog = ({ isOpen, onClose, data, onSubmitReshedule, reasonList, onDropLead, handleSubmit }) => {

    const [reason, setReason] = useState('')
    const [comments, setComments] = useState('')
    const [reasonError, setReasonError] = useState(false)
    const [commentsError, setCommentsError] = useState(false)

    const useStyles = makeStyles((theme) => {
        return {
            outlined: {
                padding: '10px',
                fontSize: 14,
            },
            commentsArea: {
                width: '80%',
                marginTop: '20px',
                fontSize: 14,
            },
        };
    });

    const styles = useStyles();

    const handleReasonChange = reason => {
        setReason(reason)
        setReasonError(false)
    }

    const handleCommentsChange = e => {
        setComments(e.target.value)
        setCommentsError(false)
    }

    const dropTheLead = () => {
        const payload = {
            status: 'Inspection Drop',
            crmLeadId: data.leadId,
            userId: getUserID(),
            comments: comments,
            reasonId: reason.value
        }
        if (reason && comments)
            onDropLead(payload)
        else if (!reason || !comments) {
            if (!reason) setReasonError(true)
            if (!comments) setCommentsError(true)
        }
    }

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} disableEscapeKeyDown maxWidth="sm" fullWidth>
                {/* <form onSubmit={handleSubmit(dropTheLead)}> */}
                <DialogTitle>
                    <h2 style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '18px', color: 'red' }}> Dropping lead id - {renderString(data.leadId)} <span className="float-right" onClick={onClose} style={{ cursor: 'pointer', color: 'black' }}>&#10005;</span></h2>
                </DialogTitle>
                <DialogContent>
                    <div className="doc-image-conatiner row">
                        <div className='col-sm-3'>
                            <p className="labelText">MMV</p>
                        </div>
                        <div className='col-sm-9'>
                            <p>{renderString(data.mmv)}</p>
                        </div>
                    </div>
                    <div className="doc-image-conatiner row">
                        <div className='col-sm-3'>
                            <p className="labelText">Drop Reason</p>
                        </div>
                        <div className='col-sm-9' style={{ width: '100%', maxWidth: '280px' }}>
                            <Select
                                options={reasonList}
                                classNamePrefix="slot-dropdown"
                                placeholder='Select Reason'
                                onChange={handleReasonChange}
                                value={reason}
                                isSearchable={true}
                            />
                            {
                                reasonError && <FormHelperText style={{ color: 'red' }}> *Please select reason </FormHelperText>
                            }
                        </div>
                    </div>
                    <div className="doc-image-conatiner row">
                        <div className='col-sm-3'>
                            <p className="labelText">Comments</p>
                        </div>
                        <div className='col-sm-9' style={{ width: '100%', maxWidth: '350px' }}>
                            <textarea
                                className={classNames('form-control', styles.commentsArea)}
                                placeholder="Enter"
                                id="remarks"
                                rows="3"
                                maxLength="255"
                                onChange={handleCommentsChange}
                                value={comments}
                            ></textarea>
                            {
                                commentsError && <FormHelperText style={{ color: 'red' }}> *Please enter comments </FormHelperText>
                            }
                        </div>
                    </div>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <button
                        className="icon-btn"
                        style={{ width: '100px', fontWeight: 600, marginBottom: '10px', backgroundColor: '#3499E3' }}
                        onClick={dropTheLead}
                    >
                        DROP
                    </button>
                </DialogActions>
                {/* </form> */}
            </Dialog>
        </>
    )
}

export default connect()(DropDialog)