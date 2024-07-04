import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { getDate, getAmount, getBikeName, getMmvYear, renderString } from '../../../../../core/utility'
import { getStoreLeads } from '../../../../../redux/actions/manageLeadsAction'
import NoResultFound from '../../../../../shared/components/NoResultFound'
import { getRole, PERMISSIONS, getCityID } from '../../../../../core/services/rbacServices'
import TableSortLabel from '@material-ui/core/TableSortLabel';

const columns = [
  { id: 'leadCreatedDate', label: 'Lead Created Date', sort: 'sort' },
  { id: 'city', label: 'City' },
  { id: 'storeName', label: 'Showroom' },
  { id: 'regnum', label: 'Registration Number' },
  { id: 'mmvYear', label: 'MMV - Y' },
  { id: 'name', label: 'Name' },
  { id: 'bikeprice', label: 'CSP' }
]

class LeadsTable extends Component {

  componentDidMount() {
    const payload = { pageNum: 1, orderType: 'desc' }
    const { dispatch } = this.props
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    dispatch(getStoreLeads(payload))
  }

  pageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }

  render() {
    const { storeList, count, pageNum, handleSorting, direction, orderType } = this.props
    return (
      <div>   
      <h4 className = "countHeader"> {`${`Total Records: ${count}`}`} </h4>   
      <div className="table-wraper marginTopFranchise">
        <Table size="small">
          <TableHead>
            <TableRow >
              {
                columns.map(column => (
                  <TableCell key={column.id}>
                    {column.sort ?
                      <TableSortLabel active={true}
                        direction={direction ? orderType : 'asc'}
                        onClick={handleSorting}>
                        {column.label}
                      </TableSortLabel>
                      :
                      (column.label)}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Boolean(storeList.length) && storeList.map(stores => {
                const {
                  leadId,
                  leadCreatedDate,
                  city,
                  storeName,
                  name,
                  number,
                  make,
                  model,
                  variant,
                  year,
                  regnum,
                  bikeprice
                } = stores
                return (
                  <TableRow hover tabIndex={-1} key={leadId}>
                    <TableCell>
                      <p> {getDate(leadCreatedDate)} </p>
                    </TableCell>
                    <TableCell>
                      <p> {renderString(city)} </p>
                    </TableCell>
                    <TableCell>
                      <p> {renderString(storeName)} </p>
                    </TableCell>
                    <TableCell>
                      <p> {renderString(regnum)} </p>
                    </TableCell>
                    <TableCell>
                      <p> {getMmvYear(getBikeName(make, model, variant), year)} </p>
                    </TableCell>
                    <TableCell>
                      <p> {renderString(name)} </p>
                    </TableCell>
                    <TableCell>
                      <p> {getAmount(bikeprice)} </p>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(storeList.length) ?
              <Pagination
                className="float-right"
                current={pageNum}
                total={count}
                pageSize={20}
                onChange={this.pageChange}
                locale={localeInfo}
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
  storeList: state.manageLeads.storeLeads,
  count: state.manageLeads.count,
  pageNum: state.manageLeads.pageNum,
  orderType: state.manageLeads.orderType
})

export default connect(mapStateToProps)(LeadsTable)