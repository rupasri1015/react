import React, { Component } from 'react'
import { connect } from 'react-redux'
import { geWarehouseData, resetWarehouseData } from '../../../../redux/actions/franchiseWarehouseDeliveryAction'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import NoResultFound from '../../../../shared/components/NoResultFound'
import { getDate, renderString, getMmvYearFranchise, getBikeName } from '../../../../core/utility'
import { PERMISSIONS, getRole } from '../../../../core/services/rbacServices'

class WarehouseTable extends Component {

  componentDidMount() {
    const { dispatch, status } = this.props
    dispatch(geWarehouseData())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetWarehouseData())
  }

  componentDidUpdate() {
    const { warehouseData, onStatusChange, isRegistrationSearch } = this.props
    if (isRegistrationSearch && warehouseData.length === 1) {
      onStatusChange(warehouseData[0].vehicleStatus)
    }
  }

  get getTableHeaders() {
    if (PERMISSIONS.LOGISTICS.includes(getRole())) {
      return [
        { id: 'Delivered Date', label: 'Delivered Date' },
        { id: 'Picked up Date', label: 'Pickup Date' },
        { id: 'Requisition Date', label: 'Requisition Date' },
        { id: 'tat', label: 'Delivery TAT' },
        { id: 'city', label: 'City' },
        { id: 'showroom', label: 'Showroom' },
        { id: 'salesExecutive', label: 'Sales Executive' },
        { id: 'MMV-Year', label: 'MMV-Year' },
        { id: 'Registration Number', label: 'Registration Number', },
        { id: 'Runner Details', label: 'Runner Details' },
        { id: 'Action', label: 'Action' }
      ]
    } else {
      return [
        { id: 'Delivered Date', label: 'Delivered Date' },
        { id: 'Picked up Date', label: 'Pickup Date' },
        { id: 'Requisition Date', label: 'Requisition Date' },
        { id: 'tat', label: 'Delivery TAT' },
        { id: 'city', label: 'City' },
        { id: 'showroom', label: 'Showroom' },
        { id: 'salesExecutive', label: 'Sales Executive' },
        { id: 'MMV-Year', label: 'MMV-Year' },
        { id: 'Registration Number', label: 'Registration Number', },
        { id: 'Runner Details', label: 'Runner Details' }
      ]
    }
  }
  
  customerDetails = leadCustId => {
    const { onCustomerDetails } = this.props
    if (onCustomerDetails) {
      onCustomerDetails(leadCustId)
    }
  }

  handlePageChange = pageNum => {
    const { onPageChange, page } = this.props
    if (page !== pageNum) {
      onPageChange(pageNum)
    }
  }

  getCount = () => {
    const { pendingConfirmation, delivered, dispute, allCount, status } = this.props
    switch (status.toLowerCase()) {
      case 'all': return allCount
      case 'pending_confirmation': return pendingConfirmation
      case 'delivered': return delivered
      case 'delivery_dispute': return dispute
      default: return allCount
    }
  }

  render() {
    const { warehouseData, page, onConfirmDelivery, status } = this.props
    return (
      <div className="table-wraper">
        <Table size="small" >
          <TableHead>
            <TableRow>
              {this.getTableHeaders.map(column => (
                <TableCell key={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Boolean(warehouseData.length) && warehouseData.map((data, id) => {
                const {
                  deliveryDate,
                  pickupDate,
                  requestedDate,
                  deliveryTAT,
                  cityName,
                  storeName,
                  salesExecutiveName,
                  salesExecutiveMobile,
                  makeName,
                  modelName,
                  variantName,
                  manufactureYear,
                  registrationNumber,
                  runnerName,
                  runnerMobile,
                  vehicleStatus
                } = data
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`${registrationNumber} ${id}`}>
                    <TableCell>
                      <p>{getDate(deliveryDate)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{getDate(pickupDate)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{getDate(requestedDate)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{deliveryTAT}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(cityName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(storeName)}</p>
                    </TableCell>
                    <TableCell>
                      <p><b>{renderString(salesExecutiveName)}</b></p>
                      <p>{renderString(salesExecutiveMobile)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{getMmvYearFranchise(getBikeName(makeName, modelName, variantName), manufactureYear)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(registrationNumber)}</p>
                    </TableCell>
                    <TableCell>
                      <p><b>{renderString(runnerName)}</b></p>
                      <p>{renderString(runnerMobile)}</p>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(warehouseData.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={this.getCount()}
                pageSize={12}
                current={page}
                locale={localeInfo}
                onChange={this.handlePageChange}
              /> :
              <NoResultFound />
          }
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => ({
  warehouseData: state.warehouseFranchise.vehicles,
  allCount: state.warehouseFranchise.totalCount,
  pendingConfirmation: state.warehouseFranchise.pendingConfirmationCount,
  delivered: state.warehouseFranchise.deliveredCount,
  dispute: state.warehouseFranchise.deliveryDisputeCount,
  page: state.warehouseFranchise.pageNumber
})

export default connect(mapStateToProps)(WarehouseTable)