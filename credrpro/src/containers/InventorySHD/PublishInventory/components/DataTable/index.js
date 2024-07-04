import React, { Fragment } from 'react'
import InventoryHeader from './Header'
import InventoryTable from './Table'

const InventoryDataTable = ({
  onPageChange,
  onPublishInventory,
  onUnPublishInventory,
  onEditPrice,
  onSearch,
  searchText,
  onSearchType,
  status,
  onStatusChange,
  isRegistrationSearch,
  setStatus,
  onClearRegistrationSearch,
  onShowDetails
}) => (
    <Fragment>
      <InventoryHeader
        onSearch={onSearch}
        searchText={searchText}
        onSearchType={onSearchType}
        status={status}
        onStatusChange={onStatusChange}
        onClearRegistrationSearch={onClearRegistrationSearch}
      />
      <InventoryTable
        status={status}
        setStatus={setStatus}
        onPageChange={onPageChange}
        isRegistrationSearch={isRegistrationSearch}
        onPublishInventory={onPublishInventory}
        onUnPublishInventory={onUnPublishInventory}
        onEditPrice={onEditPrice}
        onShowDetails={onShowDetails}
      />
    </Fragment>
  )

export default InventoryDataTable