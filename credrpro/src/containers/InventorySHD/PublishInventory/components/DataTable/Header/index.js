import React from 'react'
import { withRouter } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../../../../shared/components/form/Search'

const InventoryHeader = ({ onSearch, status, onStatusChange, searchText, onSearchType, onClearRegistrationSearch }) => {

  const getClassName = (tabStatus) => {
    return status.toLowerCase() === tabStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }

  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border">
        <button className={getClassName('published')} onClick={() => onStatusChange('PUBLISHED')}>Published</button>
        <button className={getClassName('unpublished')} onClick={() => onStatusChange('UNPUBLISHED')}>Unpublished</button>
        <SearchField
          value={searchText}
          onSearch={onSearchType}
          withButton
          onEnter={() => onSearch(searchText)}
          onClick={() => onSearch(searchText)}
          onClearInput={onClearRegistrationSearch}
          placeholder="Search By Registration Number"
          className="float-right"
          style={{ maxWidth: 220 }}
        />
      </CardBody>
    </Card>
  )
}

export default withRouter(InventoryHeader)