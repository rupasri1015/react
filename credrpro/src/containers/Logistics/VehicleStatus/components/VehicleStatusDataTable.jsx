import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Chip from '@material-ui/core/Chip'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import NoResultFound from '../../../../shared/components/NoResultFound'
import { getDate, getBikeName, capaitalize, renderString, getAmount, getElapsedTime } from '../../../../core/utility'
import { getVehicleData, resetVehicleData } from '../../../../redux/actions/vehicleStatusAction'
import '../../style.scss'
const columns = [
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Scheduled Date', label: 'Scheduled Date' },
  { id: 'Picked up Date', label: 'Picked up Date' },
  { id: 'Delivered Date', label: 'Delivered Date' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

const assignedColumns = [
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Qc Approved Date', label: 'Qc Approved Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'AssignmentTAT', label: 'Assignment TAT' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

const pendingAssignmentColumns = [
  { id: 'QC Approved Date', label: 'QC Approved Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

const pendingPickupColumns = [
  { id: 'Scheduled Date', label: 'Scheduled Pickup Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Qc Approved Date', label: 'Qc Approved Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

const pickupDisputeColumns = [
  { id: 'Disputed Date', label: 'Disputed Date' },
  { id: 'reason', label: 'Dispute Reason' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Qc Approved Date', label: 'Qc Approved Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

const intransitColumns = [
  { id: 'Picked up Date', label: 'Picked up Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Qc Approved Date', label: 'Qc Approved Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

const deliverdColumns = [
  { id: 'delivered', label: 'Delivered Date' },
  { id: 'Picked up Date', label: 'Pickup Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Qc Approved Date', label: 'Qc Approved Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Cost', label: 'Cost' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

const pendingConfirmationColumns = [
  { id: 'delivered', label: 'Delivered Date' },
  { id: 'Picked up Date', label: 'Picked up Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Qc Approved Date', label: 'Qc Approved Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

const deliveryDisputeColumns = [
  { id: 'Dispute Date', label: 'Dispute Date' },
  { id: 'reason', label: 'Dispute Reason' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Qc Approved Date', label: 'Qc Approved Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'outlet', label: 'FHD Outlet' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Conversion Category', label: 'Conversion Category' },
  { id: 'details', label: 'View Bike Details' },
  { id: 'ownedBy', label: 'Owned By' }
]

class VehicleStatusData extends Component {

  componentDidMount() {
    const { dispatch, status } = this.props
    dispatch(getVehicleData({ pageNum: 1, vehicleStatus: status }))
  }

  componentDidUpdate() {
    const { vehicleData, onStatusChange, isRegistrationSearch } = this.props
    if (isRegistrationSearch && vehicleData.length === 1) {
      onStatusChange(vehicleData[0].vehicleStatus)
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetVehicleData())
  }

  handlePageChange = page => {
    const { onPageChange, pageNum } = this.props
    if (page !== pageNum) {
      onPageChange(page)
    }
  }

  get column() {
    const { status } = this.props
    switch (status.toLowerCase()) {
      case 'all': return columns
      case 'assigned': return assignedColumns
      case 'pending_assignment': return pendingAssignmentColumns
      case 'rejected': return pendingAssignmentColumns
      case 'unassigned': return pendingAssignmentColumns
      case 'pending': return pendingPickupColumns
      case 'pickup_dispute': return pickupDisputeColumns
      case 'intransit': return intransitColumns
      case 'delivered': return deliverdColumns
      case 'pending_confirmation': return pendingConfirmationColumns
      case 'delivered_confirm_pending': return pendingConfirmationColumns
      case 'delivery_dispute': return deliveryDisputeColumns
      default: return []
    }
  }

  get getCount() {
    const { delivered, dispute, assigned, unAssigned, pendingConfirmation, pending, intrasist, total, status, delivery_dispute, pickup_dispute } = this.props
    switch (status.toLowerCase()) {
      case 'all': return total
      case 'assigned': return assigned
      case 'pending_assignment': return unAssigned
      case 'pending': return pending
      case 'pickup_dispute': return pickup_dispute
      case 'intransit': return intrasist
      case 'delivered': return delivered
      case 'pending_confirmation': return pendingConfirmation
      case 'delivery_dispute': return delivery_dispute
      default: return total
    }
  }

  viewBikeDetails = inventoryId => {
    const { onViewDetails } = this.props
    onViewDetails(inventoryId)
  }

  render() {
    const { vehicleData, pageNum, status } = this.props
    return (
      <div className="table-wraper">
        <Table size="small">
          <TableHead>
            <TableRow>
              {this.column.map(column => (
                <TableCell key={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Boolean(vehicleData.length) && vehicleData.map(data => {
                const {
                  makeName,
                  modelName,
                  variantName,
                  city,
                  fhdName,
                  registrationNumber,
                  orderCreatedDate,
                  runnerAssignedAt,
                  deliveryTat,
                  pickUpDate,
                  vehicleDisputeReason,
                  deliveredDate,
                  makeYear,
                  orderType,
                  runnerName,
                  disputeDate,
                  qcApprovedDate,
                  leadId,
                  coordinatoreNum,
                  pickedUpDate,
                  valuatorNumber,
                  valuatorName,
                  cost,
                  ownedBy,
                  runnerMobileNumber
                } = data
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={leadId}>
                    {
                      status.toLowerCase() === 'all' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(runnerAssignedAt)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickUpDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickedUpDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(deliveredDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'assigned' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(runnerAssignedAt)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(qcApprovedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(orderCreatedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getElapsedTime(deliveryTat)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      Boolean(status.toLowerCase() === 'pending_assignment' || status.toLowerCase() === 'pending_assignment' ||  status.toLowerCase() === 'unassigned') &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(qcApprovedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(runnerAssignedAt)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(orderCreatedDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'pending' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(pickUpDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(runnerAssignedAt)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(qcApprovedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(orderCreatedDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'pickup_dispute' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(disputeDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="tableCellHead">{renderString(vehicleDisputeReason)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(runnerAssignedAt)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(qcApprovedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(orderCreatedDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'intransit' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(pickedUpDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(runnerAssignedAt)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(qcApprovedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(orderCreatedDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      Boolean(status.toLowerCase() === 'delivered' || status.toLowerCase() === 'pending_confirmation' || status.toLowerCase() === 'delivered_confirm_pending') &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(deliveredDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickedUpDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(runnerAssignedAt)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(qcApprovedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(orderCreatedDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'delivery_dispute' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(disputeDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="tableCellHead">{renderString(vehicleDisputeReason)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(runnerAssignedAt)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(qcApprovedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(orderCreatedDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    <TableCell>
                      <p>{renderString(city)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="tableCellHead">{renderString(fhdName)}</p>
                      <p>{renderString(valuatorName)}</p>
                      <p>{renderString(valuatorNumber)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{`${getBikeName(makeName, modelName, variantName)} ${renderString(makeYear)}`}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(registrationNumber)}</p>
                      <small className='leadLabel'>{leadId}</small>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(runnerName)}</p>
                      <p>{renderString(runnerMobileNumber)}</p>
                    </TableCell>
                    {
                      status.toLowerCase() === 'delivered' &&
                      <TableCell>
                        <p>{getAmount(cost)}</p>
                      </TableCell>
                    }
                    <TableCell>
                      <Chip
                        label={capaitalize(orderType)}
                        classes={{ colorPrimary: capaitalize(orderType) }}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <button className="btn-outline--small blue" onClick={() => this.viewBikeDetails(leadId)}>View&nbsp;Details</button>
                    </TableCell>
                    <TableCell>
                        <p>{renderString(ownedBy)}</p>
                      </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(vehicleData.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={this.getCount}
                pageSize={12}
                current={pageNum}
                locale={localeInfo}
                onChange={this.handlePageChange}
              /> :
              <NoResultFound />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  vehicleData: state.vehicle.vehicleStatus,
  total: state.vehicle.count,
  allCount: state.vehicle.allCount,
  delivered: state.vehicle.delivered,
  dispute: state.vehicle.dispute,
  delivery_dispute:state.vehicle.delivery_dispute,
  pickup_dispute: state.vehicle.pickup_dispute,
  assigned: state.vehicle.assigned,
  pending: state.vehicle.pending,
  intrasist: state.vehicle.intrasist,
  rejected: state.vehicle.rejected,
  pageNum: state.vehicle.pageNum,
  unAssigned: state.vehicle.unAssigned,
  pendingConfirmation: state.vehicle.pendingConfirmation
})

export default connect(mapStateToProps)(VehicleStatusData)