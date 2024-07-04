import React, { useState, FC } from 'react'
import { useDispatch } from 'react-redux'
import { Modal, Grid, Button } from 'rsuite'
import { rebid, shdRebid } from '../../../core/services/biddingServices'
import { hideLoader, showLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'

export default function BidModal({ onClose, open, close, leadData, rowInfo, onRefreshPage, bidVal }) {

    const dispatch = useDispatch()

    const continueBid = () => {
        dispatch(showLoader())
        if (Number(rowInfo.customerExpectedPrice) === 0) {
            dispatch(setNotification('danger', 'Error', 'Please enter customer expected price'))
            onClose()
            close()
            onRefreshPage()
        } else {
            if (rowInfo.leadType === 'NTP' || rowInfo.leadType === 'TP-R' || rowInfo.leadType === 'TP-CP') {
                const payload = {
                    auctionTransactionId: rowInfo.transactionId,
                    cityId: rowInfo.cityId,
                    gatePassId: rowInfo.gatepassId,
                    leadId: rowInfo.leadId,
                    type: "Continue"
                }
                shdRebid(payload)
                    .then(apiResponse => {
                        if (apiResponse.isValid) {
                            dispatch(setNotification('success', 'SUCCESS', apiResponse.message))
                            dispatch(hideLoader())
                            onClose()
                            close()
                            onRefreshPage('bidAction')
                        }
                        else {
                            dispatch(setNotification(
                                'danger',
                                'Error',
                                apiResponse.message
                            ))
                        }

                    })
            }
            else {
                const payload = {
                    auctionTransactionId: rowInfo.transactionId,
                    cityId: rowInfo.cityId,
                    gatePassId: rowInfo.gatepassId,
                    leadId: rowInfo.leadId,
                    type: "Continue"
                }
                rebid(payload)
                    .then(apiResponse => {
                        if (apiResponse.isValid) {
                            dispatch(setNotification('success', 'SUCCESS', apiResponse.message))
                            dispatch(hideLoader())
                            onClose()
                            close()
                            onRefreshPage('bidAction')
                        }
                        else {
                            dispatch(setNotification(
                                'danger',
                                'Error',
                                apiResponse.message
                            ))
                        }

                    })
            }
        }
    }

    const discardBid = () => {
        onClose()
    }

    return (
        <Modal onHide={onClose} show={open} size="sm" className='diyWrap' style={{ zIndex: '2000' }}>
            <Modal.Header closeButton style={{ textAlign: 'center' }}>
                <Modal.Title>{bidVal === 'bid' ?
                        <p style={{ fontSize: '22px', fontFamily: 'ProximaNovaSemibold', color: '#333333', textAlign: 'center' }}>{`Are you sure you want to Bid ?`}</p> :
                        <p style={{ fontSize: '22px', fontFamily: 'ProximaNovaSemibold', color: '#333333', textAlign: 'center' }}>{`This will start the bid and re-assign lead to you.`}</p>}</Modal.Title>
                <hr />
            </Modal.Header>
            {/* <Modal.Body>
                <Grid fluid>
                    {bidVal === 'bid' ?
                        <p style={{ fontSize: '16px', fontFamily: 'ProximaNovaSemibold', color: '#333333', textAlign: 'center' }}>{`Are you sure you want to Bid ?`}</p> :
                        <p style={{ fontSize: '16px', fontFamily: 'ProximaNovaSemibold', color: '#333333', textAlign: 'center' }}>{`This will start the bid and re-assign lead to you.`}</p>}
                </Grid>
            </Modal.Body> */}
            <br />
            <Modal.Footer style={{ textAlign: 'center' }}>
                {/* <button onClick={discardBid} style={{ border: '#DEDEDE', backgroundColor: '#E59342', color: '#333333', padding: '8px 20px', borderRadius: '22px', marginRight: '10px' }}>Cancel</button> */}
                <button onClick={continueBid} style={{ marginRight: 15, color: '#ffffff', padding: '8px 20px', borderRadius: '22px', backgroundColor: '#4DBD74', border: '1px solid #35AC5E' }}>
                    Confirm
                </button>
            </Modal.Footer>
        </Modal>
    )
}
