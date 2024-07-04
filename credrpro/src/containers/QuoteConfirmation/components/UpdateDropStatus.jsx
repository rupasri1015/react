import React, { useState, FC, useEffect } from 'react'
import { Modal, Grid, Row, Col, Form } from 'rsuite'
import Select from '../../../shared/components/redux-form-new/Select'
import TextArea from '../../../shared/components/redux-form-new/TextArea'
import { reduxForm, InjectedFormProps, Field, getFormValues, SubmissionError } from 'redux-form'
import { connect, ConnectedProps } from 'react-redux'
import validate from './validate'
import { getReasonsQuote, updateStatus } from '../../../core/services/quoteConfServices'
import { getUserID } from '../../../core/services/rbacServices'
import { useDispatch } from "react-redux"
import { setNotification } from "../../../redux/actions/notificationAction"
import { reset } from 'redux-form';

const mapStateToProps = (state) => {
    return {
        formStates: getFormValues('quote-drop-status')(state) 
    }
}

const handleSubmitFail = () => {
    setTimeout(() => {
        const firstElement = document.getElementsByClassName('rs-error-message-wrapper')[0]
        firstElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 50)
}

const connector = connect(mapStateToProps)

function UpdateDropStatus({ onClose, open, handleSubmit, rowInfo, onRefreshRow }) {
    const [activeClose, setActiveClose] = useState(false)
    const [comments, setComments] = useState('')
    const [reasonList, setReasonList] = useState([])
    const [reason, setReason] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        const statusDrop = 'DROP'
        getReasonsQuote(statusDrop)
            .then(apiRes => {
                if (apiRes.isValid) {
                    const reasonList = apiRes.crmStatusBean.map(reason => {
                        return {
                            value: reason.statusId,
                            label: reason.statusName
                        }
                    })
                    setReasonList(reasonList)
                }
            })
        dispatch(reset('quote-drop-status'))
    }, [])

    const getDelta = (formData) => {
        const delta = {}
        if (formData.status) {
            delta.status = formData.status
        }
        if (formData.leadId) {
            delta.leadId = formData.leadId
        }
        if (formData.comments) {
            delta.comments = formData.comments
        }
        if (formData.reasonId) {
            delta.reasonId = formData.reasonId
        }

        return delta
    }

    const closePopUp = () => {
        setActiveClose(true)
        onClose()
        dispatch(reset('quote-drop-status'));
    }

    const handleUpdate = handleSubmit(formData => handleSubmitDetails(formData))

    const labelReason = () => {
        return (
            <>
                Select Reason <span style={{ color: 'red' }}>*</span>
            </>
        )
    }

    const handleCommentChange = (e) => {
        setComments(e)
    }

    const handleReasonChange = (reason) => {
        setReason(reason)
    }

    const handleSubmitDetails = (data) => {
        let delta = getDelta(data)
        delta.userId = getUserID()
        delta.leadId = rowInfo.leadId
        delta.crmLeadId = rowInfo.crmLeadId
        delta.status = 'DROP'
        if (Object.keys(delta).length) {
            if (delta.status !== null) {
                updateStatus(delta)
                    .then(apiRes => {
                        if (apiRes.isValid) {
                            dispatch(setNotification({
                                type: 'success',
                                message: 'Status Updated Successfully',
                                title: 'Success'
                            }))
                            onClose()
                            onRefreshRow()
                            getDelta({})
                            dispatch(reset('quote-drop-status'));
                        }
                        else {
                            dispatch(setNotification({
                                type: 'error',
                                message: apiRes.message,
                                title: 'Error'
                            }))
                        }
                    })
            }
        }
    }

    return (
        <Form onSubmit={handleSubmit(formData => handleSubmitDetails(formData))}>
            <Modal backdrop={true} keyboard={false} onHide={closePopUp} show={open} size="xs">
                <Modal.Header closeButton style={{ textAlign: 'center' }}>
                    <Modal.Title style={{ color: '#333333', fontFamily: 'ProximaNovaSemibold' }}>Call in Progress - {rowInfo.regNumber} </Modal.Title>
                </Modal.Header>
                <hr style={{ marginBottom: '10px' }} />
                <Modal.Body style={{ paddingBottom: 0, marginTop: '20px' }}>
                    <Grid fluid>
                        <Row style={{ marginLeft: '' }}>
                            <Col style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '15px' }}>
                                <Field
                                    name="reasonId"
                                    component={Select}
                                    cleanable={false}
                                    options={reasonList}
                                    searchable={false}
                                    label={labelReason()}
                                    placeholder="Select Reason"
                                    onChange={handleReasonChange}
                                />
                            </Col>
                            <Col sm={12} style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '15px' }}>
                                <Field
                                    style={{ width: '320px' }}
                                    name="comments"
                                    component={TextArea}
                                    label="Comments"
                                    placeholder="Enter Message"
                                    onChange={handleCommentChange}
                                    className="commentError"
                                />
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
                <br />
                <Modal.Footer>
                    <button style={{ marginRight: 15, color: '#ffffff', padding: '8px 20px', borderRadius: '22px', backgroundColor: '#4DBD74', border: '1px solid #35AC5E' }} onClick={handleUpdate}>Update</button>
                </Modal.Footer>
            </Modal>
        </Form>
    )
}

const ReduxForm = reduxForm({
    form: 'quote-drop-status',
    validate,
    onSubmitFail: handleSubmitFail
})(UpdateDropStatus)

export default connector(ReduxForm)
