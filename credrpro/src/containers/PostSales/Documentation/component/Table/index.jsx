
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { getDate, getYear, renderString, capaitalize } from '../../../../../core/utility'
import { getDocumentationList } from '../../../../../redux/actions/documentationListAction'
import NoResultFound from '../../../../../shared/components/NoResultFound'
import { getCityID, PERMISSIONS, getRole } from '../../../../../core/services/rbacServices'
import Chip from '@material-ui/core/Chip'

const columns = [
  { id: 'soldDate', label: 'Sold Date', Icon: "Icon" },
  { id: 'storeName', label: 'Showroom' },
  { id: 'cityName', label: 'City Name' },
  { id: 'customerName', label: 'Name' },
  { id: 'mobileNumber', label: 'Mobile Number' },
  { id: 'mmvYear', label: 'MMV - Y' },
  { id: 'regNumber', label: 'Registration Number' },
  { id: 'insurenceUpdateStatus', label: 'Insurance Status' },
  { id: 'rctransferRequest', label: 'RC Status' },
  { id: 'bikeDetails', label: 'Bike Details' },
  { id: 'viewDetails', label: 'Action' }
]


class DocumentationTable extends Component {

  state = {
    open: false,
    currentLeadId: null,
    prevLeadId: null,
    DocumentDataList: null,
    prevData: null,
    showUpdateButton: false
  }

  componentDidMount() {
    const { dispatch } = this.props
    const payload = { page: 1, orderBy: "desc" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    dispatch(getDocumentationList(payload))
  }

  pageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }

  showDetails = (leadDetails) => {
    const { onShowDetails } = this.props
    if (onShowDetails) {
      onShowDetails(leadDetails)
    }
  }

  changeMobileNumber = (leadDetails) => {
    const { onChangeMobile } = this.props
    if (onChangeMobile) {
      onChangeMobile(leadDetails)
    }
  }

  render() {
    const { documentsTransferList, count, page, handleSorting, direction, orderBy } = this.props
    return (
      <div>
        <h4 className="countHeader"> {`${`Total Records: ${count}`}`} </h4>
        <div className="table-wraper marginTopFranchise">
          <Table size="small">
            <TableHead>
              <TableRow>
                {
                  columns.map(column => (
                    <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                      {column.Icon ?
                        <TableSortLabel
                          active={true}
                          direction={direction ? orderBy : 'asc'}
                          onClick={handleSorting}> {column.label}
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
                Boolean(documentsTransferList.length) && documentsTransferList.map(leads => {
                  const {
                    leadId,
                    soldDate,
                    storeName,
                    cityName,
                    customerName,
                    mobileNumber,
                    regNumber,
                    mmv,
                    mfYear,
                    insurenceUpdateStatus,
                    rctransferRequest,
                  } = leads
                  return (
                    <TableRow hover tabIndex={-1} key={leadId}>
                      <TableCell>
                        <p>{getDate(soldDate)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(storeName)}</p>
                      </TableCell>

                      <TableCell>
                        <p>{renderString(cityName)}</p>
                      </TableCell>

                      <TableCell>
                        <p>{renderString(customerName)}</p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(mobileNumber)} </p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(mmv)} - {renderString(getYear(mfYear))}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(regNumber)}</p>
                      </TableCell>
                      <TableCell>
                        {insurenceUpdateStatus ?
                          <Chip
                            label={renderString(capaitalize(insurenceUpdateStatus))}
                            classes={{ colorPrimary: capaitalize(insurenceUpdateStatus) }}
                            color="primary"
                          /> :
                          <p>{renderString(insurenceUpdateStatus)}</p>}
                      </TableCell>
                      <TableCell>
                        {rctransferRequest ?
                          <Chip
                            label={renderString(capaitalize(rctransferRequest))}
                            classes={{ colorPrimary: capaitalize(rctransferRequest) }}
                            color="primary"
                          /> :
                          <p>{renderString(rctransferRequest)}</p>}
                      </TableCell>
                      <TableCell>
                        <button className="btn-outline--small blue" onClick={() => this.showDetails(leads)}>View&nbsp;Details</button>
                      </TableCell>
                      <TableCell>
                        <button className="btn-outline--small blue" onClick={() => this.changeMobileNumber(leads)}>Update&nbsp;Mobile&nbsp;Number</button>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(documentsTransferList.length) ?
                <Pagination
                  className="float-right"
                  locale={localeInfo}
                  current={page}
                  total={count}
                  pageSize={20}
                  showQuickJumper
                  onChange={this.pageChange}
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
  documentsTransferList: state.documentationList.documentsTransferList,
  count: state.documentationList.count,
  page: state.documentationList.page,
  orderBy: state.documentationList.orderBy
})

export default connect(mapStateToProps)(DocumentationTable)