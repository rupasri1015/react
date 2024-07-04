import React, { useState } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import NoResultFound from '../../../../../../shared/components/NoResultFound'
import action from '../../../../../../shared/img/icons/action-icon.svg'
import { getDate, getBikeName, getKmsDriven, getAmount, capaitalize, renderString } from '../../../../../../core/utility'

const columns = [
  { id: 'Created Date', label: 'Created\u00a0Date' },
  { id: 'Published Date', label: 'Published\u00a0Date' },
  { id: 'Inspector Name', label: 'Inspector\u00a0Name' },
  { id: 'Outlet Name', label: 'Outlet\u00a0Name' },
  { id: 'City', label: 'City' },
  { id: 'Vehicle Detail', label: 'Vehicle\u00a0Detail', maxWidth: 200 },
  { id: 'Manufacture Date', label: 'Manufacture\u00a0Date' },
  { id: 'Status', label: 'Status' },
  { id: 'View Details', label: 'View Details' },
  { id: 'Actions', label: 'Actions' }
]

const PublishedInventory = ({ inventory, page, total, onPageChange, onUnPublishInventory, onEditPrice, showDetails }) => {

  const [anchorElement, setElement] = useState(null)
  const [inventoryState, setInventory] = useState(null)

  const pageChange = (pageNumber) => {
    if (page !== pageNumber) {
      onPageChange(pageNumber)
    }
  }

  const setAnchorElement = (anchorTag = null, inventoryData = null) => {
    setElement(anchorTag)
    setInventory(inventoryData)
  }

  const unpublishInventory = () => {
    if (onUnPublishInventory) {
      onUnPublishInventory(inventoryState)
    }
    setAnchorElement()
  }

  const editPrice = () => {
    if (onEditPrice) {
      onEditPrice(inventoryState)
    }
    setAnchorElement()
  }

  return (
    <div className="table-wraper">
      <Table size="small">
        <TableHead>
          <TableRow>
            {
              columns.map(column => (
                <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                  {column.label}
                </TableCell>
              ))
            }
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
                price,
                manufactureDate,
                status,
                storeName,
                publishedDate,
                id
              } = inventoryItem
              return (
                <TableRow hover tabIndex={-1} key={`${inventoryItem.id}${index}`}>
                  <TableCell>
                    <p>{getDate(createdDate)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{getDate(publishedDate)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{renderString(inspectedUserName)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{renderString(storeName)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{renderString(cityName)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{getBikeName(bikeMake, bikeModel, bikeVariant)}</p>
                    <p>{renderString(registrationNumber)}</p>
                    <p>{getKmsDriven(kmsDriven)}</p>
                    {<p>{getAmount(price)}</p>}
                  </TableCell>
                  <TableCell>
                    <p>{getDate(manufactureDate)}</p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={capaitalize(status)}
                      classes={{ colorPrimary: capaitalize(status) }}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <button className="btn-outline--small blue" onClick={() => showDetails(id)}>View&nbsp;Summary</button>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <img src={action} id={id} alt="Action" role="button" className="action-icon" onClick={(e) => setAnchorElement(e.currentTarget, inventoryItem)} />
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={() => setAnchorElement()}
      >
        <MenuItem onClick={unpublishInventory}>Un-Publish</MenuItem>
        <MenuItem onClick={editPrice}>Edit Price</MenuItem>
      </Menu>
      <div className="table-paginator">
        {
          Boolean(inventory.length) ?
            <Pagination
              className="float-right"
              current={page}
              total={total}
              pageSize={12}
              showQuickJumper
              onChange={pageChange}
              locale={localeInfo}
            /> :
            <NoResultFound />
        }
      </div>
    </div>
  )
}

export default PublishedInventory