import React, { Component } from 'react'
import { connect } from 'react-redux'
import PublishedInventory from './PublishedInventory'
import UnPublishedInventory from './UnpublishInventory'
import { getInventoryByStatus, resetInvetory } from '../../../../../../redux/actions/publishInventoryAction'
import isEqual from 'lodash/isEqual'

class InventoryTable extends Component {

  componentDidMount() {
    const { dispatch, status } = this.props
    dispatch(getInventoryByStatus({ page: 1, status }))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetInvetory())
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
  inventory: state.publishInventory.inventoryList,
  page: state.publishInventory.page,
  total: state.publishInventory.count
})

export default connect(mapStateToProps)(InventoryTable)