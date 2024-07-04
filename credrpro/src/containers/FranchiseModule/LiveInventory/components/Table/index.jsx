import React, { Component } from 'react'
import { connect } from 'react-redux'
import { liveInventoryList } from '../../../../../redux/actions/franchiseOpsLiveInventoryAction'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { getDate, getAmount, getMmvYear, renderString, getCredrMargin } from '../../../../../core/utility'
import { getRole, PERMISSIONS, getCityID } from '../../../../../core/services/rbacServices'
import NoResultFound from '../../../../../shared/components/NoResultFound'

const columns = [
  { id: 'orderID', label: 'Order ID' },
  { id: 'actualDeliveryDate', label: 'Store Delivered Date' },
  { id: 'cityName', label: 'City' },
  { id: 'storeName', label: 'Showroom' },
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'mmv', label: 'MMV & Year' },
  { id: 'assignedCfp', label: 'CredR Franchise Price Recommended' },
  { id: 'displayPrice', label: 'Customer Selling Price' },
  { id: 'expectedMargin', label: 'Expected Margin' },
  { id: 'credrMargin', label: 'CredR Margin' }
]

class LiveInventory extends Component {

  componentDidMount() {
    const payload = { page: 1, deliveryStatus: "DELIVERED" }
    const { dispatch } = this.props
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    dispatch(liveInventoryList(payload))
  }

  pageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }

  render() {
    const { inventoryList, total, page } = this.props
    return (
      <div>
        <h4 className="countHeader"> {`${`Total Records: ${total}`}`} </h4>
        <div className="table-wraper">
          <Table size="small">
            <TableHead>
              <TableRow>
                {
                  columns.map(column => (
                    <TableCell key={column.id}>
                      {column.label}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Boolean(inventoryList.length) && inventoryList.map(inventory => {
                  const {
                    orderID,
                    storeName,
                    cityName,
                    registrationNumber,
                    mmv,
                    year,
                    assignedCfp,
                    displayPrice,
                    actualDeliveryDate,
                    voucherPrice
                  } = inventory
                  return (
                    <TableRow hover tabIndex={-1} key={orderID}>
                      <TableCell>
                        <p> {renderString(orderID)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getDate(actualDeliveryDate)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(cityName)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(storeName)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(registrationNumber)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getMmvYear(mmv, year)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(assignedCfp)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(displayPrice)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(getCredrMargin(displayPrice, assignedCfp))} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(getCredrMargin(assignedCfp, voucherPrice))} </p>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(inventoryList.length) ?
                <Pagination
                  className="float-right"
                  locale={localeInfo}
                  current={page}
                  total={total}
                  pageSize={15}
                  onChange={this.pageChange}
                /> :
                <NoResultFound />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  inventoryList: state.franchise.inventoryList,
  total: state.franchise.count,
  page: state.franchise.page
})

export default connect(mapStateToProps)(LiveInventory)