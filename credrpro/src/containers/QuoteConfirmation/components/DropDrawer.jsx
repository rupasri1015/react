import React, { Component } from 'react';
import { Icon, Button, Col, Row, Grid } from 'rsuite'
import arrowDropdown from '../../../shared/img/icons/arrowDropdown.svg'
import call from '../../../shared/img/icons/call.svg'
import { renderDate, renderTime } from '../../../core/utility/stringUtility'
import { connect } from 'react-redux'

const MAX_COUNT = 2

class DropDrawer extends Component {

    state = {
        isHistory: false,
        isCallLogs: false
    }

    getRenderedData = () => {
        const { historyData } = this.props
        const value = historyData.leadCallHistoryList
        if (value && value.length) {
            let data = value.filter((his) => his.comments !== null)
            if (this.state.isHistory) {
                return data.length ? data : null
            }
            return (data.slice(0, MAX_COUNT))
        }
    }

    getRenderedLogsData = () => {
        const { historyData } = this.props
        const value = historyData.leadCallHistoryList
        if (value && value.length) {
            if (this.state.isCallLogs) {
                return value.length ? value : null
            }
            return (value.slice(0, MAX_COUNT))
        }
    }

    handleToggleCommentsHistory = () => {
        this.setState({
            isHistory: !this.state.isHistory
        })
    }

    handleToggleLogsHistory = () => {
        this.setState({
            isCallLogs: !this.state.isCallLogs
        })
    }

    handleDrop = () => {
        const { handleDropStatus } = this.props
        handleDropStatus()
    }

