import React, { useState, createRef, useEffect } from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../../shared/components/form/Search'

const SearchRegistrationNumber = ({ onApplySearch, onClearSearch }) => {

  const [searchText, setSearchText] = useState('')
  const searchFieldRef = createRef()
  
  const applySearch = () => {
    const payload = {}
    if (searchText) {
        payload.regNumber = searchText
    }
    onApplySearch(payload)
  }

  const clearSearch = () => {
    setSearchText('')
    onClearSearch()
  }

  return (
    <Card className="pending-inventory-header">
    <CardBody className="card-shadow square-border">
        <div className='pending-inventory-filter-container'>
        {/* <h5> Search by Keywords... </h5> */}
          <div className="from-date mr-2">
              <SearchField
                value={searchText}
                onSearch={setSearchText}
                onEnter={applySearch}
                onClick={applySearch}
                onClearInput={clearSearch}
                placeholder='Search By Reg Number'
                className="number-search with-margin"
                ref={searchFieldRef}
                withButton
              />
            </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default SearchRegistrationNumber