import React from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../../../../shared/components/form/Search'

const InventoryHeader = ({ status, onSearch, onStatusUpdate, onSearchType, searchText, onClearRegistrationSearch }) => {
  const getClassName = (tabStatus) => {
    return status.toLowerCase() === tabStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }
  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border">
        <button className={getClassName('pending')} onClick={() => onStatusUpdate('PENDING')}>Pending</button>
        <button className={getClassName('rejected')} onClick={() => onStatusUpdate('REJECTED')}>Rejected</button>
        <button className={getClassName('accepted')} onClick={() => onStatusUpdate('ACCEPTED')}>Accepted</button>
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

export default InventoryHeader