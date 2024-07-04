import React, { Fragment } from 'react'
import InventoryHeader from './Header'
import InventoryTable from './Table'

const InventoryDataTable = ({
  onPageChange,
  onShowDetails,
  isRegistrationSearch,
  onSearch,
  onAcceptInventory,
  onRejectInventory,
  onClose,
  onSearchType,
  searchText,
  status,
  onStatusUpdate,
  setStatus,
  onClearRegistrationSearch,
  onRefreshPage
}) => (
    <Fragment>
      <InventoryHeader
        onSearch={onSearch}
        searchText={searchText}
        onSearchType={onSearchType}
        status={status}
        onStatusUpdate={onStatusUpdate}
        onClearRegistrationSearch={onClearRegistrationSearch}
      />
      <InventoryTable
        status={status}
        setStatus={setStatus}
        onPageChange={onPageChange}
        onShowDetails={onShowDetails}
        isRegistrationSearch={isRegistrationSearch}
        onAcceptInventory={onAcceptInventory}
        onRejectInventory={onRejectInventory}
        onClose={onClose}
        onRefreshPage={onRefreshPage}
      />
    </Fragment>
  )

export default InventoryDataTable