import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { getDate, getAmount, getMmvYear, renderString, getCredrMargin } from '../../../../../../core/utility'
import { getRole, PERMISSIONS, getCityID } from '../../../../../../core/services/rbacServices'
import NoResultFound from '../../../../../../shared/components/NoResultFound'
import { getPendingAssignList } from '../../../../../../redux/actions/pendingAssignListAction'

class AssignedData extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    const payload = { page: 1, acceptedStatus: 'ACCEPTED' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    dispatch(getPendingAssignList(payload))
  }

  tableHeader = () => {
    if (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole()) || PERMISSIONS.FRANCHISE_ADMIN.includes(getRole())) {
      return [
        { id: 'orderID', label: 'Order ID' },
        { id: 'assignedDate', label: 'Assigned Date' },
        { id: 'registrationNumber', label: 'Registration Number' },
        { id: 'mmv', label: 'MMV & Year' },
        { id: 'cityName', label: 'City' },
        { id: 'assignedStore', label: 'Assigned Store' },
        { id: 'cfp', label: 'Minimum CFP' },
        { id: 'AssignedCfp', label: 'Assigned CFP' },
        { id: 'assignedCrp', label: 'Assigned CRP' },
        { id: 'expectedDeliveryDate', label: 'Expected Delivery Date' },
        { id: 'voucherPriceCfp', label: 'CredR Margin' },
        { id: 'reAssign', label: 'Reassign' }
      ]
    }
    else {
      return [
        { id: 'orderID', label: 'Order ID' },
        { id: 'assignedDate', label: 'Assigned Date' },
        { id: 'registrationNumber', label: 'Registration Number' },
        { id: 'mmv', label: 'MMV & Year' },
        { id: 'assignedStore', label: 'Assigned Store' },
        { id: 'cfp', label: 'Minimum CFP' },
        { id: 'AssignedCfp', label: 'Assigned CFP' },
        { id: 'assignedCrp', label: 'Assigned CRP' },
        { id: 'expectedDeliveryDate', label: 'Expected Delivery Date' },
        { id: 'reAssign', label: 'Reassign' }
      ]
    }
  }

  pageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }

  render() {
    const { pendingList, total, page, onReAssignToStore } = this.props

    return (
      <div>
        <div className="countHeader">{`Total Records: ${total}`}</div>
        <div className="table-wraper mt-2">
          <Table size="small">
            <TableHead>
              <TableRow>
                {
                  this.tableHeader().map(column => (
                    <TableCell key={column.id}>
                      {column.label}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Boolean(pendingList.length) && pendingList.map(pending => {
                  const {
                    orderID,
                    assigneDate,
                    registrationNumber,
                    mmv,
                    year,
                    cfp,
                    cityName,
                    storeName,
                    assignedCfp,
                    assignedCrp,
                    expectedDeliveryDate,
                    voucherPrice,
                    paymentModeStaus
                  } = pending
                  return (
                    <TableRow hover tabIndex={-1} key={orderID}>
                      <TableCell>
                        <p> {renderString(orderID)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getDate(assigneDate)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(registrationNumber)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getMmvYear(mmv, year)} </p>
                      </TableCell>
                      {
                        (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole()) || PERMISSIONS.FRANCHISE_ADMIN.includes(getRole())) &&
                        <TableCell>
                          <p> {renderString(cityName)} </p>
                        </TableCell>
                      }
                      <TableCell>
                        <p> {renderString(storeName)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(cfp)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(assignedCfp)}</p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(assignedCrp)}</p>
                      </TableCell>
                      <TableCell>
                        <p> {getDate(expectedDeliveryDate)}</p>
                      </TableCell>
                      {
                        (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole()) || PERMISSIONS.FRANCHISE_ADMIN.includes(getRole())) &&
                        <TableCell>
                          <p> {getAmount(getCredrMargin(assignedCfp, voucherPrice))}</p>
                        </TableCell>
                      }
                      <TableCell>
                        {
                          paymentModeStaus &&
                            paymentModeStaus === 'NONE' ?
                            <button className="icon-btn" onClick={() => onReAssignToStore(pending)} style={{ display: 'block' }}>{`Reassign`}</button>
                            : 'NA'
                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(pendingList.length) ?
                <Pagination
                  className="float-right"
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
  pendingList: state.pending.pendingList,
  total: state.pending.count,
  page: state.pending.page
})

export default connect(mapStateToProps)(AssignedData)
