import React from 'react'
import { SearchIcon, SearchIconWhite, CloseIconBlack } from '../../../core/utility/iconHelper'

export default function SearchField ({ style, searchText, onSearch, onClearSearch, onEnter, placeholder, onSearchKeyword }) { 

  const handleEnter = (event) => {
    if(event.key === 'Enter' && onEnter){
      onEnter()
    }
  }

  return (
    <div className="search-field-container" style={style}>
      <input type="text" className="search-field" value={searchText} onChange={e => onSearch(e.target.value)} onKeyPress={handleEnter} placeholder={placeholder} />
      {
        searchText && <div title="Clear" className="clearable" ><img src={CloseIconBlack} style={{ height: 11 }} alt="Clear" onClick={onClearSearch} /></div>
      }
    <button className="search-button" ><img style={{ width: 16 }} src={SearchIconWhite} alt="Search" onClick={onSearchKeyword} /></button> 
    </div>
  )
}
