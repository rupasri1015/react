import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import NoResultFound from '../../../../shared/components/NoResultFound'
import { getFranchiseRunnerData, resetRunnerList } from '../../../../redux/actions/franchiseAssignRunnerListAction'
import { getDate, renderString, getMmvYearFranchise, getBikeName } from '../../../../core/utility'
import { getRole, PERMISSIONS } from '../../../../core/services/rbacServices'

class FranchiseRunnerData extends PureComponent {

  pageChange = (page) => {
    const { onPageChange, pageNumber } = this.props
    if (page !== pageNumber) {
      onPageChange(page)
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getFranchiseRunnerData())
  }

  get getTableHeader() {
    if (PERMISSIONS.LOGISTICS.includes(getRole())) {
      return [
        { id: 'Requisition Date', label: 'Requisition Date' },
        { id: 'Deadline Date', label: 'Deadline Date' },
        { id: 'City', label: 'City' },
        { id: 'Registration Number', label: 'Registration Number', },
        { id: 'Showroom', label: 'Showroom' },
        { id: 'Coordinator Details', label: 'Coordinator Details' },
        { id: 'MMV - Y', label: 'MMV - Y' },
        { id: 'Action', label: 'Action' }
      ]
    } else {
      return [
        { id: 'Requisition Date', label: 'Requisition Date' },
        { id: 'Deadline Date', label: 'Deadline Date' },
        { id: 'City', label: 'City' },
        { id: 'Registration Number', label: 'Registration Number', },
        { id: 'Showroom', label: 'Showroom' },
        { id: 'Coordinator Details', label: 'Coordinator Details' },
        { id: 'MMV - Y', label: 'MMV - Y' },
      ]
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetRunnerList())
  }

  render() {
    const { runnerData, total, pageNumber, onAssignRunner } = this.props
    return (
      <div className="table-wraper marginTop">
        <Table size="small">
          <TableHead>
            <TableRow>
              {
                this.getTableHeader.map(column => (
                  <TableCell key={column.id}>
                    {column.label}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              runnerData && Boolean(runnerData.length) && runnerData.map(runner => {
                const {
                  registrationNumber,
                  storeName,
                  assignedDate,
                  requestedDate,
                  cityName,
                  coordinatorName,
                  makeName,
                  modelName,
                  variantName,
                  vehicleStatus,
                  leadId,
                  coordinatorMobile,
                  manufactureYear
                } = runner
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={leadId} >
                    <TableCell>
                      <p>{getDate(requestedDate)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{getDate(assignedDate)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(cityName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(registrationNumber)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(storeName)}</p>
                    </TableCell>
                    <TableCell>
                      <p><b>{renderString(coordinatorName)}</b></p>
                      <p>{renderString(coordinatorMobile)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{getMmvYearFranchise(getBikeName(makeName,modelName,variantName), manufactureYear)}</p>
                    </TableCell>
                    {
                      PERMISSIONS.LOGISTICS.includes(getRole()) && (
                        vehicleStatus === 'OPEN' ?
                          <TableCell>
                            <button className="btn-outline--small blue" onClick={() => onAssignRunner(runner)}>Assign&nbsp;Runner</button>
                          </TableCell>
                          :
                          <TableCell>
                            <button className="btn-outline--small reject" onClick={() => onAssignRunner(runner, true)}>Reassign&nbsp;Runner</button>
                          </TableCell>
                      )
                    }
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(runnerData && runnerData.length) ?
              <Pagination
                className="float-right"
                current={pageNumber}
                locale={localeInfo}
                total={total}
                showQuickJumper
                pageSize={12}
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
  runnerData: state.franchiseRunner.vehicles,
  total: state.franchiseRunner.totalCount,
  pageNumber: state.franchiseRunner.pageNumber
})

export default connect(mapStateToProps)(FranchiseRunnerData)