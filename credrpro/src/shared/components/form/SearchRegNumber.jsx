

import React from 'react'
import SearchField from './Search'

const SearchRegNum = ({ onSearch, onSearchType, searchText, onClearSearch, placeHolder }) => {

  return (
    <SearchField
      value={searchText}
      onSearch={onSearchType}
      withButton
      onEnter={() => onSearch(searchText)}
      onClick={() => onSearch(searchText)}
      onClearInput={onClearSearch}
      placeholder={placeHolder}
      style={{ maxWidth: 250 }}
    />
  )
}

export default SearchRegNum;