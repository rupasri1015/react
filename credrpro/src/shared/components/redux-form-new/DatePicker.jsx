import React, { FC } from 'react'
import { FormGroup, InputGroup, DatePicker, FormControl, ControlLabel } from 'rsuite'
import moment from 'moment'


const disableDates = (min, max, date) => {
  if (min && max) {
    if (moment(date).isSameOrAfter(min, "date") && moment(date).isSameOrBefore(max, "date")) {
      return false
    }
    return true
  } else {
    if (max) {
      if (moment(date).isSameOrBefore(max, "date")) {
        return false
      }
      return true
    }
    if (min) {
      if (moment(date).isSameOrAfter(min, "date")) {
        return false
      }
      return true
    }
    return false
  }
}

const CustomInput = ({ placeholder, input, disabled, dateFormat, max, min, cleanable }) => (
  <DatePicker
    block
    oneTap
    disabledDate={date => disableDates(min, max, date)}
    ranges={[]}
    cleanable={cleanable}
    placeholder={placeholder}
    {...input}
    disabled={disabled}
    format={dateFormat}
    placement="autoVerticalStart"
  />
)

const DatePickerInput = (props) => {
  const { placeholder = "Input", meta, input, label, disabled, dateFormat = "DD/MM/YYYY", max, min, cleanable } = props
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <InputGroup inside style={{ width: '100%' }}>
        <FormControl
          accepter={CustomInput}
          placeholder={placeholder}
          input={input}
          disabled={disabled}
          dateFormat={dateFormat}
          // errorMessage={meta?.touched && meta.error}
          min={min}
          max={max}
          cleanable={cleanable}
        />
      </InputGroup>
    </FormGroup>
  )
}

export default DatePickerInput