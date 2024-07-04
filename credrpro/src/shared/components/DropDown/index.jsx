import React  from 'react'
import { SelectPicker } from 'rsuite'

export default function DropDown ({value, options, placeholder, onChange}) {
    return(
        <SelectPicker
        value={value}
        data={options}
        block
        maxHeight={140}
        searchable={false}
        placeholder={placeholder}
        onChange={onChange}
        cleanable={false}
      /> 
    )
}