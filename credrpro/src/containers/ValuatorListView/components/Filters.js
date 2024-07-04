import React, { useState, useEffect } from 'react'
import DropDown from '../../../shared/components/form/DropDown'
import { useDispatch } from 'react-redux'
import { getDatePayload } from '../../../core/utility'
import { setNotification } from '../../../redux/actions/notificationAction'
import Date_Picker from '../../../shared/components/form/DatePicker'
import { Button } from 'reactstrap'
import { getValuatorList, getValuatorDropReasons } from '../../../core/services/valuatorServices'
import CityDropDown from '../../../shared/components/form/CityDropDown'
import moment from 'moment'
import { DatePicker } from 'rsuite'
// import FilterInput from '../../../shared/components/form/FilterInput'

const dateTypes = [
    {
        value: 'SCHEDULE_DATE',
        label: 'Scheduled Date'
    },
    {
        value: 'INSPECTED_DATE',
        label: 'Inspected Date'
    },
    {
        value: 'CREATED_DATE',
        label: 'Created Date'
    },
    {
        value: 'slotDate',
        label: 'Schedule Date(Slot+Time)'
    }
]

const sourceTypes = [
    {
        value: 'OSO',
        label: 'OSO'
    },
    {
        value: 'OEM',
        label: 'OEM'
    }
]

