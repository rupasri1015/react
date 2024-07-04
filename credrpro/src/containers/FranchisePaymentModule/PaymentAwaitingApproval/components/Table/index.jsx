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
import { getDate, getAmount, getYear, capaitalize, renderString } from '../../../../../core/utility'
import NoResultFound from '../../../../../shared/components/NoResultFound'

const columns = [
  { id: 'orderID', label: 'Order ID' },
  { id: 'paymentDate', label: 'Payment Date' },
  { id: 'assignedDate', label: 'Assigned Date' },
  { id: 'cityName', label: "City" },
  { id: 'storeName', label: 'Showroom' },
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'mmv', label: 'MMV - Year' },
  { id: 'cfp', label: 'Credr Franchise Price' },
  { id: 'paymentApproval', label: 'Payment Approval' },
  { id: 'paymentMade', label: 'Payment Made' },
  { id: 'pendingAmount', label: 'Pending Amount' },
  { id: 'viewUTRReceipt', label: 'View UTR Receipt' },
]

class AwaitingApproval extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    let payload = { page: 1, paymentstatus: 'AWAITING' }
    dispatch(getFranchisePaymentList(payload))
  }

  pageChange = (pageNum) => {
    const { page, onPageChange } = this.props
    if (page !== pageNum) {
      onPageChange(pageNum)
    }
  }

  render() {
    const { paymentsTableDataList, total, page, awaitingViewUtr } = this.props
    return (
      <div>
        <h4 className="countHeader"> {`${`Total Records: ${total}`}`} </h4>
        <div className="table-wraper marginTopFranchise">
          <Table size="small">
            <TableHead>
              <TableRow>
                {
                  columns.map(column => (
                    <TableCell key={column.id} >
                      {column.label}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Boolean(paymentsTableDataList.length) && paymentsTableDataList.map(AwaitingList => {
                  const {
                    orderID,
                    paymentDate,
                    assigneDate,
                    cityName,
                    storeName,
                    registrationNumber,
                    mmv,
                    year,
                    assignedCfp,
                    amount,
                    remainingAmount,
                    paymentStatus,
                    documentStatus
                  } = AwaitingList
                  return (
                    <TableRow hover tabIndex={-1} key={orderID}>
                      <TableCell>
                        <p> {renderString(orderID)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getDate(paymentDate)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getDate(assigneDate)} </p>
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
                        <p> {renderString(mmv)} - {getYear(year)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(assignedCfp)} </p>
                      </TableCell>
                      <TableCell>
                        {paymentStatus === 'APPROVED' ? <p>Approved </p> : <div>{paymentStatus === "PAYMENT_APPROVAL" ? 'Approval Pending' : capaitalize(paymentStatus)} </div>}
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(amount)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(remainingAmount)} </p>
                      </TableCell>
                      <TableCell>
                        {documentStatus === "UPLOADED" ? <button className="btn-outline--small blue" onClick={() => awaitingViewUtr(orderID)} style={{ cursor: 'pointer' }}>View</button> : <p>Payment Reciept Not Available</p>}
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

export default connect(mapStateToProps)(AwaitingApproval)