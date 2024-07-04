import React, { FC } from 'react'
import { FormGroup, RadioGroup, FormControl, ControlLabel } from 'rsuite'

interface Meta {
  touched: boolean;
  error: string;
}

interface ComponentProps {
  input: any;
  meta?: Meta;
  label?: string;
}

const RadioInput: FC<ComponentProps> = props => {
  const { meta, input, label, children } = props
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <FormControl
        accepter={RadioGroup}
        value={input.value}
        onChange={input.onChange}
        name={input.name}
        inline
        errorMessage={meta?.touched && meta.error}
      >
        {children}
      </FormControl>
    </FormGroup>
  )
}

export default RadioInput