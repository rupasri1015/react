import { Card, CardActions, CardContent, CardHeader, Dialog, DialogContent} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'reactstrap'
import './style.scss'
import { getAmount } from '../../../core/utility'
import { useDispatch } from "react-redux";
import { setNotification } from '../../../redux/actions/notificationAction'
import { onlyNumber } from '../../../core/utility/inputNormalizers'
import { updateCustomerDetails } from '../../../core/services/miscServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { Error, Height } from '@material-ui/icons'
import { getPincodeSlots, postPincodeSlots } from '../../../core/services/pincodeMappingSevices'
import { getUserID } from '../../../core/services/rbacServices'

export default function index({ open, onClose, name, city, workScheduleResult, workDayResult, slotTime, weekDay, onSubmittingSlots, tableData, isResponse,isSetResponse }) {

    const [updatedName, setUpdatedName] = useState(name);
    const [updatedCity, setUpdatedCity] = useState(city);
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState(false);
    const [scheduleBool, setScheduleBool] = useState(false);
    const [days, setDay] = useState(workScheduleResult)
    const [time, setTime] = useState(workDayResult)


    useEffect(() => {
        setScheduleBool(false)
    }
        , [scheduleBool])

    const handleAdd = () => {
        let payload = {}
        const finalDayInfo = days.reduce(
            (obj, item) => Object.assign(obj, { [item.day]: item.value }), {});
        const finalSlotsInfo = time.reduce(
            (obj, item) => Object.assign(obj, { [item.day]: item.value }), {});
        payload = { ...finalDayInfo, ...finalSlotsInfo, userId: tableData.userId }
        let nameReg = /^[a-zA-Z ]*$/
        let cityReg = /^[a-zA-Z ]*$/

        if (!nameReg.test(updatedName)) {
            setIsError(true);
            setErrorText("Invalid Name");
        }
        else if (!cityReg.test(updatedCity)) {
            setIsError(true);
            setErrorText("Invalid City");
        }
        else {
            onSubmittingSlots(payload)
        }
    };
    const handleName = (e) => {
        setUpdatedName(e.target.value)
    }
    const handleEmail = (e) => {
        setUpdatedCity(e.target.value)
    }

    const toggleDayChange = (day, value) => {
        let dayIndex = days.findIndex((dy => dy.day === day));
        days[dayIndex].value = !value
        setScheduleBool(true)
    }
    const toggleTimeChange = (day, value) => {
        let timeIndex = time.findIndex((ti => ti.day === day))
        time[timeIndex].value = !value
        setScheduleBool(true)
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogContent className="dialog" style={{ padding: "0 20px" }} >
                    <Card className="Card" style={{ boxShadow: "none" }}>
                        <CardHeader
                            title={<p className="headerText">Work Availability</p>}
                        />
                        <CardContent >
                            <div className="row">
                                <div className="col-5 text-left">Valuator Name : </div>
                                <div className="col-7 ">
                                    {tableData.userName}
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-5 text-left">City : </div>
                                <div className="col-7">
                                    {tableData.cityName}
                                </div>
                            </div>
                            {isError && (
                                <div className="row" >
                                    <div className="errorDiv">
                                        <div style={{ padding: "0px 5px" }}>
                                            <Error style={{ width: "15px" }} />
                                            {errorText}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                   {
                    isResponse ? 
                    <>
                    <Card className='Card' style={{ margin: "10px 0" }}>
                        <CardContent>
                            <div className="row">
                                <div className="col-2 text-left">Working Days: </div>
                                {
                                    days && Boolean(days.length) && days.map((li, index) => {
                                        return (
                                            <Button color={li.value ? "success" : "danger"} key={index} className='col-1'
                                                style={{ margin: "2px" }}
                                                onClick={() => toggleDayChange(li.day, li.value)}>

                                                {`${Object.values(weekDay[index])}`}
                                            </Button>
                                        )
                                    })
                                }

                            </div>
                        </CardContent>
                    </Card>
                    <Card className='Card'>
                        <CardContent>
                            <div className="row">
                                <div className="col-2 text-left">Working Slots: </div>
                                <div
                                    className='col-5 container WorkingSlot'>
                                    {
                                        time && Boolean(time) && time.map((li, index) => {
                                            return (
                                                <Button key={index} color={li.value ? "success" : "danger"} className="slotButton"
                                                    onClick={() => toggleTimeChange(li.day, li.value)}>
                                                    {`${slotTime[index]}`}</Button >
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div style={{ textAlign: "center" }}>
                        <Button
                            color="primary"
                            className="addpricebtn"
                            style={{ borderRadius: "5rem", width: "25%" }}
                            onClick={handleAdd}
                        >
                            SUBMIT
                        </Button>
                    </div>
                </> : 
            <Card className='Card' style={{ margin: "10px 0" }}>
                <CardContent style={{display:"flex", justifyContent:"space-between",width:"40em",alignItems:"center",padding:'16px'}}>
                    <Alert severity='error' >No entry is available for this valuator </Alert >
                    <Button color ="primary"
                    style={{ borderRadius: "5rem", width: "25%" }}
                    onClick ={()=> isSetResponse(true)}
                    >ADD</Button>
                </CardContent>
            </Card>
                   }
                </DialogContent>
            </Dialog>

        </div>
    )
}
