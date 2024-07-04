import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getRefurbdata, resetRefurbData } from '../../../redux/actions/refurbDataAction'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import NoResultFound from '../../../shared/components/NoResultFound'
import isEqual from 'lodash/isEqual'
import { getDate, getAmount, renderString } from '../../../core/utility'
import { refurbUrl, getInspectionDetails } from '../../../core/services/refurbServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import InspectionDialog from '../Dialogs/inspectionDialog'

const rows = [
  { id: 'exchangeDate', label: 'Sell\u00a0Date', },
  { id: 'warehouseInwardDate', label: 'In Date' },
  { id: 'refurbQcCompletedDate', label: 'QC\u00a0Done\u00a0On', },
  // { id: 'oneAPassDate', label: '1\u00a0A\u00a0PassedDate', },
  { id: 'leadSellType', label: 'Source', },
  { id: 'registrationNumber', label: 'Reg\u00a0No', },
  { id: 'mmv', label: 'MMV', },
  { id: 'year', label: 'Year', },
  { id: 'stock', label: 'Stock' },
  { id: 'leadPayStatus', label: 'Payment' },
  { id: 'productionStatus', label: 'Status' },
  { id: 'viewImage', label: 'Job Card' },
  { id: 'viewDetails', label: 'Inspection' }
];

const InProgressRows = [
  { id: 'exchangeDate', label: 'Sell\u00a0Date', },
  { id: 'warehouseInwardDate', label: 'In Date' },
  { id: 'refurbQcCompletedDate', label: 'QC\u00a0Done\u00a0On', },
  // { id: 'oneAPassDate', label: '1\u00a0A\u00a0PassedDate', },
  { id: 'leadSellType', label: 'Source', },
  { id: 'registrationNumber', label: 'Reg\u00a0No', },
  { id: 'mmv', label: 'MMV', },
  { id: 'year', label: 'Year', },
  { id: 'leadPayStatus', label: 'Payment' },
  { id: 'productionStatus', label: 'Status' },
  { id: 'viewImage', label: 'Job Card' },
  { id: 'viewDetails', label: 'Inspection' }
];

const PendigQcRows = [
  { id: 'exchangeDate', label: 'Sell\u00a0Date', },
  { id: 'warehouseInwardDate', label: 'In Date' },
  // { id: 'oneAPassDate', label: '1\u00a0A\u00a0PassedDate', },
  { id: 'leadSellType', label: 'Source', },
  { id: 'registrationNumber', label: 'Reg\u00a0No', },
  { id: 'mmv', label: 'MMV', },
  { id: 'year', label: 'Year', },
  { id: 'stock', label: 'Stock' },
  { id: 'leadPayStatus', label: 'Payment' },
  { id: 'productionStatus', label: 'Status' },
  { id: 'viewImage', label: 'Job Card' },
  { id: 'viewDetails', label: 'Inspection' }
];

class RefurbData extends Component {

