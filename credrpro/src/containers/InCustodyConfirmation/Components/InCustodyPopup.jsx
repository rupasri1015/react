import React, { useState, FC } from 'react'
import { Modal, Grid, Button } from 'rsuite'
import call from '../../../shared/img/icons/call.svg'

export default function InCustodyModal  ({ onClose, inCustody, open, leadId })  {

    const inCustodyAction = () => {
        inCustody(leadId)
    }

    return (
        <Modal onHide={onClose} show={open} size="sm" className='diyWrap' style={{zIndex:'2000'}}>
            <Modal.Header closeButton style={{ textAlign: 'center' }}>
                <Modal.Title>In Custody Confirmation</Modal.Title>
                <hr />
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <p style={{fontSize: '16px', fontFamily: 'ProximaNovaSemibold', color: '#333333', textAlign: 'center'}}>{`Are you sure you want to perform this Action?`}</p>
                </Grid>
            </Modal.Body>
            <br />
            <Modal.Footer style={{textAlign: 'center'}}>
                <button onClick={onClose} style={{ border: '#DEDEDE', backgroundColor: '1px solid #E8E8E8',  color: '#333333', padding: '8px 20px', borderRadius: '22px', marginRight: '10px'}}>Cancel</button>
                <button onClick={inCustodyAction} style={{ marginRight: 15, color: '#ffffff', padding: '8px 20px', borderRadius: '22px', backgroundColor: '#4DBD74', border: '1px solid #35AC5E'  }}>
                    Ok
                </button>
            </Modal.Footer>
        </Modal>
    )
}
