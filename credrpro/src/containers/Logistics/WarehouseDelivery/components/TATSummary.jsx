import React, { Component } from 'react';
import {
    Card, CardBody, CardTitle
} from 'reactstrap';
import './index.scss'
import { connect } from 'react-redux'

class TATSummary extends Component {
    render() {
        const { Tatinfo } = this.props
        return (
            <div>
                <h3> Delivery TAT Summary </h3>
                <div className='row mt-2'>
                    <div className='col-sm-3'>
                        <Card style={{ width: '272px', height: '144px', border: 'solid 1px #eeeeee', backgroundColor: '#ffffff' }}>
                            <CardTitle style={{ padding: '10px 10px 10px 10px', fontSize: '21px', color: '#147bc5' }}> 0 Hours to 24 Hours</CardTitle>
                            <CardBody>
                                <p className='count'>{Tatinfo && Tatinfo.between0to24}</p>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='col-sm-3'>
                        <Card style={{ width: '272px', height: '144px', border: 'solid 1px #eeeeee', backgroundColor: '#ffffff' }}>
                            <CardTitle style={{ padding: '10px 10px 10px 10px', fontSize: '21px', color: '#fe7530' }}> 24 Hours to 48 Hours</CardTitle>
                            <CardBody>
                                <p className='count'>{Tatinfo && Tatinfo.between24to48}</p>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='col-sm-3'>
                        <Card style={{ width: '272px', height: '144px', border: 'solid 1px #eeeeee', backgroundColor: '#ffffff' }}>
                            <CardTitle style={{ padding: '10px 10px 10px 10px', fontSize: '21px', color: '#e76469' }}> 48 Hours to 72 Hours</CardTitle>
                            <CardBody>
                                <p className='count'> {Tatinfo && Tatinfo.between48to72} </p>
                            </CardBody>
                        </Card>
                    </div>
                    <div className='col-sm-3'>
                        <Card style={{ width: '272px', height: '144px', border: 'solid 1px #eeeeee', backgroundColor: '#ffffff' }}>
                            <CardTitle style={{ padding: '10px 10px 10px 10px', fontSize: '21px', color: '#d92128' }}> 72 Hours +</CardTitle>
                            <CardBody>
                                <p className='count'> {Tatinfo && Tatinfo.above72} </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    // Tatinfo: state.warehouse.wareHouseTimeResponse.interval
})

export default connect(mapStateToProps)(TATSummary)