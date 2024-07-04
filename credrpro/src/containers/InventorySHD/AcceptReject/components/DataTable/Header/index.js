import React from 'react'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../../../../../shared/components/form/Search'

const InventoryHeader = ({ status, onSearch, onStatusUpdate, onSearchType, searchText, onClearRegistrationSearch }) => {

  const getClassName = (tabStatus) => {
    if (status === 'PENDING_APPROVAL') {
      status = 'PENDING'
    }
    
    // else if(status === 'PUBLISHED'){
    //   status = 'ACCEPTED'
    // }
    return status.toLowerCase() === tabStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue'
  }
  return (
    <Card className="pending-inventory-header">
      <CardBody className="card-shadow square-border">
        <button className={getClassName('pending')} onClick={() => onStatusUpdate('PENDING_APPROVAL')}>Pending</button>
        <button className={getClassName('published')} onClick={() => onStatusUpdate('PUBLISHED')}>Published</button>
        <button className={getClassName('unpublished')} onClick={() => onStatusUpdate('UNPUBLISHED')}>UnPublished</button>
        <button className={getClassName('rejected')} onClick={() => onStatusUpdate('REJECTED')}>Rejected</button>

        <SearchField
          value={searchText}
          onSearch={onSearchType}
          withButton
          onEnter={() => onSearch(searchText)}
          onClick={() => onSearch(searchText)}
          onClearInput={onClearRegistrationSearch}
          placeholder="Search By Registration Number"
          className="float-right"
          style={{ maxWidth: 320 }}
        />
      </CardBody>
    </Card>
  )
}

export default InventoryHeader