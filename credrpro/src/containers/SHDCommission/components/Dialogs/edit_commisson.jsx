import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Checkbox, Divider } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import Card from 'reactstrap/lib/Card';
import CardBody from 'reactstrap/lib/CardBody';
import CardHeader from 'reactstrap/lib/CardHeader'
import '../style.scss'
import Add from '@material-ui/icons/AddCircleOutline';
import Remove from '@material-ui/icons/RemoveCircleOutlineOutlined';
import TextField from '@material-ui/core/TextField';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Edit from '@material-ui/icons/BorderColorOutlined';
import { onlyNumber } from '../../../../core/utility/inputNormalizers'
import { getAmount } from '../../../../core/utility'

class Commission extends Component {
    state = {
        extra_com: 0,
        traffic_challan: 0,
        traffic_challan_shd: 0,
        cityCom: 0,
        hp_rto: 0,
        hp_rto_shd: 0,
        noc: 0,
        noc_shd: 0,
        vehicle: 0,
        vehicle_shd: 0,
        misc: 0,
        misc_shd: 0,
        cms: 0,
        precms: 0,
        highBid: 0,
        enableForm: true,
        totalDeductionCom: 0,
        totalDeductionShd: 0,
        calAmt: true,
        accept: true,
        totalAddShd: 0,
        finalAmtCom: 0,
        finalAmtShd: 0,
        chars_left: 600,
        showErr: false,
        docQc2: 0
    }

    TextInput = (field) => {
        return (
            <input
                {...field.input}
                type="input"
                maxlength="6"
                disabled={this.props.enableForm}
                className="form-control"
                onChange={e => field.input.onChange(e.target.value)}
            />
        );
    };
    DisabledTextInput = (field) => {
        return (
            <input
                {...field.input}
                type="input"
                maxlength="6"
                disabled={true}
                className="form-control"
                onChange={e => field.input.onChange(e.target.value)}
            />
        );
    };
    TextInput2 = (field) => {
        const { enableForm } = this.props
        return (
            <input
                {...field.input}
                type="input"
                disabled={enableForm}
                className="form-control"
                onChange={e => field.input.onChange(e.target.value)}
            />
        );
    };
    label = (field) => {
        return (
            <input
                {...field.input}
                type="input"
                disabled
                style={{ backgroundColor: "white", border: "none", pointerEvents: 'none' }}
                className="form-control"
            />
        );
    };
    Textarea = (field) => {
        return (
            <textarea
                {...field.input}
                type="text"
                disabled={this.props.enableForm}
            />
        );
    };

    componentDidMount() {
        const { viewData, action, initialize } = this.props
        this.setState({ cityCom: viewData.cityLevelCommission })
        if (viewData.shdTrafficChalan) {
            this.setState({ tcshdcheck: true })
        }
        this.setState({ commission: viewData.commission })
        this.setState({ extra_com: viewData.commission })
        this.setState({ traffic_challan_shd: viewData.shdTrafficChalan })
        this.setState({ traffic_challan: viewData.userTrafficChalan })
        this.setState({ hp_rto: viewData.userHpRtoCharges })
        this.setState({ hp_rto_shd: viewData.shdHpRtoCharges })
        this.setState({ noc: viewData.userNocCharges })
        this.setState({ noc_shd: viewData.shdNocCharges })
        this.setState({ vehicle: viewData.userVehicleCondition })
        this.setState({ vehicle_shd: viewData.shdVehicleCondition })
        this.setState({ misc: viewData.userMiscellaneous })
        this.setState({ misc_shd: viewData.shdMiscellaneous })
        this.setState({ cms: viewData.credrPlusAmount })
        this.setState({ precms: viewData.credrPlusAmount })
        this.setState({ highBid: viewData.highestBid })
        this.setState({ docQc2: viewData.docQc2Deductions })
        initialize(viewData)
    }

    onKeyPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        } 
      }

    handleForm = payload => {
        const { onSubmit } = this.props
        const { precms } = this.state
        if (payload.shdTrafficChalan)
            payload.shdTrafficChalan = payload.shdTrafficChalan
        else
            payload.shdTrafficChalan = 0
        if (payload.userTrafficChalan)
            payload.userTrafficChalan = payload.userTrafficChalan
        else
            payload.userTrafficChalan = 0
        if (payload.userHpRtoCharges)
            payload.userHpRtoCharges = payload.userHpRtoCharges
        else
            payload.userHpRtoCharges = 0
        if (payload.shdHpRtoCharges)
            payload.shdHpRtoCharges = payload.shdHpRtoCharges
        else
            payload.shdHpRtoCharges = 0
        if (payload.userNocCharges)
            payload.userNocCharges = payload.userNocCharges
        else
            payload.userNocCharges = 0
        if (payload.shdNocCharges)
            payload.shdNocCharges = payload.shdNocCharges
        else
            payload.shdNocCharges = 0
        if (payload.userVehicleCondition)
            payload.userVehicleCondition = payload.userVehicleCondition
        else
            payload.userVehicleCondition = 0
        if (payload.shdVehicleCondition)
            payload.shdVehicleCondition = payload.shdVehicleCondition
        else
            payload.shdVehicleCondition = 0
        if (payload.userMiscellaneous)
            payload.userMiscellaneous = payload.userMiscellaneous
        else
            payload.userMiscellaneous = 0
        if (payload.shdMiscellaneous)
            payload.shdMiscellaneous = payload.shdMiscellaneous
        else
            payload.shdMiscellaneous = 0
        if (payload.commission)
            payload.commission = payload.commission
        else
            payload.commission = 0
        if (payload.credrPlusAmount)
            payload.cmsPlusCost = payload.credrPlusAmount
        else
            payload.cmsPlusCost = 0
        if (!Number(payload.commission) && !Number(payload.userTrafficChalan) && !Number(payload.userHpRtoCharges) && !Number(payload.userNocCharges) && !Number(payload.userVehicleCondition) && !Number(payload.userMiscellaneous) && !Number(payload.credrPlusAmount)) {
            if (window.confirm("Are you sure to Submit ?")) {
                onSubmit(payload)
            }
        }
        else {
            if (payload.credrPlusAmount < precms)
                this.setState({ showErr: true })
            else
                onSubmit(payload)
        }
    }
    handleTextarea(event) {
        var input = event.target.value;
        this.setState({
            chars_left: 600 - input.length
        });
    }

    totalDeductionCom = () => {
        const { cityCom, extra_com, traffic_challan, hp_rto, noc, vehicle, misc, docQc2 ,commission} = this.state
        let totalAmt = 0
        if (cityCom)
            totalAmt = Number(cityCom)
        if (commission)
            totalAmt = totalAmt + Number(commission)
        if (traffic_challan)
            totalAmt = totalAmt + Number(traffic_challan)
        if (hp_rto)
            totalAmt = totalAmt + Number(hp_rto)
        if (noc)
            totalAmt = totalAmt + Number(noc)
        if (vehicle)
            totalAmt = totalAmt + Number(vehicle)
        if (misc)
            totalAmt = totalAmt + Number(misc)
        if (docQc2)
            totalAmt = totalAmt + Number(docQc2)
        return totalAmt
    }
    totalDeductionShd = () => {
        const { traffic_challan_shd, hp_rto, noc_shd, vehicle_shd, traffic_challan, rto, misc_shd, docQc2, extra_com } = this.state
        let totalAmt = 0
        if (traffic_challan)
            totalAmt = Number(traffic_challan)
        if (hp_rto)
            totalAmt = totalAmt + Number(hp_rto)
        // if (noc_shd)
        //     totalAmt = totalAmt + Number(noc_shd)
        // if (vehicle_shd)
        //     totalAmt = totalAmt + Number(vehicle_shd)
        // if (misc_shd)
        //     totalAmt = totalAmt + Number(misc_shd)
        // if (rto)
        //     totalAmt = totalAmt + Number(rto)
        // if (trafficChallan)
        //     totalAmt = totalAmt + Number(trafficChallan)
        if (docQc2)
            totalAmt = totalAmt + Number(docQc2)
        // if (extra_com)
        //     totalAmt = totalAmt + Number(extra_com)
        return totalAmt
    }
    finalAmtCom = () => {
        const finalcom = Number(this.state.highBid) - this.totalDeductionCom()
        return finalcom
    }
    finalAmtShd = () => {
        const finalshd = Number(this.state.highBid) - this.totalDeductionShd()
        return finalshd
    }
    totalAddShd = () => {
        return Number(this.state.cms)
    }
    getValue = (comm) => {
        const { traffic_challan } = this.state
        if (comm || traffic_challan !== '') {
            return true
        }
        else return false
    }
    checkTc = (val) => {
        if (val === "" || Number(val) === 0) {
            this.props.change("shdTrafficChalan", "")
            this.setState({ traffic_challan_shd: 0 })
        }
    }
    setTcCheck = () => {
        this.props.change("shdTrafficChalan", this.state.traffic_challan)
        this.setState({ traffic_challan_shd: this.state.traffic_challan })
    }
    UnsetTcCheck = () => {
        this.props.change("shdTrafficChalan", "")
        this.setState({ traffic_challan_shd: 0 })
    }
    checkHp = (val) => {
        if (val === "" || Number(val) === 0) {
            this.props.change("shdHpRtoCharges", "")
            this.setState({ hp_rto_shd: 0 })
        }
    }
    setHpCheck = () => {
        this.props.change("shdHpRtoCharges", this.state.hp_rto)
        this.setState({ hp_rto_shd: this.state.hp_rto })
    }
    UnsetHpCheck = () => {
        this.props.change("shdHpRtoCharges", "")
        this.setState({ hp_rto_shd: 0 })
    }
    checkNoc = (val) => {
        if (val === "" || Number(val) === 0) {
            this.props.change("shdNocCharges", "")
            this.setState({ noc_shd: 0 })
        }
    }
    setNocCheck = () => {
        this.props.change("shdNocCharges", this.state.noc)
        this.setState({ noc_shd: this.state.noc })
    }
    UnsetNocCheck = () => {
        this.props.change("shdNocCharges", "")
        this.setState({ noc_shd: 0 })
    }
    checkVc = (val) => {
        if (val === "" || Number(val) === 0) {
            this.props.change("shdVehicleCondition", "")
            this.setState({ vehicle_shd: 0 })
        }
    }
    setVcCheck = () => {
        this.props.change("shdVehicleCondition", this.state.vehicle)
        this.setState({ vehicle_shd: this.state.vehicle })
    }
    UnsetVcCheck = () => {
        this.props.change("shdVehicleCondition", "")
        this.setState({ vehicle_shd: 0 })
    }
    checkMis = (val) => {
        if (val === "" || Number(val) === 0) {
            this.props.change("shdMiscellaneous", "")
            this.setState({ misc_shd: 0 })
        }
    }
    setMisCheck = () => {
        this.props.change("shdMiscellaneous", this.state.misc)
        this.setState({ misc_shd: this.state.misc })
    }
    UnsetMisCheck = () => {
        this.props.change("shdMiscellaneous", "")
        this.setState({ misc_shd: 0 })
    }
    checkPreCms = (val) => {
        if (val < this.state.precms)
            this.setState({ showErr: true })
        else
            this.setState({ showErr: false })
    }

    render() {
        const { open, enableForm, handleSubmit, close, action, viewData, enableEditing } = this.props
        const { chars_left, precms, showErr } = this.state
        const finalcomamt = this.finalAmtCom()
        const finalshdcmt = this.finalAmtShd()
        return (
            <Dialog
                open={open}
                onClose={close}
                fullWidth
                maxWidth="md">
                <DialogTitle>
                    Commission and Deductions <span className="float-right" onClick={close} style={{ cursor: 'pointer' }}>&#10005;</span>
                    {action === "Edit" && enableForm &&
                        <Button style={{ marginRight: '25px' }} onClick={enableEditing} startIcon={<Edit />} className="float-right editbtn:hover editbtn" >ENABLE EDITING</Button>
                    }
                </DialogTitle>
                <DialogContent>

                    <form onSubmit={handleSubmit(this.handleForm)} onKeyPress={this.onKeyPress}>
                        <Card style={{ border: "1px solid #DCDCDC", borderRadius: '0%' }}>
                            <CardHeader style={{ backgroundColor: "#111328", color: "white" }}>Add Commission
                            </CardHeader>

                            <CardBody>
                                <Row style={{ paddingLeft: '15px' }}>
                                    <Col className="rowstyle" md={3}>
                                        Extra Commission
                                    </Col>
                                    <Col className="rowstyle" style={{ marginTop: "-15px" }} md={3}>
                                        <Field
                                            name="commission"
                                            component={this.TextInput}
                                            variant="outlined"
                                            disabled={enableForm}
                                            normalize={onlyNumber}
                                            onChange={(e, newval, preval) => { this.setState({ commission: newval }); }}
                                            style={{ width: '300px', marginLeft: "-28px", backgroundColor: 'transparent' }}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ paddingLeft: '15px' }}>
                                    <Col className="rowstyle" md={3}>
                                        City Commission
                                    </Col>
                                    <Col className="rowstyle" style={{ marginTop: "-15px" }} md={3}>
                                        <p style={{ paddingTop: "15px", marginLeft: "-22px" }}>
                                            {
                                                getAmount(viewData.cityLevelCommission)
                                            }
                                        </p>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Card style={{ border: "1px solid #DCDCDC", borderRadius: '0%' }}>
                            <CardHeader style={{ backgroundColor: "#111328", color: "white" }}>Add Deductions
                            </CardHeader>
                            <CardBody>
                                <table className="table table-borderless">
                                    <thead >
                                        <tr>
                                            <th> </th>
                                            <th> Customer</th>
                                            <th style={{ float: 'left' }}> Channel Partner</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>

                                            <td style={{ paddingTop: "23px" }} >
                                                Traffic Challan
                                            </td>
                                            <td  >
                                                <Field
                                                    name="userTrafficChalan"
                                                    component={this.TextInput2}
                                                    variant="outlined"
                                                    disabled={enableForm}
                                                    normalize={onlyNumber}
                                                    onChange={(e, newval, preval) => { this.setState({ traffic_challan: newval }); this.setState({ traffic_challan_shd: newval }); this.props.change("shdTrafficChalan", newval); this.checkTc(newval) }}
                                                    style={{ width: '300px' }}
                                                />

                                            </td>
                                            <td>
                                                <Field
                                                    name="userTrafficChalan"
                                                    component={this.DisabledTextInput}
                                                    variant="outlined"
                                                    disabled={true}
                                                    normalize={onlyNumber}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>

                                            <td  >
                                                {/* <button type="button" disabled={true} className="btn btn-success" onClick={this.setTcCheck}>Add to CP</button>
                                                <button type="button" disabled={true} className="btn btn-danger" onClick={this.UnsetTcCheck}>Clear CP</button> */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingTop: "23px" }} >
                                                HP / RTO Charges
                                            </td>
                                            <td>
                                                <Field
                                                    name="userHpRtoCharges"
                                                    component={this.TextInput2}
                                                    variant="outlined"
                                                    disabled={enableForm}
                                                    normalize={onlyNumber}
                                                    onChange={(e, newval, preval) => { this.setState({ hp_rto: newval }); this.setState({ hp_rto_shd: newval }); this.props.change("shdHpRtoCharges", newval); this.checkHp(newval) }}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td>
                                                <Field
                                                    name="userHpRtoCharges"
                                                    component={this.DisabledTextInput}
                                                    variant="outlined"
                                                    disabled={true}
                                                    normalize={onlyNumber}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td  >
                                                {/* <button type="button" disabled={true} className="btn btn-success" onClick={this.setHpCheck}>Add to CP</button>
                                                <button type="button" disabled={true} className="btn btn-danger" onClick={this.UnsetHpCheck}>Clear CP</button> */}
                                            </td>
                                        </tr>
                                        {/* <tr>
                                            <td style={{ paddingTop: "15px" }}>NOC Charges</td>
                                            <td>
                                                <Field
                                                    name="userNocCharges"
                                                    component={this.TextInput2}
                                                    variant="outlined"
                                                    disabled={true}
                                                    normalize={onlyNumber}
                                                    onChange={(e, newval, preval) => { this.setState({ noc: newval }); this.checkNoc(newval) }}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td>
                                                <Field
                                                    name="shdNocCharges"
                                                    component={this.TextInput2}
                                                    variant="outlined"
                                                    normalize={onlyNumber}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td>
                                                <button type="button" disabled={true} className="btn btn-success" onClick={this.setNocCheck}>Add to CP</button>
                                                <button type="button" disabled={true} className="btn btn-danger" onClick={this.UnsetNocCheck}>Clear CP</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingTop: "15px" }}>Vehicle Condition</td>
                                            <td>
                                                <Field
                                                    name="userVehicleCondition"
                                                    component={this.TextInput2}
                                                    variant="outlined"
                                                    disabled={true}
                                                    normalize={onlyNumber}
                                                    onChange={(e, newval, preval) => { this.setState({ vehicle: newval }); this.checkVc(newval) }}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td>

                                                <Field
                                                    name="shdVehicleCondition"
                                                    component={this.TextInput2}
                                                    variant="outlined"
                                                    normalize={onlyNumber}
                                                    onChange={(e, newval, preval) => { this.setState({ vehicle: newval }); this.setVcCheck(newval) }}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td>
                                                <button type="button" disabled={true} className="btn btn-success" onClick={this.setVcCheck}>Add to CP</button>
                                                <button type="button" disabled={true} className="btn btn-danger" onClick={this.UnsetVcCheck}>Clear CP</button>
                                            </td>
                                        </tr>
                                        <tr >
                                            <td style={{ paddingTop: "15px" }}>Miscellaneous</td>
                                            <td style={{ padding: "0px !important" }}>
                                                <Field
                                                    name="userMiscellaneous"
                                                    component={this.TextInput2}
                                                    variant="outlined"
                                                    disabled={true}
                                                    normalize={onlyNumber}
                                                    onChange={(e, newval, preval) => { this.setState({ misc: newval }); this.checkMis(newval) }}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td>
                                                <Field
                                                    name="shdMiscellaneous"
                                                    component={this.TextInput2}
                                                    variant="outlined"
                                                    disabled={true}
                                                    normalize={onlyNumber}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td>
                                                <button type="button" disabled={enableForm} className="btn btn-success" onClick={this.setMisCheck}>Add to CP</button>
                                                <button type="button" disabled={enableForm} className="btn btn-danger" onClick={this.UnsetMisCheck}>Clear CP</button>
                                            </td>

                                        </tr> */}
                                        <tr >
                                            <td style={{ paddingTop: "23px" }}>Doc QC2 Charges</td>
                                            <td style={{ padding: "0px !important" }}>
                                                <Field
                                                    name="docQc2Deductions"
                                                    component={this.DisabledTextInput}
                                                    variant="outlined"
                                                    disabled={true}
                                                    normalize={onlyNumber}
                                                    // onChange={(e, newval, preval) => { this.setState({ misc: newval }); this.checkMis(newval) }}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                            <td style={{ padding: "0px !important" }}>
                                                <Field
                                                    name="docQc2Deductions"
                                                    component={this.DisabledTextInput}
                                                    variant="outlined"
                                                    disabled={true}
                                                    normalize={onlyNumber}
                                                    // onChange={(e, newval, preval) => { this.setState({ misc: newval }); this.checkMis(newval) }}
                                                    style={{ width: '300px' }}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Row>
                                    <Col md={3} >
                                        <p style={{ marginLeft: '20px' }} >Comments</p>
                                    </Col>
                                    <Col md={9} >
                                        <Field
                                            name="comments"
                                            minRows={6}
                                            disabled={enableForm}
                                            style={{ width: '535px', marginLeft: '-40px' }}
                                            component="textarea"
                                            // onChange={(e)=>this.characters(e.target.value)}
                                            onChange={this.handleTextarea.bind(this)}
                                            maxLength="600"
                                        />
                                        <small className="float-right" style={chars_left == 0 ? { color: 'red', paddingRight: "30px" } : { paddingRight: "30px" }}>{chars_left} Characters left </small>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        {/* <Card style={{ border: "1px solid #DCDCDC", borderRadius: '0%' }}>
                            <CardHeader style={{ backgroundColor: "#111328", color: "white" }}>CMS Plus Additions ( Only Channel Partner )
                            </CardHeader>
                            <CardBody>
                                <Row style={{ paddingLeft: '15px' }}>
                                    <Col style={{ paddingTop: "15px" }} md={3}>
                                        CMS Plus cost
                                    </Col>
                                    <Col md={3}>
                                        <Field
                                            name="credrPlusAmount"
                                            component={this.TextInput}
                                            variant="outlined"
                                            disabled={enableForm}
                                            normalize={onlyNumber}
                                            onChange={(e, newval, preval) => { this.setState({ cms: newval }); this.checkPreCms(newval) }}
                                            style={{ width: '300px', marginLeft: "-20px" }}
                                        />
                                    </Col>
                                    {
                                        showErr &&
                                        <Col style={{ paddingTop: "15px", color: "red" }} md={6}>
                                            CMS Plus cost cannot be less than {precms}
                                        </Col>
                                    }
                                </Row>
                            </CardBody>
                        </Card> */}
                        <Card style={{ border: "1px solid #DCDCDC", borderRadius: '0%' }}>
                            <CardHeader style={{ backgroundColor: "#111328", color: "white" }}>Totals
                            </CardHeader>
                            <CardBody>
                                <Row style={{ paddingLeft: '15px' }}>
                                    <Col className="rowstyle" md={3}>
                                        <b>Highest Bid</b>
                                    </Col>
                                    <Col className="rowstyle" style={{ marginTop: "-15px" }} md={3}>
                                        <p style={{ paddingTop: "15px", marginLeft: "-20px" }}>
                                            {
                                                getAmount(viewData.highestBid)
                                            }
                                        </p>
                                    </Col>
                                </Row>
                                <Row style={{ paddingLeft: '15px' }}>
                                    <Col className="rowstyle" md={4}>

                                    </Col>
                                    <Col className="rowstyle" style={{ marginLeft: "-50px" }} md={4}>
                                        For Customer
                                    </Col>
                                    <Col className="rowstyle" md={4}>
                                        For Channel Partner
                                    </Col>
                                </Row>
                                {/* <Row style={{ paddingLeft: '15px' }}>
                                    <Col className="rowstyle" md={4}>
                                        <Row>
                                            <Col md={8}>
                                                <b>Total Additions</b>
                                            </Col>
                                            <Col md={2}>
                                                <span><Add style={{ color: '#3CB371' }} /></span>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="rowstyle lables"  style={{ marginLeft: "-50px" }}  md={4}>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            defaultValue="NA"
                                            variant="filled"
                                            style={{ backgroundColor: "#E8E8E8" }}
                                        />
                                    </Col>
                                    <Col className="rowstyle lables" md={4}>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            value={getAmount(this.totalAddShd())}
                                            variant="filled"
                                            style={{ backgroundColor: "#E8E8E8" }}
                                        />
                                    </Col>
                                </Row> */}
                                <Row style={{ paddingLeft: '15px' }}>
                                    <Col className="rowstyle " md={4}>
                                        <Row>
                                            <Col md={8}>
                                                <b>Total Deductions</b>
                                            </Col>
                                            <Col md={2}>
                                                <span><Remove color="secondary" /></span>
                                            </Col>
                                        </Row>

                                    </Col>
                                    <Col className="rowstyle lables" style={{ marginLeft: "-50px" }} md={4}>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            value={getAmount(this.totalDeductionCom())}
                                            variant="filled"
                                            style={{ backgroundColor: "#E8E8E8" }}
                                        />
                                    </Col>
                                    <Col className="rowstyle lables" md={4}>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            value={getAmount(this.totalDeductionShd())}
                                            variant="filled"
                                            style={{ backgroundColor: "#E8E8E8" }}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ paddingLeft: '15px' }}>
                                    <Col className="rowstyle" md={4}>
                                        <Row>
                                            <Col md={8}>
                                                <b>Final amount</b>
                                            </Col>
                                            <Col md={2}>
                                                <button style={{ borderRadius: '100%', marginLeft: '3px', border: '2px solid #1589FF', height: "20px", width: "20px", textAlign: "center", fontWeight: "bold", color: "#1589FF", backgroundColor: "white", padding: '0px', pointerEvents: 'none' }}>=</button>
                                            </Col>
                                        </Row>

                                    </Col>
                                    <Col className="rowstyle lables" style={{ marginLeft: "-50px" }} md={4}>
                                        <TextField
                                            variant="filled"
                                            disabled
                                            id="outlined-disabled"
                                            value={getAmount(this.finalAmtCom())}
                                            style={{ backgroundColor: "#FEE7CC" }}
                                        />
                                    </Col>
                                    <Col className="rowstyle lables" md={4}>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            value={getAmount(this.finalAmtShd())}
                                            variant="filled"
                                            style={{ backgroundColor: "#FEE7CC" }}
                                        />
                                    </Col>

                                </Row>
                            </CardBody>
                        </Card>
                        <DialogActions>
                            {!enableForm && finalcomamt > 0 && finalshdcmt > 0 &&
                                <button className="float-right subbtn" >Submit</button>
                            }
                            {
                                finalcomamt < 0 &&
                                <h6 style={{ color: "red", textAlign: "center" }}>Negative value detected for Final Amount!</h6>
                            }
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }


}

const mapStateToProps = (props) => ({
})

Commission = connect(mapStateToProps)(withRouter(Commission))

export default reduxForm({
    form: 'commission_form',
})(Commission)
