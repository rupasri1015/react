import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import DatePicker from '../form/MaterialDate'
import FormHelperText from '@material-ui/core/FormHelperText'

const RenderSelectField = ({
  input,
  label,
  min,
  max,
  showMonth,
  showYear,
  meta: { touched, error },
  children,
  ...custom
}) => (
    <FormControl className='w-100'>
      <DatePicker
        label={label}
        {...input}
        min={min}
        max={max}
        showMonth={showMonth}
        showYear={showYear}
        error={touched && Boolean(error)}
        onDateChange={(date) => input.onChange(date)}
        {...custom}
      />
      <FormHelperText style={{ color: '#c00' }}>{touched && error}</FormHelperText>
    </FormControl>
  )

export default RenderSelectField