    render() {
        const { drawer, open, confirmList, rowInfo, historyData, status } = this.props
        let data = historyData && historyData.length && historyData.leadCallHistoryList.filter((his) => his.comments !== null)
        return (
            <div className={drawer}>
                <div className="col-md-12 p-3">
                    <h4 className='call-header'>Lead Status Details - {rowInfo.regNumber} </h4>
                </div>
                <Grid fluid>
                    <Row gutter={45} style={{ marginTop: '20px' }}>
                        <Col sm={12} className='paddingDiy2'>
                            <Button
                                color="green"
                                style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold' }}
                                onClick={() => open(confirmList)}
                            >
                                <img src={call} alt='call' style={{ marginRight: '8px', width: '18px' }} />
                        Call to Customer
                      </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ marginBottom: '30px' }}>
                            <p className='drawerHeader'>Lead History</p>
                            <Row className='drawerWrap' style={{ marginLeft: '16px', marginRight: '16px' }}>
                                <Col sm={6}>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px' }}>Lead Id</p>
                                </Col>
                                <Col sm={6}>
                                    <p style={{ fontSize: '11px', margin: '0px' }}> {rowInfo.leadId} </p>
                                </Col>
                                <Col sm={6}>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px' }}>Lead Type</p>
                                </Col>
                                <Col sm={6}>
                                    {
                                        rowInfo && rowInfo.leadType && rowInfo.leadType.startsWith('TP') === '1' ?
                                            <p style={{ fontSize: '11px', margin: '0px' }}> {rowInfo.leadType} </p> :
                                            <p style={{ fontSize: '11px', margin: '0px' }}>{rowInfo.leadType}</p>
                                    }
                                </Col>
                                <Col sm={7} style={{ paddingTop: '6px' }}>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px' }}>Lead Status</p>
                                </Col>
                                <Col sm={17} style={{ paddingTop: '6px' }}>
                                    <p style={{ fontSize: '11px', margin: '0px', backgroundColor: '#D92128', color: '#ffffff', textAlign: 'center', borderRadius: '9px', padding: '3px', width: '100%', maxWidth: '80px' }}>Drop</p>
                                </Col>
                                <Col style={{ paddingTop: '6px' }}>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px', paddingLeft: '5px', paddingRight: '5px' }}>Dropped Reason</p>
                                    {
                                        historyData.leadReason ?
                                            <p style={{ fontSize: '11px', paddingLeft: '5px', paddingRight: '5px', margin: '0px' }}> {historyData.leadReason} </p> :
                                            <p style={{ fontSize: '11px', paddingLeft: '5px', paddingRight: '5px', margin: '0px' }}> - </p>
                                    }
                                </Col>
                                <Col style={{ paddingTop: '6px' }}>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px', paddingLeft: '5px', paddingRight: '5px' }}>Dropped Date & Time</p>
                                    {
                                        historyData.leadReasonDate || historyData.leadReasonTime ?
                                            <p style={{ fontSize: '11px', paddingLeft: '5px', paddingRight: '5px', margin: '0px' }}> {renderDate(historyData.leadReasonDate)} <span style={{ borderLeft: '1px solid #333333', marginRight: '5px', marginLeft: '5px' }}></span> {renderTime(historyData.leadReasonDate)} </p> :
                                            <p style={{ fontSize: '11px', paddingLeft: '5px', paddingRight: '5px', margin: '0px' }}> - </p>
                                    }
                                </Col>
                            </Row>
                            <p className='drawerHeader' style={{ marginTop: '0px' }}>Comments History</p>
                            {
                                this.getRenderedData() && this.getRenderedData().length ?
                                    this.getRenderedData().map((val) => (
                                        <div className='drawerWrap'>
                                            <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px' }}> {renderDate(val.callDateTime)} </p>
                                            <p style={{ fontSize: '11px', margin: '0px' }}> {val.comments} </p>
                                        </div>
                                    ))
                                    :
                                    <p style={{ fontSize: '11px', margin: '0px', paddingLeft: '20px' }}>No Comments</p>
                            }
                            {
                                data && data.length > 2 &&
                                <div className='imgWrapDIY viewMore'>
                                    {
                                        this.state.isHistory === false ?
                                            <img src={arrowDropdown} alt='dropdown' style={{ width: '25px' }} onClick={this.handleToggleCommentsHistory} /> :
                                            <img src={arrowDropdown} alt='dropdown' style={{ width: '25px', transform: 'rotate(180deg)' }} onClick={this.handleToggleCommentsHistory} />
                                    }
                                </div>
                            }
                            <p className='drawerHeader' style={{ marginTop: '0px' }}>Call Logs</p>
                            {
                                this.getRenderedLogsData() && this.getRenderedLogsData().map((val, index) => (
                                    <div className='drawerWrap' style={{ marginTop: '10px' }}>
                                        <div className='logShape' key={index}>Attempt {historyData.leadCallHistoryList.length - index} </div>
                                        <p style={{ fontFamily: 'ProximaNovaSemibold', fontSize: '11px', marginTop: '0px' }}>{renderDate(val.callDateTime)}<span style={{ borderLeft: '1px solid #333333', marginRight: '5px', marginLeft: '5px' }}></span> {renderTime(val.callDateTime)} | {val.callerName}</p>
                                        <p style={{ fontSize: '11px', margin: '0px' }}>Call Duration <span style={{ marginRight: '5px', marginLeft: '5px' }}>:</span> <span style={{ fontFamily: 'ProximaNovaSemibold' }}> {val.callDuration} </span></p>
                                    </div>
                                )
                                )
                            }
                            {
                                historyData && historyData.leadCallHistoryList && historyData.leadCallHistoryList.length > 2 &&
                                <div className='imgWrapDIY viewMore'>
                                    {
                                        this.state.isCallLogs === false ?
                                            <img src={arrowDropdown} alt='dropdown' style={{ width: '25px' }} onClick={this.handleToggleLogsHistory} /> :
                                            <img src={arrowDropdown} alt='dropdown' style={{ width: '25px', transform: 'rotate(180deg)' }} onClick={this.handleToggleLogsHistory} />

                                    }
                                </div>
                            }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default connect()(DropDrawer)