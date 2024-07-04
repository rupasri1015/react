import React from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from './form/Search'
import ExportToExcel from './ExportToExcel'

const SearchRegNum = ({ onSearch, onSearchType, searchText, onClearSearch, onExport, onShowExport }) => (
  <Card className="pending-inventory-header">
    <CardBody className="card-shadow square-border" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SearchField
        value={searchText}
        onSearch={onSearchType}
        withButton
        onEnter={() => onSearch(searchText)}
        onClick={() => onSearch(searchText)}
        onClearInput={onClearSearch}
        placeholder="Search By Registration Number"
        style={{ maxWidth: 250 }}
      />
      {/* {
        onShowExport &&
        <ExportToExcel
          onExportData={onExport}
        />
      } */}
    </CardBody>
  </Card>
)

export default SearchRegNum