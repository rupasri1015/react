import React, { useState } from 'react'
import DatePicker from '../../../shared/components/form/DatePicker'
import CityDropDown from '../../../shared/components/form/CityDropDown'
import DropDown from '../../../shared/components/form/DropDown'
import { Button } from 'reactstrap'
import { setNotification } from '../../../redux/actions/notificationAction'
import { useDispatch } from 'react-redux'
import { getDatePayload } from '../../../core/utility'

const pendingDateTypeOption = [
    {
        value: 'PickedUpDate',
        label: 'Picked Up Date'
    },
]
const compDateTypeOption = [
    {
        value: 'PickedUpDate',
        label: 'Picked Up Date'
    },
    {
        value: 'InCustodyDate',
        label: 'In Custody Date'
    },
]

const Filter = ({
    onApplyFilters, dateType, fromDate, toDate, city, source, onDateTypeChange, onFromDateChange,
    onToDateChange, onCityChange, onShowroomChange, onClearFilters, status
}) => {

    const sourceOptions = [
        { value: 'ADIY', label: 'ADIY' },
        { value: 'OEM', label: 'OEM' },
        { value: 'CDIY', label: 'CDIY' }
    ]
    const dispatch = useDispatch()

    const applyFilters = () => {
        const payload = {}
        payload.tabType= status;
        let isValid = true
        if (dateType) {
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
            else if (!fromDate && !toDate) {
                isValid = false
                dispatch(setNotification('danger', 'Invalid Selection', 'Dates Required.'))
            }
        }
        if (city) {
            payload.cityId = city.value
        }
        if (source) {
            payload.source = source.value
        }
        if (Object.keys(payload).length && isValid) {
            onApplyFilters(payload)
        }
    }

    return (
        <div className='assign-runner-filter-container mt-3'>
            <div className="filter-title">Filters</div>
            <DropDown
                placeholder="Select Date Type"
                options={status === "PENDING" ? pendingDateTypeOption : compDateTypeOption}
                onChange={onDateTypeChange}
                value={dateType}
                className="dropdown-wraper"
            />
            <div className="from-date">
                <p>From</p>
                <DatePicker
                    onDateChange={onFromDateChange}
                    max={toDate}
                    startDate={fromDate}
                />
            </div>
            <div className="from-date">
                <p>To</p>
                <DatePicker
                    onDateChange={onToDateChange}
                    min={fromDate}
                    startDate={toDate}
                />
            </div>
            <CityDropDown
                onCityChange={onCityChange}
                value={city}
                className="dropdown-wraper"
            />
            <DropDown
                placeholder="Select Source"
                options={sourceOptions}
                onChange={onShowroomChange}
                value={source}
                className="dropdown-wraper"
            />
            <Button color="success" type="button" className="rounded no-margin" onClick={applyFilters}>Apply</Button>
            <Button className="rounded no-margin" type="button" onClick={onClearFilters}>Clear</Button>
        </div>
    )
}

export default Filter