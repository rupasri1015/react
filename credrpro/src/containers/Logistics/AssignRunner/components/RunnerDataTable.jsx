import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Chip from '@material-ui/core/Chip'
import NoResultFound from '../../../../shared/components/NoResultFound'
import { getRunnerData, resetRunnerList } from '../../../../redux/actions/assignRunnerListAction'
import { getDate, capaitalize, renderString } from '../../../../core/utility'
import { getRole, PERMISSIONS } from '../../../../core/services/rbacServices'
import '../../style.scss'
class RunnerData extends PureComponent {

  pageChange = (page) => {
    const { onPageChange, pageNumber } = this.props

    if (page !== pageNumber) {
      onPageChange(page)
    }
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(getRunnerData())
  }

  get getTableHeader() {
    if (PERMISSIONS.LOGISTICS.includes(getRole()) ) {
      return [
        { id: 'QC Approved Date', label: 'QC Approved Date' },
        { id: 'Exchange Date', label: 'Exchange Date' },
        { id: 'City', label: 'City' },
        { id: 'Registration Number', label: 'Registration Number', },
        { id: 'FHD Name', label: 'FHD Name' },
        { id: 'cpName', label: 'CP Name' },
        { id: 'cpPaymentStatus', label: 'CP Payment Status' },
        { id: 'Coordinator Details', label: 'Coordinator Details' },
        { id: 'MFG Year', label: 'MFG Year' },
        { id: 'Conversion Category', label: 'Conversion Category' },
        { id: 'Action', label: 'Action' },
        { id: 'ownedBy', label: 'Owned By' }
      ]
    } else {
      return [
        { id: 'QC Approved Date', label: 'QC Approved Date' },
        { id: 'Exchange Date', label: 'Exchange Date' },
        { id: 'City', label: 'City' },
        { id: 'Registration Number', label: 'Registration Number', },
        { id: 'FHD Name', label: 'FHD Name' },
        { id: 'cpName', label: 'CP Name' },
        { id: 'cpPaymentStatus', label: 'CP Payment Status' },
        { id: 'Coordinator Details', label: 'Coordinator Details' },
        { id: 'MFG Year', label: 'MFG Year' },
        { id: 'Conversion Category', label: 'Conversion Category' },
        { id: 'ownedBy', label: 'Owned By' }
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
                  registrationNum,
                  storeName,
                  orderCreatedDate,
                  cityName,
                  coordinatoreName,
                  qcApprovedDate,
                  makeYear,
                  orderType,
                  leadId,
                  coordinatoreNum,
                  vehicleLeadStatus,
                  ownedBy,
                  cpName,
                  cpPaymentStatus
                } = runner
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={leadId} >
                    <TableCell>
                      <p>{getDate(qcApprovedDate)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{getDate(orderCreatedDate)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(cityName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(registrationNum)}</p>
                      <small className='leadLabel'>{leadId}</small>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(storeName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(cpName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(cpPaymentStatus)}</p>
                    </TableCell>
                    <TableCell>
                      <p><b>{renderString(coordinatoreName)}</b></p>
                      <p>{renderString(coordinatoreNum)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(makeYear)}</p>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={capaitalize(orderType)}
                        classes={{ colorPrimary: capaitalize(orderType) }}
                        color="primary"
                      />
                    </TableCell>
                    {
                      PERMISSIONS.LOGISTICS.includes(getRole()) && (
                        vehicleLeadStatus === 'UNASSIGNED' ?
                          <TableCell>
                            <button className="btn-outline--small blue" onClick={() => onAssignRunner(runner)}>Assign&nbsp;Runner</button>
                          </TableCell>
                          :
                          <TableCell>
                            <button className="btn-outline--small reject" onClick={() => onAssignRunner(runner, true)}>Reassign&nbsp;Runner</button>
                          </TableCell>
                      )
                    }
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
            Boolean(runnerData.length) ?
              <Pagination
                className="float-right"
                current={pageNumber}
                locale={localeInfo}
                total={total}
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
  runnerData: state.runner.coordinatorLead,
  total: state.runner.count,
  pageNumber: state.runner.pageNumber
})

export default connect(mapStateToProps)(RunnerData)