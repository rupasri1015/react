import React, { useState, createRef, useEffect } from 'react'
import DropDown from '../../../../../shared/components/form/DropDown'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../../../shared/components/form/Search'
import ExportToExcel from '../../../../../shared/components/ExportToExcel'

const options = [{ label: 'Search By Name', value: 'Search By Name' }, { label: 'Search By Registration Number', value: 'Search By Registration Number' }, { label: 'Search By Mobile Number', value: 'Search By Mobile Number' }]

const SearchByKeyword = ({ onApplySearch, onClearSearch, onExportData }) => {

  const [searchType, setSearchType] = useState(null)
  const [searchText, setSearchText] = useState('')
  const searchFieldRef = createRef()

  const applySearch = () => {
    const payload = {}
    if (searchText) {
      if (searchType.value === 'Search By Name') {
        payload.name = searchText
      }
      else if (searchType.value === 'Search By Registration Number') {
        payload.regNumber = searchText
      }
      else {
        payload.mobileNo = searchText
      }
    }
    onApplySearch(payload)
  }

  const changeHandler = (searchData) => {
    setSearchType(searchData)
    setSearchText('')
  }

  const clearSearch = () => {
    setSearchText('')
    setSearchType(null)
    onClearSearch()
  }

  useEffect(() => {
    if (searchType) {
      searchFieldRef.current.focus()
    }
  }, [searchType])

  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border">
        <div className='pending-inventory-filter-container'>
          <h5> Search by Keywords... </h5>
          <div className="from-date mr-2">
            <DropDown
              className="dropdown-wraper"
              options={options}
              placeholder="Select to Search"
              onChange={changeHandler}
              value={searchType}
            />
          </div>
          {
            searchType && <div className="from-date mr-2">
              <SearchField
                value={searchText}
                onSearch={setSearchText}
                onEnter={applySearch}
                onClick={applySearch}
                onClearInput={clearSearch}
                ref={searchFieldRef}
                placeholder={`${searchType.value}`}
                className="number-search with-margin"
                withButton
              />
            </div>
          }
          {/* <div style={{ marginLeft: 'auto' }}>
            <ExportToExcel
              onExportData={onExportData}
            />
          </div> */}
        </div>
      </CardBody>
    </Card>
  )
}

export default SearchByKeyword