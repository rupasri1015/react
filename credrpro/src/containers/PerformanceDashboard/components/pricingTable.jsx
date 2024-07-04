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
import { getDate, getAmount } from '../../../core/utility'
import { pricingData } from '../../../redux/actions/pdPricingAction'
import { getUserID } from '../../../core/services/rbacServices'


class PricingTable extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    const payload = {pageNumber: 1, userId: `${getUserID()}`}
    dispatch(pricingData(payload))
  }

  handlePageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }
  render() {
    const { pricingList, columns, dataCount, pageNumber, appliedRange } = this.props
    return (
      <div className="table-wraper">
        <h4 style={{color: 'black', marginLeft: '7px', fontStyle: 'bold'}}> { appliedRange ? `Applied\u00A0Range:\u00A0${appliedRange}` : '' } </h4>
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
              Boolean(pricingList.length) && pricingList.map((list, index) => (
                <TableRow hover
                  tabIndex={-1}
                  key={`${list.leadId}${index}`}>
                  {
                  columns.map((column , index)=> (
                    <TableCell key={`${column.leadId}${index}`}>
                      {(column.type === "date") ? getDate(list[column.id]) : 
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
            Boolean(pricingList.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={dataCount != null ? dataCount : ""}
                pageSize={12}
                current={pageNumber}
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
  pricingList: state.pdPricingResult.pricingResult,
  dataCount: state.pdPricingResult.pricingCount,
  pageNumber: state.pdPricingResult.pageNumber
})
export default connect(mapsStatetoProps)(PricingTable)