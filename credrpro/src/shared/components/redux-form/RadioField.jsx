import React from 'react'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

const RenderRadioField = ({
  input,
  label,
  children,
  meta: { touched, error }
}) => (
    <FormControl component="fieldset">
      <FormLabel error={Boolean(touched && error)} classes={{ focused: 'focus-color' }}>{label}</FormLabel>
      <RadioGroup
        onChange={(event) => input.onChange(event.target.value)}
        row
        value={input.value}
        children={children}
      />
      <FormHelperText style={{ color: '#c00', margin: 0 }}>{touched && error}</FormHelperText>
    </FormControl>
  )

export default RenderRadioField