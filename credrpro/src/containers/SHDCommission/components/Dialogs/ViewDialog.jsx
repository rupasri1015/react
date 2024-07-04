import React, { Component, useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Divider } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import CardHeader from 'reactstrap/lib/CardHeader'
import '../style.scss'
import Checkbox from '@material-ui/core/Checkbox';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Add from '@material-ui/icons/AddCircleOutline';
import Remove from '@material-ui/icons/RemoveCircleOutlineOutlined';
import TextField from '@material-ui/core/TextField';
import { getAmount, getTotalDeductionCos, getTotalDeductionSHD } from '../../../../core/utility'


const ViewDialog = ({ open, data, close }) => {
    let tcCom = 0;
    let hprtoCom = 0;
    let nocCom = 0;
    let vcCom = 0;
    let mesCom = 0;
    let tcSHD = 0;
    let hprtoSHD = 0;
    let nocSHD = 0;
    let vcSHD = 0;
    let mesSHD = 0;
    if (data.userDeductions) {
        tcCom = data.userDeductions.userTrafficChalan && data.userDeductions.userTrafficChalan;
        hprtoCom = data.userDeductions.userHpRtoCharges && data.userDeductions.userHpRtoCharges;
        nocCom = data.userDeductions.userNocCharges && data.userDeductions.userNocCharges;
        vcCom = data.userDeductions.userVehicleCondition && data.userDeductions.userVehicleCondition;
        mesCom = data.userDeductions.userMiscellaneous && data.userDeductions.userMiscellaneous;
    }
    if (data.shdDeductions) {
        tcSHD = data.shdDeductions.shdTrafficChalan && data.shdDeductions.shdTrafficChalan;
        hprtoSHD = data.shdDeductions.shdHpRtoCharges && data.shdDeductions.shdHpRtoCharges;
        nocSHD = data.shdDeductions.shdNocCharges && data.shdDeductions.shdNocCharges;
        vcSHD = data.shdDeductions.shdVehicleCondition && data.shdDeductions.shdVehicleCondition;
        mesSHD = data.shdDeductions.shdMiscellaneous && data.shdDeductions.shdMiscellaneous;
    }


    return (

        <Dialog
            open={open}
            onClose={close}
            fullWidth
            maxWidth="md">
            <DialogTitle>
                Viewing Commission and Deductions <span className="float-right" onClick={close} style={{ cursor: 'pointer' }}>&#10005;</span>
            </DialogTitle>
            {/* <Divider /> */}
            <DialogContent>
                <Card style={{ border: "1px solid #DCDCDC", borderRadius: '0%' }}>
                    <CardHeader style={{ backgroundColor: "#111328", color: "white" }}>Commission
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col className="rowstyle" md={3}>
                                Extra Commission
                            </Col>
                            <Col className="rowstyle" md={3}>
                                {data.extraShdCommission ? getAmount(data.extraShdCommission) : "NA"}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="rowstyle" md={3}>
                                City Commission
                            </Col>
                            <Col className="rowstyle" md={3}>
                                {data.cityLevelCommission ? getAmount(data.cityLevelCommission) : 'NA'}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card style={{ border: "1px solid #DCDCDC", borderRadius: '0%' }}>
                    <CardHeader style={{ backgroundColor: "#111328", color: "white" }}>Deductions

                    </CardHeader>
                    <CardBody>
                        <table className="table">
                            <tr className="broder">
                                <th > </th>
                                {/* <th >Amount</th> */}
                                <th style={{ paddingLeft: "20px" }} >Customer</th>
                                <th style={{ paddingLeft: "20px" }}>Channel Partner</th>
                            </tr>
                            <tr className="broder">
                                <td  >
                                    Traffic Challan
                                </td>

                                <td>
                                    {data.userDeductions ? getAmount(data.userDeductions.userTrafficChalan) : "NA"}
                                </td>

                                <td  >
                                    {data.shdDeductions ? getAmount(data.shdDeductions.shdTrafficChalan) : "NA"}
                                </td>

                            </tr>
                            <tr className="broder">
                                <td  >
                                    HP / RTO Charges
                                </td>
                                <td  >
                                    {data.userDeductions ? getAmount(data.userDeductions.userHpRtoCharges) : "NA"}
                                </td>
                                <td  >
                                    {data.shdDeductions ? getAmount(data.shdDeductions.shdHpRtoCharges) : "NA"}
                                </td>
                            </tr>
                            {/* <tr className="broder">
                                <td>NOC Charges</td>
                                <td>
                                {data.userDeductions ? getAmount(data.userDeductions.userNocCharges) : "NA"}
                                </td>
                                <td>
                                    {data.shdDeductions ? getAmount(data.shdDeductions.shdNocCharges) : "NA"}
                                </td>
                            </tr>
                            <tr className="broder">
                                <td>Vehicle Condition</td>
                                <td>
                                {data.userDeductions ? getAmount(data.userDeductions.userVehicleCondition) : "NA"}
                                </td>
                                <td>
                                {data.shdDeductions ? getAmount(data.shdDeductions.shdVehicleCondition) : "NA"}
                                </td>
                            </tr>
                            <tr className="broder" style={{ borderBottom: "1px solid #dee2e6" }}>
                                <td>Miscellaneous</td>
                                <td>
                                {data.userDeductions ? getAmount(data.userDeductions.userMiscellaneous) : "NA"}
                                </td>
                                <td>
                                {data.shdDeductions ? getAmount(data.shdDeductions.shdMiscellaneous) : "NA"}
                                </td>
                            </tr> */}
                            <tr className="broder">
                                <td style={{ paddingTop: "23px" }}>Doc QC2 Charges</td>
                                <td style={{ padding: "0px !important" }}>
                                    {data.docQc2Deductions}
                                </td>
                                <td style={{ padding: "0px !important" }}>
                                    {data.docQc2Deductions}
                                </td>
                            </tr>

                        </table>
                        <Row>
                            <Col md={3} >
                                <p style={{ marginLeft: '20px' }} >Comments</p>

                            </Col>
                            <Col md={9} >
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={6}
                                    disabled
                                    defaultValue={data.comments ? data.comments : "NA"}
                                    // placeholder="Minimum 3 rows"
                                    style={{ width: '537px' }}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card style={{ border: "1px solid #DCDCDC", borderRadius: '0%' }}>
                    {/* <CardHeader style={{ backgroundColor: "#111328", color: "white" }}>CMS Plus Additions ( Only Channel Partner )
                    </CardHeader> */}
                    <CardBody>
                        {/* <Row>
                            <Col className="rowstyle" md={3}>
                                CMS Plus cost
                            </Col>
                            <Col className="rowstyle" md={3}>
                                {data.credrPlusAmount && data.credrPlusAmount != 0 ? getAmount(data.credrPlusAmount) : "NA"}
                            </Col>
                        </Row> */}

                    </CardBody>
                </Card>
                <Card style={{ border: "1px solid #DCDCDC", borderRadius: '0%' }}>
                    <CardHeader style={{ backgroundColor: "#111328", color: "white" }}>Totals
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col className="rowstyle" md={4}>
                                <b>Highest Bid</b>
                            </Col>
                            <Col className="rowstyle" md={4}>
                                {data.highestBid && data.highestBid != 0 ? getAmount(data.highestBid) : "NA"}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="rowstyle" md={4}>

                            </Col>
                            <Col className="rowstyle" md={3}>
                                For Customer
                            </Col>
                            <Col className="rowstyle" md={3}>
                                For Channel Partner
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col className="rowstyle" md={4}>
                                <Row>
                                    <Col md={10}>
                                        <b>Total Additions</b>
                                    </Col>
                                    <Col md={2}>
                                        <span><Add style={{ color: '#3CB371' }} /></span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="rowstyle lables" md={3}>
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    defaultValue="NA"
                                    variant="filled"
                                    style={{ backgroundColor: "#E8E8E8" }}
                                />
                            </Col>
                            <Col className="rowstyle lables" md={3}>
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    value={data.credrPlusAmount && data.credrPlusAmount != 0 ? getAmount(data.credrPlusAmount) : "NA"}
                                    variant="filled"
                                    style={{ backgroundColor: "#E8E8E8" }}
                                />
                            </Col>
                        </Row> */}
                        <Row>
                            <Col className="rowstyle " md={4}>
                                <Row>
                                    <Col md={10}>
                                        <b>Total Deductions</b>
                                    </Col>
                                    <Col md={2}>
                                        <span><Remove color="secondary" /></span>
                                    </Col>
                                </Row>

                            </Col>
                            <Col className="rowstyle lables" md={3}>
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    variant="filled"
                                    style={{ backgroundColor: "#E8E8E8" }}
                                    value={getAmount(getTotalDeductionCos(data.cityLevelCommission, data.extraShdCommission, tcCom, hprtoCom, nocCom, vcCom, mesCom))}
                                />
                            </Col>
                            <Col className="rowstyle lables" md={3}>
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    value={getAmount(getTotalDeductionSHD(tcSHD, hprtoSHD, nocSHD, vcSHD, mesSHD))}
                                    variant="filled"
                                    style={{ backgroundColor: "#E8E8E8" }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="rowstyle" md={4}>
                                <Row>
                                    <Col md={10}>
                                        <b>Final amount</b>
                                    </Col>
                                    <Col md={2}>
                                        <button style={{ borderRadius: '100%', marginLeft: '3px', border: '2px solid #1589FF', height: "20px", width: "20px", textAlign: "center", color: "#1589FF", fontWeight: "bold", backgroundColor: "white", padding: '0px', pointerEvents: 'none' }}><p style={{ fontWeight: "bold" }}>=</p></button>
                                    </Col>
                                </Row>

                            </Col>
                            <Col className="rowstyle lables" md={3}>
                                <TextField
                                    variant="filled"
                                    disabled
                                    id="outlined-disabled"
                                    value={getAmount(data.highestBid && (Number(data.highestBid) - getTotalDeductionCos(data.cityLevelCommission, data.extraShdCommission, tcCom, hprtoCom, nocCom, vcCom, mesCom)))}
                                    style={{ backgroundColor: "#E8E8E8" }}
                                // style={{backgroundColor:"#FEE7CC"}}
                                />
                            </Col>
                            <Col className="rowstyle lables" md={3}>
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    value={getAmount(data.highestBid && ((Number(data.highestBid) + Number(data.credrPlusAmount)) - getTotalDeductionSHD(tcSHD, hprtoSHD, nocSHD, vcSHD, mesSHD)))}
                                    variant="filled"
                                    style={{ backgroundColor: "#E8E8E8" }}
                                // style={{backgroundColor:"#FEE7CC"}}
                                />
                            </Col>
                            <Col>

                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </DialogContent>

        </Dialog>

    )

}

export default ViewDialog