const ValuatorListFilter = (props) => {

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [city, setCity] = useState(null)
    const [dateType, setDateType] = useState(null)
    const [sourceType, setSourceType] = useState(null)
    const [valuatorsList, setValuatorsList] = useState([])
    const [valuator, setValuator] = useState('')
    const [callCount, setCallcount] = useState(null)
    const [dropReasonList, setDropReasonList] = useState([])
    const [dropReason, setDropReason] = useState('')
    const [startTime, setStartTime] = useState('')
    const [slotDate, setStartDate] = useState('')
    const [endTime, setEndTime] = useState('')
    const [toslotDate, setToslotDate] = useState('')
    
    const dispatch = useDispatch()

    useEffect(() => {
        getValuatorDropReasons()
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    let dropList = apiResponse.crmStatusBean.map(reason => {
                        return {
                            value: reason.statusId,
                            label: reason.statusName
                        }
                    })
                    setDropReasonList(dropList)
                }
            })
    }, [])

    const clearFilters = () => {
        setFromDate(null)
        setToDate(null)
        setCity(null)
        setDateType(null)
        setValuatorsList([])
        setValuator('')
        setCallcount('')
        setDropReason('')
        setSourceType(null)
        setStartTime('')
        setStartDate('')
        setEndTime('')
        setToslotDate('')
        props.onClearFilters()
    }

    const cityChangeHandler = city => {
        setCity(city)
        getValuatorList(city.value)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    let valList = apiResponse.userList.map(user => {
                        return {
                            value: user.userId,
                            label: user.userFirstName
                        }
                    })
                    setValuatorsList(valList)
                }
            })
    }

    const applyFilter = () => {
        const payload = {}
        let isValid = true
        if (city) {
            payload.cityId = city.value
        }
        if (dateType) {
            if(dateType.value==="INSPECTED_DATE")
            {
                props.onChangeStatus('INSPECTED')
            }
            if (dateType.value !== 'slotDate')
                payload.dateType = dateType.value
            if (fromDate && toDate) {
                payload.fromDate = getDatePayload(fromDate)
                payload.toDate = getDatePayload(toDate)
            } else if (fromDate || toDate) {
                isValid = false
                if (fromDate) {
                    dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'))
                } else {
                    dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'))
                }
            }
        }
        if (valuator) {
            payload.valuatorId = valuator.value
        }
        if (callCount) {
            payload.callCount = callCount
        }
        if (dropReason) {
            payload.dropReason = dropReason.value
        }
        if (sourceType) {
            payload.bikeType = sourceType.value
        }
        if (slotDate && toslotDate) {
            if (startTime && endTime) {
                let endSlot = endTime && endTime.startsWith('00') ? endTime.replace('00', '12').toUpperCase() : endTime.toUpperCase()
                payload.startTime = startTime.startsWith('00') ? startTime.replace('00', '12').toUpperCase() : startTime.toUpperCase()
                payload.endTime = endSlot.toUpperCase()
            }
            else {
                if (endTime === '') {
                    dispatch(setNotification('danger', 'Invalid Selection', 'Select Slot End Time'))
                }
                if (startTime === '') {
                    dispatch(setNotification('danger', 'Invalid Selection', 'Select Slot Start Time'))
                }
            }
            payload.fromSlotDate = moment(slotDate).format('YYYY-MM-DD')
            payload.toSlotDate = moment(toslotDate).format('YYYY-MM-DD')
        }
        else {
            dispatch(setNotification('danger', 'Invalid Selection', 'Select Slot Dates'))
        }
        if (Object.keys(payload).length && isValid) {
            props.onApplyFilter(payload)
        }
    }

    const onDateTypeChange = dateTypeData => {
        setDateType(dateTypeData)
    }

    const onInspectionTypeChange = sourceTypeData => {
        setSourceType(sourceTypeData)
    }

    const onValuatorChange = outletData => {
        setValuator(outletData)
    }

    // const onCallCountChange = (e) => {
    //     let onlyNumbers = e.target.value.replace(/[^\d]/g, '')
    //     onlyNumbers.replace(/(?!^)+/g, '')
    //     let val = onlyNumbers.slice(0, 7)
    //     setCallcount(val)
    // }

    const onDropChange = dropData => {
        setDropReason(dropData)
    }

    const handleFromDate = (fromDate) => {
        setStartDate(fromDate)
    }
    const handleToDate = (toDate) => {
        setToslotDate(toDate)
    }

    const handleStartTimeChange = newTime => {
        setStartTime(newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))
    }

    const handleSEndTimeChange = newTime => {
        setEndTime(newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))
    }


    return (
        <div className="pending-inventory-filter-container mt-3">
            <div className="filter-title">Filters</div>
            <CityDropDown
                placeholder="Select City"
                onCityChange={cityChangeHandler}
                value={city}
                className="dropdown-wraper"
            />
            <DropDown
                placeholder="Select Date Type"
                options={dateTypes}
                onChange={onDateTypeChange}
                value={dateType}
                className="dropdown-wraper"
            />
            <DropDown
                placeholder="Select Inspection Type"
                options={sourceTypes}
                onChange={onInspectionTypeChange}
                value={sourceType}
                className="dropdown-wraper"
            />
            {
                dateType && dateType.value !== 'slotDate' &&
                <>
                    <div className="from-date">
                        <p>From</p>
                        <Date_Picker
                            onDateChange={setFromDate}
                            max={toDate}
                            startDate={fromDate}
                        />
                    </div>
                    <div className="from-date">
                        <p>To</p>
                        <Date_Picker
                            onDateChange={setToDate}
                            min={fromDate}
                            startDate={toDate}
                        />
                    </div>
                </>

            }
            {
                dateType && dateType.value === 'slotDate' &&
                <>
                    <div className="from-date" >
                        {/* <DatePicker
                            value={slotDate}
                            block
                            format="DD-MMM-YYYY"
                            cleanable={false}
                            oneTap
                            ranges={[]}
                            onChange={handleFromDate}
                        /> */}
                         <Date_Picker
                            onDateChange={handleFromDate}
                            // min={slotDate}
                            startDate={slotDate}
                        />
                    </div>
                    <div className="from-date ml-2" >
                        <DatePicker format="HH:mm A" ranges={[]} style={{ width: 200,zIndex:"0" }} showMeridian onChange={handleStartTimeChange} placeholder='Select Start Time' />
                    </div>
                    <div className="from-date" >
                        {/* <DatePicker
                        min={slotDate}
                            value={toslotDate}
                            block
                            format="DD-MMM-YYYY"
                            cleanable={false}
                            oneTap
                            ranges={[]}
                            onChange={handleToDate}
                        /> */}
                         <Date_Picker
                            onDateChange={handleToDate}
                            min={slotDate}
                            startDate={toslotDate}
                        />
                    </div>
                    <div className=" from-date ml-3" >
                        <DatePicker format="HH:mm A" ranges={[]} style={{ width: 200,zIndex:"0" }} showMeridian onChange={handleSEndTimeChange} placeholder='Select End Time' />
                    </div>
                </>
            }
            <div>
                <DropDown
                    placeholder="Select Valuator"
                    onChange={onValuatorChange}
                    options={valuatorsList}
                    value={valuator}
                    className="dropdown-wraper"
                />
            </div>

            {/* <FilterInput 
                onChange={(e) => onCallCountChange(e)}
                style={{ maxWidth: 220, marginRight: 15 }}
                placeholder="Enter Call Count"
                value={callCount}
            /> */}
            <DropDown
                placeholder="Select Drop Reasons"
                onChange={onDropChange}
                options={dropReasonList}
                value={dropReason}
                className="dropdown-wraper"
            />
            <Button color="success" type="button" className="rounded no-margin" onClick={applyFilter}>Apply</Button>
            <Button className="rounded no-margin" type="button" onClick={clearFilters}>Clear</Button>
        </div>
    )
}

export default ValuatorListFilter