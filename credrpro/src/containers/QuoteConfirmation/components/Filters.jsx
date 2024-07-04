import React from 'react'
import filterImg from '../../../shared/img/icons/filter-icon.svg'
import DropDown from '../../../shared/components/form/DropDown';
import { DatePicker, Loader } from 'rsuite'
import { disableDates } from '../../../core/utility/stringUtility'
import './style.scss'

export default function Filter({
  startTime,
  endTime,
  onClearFilters,
  isFilterLoading,
  onApplyFilters,
  onEndDateChange,
  onStartDateChange,
  status,
  onStatusChange,
  onChangeCity,
  city,
  resetFilters,
  onDateTypeChange,
  dateType,
  pendingDateType,
  onAgentChange,
  agentList,
  agent,
  cityList,
  followupDateType,
  unAssignedDateType,
  onApplyOnGoing,
  onGoingStatus,
  statusTypes,
  filterStatus,
  onGoingStatusType,
  onGoingStatVal,
  dropDateType,
  soldDateType
}) {

  const retDateType = (status)=> {
    if(status === 'UNASSIGNED') return unAssignedDateType
    if(status === 'PENDING') return pendingDateType
    if(status === 'FOLLOWUP') return followupDateType
    if(status === 'DROP') return dropDateType
    if(status === 'SOLD') return soldDateType
  }

  const getStatusValue = () => {
    if(status === 'PENDING' || status === 'FOLLOWUP') return true
    else return false 
  }

  return (
    <div className="cpp-filter-container" style={{ flexWrap: 'nowrap' }}>
      {
        isFilterLoading &&
        <Loader
          backdrop
          vertical
          content="Filter Loading..."
          style={{ zIndex: 9999 }}
          size="md"
        />
      }
      <div className="filter-icon">
        <img src={filterImg} alt="Filter Icon" className="filter-img" />
        <p className="filter-name">Filters</p>
      </div>
      <div className="cpp-filter-options filterOptions">
        <div className="date-filter-container">
          {getStatusValue() &&
            <div className="filter-container">
              <DropDown
                placeholder="Select Status"
                value={filterStatus}
                options={statusTypes}
                onChange={onStatusChange}
              />
            </div>
          }
          <div className="filter-container">
            <DropDown
              placeholder="Select Date Type"
              value={dateType}
              options={retDateType(status)}
              onChange={onDateTypeChange}
            />
          </div>
          {/* <p className="from">From</p> */}
          <div className="calendar-conatiner">
            <DatePicker
              placeholder='From Date'
              value={startTime}
              block
              format="DD-MMM-YYYY"
              cleanable={false}
              oneTap
              ranges={[]}
              onChange={onStartDateChange}
              disabledDate={date => disableDates('', endTime, date)}
            />
          </div>
          {/* <p className="to">To</p> */}
          <div className="calendar-conatiner">
            <DatePicker
              placeholder='To Date'
              value={endTime}
              block
              format="DD-MMM-YYYY"
              cleanable={false}
              oneTap
              ranges={[]}
              onChange={onEndDateChange}
              disabledDate={date => disableDates(startTime, '', date)}
            />
          </div>
          <div className="filter-container">
            <DropDown
              options={cityList}
              value={city}
              placeholder="Select City"
              onChange={onChangeCity}
            />
          </div>
          {
            status && status !== 'UNASSIGNED' &&
            <div className="filter-container">
              <DropDown
                placeholder="Select Agent"
                value={agent}
                options={agentList}
                onChange={onAgentChange}
              />
            </div>
          }
          <div className="filter-container">
            <button className="font-regular" style={{ marginRight: 15, color: '#ffffff', padding: '8px 20px', borderRadius: '22px', backgroundColor: '#4DBD74', border: '1px solid #35AC5E' }} onClick={onApplyFilters}>Apply</button>
            <button className="font-regular" onClick={resetFilters} style={{ border: '#DEDEDE', backgroundColor: '1px solid #E8E8E8', color: '#333333', padding: '8px 20px', borderRadius: '22px' }}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  )
}