  state = {
    status: '',
    openDialog: false,
    data: [],
    rmId: null,
    setStatus: ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getRefurbdata())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetRefurbData())
  }

  componentDidUpdate(prevProps) {
    const { refurbData, onSetStatus, isRegistrationSearch } = this.props
    if (refurbData && refurbData.length && !isEqual(prevProps.refurbData, refurbData) && isRegistrationSearch) {
      if(refurbData[0].leadStatus || refurbData[0].mainStatus){
        if(refurbData[0].leadStatus === 'DROPPED')
        onSetStatus(refurbData[0].leadStatus)
        else if(refurbData[0].mainStatus)
        onSetStatus(refurbData[0].mainStatus)
      }
    }
  }

  handlePageChange = pageNum => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(pageNum)
    }
  }

  get pageCount() {
    const { total, refurbStatus, progressCount, oneApassCount, pendingCount, alternateStockCount, qcCompletedCount, droppedCount } = this.props
    console.log(droppedCount, 'droppedcount')
    switch (refurbStatus) {
      case 'QC_PENDING': return pendingCount
      case 'REFURB_IN_PROGRESS': return progressCount
      case '1A_PASS': return oneApassCount
      case 'ALTERNATE_STOCK': return alternateStockCount
      case 'QC_COMPLETED': return qcCompletedCount
      case 'DROPPED': return droppedCount
      default: return total
    }
  }

  viewPDF = (id) => {
    const { dispatch } = this.props
    refurbUrl(id)
      .then(urlResponse => {
        if (urlResponse.isValid) {
          window.open(urlResponse.url)
        }
        else {
          dispatch(setNotification(
            'danger',
            'Error',
            urlResponse.message
          ))
        }
      })
  }
  openDialog = (id, status) => {
    const { dispatch } = this.props
    getInspectionDetails(id)
      .then(urlResponse => {
        if (urlResponse.isValid) {
          this.setState({ rmId: id })
          this.setState({ data: urlResponse.finalDashboardList })
          this.setState({ openDialog: true })
          this.setState({ setStatus: status })
        }
        else {
          dispatch(setNotification(
            'danger',
            'Error',
            urlResponse.message
          ))
        }
      })
  }
  closeDialog = () => {
    this.setState({ openDialog: false })
  }

  getRows = () => {
    const { refurbStatus } = this.props
    if (refurbStatus === 'QC_PENDING' || refurbStatus === 'QC_Pending' )
      return PendigQcRows
      if (refurbStatus === 'REFURB_IN_PROGRESS' || refurbStatus === 'QC_COMPLETED')
      return InProgressRows
    else
      return rows
  }

  getCol = () => {
    const { refurbStatus } = this.props
    if (refurbStatus === 'QC_PENDING' || refurbStatus === 'QC_Pending')
      return false
    else return true
  }

  getStockCol = () => {
    const { refurbStatus } = this.props
    if (refurbStatus === 'REFURB_IN_PROGRESS' || refurbStatus === 'QC_COMPLETED')
      return false
    else return true
  }

  render() {
    const { pageNum, refurbData, refurbStatus } = this.props
    const { openDialog, data, rmId, setStatus } = this.state
    return (
      <div className="table-wraper">
        <Table size="small">
          <TableHead>
            <TableRow>
              {
                this.getRows().map(row => (
                  <TableCell
                    key={row.id}
                  >
                    {row.label}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Boolean(refurbData.length) && refurbData.map((refurb, index) => {
                const {
                  warehouseInwardDate,
                  stock,
                  sparePartsAvailability,
                  refurbEstimate,
                  bikeMMV,
                  bikeRegistrationNo,
                  bikeMakeYear,
                  cpp,
                  exchangeDate,
                  oneApassedDate,
                  qcCompleteDate,
                  biddingPrice,
                  status,
                  rmID,
                  leadSellType,
                  leadPayStatus,
                  leadId
                } = refurb
                return (
                  <TableRow hover tabIndex={-1} key={`${bikeRegistrationNo}${index}`}>
                    <TableCell >
                      {getDate(exchangeDate)}
                    </TableCell>
                    <TableCell>
                      <p>{getDate(warehouseInwardDate)}</p>
                    </TableCell>
                    {
                      this.getCol() &&
                      <TableCell>
                        <p>{getDate(qcCompleteDate)}</p>
                      </TableCell>
                    }
                    <TableCell>
                      {renderString(leadSellType === 'TP' ? 'OSO' : leadSellType === 'TP-FHD' ? 'OEM' : leadSellType)}
                    </TableCell>
                    <TableCell>
                      <p>{renderString(bikeRegistrationNo)}</p>
                      <small style={{backgroundColor: "#dce7fd",padding:"2px"}}>{leadId}</small>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(bikeMMV)}</p>
                    </TableCell>
                    <TableCell>
                      <p>{renderString(bikeMakeYear)}</p>
                    </TableCell>
                    {
                      this.getStockCol() &&
                      <TableCell>
                        <p> {renderString(stock)}</p>
                      </TableCell>
                    }
                    <TableCell>
                      {renderString(leadPayStatus)}
                    </TableCell>
                    <TableCell>
                      {renderString(status)}
                    </TableCell>
                    {/* <TableCell>
                      {renderString(sparePartsAvailability)}
                    </TableCell> */}
                    <TableCell>
                      <button
                        className="btn-outline--small blue"
                        onClick={() => this.viewPDF(rmID)}
                      > View
                      </button>
                    </TableCell>
                    <TableCell>
                      {
                        status === 'QC Pending' &&
                        <div style={{ textAlign: "center" }}>NA</div>
                      }
                      {
                        status !== 'QC Pending' &&
                        <div className='btn-link' style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.openDialog(rmID, status)}>View details</div>
                      }
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(refurbData.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={this.pageCount}
                pageSize={10}
                current={pageNum}
                locale={localeInfo}
                showQuickJumper
                onChange={this.handlePageChange}
              /> :
              <NoResultFound />
          }
        </div>
        {openDialog &&
          <InspectionDialog
            open={openDialog}
            onClose={this.closeDialog}
            data={data}
            rmId={rmId}
            status={setStatus}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  refurbData: state.refurb.refurbDashBoardResponse,
  total: state.refurb.count,
  pageNum: state.refurb.pageNum,
  progressCount: state.refurb.refurbCount,
  oneApassCount: state.refurb.oneAcount,
  pendingCount: state.refurb.pendingCount,
  alternateStockCount: state.refurb.alternateCount,
  qcCompletedCount: state.refurb.qcCompletedCount,
  droppedCount: state.refurb.dropCount
})

export default connect(mapStateToProps)(RefurbData)