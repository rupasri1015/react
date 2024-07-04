import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import { Button } from 'reactstrap';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import "./style.scss"
import { Chip, Dialog, DialogContent } from '@material-ui/core'
import { SelectPicker } from 'rsuite';
import NoResultFound from '../../../shared/components/NoResultFound'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Link } from 'react-router-dom'
import { EditIcon } from '../../../core/utility/iconHelper'
import WorkDialog from './WorkActionPopup'
import { useDispatch } from "react-redux";
import { getPincodeSlots, postPincodeSlots } from '../../../core/services/pincodeMappingSevices'
import { setNotification } from '../../../redux/actions/notificationAction'
import { connect } from 'react-redux'

class TableComponent extends Component {

    state = {
        city: "",
        valUserId: null,
        newSelectedPin: null,
        updatePincodes: [],
        currentPage: 1,
        isSeleted: false,
        username: "",
        openDialog: false,
        workScheduleResult: [],
        workDayResult: [],
        tableData: {},
        isResponse: false,
        openPin:false,
    }

    noResponse = {
        "workScheduleResult": [{
            "ews_mon": false,
            "ews_tue": false,
            "ews_wed": false,
            "ews_thu": false,
            "ews_fri": false,
            "ews_sat": false,
            "ews_sun": false
        }],
        "workDayResult": [
            {
                "ewds_0_1": false,
                "ewds_1_2": false,
                "ewds_2_3": false,
                "ewds_3_4": false,
                "ewds_4_5": false,
                "ewds_5_6": false,
                "ewds_6_7": false,
                "ewds_7_8": false,
                "ewds_8_9": false,
                "ewds_9_10": false,
                "ewds_10_11": false,
                "ewds_11_12": false,
                "ewds_12_13": false,
                "ewds_13_14": false,
                "ewds_14_15": false,
                "ewds_15_16": false,
                "ewds_16_17": false,
                "ewds_17_18": false,
                "ewds_18_19": false,
                "ewds_19_20": false,
                "ewds_20_21": false,
                "ewds_21_22": false,
                "ewds_22_23": false,
                "ewds_23_24": false
            }]
    }
   
    weekDay = [{ "ews_mon": "MON" }, { "ews_tue": "TUE" }, { "ews_wed": "WED" }, { "ews_thu": "THU" }, { "ews_fri": "FRI" }, { "ews_sat": "SAT" }, { "ews_sun": "SUN" }];
    slotTime = ["00:00 - 01:00 AM", "01:00 - 02:00 AM", "02:00 - 03:00 AM", "03:00 - 04:00 AM", "04:00 - 05:00 AM", "05:00 - 06:00 AM", "06:00 - 07:00 AM", "07:00 - 08:00 AM", "08:00 - 09:00 AM", "09:00 - 10:00 AM", "10:00 - 11:00 AM", "11:00 - 12:00 AM", "12:00 - 01:00 PM", "01:00 - 02:00 PM", "02:00 - 03:00 PM", "03:00 - 04:00 PM", "04:00 - 05:00 PM", "05:00 - 06:00 PM", "06:00 - 07:00 PM", "07:00 - 08:00 PM", "08:00 - 09:00 PM", "09:00 - 10:00 PM", "10:00 - 11:00 PM", "11:00 - 12:00 PM"]


    handleDelete = (pincode) => {
        const { onDelete, pincodes } = this.props
        const { valUserId, currentPage, username } = this.state
        let payload = {}
        let updatedPincodes = []
        updatedPincodes = pincodes.filter(item => item !== pincode)
        payload.pinCodes = updatedPincodes
        payload.userId = valUserId
        onDelete(payload, currentPage, username)
    }

    setNewPincode = ((pincode) => {
        const { onDelete, pincodes } = this.props
        this.setState({ newSelectedPin: pincode })

    })

    pageChange = ((pageNum) => {
        this.setState({ isSeleted: false })
        const { onPagechange } = this.props
        this.setState({ currentPage: pageNum })
        onPagechange(pageNum)
    })

