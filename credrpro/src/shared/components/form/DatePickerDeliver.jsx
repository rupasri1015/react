import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import { CalenderIcon } from '../../../core/utility/iconHelper'

const CalenderInput = React.forwardRef((props, ref) => (
  <div className="date-picker-input-container" ref={ref} onClick={props.onClick}>
    <input type="text" className="date-picker-input" placeholder={props.label || "Select Date"} value={props.value} readOnly />
    <img src={CalenderIcon} className="calender-icon" alt="calender-icon" />
  </div>
))

class DatePickerField extends PureComponent {

  handleChange = (date) => {
    const { onDateChange } = this.props
    if (onDateChange) {
      onDateChange(date)
    }
  }

  render() {
    const { max, min, startDate, placeholder } = this.props

    return (
      <div className="date-pickerr">
        <DatePicker
          selected={startDate}
          onChange={this.handleChange}
          dateFormat="dd-MMMM-yyyy"
          dropDownMode="select"
          maxDate={max}
          minDate={min}
          customInput={<CalenderInput label={placeholder}/>}
        />
      </div>
    );
  }
}

export default DatePickerField
