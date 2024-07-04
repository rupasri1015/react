import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFranchisePaymentList } from '../../../../../redux/actions/franchisePaymentListAction'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { getDate, getYear, renderString } from '../../../../../core/utility'
import NoResultFound from '../../../../../shared/components/NoResultFound'
import { getRole, PERMISSIONS, getCityID } from '../../../../../core/services/rbacServices'

const columns = [
  { id: 'orderID', label: 'Order ID' },
  { id: 'assignedDate', label: 'Assigned Date' },
  { id: 'storeName', label: 'Showroom' },
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'mmv', label: 'MMV - Year' },
]

class PendingPayment extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    let payload = { page: 1, paymentstatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    dispatch(getFranchisePaymentList(payload))
  }

  pageChange = (pageNum) => {
    const { page, onPageChange } = this.props
    if (page !== pageNum) {
      onPageChange(pageNum)
    }
  }

  render() {
    const { paymentsTableDataList, total, page } = this.props
    return (
      <div>
        <h4 className="countHeader"> {`${`Total Records: ${total}`}`} </h4>
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
                Boolean(paymentsTableDataList.length) && paymentsTableDataList.map(paymentList => {
                  const {
                    orderID,
                    assigneDate,
                    storeName,
                    registrationNumber,
                    mmv,
                    year,
                  } = paymentList
                  return (
                    <TableRow hover tabIndex={-1} key={orderID}>
                      <TableCell>
                        <p> {renderString(orderID)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getDate(assigneDate)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(storeName)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(registrationNumber)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(mmv)} - {getYear(year)} </p>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(paymentsTableDataList.length) ?
                <Pagination
                  className="float-right"
                  current={page}
                  total={total}
                  pageSize={15}
                  locale={localeInfo}
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
  paymentsTableDataList: state.franchisePaymentList.paymentsTableDataList,
  total: state.franchisePaymentList.count,
  page: state.franchisePaymentList.page
})

export default connect(mapStateToProps)(PendingPayment)