import React, { CSSProperties, FC } from 'react'
import { FormGroup, InputGroup, Input, FormControl, ControlLabel } from 'rsuite'

interface Meta {
  touched: boolean;
  error: string;
}

interface ComponentProps {
  buttonText?: string;
  input: any;
  label?: string;
  placeholder: string;
  meta?: Meta;
  type: string;
  onButtonClick?(value: any | undefined): void;
}

const ButtonStyles: CSSProperties = {
  border: "solid 1px #d92128",
  backgroundColor: "#d92128",
  color: "#ffffff",
  fontFamily: "ProximaNovaSemibold"
}

const CustomInput: FC<ComponentProps> = ({ placeholder, input, type }) => (
  <Input placeholder={placeholder} {...input} type={type} autoComplete="off" />
)

const InputWithButton: FC<ComponentProps> = (props: ComponentProps) => {
  const { placeholder = "Input", buttonText, label, meta, input, type = "text", onButtonClick } = props
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <InputGroup inside style={{ width: '100%' }}>
        <FormControl
          accepter={CustomInput}
          placeholder={placeholder}
          input={input}
          type={type}
          errorMessage={meta?.touched && meta.error}
        />
        <InputGroup.Button style={ButtonStyles} onClick={() => onButtonClick && onButtonClick(input?.value)}>
          {buttonText}
        </InputGroup.Button>
      </InputGroup>
    </FormGroup>
  )
}

export default InputWithButton