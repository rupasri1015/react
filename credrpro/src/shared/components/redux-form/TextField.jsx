import React from 'react'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'

const RenderTextField = ({
  input,
  label,
  multiline,
  row,
  className,
  meta: { touched, error },
  ...custom
}) => (
    <FormControl className='w-100'>
      <TextField
      className={className}
        rows={row}
        multiline={multiline}
        label={label}
        autoComplete="off"
        error={touched && Boolean(error)}
        {...input}
        {...custom}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

export default RenderTextField