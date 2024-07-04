import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DatePicker from '../../../shared/components/form/DatePickerValuator'
import { renderString } from '../../../core/utility'
import { makeStyles } from '@material-ui/core/styles'
import DropDown from '../../../shared/components/form/DropDown'
import moment from 'moment'
import { getUserID } from '../../../core/services/rbacServices'
import Select from 'react-select'
import classname from 'classnames'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

const TIME_SLOTS = [
    { value: '12:00 AM - 01:00 AM', label: '12:00 AM - 01:00 AM' },
    { value: '01:01 AM - 02:00 AM', label: '01:01 AM - 02:00 AM' },
    { value: '02:01 AM - 03:00 AM', label: '02:01 AM - 03:00 AM' },
    { value: '03:01 AM - 04:00 AM', label: '03:01 AM - 04:00 AM' },
    { value: '04:01 AM - 05:00 AM', label: '04:01 AM - 05:00 AM' },
    { value: '05:01 AM - 06:00 AM', label: '05:01 AM - 06:00 AM' },
    { value: '06:01 AM - 07:00 AM', label: '06:01 AM - 07:00 AM' },
    { value: '07:01 AM - 08:00 AM', label: '07:01 AM - 08:00 AM' },
    { value: '08:01 AM - 09:00 AM', label: '08:01 AM - 09:00 AM' },
    { value: '09:01 AM - 10:00 AM', label: '09:01 AM - 10:00 AM' },
    { value: '10:01 AM - 11:00 AM', label: '10:01 AM - 11:00 AM' },
    { value: '11:01 AM - 12:00 PM', label: '11:01 AM - 12:00 PM' },
    { value: '12:00 PM - 01:00 PM', label: '12:00 PM - 01:00 PM' },
    { value: '01:01 PM - 02:00 PM', label: '01:01 PM - 02:00 PM' },
    { value: '02:01 PM - 03:00 PM', label: '02:01 PM - 03:00 PM' },
    { value: '03:01 PM - 04:00 PM', label: '03:01 PM - 04:00 PM' },
    { value: '04:01 PM - 05:00 PM', label: '04:01 PM - 05:00 PM' },
    { value: '05:01 PM - 06:00 PM', label: '05:01 PM - 06:00 PM' },
    { value: '06:01 PM - 07:00 PM', label: '06:01 PM - 07:00 PM' },
    { value: '07:01 PM - 08:00 PM', label: '07:01 PM - 08:00 PM' },
    { value: '08:01 PM - 09:00 PM', label: '08:01 PM - 09:00 PM' },
    { value: '09:01 PM - 10:00 PM', label: '09:01 PM - 10:00 PM' },
    { value: '10:01 PM - 11:00 PM', label: '10:01 PM - 11:00 PM' },
    { value: '11:01 PM - 12:00 AM', label: '11:01 PM - 12:00 AM' },
]

const RescheduleDialog = ({ isOpen, onClose, data, onSubmitReshedule }) => {

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [dateError, setDateError] = useState(false)
    const [timeError, setTimeError] = useState(false)
    const classes = useStyles();

    const handleDateChange = (dateTypeData) => {
        setDate(dateTypeData)
        setDateError(false)
    }

    const handleTimeChange = newTime => {
        setTime(newTime)
        setTimeError(false)
    }

    const handleSubmit = () => {
        if (date === '') {
            setDateError(true)
        }
        if (time === '') {
            setTimeError(true)
        }
        if (date && time) {
            const payload = {
                leadId: data.leadId,
                reScheduleDate: moment(date).format('YYYY-MM-DD'),
                reScheduleTime: time.value,
                updatedBy: getUserID(),
                type: 'RESCHEDULE',
            }
            onSubmitReshedule(payload)
        }
    }

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} disableEscapeKeyDown maxWidth="sm" fullWidth>
                <DialogTitle>Re-Schedule <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
                <DialogContent>
                    <div className="doc-image-conatiner">
                        <p className="labelText">New Date:</p>
                        <DatePicker
                            onDateChange={handleDateChange}
                            startDate={date}
                        >
                            {/* {
                            availableSlots && availableSlots.length ? availableSlots.filter(dateTimeSlot => dateTimeSlot.slots.length)
                              .map(slot => <MenuItem value={slot.date} key={slot.date}> {slot.date} </MenuItem>) : []
                          } */}
                        </DatePicker>
                    </div>
                    {
                        dateError && <p style={{ color: 'red' }}> *Please Select New Date</p>
                    }
                    <div className="doc-image-conatiner">
                        <p className="labelText">New Time:</p>
                        <div className='row' style={{ width: '44%', marginLeft: '54px', }}>
                            <div className="slot-dropdown-container">
                                <Select
                                    options={TIME_SLOTS}
                                    classNamePrefix="slot-dropdown"
                                    placeholder='Select Time'
                                    onChange={handleTimeChange}
                                    value={time}
                                    isSearchable={true}
                                    className="dropdown-wraper"
                                />
                            </div>
                            {/* <DropDown
                                placeholder="Select Time"
                                options={TIME_SLOTS}
                                onChange={handleTimeChange}
                                value={time}
                                className="dropdown-wraper"
                            /> */}
                        </div>
                    </div>
                    {
                        timeError && <p style={{ color: 'red' }}> *Please Select New Time </p>
                    }
                    <div className="doc-image-conatiner">
                        <p className="name">Current Date:</p>
                        <p> {data.dateAndSlot && data.dateAndSlot !== null && data.dateAndSlot.split(' : ')[0]} </p>
                    </div>
                    <div className="doc-image-conatiner">
                        <p className="name">Current Time:</p>
                        <p> {data.dateAndSlot && data.dateAndSlot !== null && data.dateAndSlot.split(' : ')[1]} </p>
                    </div>
                    <div className="doc-image-conatiner">
                        <p className="name">Valuator:</p>
                        <p> {renderString(data.customerName)} </p>
                    </div>
                    <div className="doc-image-conatiner">
                        <p className="name">Pincode:</p>
                        <p> {renderString(data.pincode)} </p>
                    </div>
                    <div className="doc-image-container">
                        <button className="btn-outline--small blue float-right" onClick={handleSubmit}>Confirm</button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RescheduleDialog