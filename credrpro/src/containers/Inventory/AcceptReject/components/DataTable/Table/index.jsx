import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Chip from '@material-ui/core/Chip'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import NoResultFound from '../../../../../../shared/components/NoResultFound'
import { getDate, getBikeName, getKmsDriven, getAmount, capaitalize, renderString } from '../../../../../../core/utility'
import { getInventoryByStatus, resetInventoryByStatus } from '../../../../../../redux/actions/listInventoryAction'
import isEqual from 'lodash/isEqual'

const columns = [
  { id: 'Created Date', label: 'Created\u00a0Date' },
  { id: 'Inspector Name', label: 'Inspector\u00a0Name', },
  { id: 'City', label: 'City' },
  { id: 'Vehicle Details', label: 'Vehicle\u00a0Details', maxWidth: 200 },
  { id: 'Manufacture Date', label: 'Manufacture\u00a0Date' },
  { id: 'Status', label: 'Status' },
  { id: 'Actions', label: 'Actions' }
]

const columnsRejected = [
  { id: 'Created Date', label: 'Created\u00a0Date' },
  { id: 'Rejected Date', label: 'Rejected\u00a0Date' },
  { id: 'Inspector Name', label: 'Inspector\u00a0Name', },
  { id: 'City', label: 'City' },
  { id: 'Vehicle Details', label: 'Vehicle\u00a0Details', maxWidth: 200 },
  { id: 'Manufacture Date', label: 'Manufacture\u00a0Date' },
  { id: 'Status', label: 'Status' }
]

const columnsWithoutAction = [
  { id: 'Created Date', label: 'Created\u00a0Date' },
  { id: 'Inspector Name', label: 'Inspector\u00a0Name', },
  { id: 'City', label: 'City' },
  { id: 'Vehicle Details', label: 'Vehicle\u00a0Details', maxWidth: 200 },
  { id: 'Manufacture Date', label: 'Manufacture\u00a0Date' },
  { id: 'Status', label: 'Status' },
]

class InventoryTable extends Component {

  componentDidMount() {
    const { dispatch, status } = this.props
    dispatch(getInventoryByStatus({ page: 1, status }))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetInventoryByStatus())
  }

  componentDidUpdate(prevProps) {
    const { inventory, setStatus, isRegistrationSearch } = this.props
    if (!isEqual(inventory, prevProps.inventory)) {
      if (isRegistrationSearch && inventory && inventory.length === 1) {
        setStatus(inventory[0].status)
      }
    }
  }

  pageChange = (pageNumber) => {
    const { page, onPageChange } = this.props
    if (page !== pageNumber) {
      onPageChange(pageNumber)
    }
  }

  showDetails = (id) => {
    const { onShowDetails } = this.props
    onShowDetails(id)
  }

  rejectInventory = (rejectData) => {
    const { onRejectInventory } = this.props
    if (onRejectInventory) {
      onRejectInventory(rejectData)
    }
  }

  acceptInventory = acceptData => {
    const { onAcceptInventory } = this.props
    if (onAcceptInventory) {
      onAcceptInventory(acceptData)
    }
  }

  render() {
    const { inventory, page, total, status: pageStatus } = this.props
    return (
      <div className="table-wraper">
        <Table size="small">
          <TableHead>
            <TableRow>
              {pageStatus.toLowerCase() === 'pending' ? (
                columns.map(column => (
                  <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                    {column.label}
                  </TableCell>
                ))
              ) :
                pageStatus.toLowerCase() === 'rejected' ?
                  (
                    columnsRejected.map(column => (
                      <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                        {column.label}
                      </TableCell>
                    ))
                  )
                  : (
                    columnsWithoutAction.map(column => (
                      <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                        {column.label}
                      </TableCell>
                    ))
                  )}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Boolean(inventory.length) && inventory.map((inventoryItem, index) => {
                const {
                  createdDate,
                  inspectedUserName,
                  cityName,
                  bikeMake,
                  bikeModel,
                  bikeVariant,
                  registrationNumber,
                  kmsDriven,
                  inspectedPrice,
                  manufactureDate,
                  status,
                  rejectedDate,
                  id
                } = inventoryItem
                return (
                  <TableRow hover tabIndex={-1} key={`${inventoryItem.id}${index}`}>
                    <TableCell>
                      <p>{getDate(createdDate)}</p>
                    </TableCell>
                    {
                      status && status.toLowerCase() === 'rejected' &&
                      <TableCell>
                        <p>{ getDate(rejectedDate)}</p>
                      </TableCell>
                    }
                    <TableCell>
                      <p>{renderString(inspectedUserName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(cityName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{getBikeName(bikeMake, bikeModel, bikeVariant)}</p>
                      <p>{renderString(registrationNumber)}</p>
                      <p>{getKmsDriven(kmsDriven)}</p>
                      {inspectedPrice ? <p>{getAmount(inspectedPrice)}</p> : <p>NA</p>}
                    </TableCell>
                    <TableCell>
                      <p>{getDate(manufactureDate)}</p>
                    </TableCell>
                    <TableCell>
                      {
                        status ?
                        <Chip
                          label={capaitalize(status)}
                          classes={{ colorPrimary: capaitalize(status) }}
                          color="primary"
                        /> : '-'
                      }
                    </TableCell>
                    {
                      status ? status.toLowerCase() === 'pending' && (
                        <TableCell>
                          <button className="btn-outline--small accept" onClick={() => this.acceptInventory(inventoryItem)}>Accept</button>
                          <button className="btn-outline--small reject" onClick={() => this.rejectInventory(inventoryItem)}>Reject</button>
                          <button className="btn-outline--small blue" onClick={() => this.showDetails(id)}>View Summary</button>
                        </TableCell>
                      )
                      :
                      <TableCell>-</TableCell> 
                    }
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(inventory.length) ?
              <Pagination
                className="float-right"
                locale={localeInfo}
                current={page}
                total={total}
                pageSize={12}
                showQuickJumper
                onChange={this.pageChange}
              /> :
              <NoResultFound />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  inventory: state.inventory.inventoryList,
  page: state.inventory.page,
  total: state.inventory.count
})

export default withRouter(connect(mapStateToProps)(InventoryTable))