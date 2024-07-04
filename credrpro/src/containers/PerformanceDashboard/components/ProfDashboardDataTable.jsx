import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import isEqual from 'lodash/isEqual'
import NoResultFound from '../../../shared/components/NoResultFound'
import { getDate, getAmount, getStatus } from '../../../core/utility'
import { conversionalData } from '../../../redux/actions/conversionalFunnelAction'

class ProfDashboardDataTable extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(conversionalData())
  }

  componentDidUpdate(prevProps) {
    const { vehicleData, onStatusChange } = this.props
    if (!isEqual(vehicleData, prevProps.vehicleData) && vehicleData.length === 1) {
      onStatusChange(vehicleData[0].vehicleStatus)
    }
  }


  handlePageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }

  render() {
    const { performanceDashboardList, paginationCount, columns } = this.props
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
              Boolean(performanceDashboardList.length) && performanceDashboardList.map((list, index) => (
                <TableRow hover
                  tabIndex={-1}
                  key={`${list.leadId}${index}`}
                >
                  {columns.map(column => (
                    <TableCell key={column.id}>
                      {(column.type === "date") ? getDate(list[column.id]) : (column.type === "string") ? 
                      list[column.id] : (column.type === "price") ? getAmount(list[column.id]) : 
                      (column.type === "viewModal") ? 
                      <button variant="contained" className="custom_button rounded btn btn-sm btn-outline-info" 
                      onClick={() => this.props.onOpen(list)} color="info">View Lifecycle</button> : 
                      (list[column.id] != null) ? getStatus(list[column.id]) : "---"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(performanceDashboardList.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={paginationCount && paginationCount}
                pageSize={12}
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

const mapsStatetoProps = (state) => ({
  performanceDashboardList: state.conversionalFunnnel.fhdPerformanceResponse,
  paginationCount: state.conversionalFunnnel.performanceDashoboardCount.paginationCount
})
export default connect(mapsStatetoProps)(ProfDashboardDataTable)