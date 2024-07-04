import React, { PureComponent } from 'react'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import FormControl from '@material-ui/core/FormControl'
import { CalenderIcon } from '../../../core/utility/iconHelper'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import moment from 'moment'

const Adornment = () => (
  <InputAdornment position="end">
    <img
      src={CalenderIcon}
      className="MuiSvgIcon-root"
      style={{ width: 24, height: 24 }}
      alt="Calendar"
    />
  </InputAdornment>
)

const CalenderInput = React.forwardRef((props, ref) => (
  <FormControl className="w-100" ref={ref}>
    <InputLabel error={props.error}>{props.placeholder}</InputLabel>
    <Input
      type="text"
      error={props.error}
      onClick={props.onClick}
      value={props.value}
      endAdornment={<Adornment value={props.value} onButtonClick={props.onClearDate} />}
    />
  </FormControl>
))

class DatePickerField extends PureComponent {

  handleChange = (date) => {
    const { onDateChange } = this.props
    if (onDateChange) {
      onDateChange(date)
    }
  }

  render() {
    const { label, value, error } = this.props
    return (
      <div className="date-picker">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            style={{ width: '100%' }}
            value={value ? value : null}
            variant="dialog"
            onChange={this.handleChange}
            clearable
            disableFuture
            autoOk
            TextFieldComponent={
              ({ inputProps, onClick, inputRef }) =>
                <CalenderInput
                  {...inputProps}
                  onClick={onClick}
                  error={error}
                  value={value ? moment(value).format('DD-MM-YYYY') : ''}
                  placeholder={label}
                  inputRef={inputRef}
                />
            }
            views={["year", "month", "date"]}
          />
        </MuiPickersUtilsProvider>
      </div>
    )
  }
}

export default DatePickerField
