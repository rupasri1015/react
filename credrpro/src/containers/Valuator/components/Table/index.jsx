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
import NoResultFound from '../../../../shared/components/NoResultFound'
import { getValuatorList, resetValuatorList } from '../../../../redux/actions/valuatorAction'
import { renderString } from '../../../../core/utility';

const columns = [
  { id: 'Name', label: 'Name' },
  { id: 'Phone Number', label: 'Phone\u00a0Number' },
  { id: 'City', label: 'City' },
  { id: 'Actions', label: 'Actions' }
]

class ValuatorTable extends Component {

  state = {
    initialValues: null
  }

  pageChange = (pageNum) => {
    const { page, onPageChange } = this.props
    if (page !== pageNum) {
      onPageChange(pageNum)
    }
  }

  updateValuator = (id) => {
    const { onUpdateValuator } = this.props
    if (onUpdateValuator) {
      onUpdateValuator(id)
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getValuatorList())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetValuatorList())
  }

  render() {
    const { valuatorList, count, page } = this.props
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
              Boolean(valuatorList.length) && valuatorList.map(valuator => {
                const {
                  userId,
                  userFirstName,
                  userMobileNumber,
                  cityName
                } = valuator
                return (
                  <TableRow hover tabIndex={-1} key={userId}>
                    <TableCell>
                      <p>{renderString(userFirstName)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(userMobileNumber)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(cityName)}</p>
                    </TableCell>
                    <TableCell>
                      <img src={edit} id={userId} alt="Edit Valuator" role="button" className="action-icon" onClick={() => this.updateValuator(userId)} />
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>

        <div className="table-paginator">
          {
            Boolean(valuatorList.length) ?
              <Pagination
                className="float-right"
                locale={localeInfo}
                current={page}
                total={count}
                pageSize={10}
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
  valuatorList: state.valuator.valuatorList,
  count: state.valuator.count,
  page: state.valuator.page
})

export default connect(mapStateToProps)(ValuatorTable);