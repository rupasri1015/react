import React, { forwardRef } from 'react'
import classname from 'classnames'

const FilterInput = forwardRef(({ onChange, value, onEnter, className, style, onClick, ...rest },ref)=>{
  
  const optionChange = (option) => {
    if (onChange) {
      onChange(option)
    }
  }

  return (
    <div className={classname("search-field-container", className)} style={style}>
      <input type="text" className="search-field" value={value} ref={ref} onChange={optionChange} {...rest} />
    </div>
  )
})


export default FilterInput