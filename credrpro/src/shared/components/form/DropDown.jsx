import React, { Component } from 'react'
import Select from 'react-select'
import classname from 'classnames'

class DropDown extends Component {

  optionChange = (option) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(option)
    }
  }

  render() {
    const { value, className, placeholder, options, searchable, id } = this.props
    return (
      <div className={classname("city-dropdown-container", className)}>
        <Select
          options={options}
          classNamePrefix="city-dropdown"
          placeholder={placeholder}
          onChange={this.optionChange}
          value={value}
          isSearchable={searchable}
        />
      </div>
    )
  }
}

export default DropDown