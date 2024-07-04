import React, { FC } from 'react'
import { FormGroup, InputGroup, Input, Icon, FormControl } from 'rsuite'
import { IconNames } from 'rsuite/lib/Icon'

const CustomInput = ({ placeholder, input, type }) => (
  <Input placeholder={placeholder} {...input} type={type} autoComplete="off" />
)

const InputWithIcon = (props) => {
  const { placeholder = "Input", icon = "user", meta, input, type = "text" } = props
  return (
    <FormGroup>
      <InputGroup inside style={{ width: '100%' }}>
        <FormControl
          accepter={CustomInput}
          placeholder={placeholder}
          input={input}
          type={type}
          errorMessage={meta?.touched && meta.error}
        />
        <InputGroup.Addon>
          <Icon icon={icon} />
        </InputGroup.Addon>
      </InputGroup>
    </FormGroup>
  )
}

export default InputWithIcon