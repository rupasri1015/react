import React, { Component } from 'react';
import { Icon, Button,  Col, Row, Grid } from 'rsuite'
import call from '../../../shared/img/icons/call.svg'

class PendingDrawer extends Component {

    render() {
        const { drawer, open, confirmList, rowInfo, openForm } = this.props
        return (
            <div className={drawer}>
                <div className="col-md-12 p-3">
                    <h4 className='call-header'>Lead Status Details - {rowInfo.regNumber} </h4>
                </div>
                <Grid fluid>
                    <Row gutter={45} style={{marginTop: '20px'}}>
                        <Col className='paddingDiy2' style={{textAlign: 'left'}}>
                        <Button
                        color="green"
                        style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold' }}
                        onClick={() => open(confirmList)}
                    >
                        <img src={call} alt='call' style={{marginRight: '8px', width: '18px'}} />
                        Call to Customer
                      </Button>
                        </Col>
                    </Row>
                    <Row gutter={45} style={{marginTop: '20px'}}>
                        <Col className='paddingDiy2' style={{textAlign: 'left'}}>
                        <Button
                        color="blue"
                        style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold' }}
                        onClick={() => openForm(confirmList)}
                    >
                        Update Status
                      </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className='drawerHeader'>Lead History</p>
                            <Row className='drawerWrap' style={{marginLeft: '16px', marginRight: '16px'}}>
                                <Col sm={6}>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px' }}>Lead Id</p>     
                                </Col>
                                <Col sm={6}>
                                    <p style={{ fontSize: '11px', margin: '0px' }}> {rowInfo.leadId} </p>
                                </Col>
                                <Col sm={6}>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px' }}>Lead Type</p>
                                </Col>
                                {/* <Col sm={6}>
                                    {
                                       rowInfo &&  rowInfo.leadType.startsWith('TP') === '1' ?
                                        <p style={{ fontSize: '11px', margin: '0px' }}> {rowInfo.leadType} </p> :
                                        <p style={{ fontSize: '11px', margin: '0px' }}>{rowInfo.leadType}</p>
                                    }
                                </Col> */}
                                <Col sm={7} style={{paddingTop: '6px'}}>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px' }}>Lead Status</p> 
                                </Col>
                                <Col sm={12} style={{paddingTop: '6px'}}>
                                    <p style={{ fontSize: '11px', margin: '0px', backgroundColor: '#F68D04', color: '#ffffff', textAlign: 'center', borderRadius: '9px', padding: '3px' }}> Pending </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PendingDrawer
