import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import SelectField from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import '../../../containers/FranchiseStoreManagerDashboard/GSTPage/gstPage.scss'

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 225,
      // width: '100%',
      // maxWidth: '300px',
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
  label,
  meta: { touched, error },
  children,
  className,
  ...custom
}) => (
    <FormControl className={className} style={{width: '100% !important'}}>
      <InputLabel style={{ color: error && touched ? '#c00' : '' }}>{label}</InputLabel>
      <SelectField
        label={label}
        error={touched && Boolean(error)}
        {...input}
        onChange={(event) => input.onChange(event.target.value)}
        children={children}
        {...custom}
        MenuProps={MenuProps}
        autoWidth={false}
        // className={className}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

export default RenderSelectField