    setPincode = (pincodes, city, cityId, userId, userName) => {
        this.setState({ isSeleted: false })
        const { setPincodes } = this.props
        this.setState({ city: city })
        this.setState({ valUserId: userId })
        this.setState({ username: userName })
        let payload = {}
        payload.cityId = cityId
        setPincodes(payload, pincodes)
        this.setState({openPin: true})
    }

    checkPincode = (() => {
        const { onUpdate, pincodes } = this.props
        const { newSelectedPin, valUserId, currentPage } = this.state
        if (pincodes && pincodes.length && !pincodes.includes(newSelectedPin))
            this.setState({ isSeleted: false })
        else
            this.setState({ isSeleted: true })
    })

    handleAdd = (() => {
        this.setState({openPin : false})
        const { onUpdate, pincodes } = this.props
        const { newSelectedPin, valUserId, currentPage, username } = this.state
        let payload = {}
        this.checkPincode()
        if (!pincodes.includes(newSelectedPin)) {
            this.setState({ isSeleted: false })
            if (pincodes && pincodes.length) {
                let updatePincodes = [...pincodes];
                updatePincodes.push(newSelectedPin)
                payload.pinCodes = updatePincodes
                payload.userId = valUserId
                onUpdate(payload, currentPage, username)
            }
            else {
                let updatePincodes = []
                updatePincodes.push(newSelectedPin)
                payload.pinCodes = updatePincodes
                payload.userId = valUserId
                onUpdate(payload, 1, username)
                this.setState({ currentPage: 1 })
            }
        }
        else this.setState({ isSeleted: true, newSelectedPin: null })
    })

