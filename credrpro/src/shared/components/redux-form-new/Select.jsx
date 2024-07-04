import React, { FC } from 'react'
import { FormGroup, InputGroup, SelectPicker, FormControl, ControlLabel } from 'rsuite'

const CustomSelect = ({ placeholder, input, options, searchable, disabled, cleanable,groupBy, className }) => (
  <>
  <SelectPicker
    searchable={searchable}
    block
    placeholder={placeholder}
    data={options}
    maxHeight={140}
    disabled={disabled}
    cleanable={cleanable}
    groupBy={groupBy}
    {...input}
    classPrefix={className}
  />
  </>
)

const Select = (props) => {
  const { placeholder = "Select", meta, input, label, options, searchable = true, disabled, cleanable = true, groupBy = '', className } = props
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <InputGroup inside style={{ width: '100%' }}>
        <FormControl
          accepter={CustomSelect}
          placeholder={placeholder}
          input={input}
          options={options}
          disabled={disabled}
          searchable={searchable}
          cleanable={cleanable}
          errorMessage={meta.touched && meta.error}
          groupBy={groupBy}
          classPrefix={className}
        />
      </InputGroup>
    </FormGroup>
  )
}

export default Select