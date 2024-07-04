import React, { FC } from 'react'
import { FormGroup, InputGroup, DatePicker, FormControl, ControlLabel } from 'rsuite'
import moment from 'moment'

const disabledHours = (min, max, hour) => {
  if (min && max) {
    if (min <= hour && max >= hour) {
      return false
    }
    return true
  } else {
    if (max) {
      if (max >= hour) {
        return false
      }
      return true
    }
    if (min) {
      if (min <= hour) {
        return false
      }
      return true
    }
    return false
  }
}

const disabelMinutes = (max, minute, time) => {
  if (max) {
    const hour = Number(moment(time).format('HH'))
    if (hour === max) {
      if (minute) {
        return true
      }
      return false
    } else {
      return false
    }
  }
  return true
}

const handleClose = (max, date, changeCallBack) => {
  if (max && max === Number(Number(moment(date).format('HH')))) {
    const dateDefault = moment().format('DD-MM-YYYY')
    changeCallBack(moment(`${dateDefault} ${max}:00`, 'DD-MM-YYYY HH:mm').toDate())
  }
}

const CustomInput = ({ placeholder, input, disabled, max, min, cleanable }) => (
  <DatePicker
    block
    hideHours={hour => disabledHours(min, max, hour)}
    hideMinutes={(minutes, time) => disabelMinutes(max, minutes, time)}
    ranges={[]}
    onOk={(date) => handleClose(max, date, input.onChange)}
    cleanable={cleanable}
    placeholder={placeholder}
    {...input}
    disabled={disabled}
    format="HH:mm"
    placement="autoVerticalStart"
  />
)

const DatePickerInput = (props) => {
  const { placeholder = "Input", meta, input, label, disabled, max, min, cleanable } = props
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <InputGroup inside style={{ width: '100%' }}>
        <FormControl
          accepter={CustomInput}
          placeholder={placeholder}
          input={input}
          disabled={disabled}
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