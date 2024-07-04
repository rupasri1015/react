import React, { FC } from 'react'
import { FormGroup, InputGroup, InputNumber, FormControl, ControlLabel } from 'rsuite'

interface Meta {
  touched: boolean;
  error: string;
}

interface ComponentProps {
  input: any;
  placeholder: string;
  meta?: Meta;
  label?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

const CustomInput: FC<ComponentProps> = ({ placeholder, input, disabled, max, min }) => (
  <InputNumber
    scrollable={false}
    style={{ width: '100%' }}
    max={max}
    min={min}
    placeholder={placeholder}
    autoComplete="off"
    disabled={disabled}
    {...input}
  />
)

const InputWithLabel: FC<ComponentProps> = (props: ComponentProps) => {
  const { placeholder = "Input", meta, input, label, disabled, min = Infinity, max = Infinity } = props
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <InputGroup inside style={{ width: '100%' }}>
        <FormControl
          accepter={CustomInput}
          placeholder={placeholder}
          input={input}
          max={max}
          min={min}
          disabled={disabled}
          errorMessage={meta?.touched && meta.error}
        />
      </InputGroup>
    </FormGroup>
  )
}

export default InputWithLabel