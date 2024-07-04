import React, { FC } from 'react'
import { FormGroup, InputGroup, Input, Icon, FormControl, ControlLabel } from 'rsuite'
import { IconNames } from 'rsuite/lib/Icon'

const CustomInput= ({ placeholder, input, type, disabled ,className}) => (
  <>
  <Input placeholder={placeholder} {...input} type={type} autoComplete="off" disabled={disabled} classPrefix={className} />
  </>
)

const InputWithLabel = (props) => {
  const { placeholder = "Input", icon, meta, input, type = "text", label, disabled, className } = props
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <InputGroup inside style={{ width: '100%' }} classPrefix={className}>
        <FormControl
          accepter={CustomInput}
          placeholder={placeholder}
          input={input}
          type={type}
          disabled={disabled}
          errorMessage={meta?.touched && meta.error}
          // 
        />
        {
          icon &&
          <InputGroup.Addon>
            <Icon icon={icon} />
          </InputGroup.Addon>
        }
      </InputGroup>
    </FormGroup>
  )
}

export default InputWithLabel