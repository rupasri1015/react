import React, { Component } from 'react';
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import edit from '../../../../shared/img/icons/edit-icon.svg'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Chip from '@material-ui/core/Chip'
import NoResultFound from '../../../../shared/components/NoResultFound'
import { listAllSHDData, resetShdList } from '../../../../redux/actions/shdListAction'
import { capaitalize, renderString } from '../../../../core/utility'

const columns = [
  { id: 'name', label: 'Outlet Name' },
  { id: 'customerName', label: 'Owner Name' },
  { id: 'mobile', label: 'Owner Phone Number' },
  { id: 'empType', label: 'Employee Type' },
  { id: 'city', label: 'City' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' }
];

class ShdTable extends Component {

  pageChange = (pageNum) => {
    const { page, onPageChange } = this.props
    if (page !== pageNum) {
      onPageChange(pageNum)
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(listAllSHDData())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetShdList())
  }

  render() {
    const {
      shdList,
      total,
      page,
      onUpdateShd
    } = this.props
    return (
      <div className="table-wraper marginTop">
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
              Boolean(shdList.length) && shdList.map(shd => {
                const {
                  storeName,
                  userFirstName,
                  userMobileNumber,
                  groupName,
                  cityName,
                  userStatus,
                  userId
                } = shd
                return (
                  <TableRow hover tabIndex={-1} key={userId}>
                    <TableCell>
                      <p>{renderString(storeName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(userFirstName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(userMobileNumber)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(groupName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(cityName)}</p>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={capaitalize(userStatus)}
                        classes={{ colorPrimary: 'color-green' }}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <img src={edit} id={userId} alt="Edit Valuator" role="button" className="action-icon" onClick={() => onUpdateShd(shd)} />
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(shdList.length) ?
              <Pagination
                className="float-right"
                current={page}
                total={total}
                pageSize={10}
                locale={localeInfo}
                showQuickJumper
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
  shdList: state.shdData.shdList,
  total: state.shdData.total,
  page: state.shdData.page
})

export default connect(mapStateToProps)(ShdTable);