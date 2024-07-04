import React, { FC } from 'react'
import { FormGroup, InputGroup, Input, FormControl, ControlLabel } from 'rsuite'

const CustomInput = ({ placeholder, input, type, disabled, rows, className }) => (
  <Input
    placeholder={placeholder}
    {...input}
    type={type}
    autoComplete="off"
    disabled={disabled}
    componentClass="textarea"
    rows={rows}
    classPrefix={className}
  />
)

const InputWithLabel = (props) => {
  const { placeholder = "Input", meta, input, type = "text", label, disabled, rows = 3, className } = props
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <InputGroup inside style={{ width: '100%' }}>
        <FormControl
          accepter={CustomInput}
          placeholder={placeholder}
          input={input}
          type={type}
          disabled={disabled}
          rows={rows}
          errorMessage={meta.touched && meta.error}
          classPrefix={className}
        />
      </InputGroup>
    </FormGroup>
  )
}

export default InputWithLabel