    handleResponse = (tableInfo) => {
        const {dispatch} = this.props
        getPincodeSlots(tableInfo.userId)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState({
                        workScheduleResult: Object.keys(apiResponse.workScheduleResult && apiResponse.workScheduleResult.length && apiResponse.workScheduleResult[0])
                            .map(key => ({ day: key, value: apiResponse.workScheduleResult[0][key] })),
                        workDayResult: apiResponse.workDayResult && apiResponse.workDayResult.length && Object.keys(apiResponse.workDayResult[0])
                            .map(key => ({ day: key, value: apiResponse.workDayResult[0][key] }))
                    })
                    this.setState({ openDialog: true, tableData: tableInfo })
                    this.setState({ isResponse: true })
                    dispatch(setNotification("success", "Success", apiResponse.message));
                }
                else {
                    this.setState({
                        workScheduleResult: Object.keys(this.noResponse.workScheduleResult && this.noResponse.workScheduleResult.length && this.noResponse.workScheduleResult[0])
                            .map(key => ({ day: key, value: this.noResponse.workScheduleResult[0][key] })),
                        workDayResult: this.noResponse.workDayResult && this.noResponse.workDayResult.length && Object.keys(this.noResponse.workDayResult[0])
                            .map(key => ({ day: key, value: this.noResponse.workDayResult[0][key] }))
                    })
                    this.setState({ openDialog: true, tableData: tableInfo })
                    this.setState({ isResponse: false })
                    dispatch(setNotification("error", apiResponse.message))
                }
            })
    }
    setIsResponse = (respoVal) => {
        this.setState({ isResponse: respoVal })
    }

    handleCloseDialog = (() => {
        this.setState({ openDialog: false })
    })
    handleClosePinDialog =(()=>{
        this.setState({openPin:false})
    })

    submitSlots = (payload) => {
        const { dispatch } = this.props
        postPincodeSlots(payload)
            .then((apiResponse) => {
                if (apiResponse.isValid) dispatch(setNotification("success", "Success", apiResponse.message));
                else dispatch(setNotification("danger", "Error", apiResponse.message));
                this.setState({ openDialog: false })
            });
    }

    render() {

        const {openPin,city, currentPage, isSeleted, username, openDialog, workScheduleResult, workDayResult, tableData, isResponse } = this.state
        const {userType, data, availablePincodes, pincodes, total } = this.props
        const cellStyle ={ backgroundColor: "#111328", color: "white" }
        return (
            <div>
                <Row>
                    <Col md={7}>
                        <div>
                            <Card className="shadow">
                                <CardContent>
                                    <Table size="small" style={{ height: "50px" }}>
                                        <TableHead>
                                            <TableRow >
                                                <TableCell style={cellStyle}>Valuator Name</TableCell>
                                                <TableCell style={cellStyle}>City</TableCell>
                                                <TableCell align='center' style={cellStyle}>Assigned Pin Codes</TableCell>
                                                {userType !== "DIY_ASSIST" && <TableCell style={cellStyle}>Work Availability</TableCell>}
                                                <TableCell style={cellStyle}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody style={{ overflow: "scroll" }}>
                                            {
                                                data && Boolean(data.length) &&
                                                data.map((value, index) => {
                                                    return (
                                                        <TableRow tabIndex={-1} selected={username === value.userName && username !== ""} key={index}>
                                                            <TableCell >{value.userName}</TableCell>
                                                            <TableCell>{value.cityName}</TableCell>
                                                            <TableCell style={{ textAlign: "center" }} >{value.pinCodes && value.pinCodes.length}</TableCell>
                                                            {userType !== "DIY_ASSIST" && <TableCell >
                                                                <div className='col-4' >
                                                                    <img src={EditIcon} style={{ marginLeft: "30px", cursor: "pointer", width: "15px" }} onClick={() => this.handleResponse(value)} />
                                                                </div>
                                                            </TableCell>}
                                                            <TableCell ><Button id={index} name={index} onClick={() => this.setPincode(value.pinCodes, value.cityName, value.cityId, value.userId, value.userName)} color="primary" >Edit</Button></TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                    <div className="table-paginator" style={{ padding: '15px', paddingBottom: '20px' }}>
                                        {
                                            Boolean(data.length) ?
                                                <Pagination
                                                    showQuickJumper
                                                    className="float-right"
                                                    current={currentPage}
                                                    locale={localeInfo}
                                                    total={total}
                                                    pageSize={10}
                                                    onChange={this.pageChange}
                                                /> :
                                                <NoResultFound />
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {/*  */}
                    </Col>
                    
                    {openPin && 
                    <Col md={5} open={openPin} onClose={this.handleClosePinDialog} >

                        <Card className="shadow">
                            <CardHeader style={{ backgroundColor: "#111328" }} title={<Typography style={{ color: "white" }}>Mapped Pincodes : {city}</Typography>} />
                            <CardContent style={{ height: 'auto' }}>

                                <Row>
                                    <Col md={5}>

                                        <SelectPicker data={availablePincodes} appearance="default" placeholder="Select Pin Code" style={{ width: 224, textAlign: "center" }} onChange={this.setNewPincode} />
                                    </Col>
                                    <Col md={3}>
                                        <Button variant="container" color="success" onClick={this.handleAdd}>Add</Button>
                                    </Col>
                                </Row>
                                <div style={{ paddingTop: "15px" }}>
                                    {pincodes && pincodes.length ? pincodes.map((item) => {
                                        return <Chip label={item} className="pinlabel" onDelete={() => this.handleDelete(item)} />

                                    }) : ""}
                                </div>
                                {
                                    pincodes && pincodes.length && isSeleted ?
                                        <span style={{ color: "red" }}>Pincode Already Exists</span> : ""
                                }
                            </CardContent>
                        </Card>
                    </Col>}
                </Row>
                {
                    openDialog &&
                    <WorkDialog
                        open={openDialog}
                        onClose={this.handleCloseDialog}
                        workScheduleResult={workScheduleResult}
                        workDayResult={workDayResult}
                        weekDay={this.weekDay}
                        slotTime={this.slotTime}
                        onSubmittingSlots={this.submitSlots}
                        tableData={tableData}
                        isResponse={isResponse}
                        isSetResponse={this.setIsResponse}
                    />
                }

            </div>
        )
    }
}
export default connect()(TableComponent)