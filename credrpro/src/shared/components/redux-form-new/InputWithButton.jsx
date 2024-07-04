import React, { FC } from 'react'
import { FormGroup, InputGroup, Input, Icon, FormControl } from 'rsuite'
import { IconNames } from 'rsuite/lib/Icon'

const CustomInput = ({ placeholder, input, type }) => (
  <Input placeholder={placeholder} {...input} type={type} autoComplete="off" />
)

const InputWithButton = (props) => {
  const { placeholder = "Input", icon = "user", meta, input, type = "text", onButtonClick } = props
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
        <InputGroup.Button onClick={onButtonClick}>
          <Icon icon={icon} />
        </InputGroup.Button>
      </InputGroup>
    </FormGroup>
  )
}

export default InputWithButton