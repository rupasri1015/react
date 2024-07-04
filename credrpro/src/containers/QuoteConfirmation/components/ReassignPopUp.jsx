import React, { useState, FC } from 'react'
import { Modal, Grid, Button } from 'rsuite'
import call from '../../../shared/img/icons/call.svg'

export default function ReassignModal  ({ onClose, onReassignUser, open, leadData, rowInfo })  {

    const callToCustomer = () => {
        onReassignUser(leadData, rowInfo)
    }

    return (
        <Modal onHide={onClose} show={open} size="sm" className='diyWrap' style={{zIndex:'2000'}}>
            <Modal.Header closeButton style={{ textAlign: 'center' }}>
                <Modal.Title>Are you sure you want to re-assign?</Modal.Title>
                <hr />
            </Modal.Header>
            {/* <Modal.Body>
                <Grid fluid>
                    <p style={{fontSize: '16px', fontFamily: 'ProximaNovaSemibold', color: '#333333', textAlign: 'center'}}>{`Are you sure you want to call`} {rowInfo.userName}</p>
                </Grid>
            </Modal.Body> */}
            <br />
            <Modal.Footer style={{textAlign: 'center'}}>
                {/* <button onClick={onClose} style={{ border: '#DEDEDE', backgroundColor: '1px solid #E8E8E8',  color: '#333333', padding: '8px 20px', borderRadius: '22px', marginRight: '10px'}}>Cancel</button> */}
                <button onClick={callToCustomer} style={{ marginRight: 15, color: '#ffffff', padding: '8px 20px', borderRadius: '22px', backgroundColor: '#4DBD74', border: '1px solid #35AC5E'  }}>
                    {/* <img src={call} alt='call' style={{marginRight: '5px', width: '15px'}} /> */}
                    Reassign
                </button>
            </Modal.Footer>
        </Modal>
    )
}
