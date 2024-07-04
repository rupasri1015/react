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
import { getDate, getBikeName, capaitalize, renderString, getAmount } from '../../../../core/utility'
import { getVehicleStatusData,resetVehicleStatus } from '../../../../redux/actions/franchiseVehicleStatusAction'

const columns = [
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Scheduled Date', label: 'Scheduled Date' },
  { id: 'Picked up Date', label: 'Picked up Date' },
  { id: 'Delivered Date', label: 'Delivered Date' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'details', label: 'View Bike Details' }
]

const assignedColumns = [
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'AssignmentTAT', label: 'Assignment TAT' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'details', label: 'View Bike Details' }
]

const pendingAssignmentColumns = [
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'details', label: 'View Bike Details' }
]

const pendingPickupColumns = [
  { id: 'Scheduled Date', label: 'Scheduled Pickup Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'details', label: 'View Bike Details' }
]

const pickupDisputeColumns = [
  { id: 'Picked up Date', label: 'Pickup Date' },
  { id: 'reason', label: 'Dispute Reason' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'details', label: 'View Bike Details' }
]

const intransitColumns = [
  { id: 'Picked up Date', label: 'Pickup Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'details', label: 'View Bike Details' }
]

const deliverdColumns = [
  { id: 'delivered', label: 'Delivered Date' },
  { id: 'Picked up Date', label: 'Pickup Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'Cost', label: 'Cost' },
  { id: 'details', label: 'View Bike Details' }
]

const pendingConfirmationColumns = [
  { id: 'delivered', label: 'Delivered Date' },
  { id: 'Picked up Date', label: 'Pickup Date' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'details', label: 'View Bike Details' }
]

const deliveryDisputeColumns = [
  { id: 'Dispute Date', label: 'Dispute Date' },
  { id: 'reason', label: 'Dispute Reason' },
  { id: 'Assigned Date', label: 'Assigned Date' },
  { id: 'Exchange Date', label: 'Exchange Date' },
  { id: 'city', label: 'City' },
  { id: 'showroom', label: 'Showroom Name' },
  { id: 'MMV-Year', label: 'MMV-Year' },
  { id: 'Registration Number', label: 'Registration Number', },
  { id: 'Runner Details', label: 'Runner Details' },
  { id: 'details', label: 'View Bike Details' }
]

class VehicleStatusData extends Component {

  componentDidMount() {
    const { dispatch, status } = this.props
    dispatch(getVehicleStatusData())
  }

  componentDidUpdate() {
    const { vehicles, onStatusChange, isRegistrationSearch } = this.props
    if (isRegistrationSearch && vehicles.length === 1) {
      onStatusChange(vehicles[0].vehicleStatus)
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetVehicleStatus())
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
      case 'open': return pendingAssignmentColumns
      case 'pending_pickup': return pendingPickupColumns
      case 'pickup_dispute': return pickupDisputeColumns
      case 'in_transit': return intransitColumns
      case 'delivered': return deliverdColumns
      case 'pending_confirmation': return pendingConfirmationColumns
      case 'delivery_dispute': return deliveryDisputeColumns
      default: return []
    }
  }

  get getCount() {
    const { delivered, deliveryDispute, assigned, pendingAssignment, pendingConfirmation, pendingPickup, inTransit, total, status, pickupDispute } = this.props
    switch (status.toLowerCase()) {
      case 'all': return total
      case 'assigned': return assigned
      case 'open': return pendingAssignment
      case 'pending_pickup': return pendingPickup
      case 'pickup_dispute': return pickupDispute
      case 'in_transit': return inTransit
      case 'delivered': return delivered
      case 'pending_confirmation': return pendingConfirmation
      case 'delivery_dispute': return deliveryDispute
      default: return total
    }
  }

  viewBikeDetails = inventoryId => {
    const { onViewDetails } = this.props
    onViewDetails(inventoryId)
  }

  render() {
    const { vehicles, pageNum, status } = this.props
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
              vehicles && Boolean(vehicles.length) && vehicles.map(data => {
                const {
                  makeName,
                  modelName,
                  variantName,
                  cityName,
                  storeName,
                  disputeReason,
                  assignedDate,
                  requestedDate,
                  scheduledDate,
                  pickupDate,
                  deliveryDate,
                  disputeDate,
                  pickUpScheduledDate,
                  salesExecutiveName,
                  salesExecutiveMobile,
                  runnerName,
                  runnerMobile,
                  coordinatorName,
                  coordinatorMobile,
                  registrationNumber,
                  orderId,
                  manufactureYear
                } = data
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={orderId}>
                    {
                      status.toLowerCase() === 'all' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(assignedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickUpScheduledDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(deliveryDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'assigned' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(deliveryDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickUpScheduledDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(requestedDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'open' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'pending_pickup' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'pickup_dispute' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="tableCellHead">{renderString(disputeReason)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(assignedDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      status.toLowerCase() === 'in_transit' &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(assignedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    {
                      Boolean(status.toLowerCase() === 'delivered' || status.toLowerCase() === 'pending_confirmation') &&
                      (
                        <>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(pickupDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
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
                            <p className="tableCellHead">{renderString(disputeReason)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(scheduledDate)}</p>
                          </TableCell>
                        </>
                      )
                    }
                    <TableCell>
                      <p>{renderString(cityName)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="tableCellHead">{renderString(storeName)}</p>
                      <p>{renderString(salesExecutiveName)}</p>
                      <p>{renderString(salesExecutiveMobile)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{`${getBikeName(makeName, modelName, variantName)} ${renderString(manufactureYear)}`}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(registrationNumber)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(runnerName)}</p>
                      <p>{renderString(runnerMobile)}</p>
                    </TableCell>
                    <TableCell>
                      <button className="btn-outline--small blue" onClick={() => this.viewBikeDetails(orderId)}>View&nbsp;Details</button>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
           vehicles && Boolean(vehicles.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={this.getCount}
                pageSize={12}
                current={pageNum}
                locale={localeInfo}
                showQuickJumper
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
  vehicles: state.vehicleStatus.vehicles,
  total: state.vehicleStatus.totalCount,
  delivered: state.vehicleStatus.deliveredCount,
  deliveryDispute: state.vehicleStatus.deliveryDisputeCount,
  assigned: state.vehicleStatus.assignedCount,
  inTransit: state.vehicleStatus.inTransitCount,
  pendingAssignment: state.vehicleStatus.pendingAssignmentCount,
  pendingConfirmation: state.vehicleStatus.pendingConfirmationCount,
  pendingPickup: state.vehicleStatus.pendingPickupCount,
  pickupDispute: state.vehicleStatus.pickupDisputeCount,
  pageNum: state.vehicleStatus.pageNumber
})

export default connect(mapStateToProps)(VehicleStatusData)