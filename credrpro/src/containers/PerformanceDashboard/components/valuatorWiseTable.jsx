import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import NoResultFound from '../../../shared/components/NoResultFound'
import { getAmount, getDate } from '../../../core/utility'
import { valuatorProf } from '../../../redux/actions/valuatorProfAction'

class ValuatorWiseTable extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(valuatorProf())
  }

  handlePageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }

  render() {
    const { valuatorProfList, dataCount, columns } = this.props
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
              Boolean(valuatorProfList.length) && valuatorProfList.map((list, index) => (

                <TableRow hover
                  tabIndex={-1}
                  key={`${list.leadId}${index}`}
                >
                  {
                  columns.map((column, index) => (
                    <TableCell key={`${column.leadId}${index}`}>
                      {(column.type === "date") ? getDate(list[column.id]) : 
                      (column.type === "string") ? list[column.id] : 
                      (column.type === "price") ? getAmount(list[column.id]) : 
                      (column.type === "viewModal") ?
                      <button variant="contained" className="custom_button rounded btn btn-sm btn-outline-info" onClick={() => this.props.onOpen(list)} color="info">View Lifecycle</button> : 
                      (list[column.id] != null) ? list[column.id] : "---"}
                    </TableCell>
                  ))
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(valuatorProfList.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={dataCount != null && dataCount.count != null ? dataCount.count : ""}
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
  valuatorProfList: state.valuatorProfList.valuatorProfList,
  dataCount: state.valuatorProfList.valuatorCount
})

export default connect(mapsStatetoProps)(ValuatorWiseTable)