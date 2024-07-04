import React, { Component } from 'react'
import { connect } from 'react-redux'
import PublishedInventory from './PublishInventory'
import UnPublishedInventory from './UnpublishInventory'
import { getInventoryByStatusShd, resetInventoryByStatusShd } from '../../../../../../redux/actions/listinventoryShdAction'
import isEqual from 'lodash/isEqual'

class InventoryTable extends Component {

  componentDidMount() {
    const { dispatch, status } = this.props
    dispatch(getInventoryByStatusShd({ page: 1, status, isShdBike: true }))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetInventoryByStatusShd())
  }

  componentDidUpdate(prevProps) {
    const { inventory, setStatus, isRegistrationSearch } = this.props
    if (!isEqual(inventory, prevProps.inventory)) {
      if (isRegistrationSearch && inventory && inventory.length === 1) {
        setStatus(inventory[0].status)
      }
    }
  }

  render() {
    const {
      inventory,
      page,
      total,
      onPageChange,
      onPublishInventory,
      onUnPublishInventory,
      onEditPrice,
      status,
      onShowDetails
    } = this.props
    return (
      status.toLowerCase() === 'published' ?
        <PublishedInventory
          inventory={inventory}
          page={page}
          total={total}
          status={status}
          onPageChange={onPageChange}
          onUnPublishInventory={onUnPublishInventory}
          onEditPrice={onEditPrice}
          showDetails={onShowDetails}
        />
        : status.toLowerCase() === 'unpublished' &&
        <UnPublishedInventory
          inventory={inventory}
          page={page}
          total={total}
          showDetails={onShowDetails}
          onPageChange={onPageChange}
          onPublishInventory={onPublishInventory}
        />
    )
  }
}

const mapStateToProps = (state) => ({
  inventory: state.inventoryShd.inventoryList,
  page: state.inventoryShd.page,
  total: state.inventoryShd.count
})

export default connect(mapStateToProps)(InventoryTable)