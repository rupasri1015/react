import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import SelectField from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import Autocomplete from '@material-ui/lab/Autocomplete';
import './select.scss'

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 225
    },
  },

  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  }
}

const RenderSelectField = ({
  input,
  value,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
    <FormControl className='w-100'>
      <InputLabel style={{ color: error && touched ? '#c00' : '' }}>{label}</InputLabel>
      <SelectField
        value={value}
        className="outlinedSelectwrap"
        label={label}
        error={touched && Boolean(error)}
        {...input}
        onChange={(event) => input.onChange(event.target.value)}
        children={children}
        {...custom}
        MenuProps={MenuProps}
        variant="outlined"
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

export default RenderSelectField