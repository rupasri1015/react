import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import NoResultFound from '../../../../shared/components/NoResultFound'
import { getDate, renderString } from '../../../../core/utility'
import { getPaperData, resetPaperData } from '../../../../redux/actions/paperTransferAction'
import isEqual from 'lodash/isEqual'
import CallAction from '../CallAction'
import { CallIcon } from '../../../../core/utility/iconHelper'

const columns = [
  { id: 'soldDate', label: 'Sale Date' },
  { id: 'storeName', label: 'Store' },
  { id: 'ptAgent', label: 'PT Agent' },
  { id: 'customerMobileNumber', label: 'Call' },
  { id: 'customerName', label: 'Customer' },
  { id: 'cityName', label: 'City' },
  { id: 'regNum', label: 'Registration Number' },
  { id: 'documents', label: 'View Documents' },
  { id: 'ptStatus', label: 'Status' }
]

class PaperTransferTable extends Component {

  state = {
    isOpen: false,
    valuatorData: {}
  }

  pageChange = pageNum => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(pageNum)
    }
  }

  componentDidMount() {
    const { dispatch, ptStatus } = this.props
    dispatch(getPaperData({ ptStatus, pageNum: 1 }))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetPaperData())
  }

  componentDidUpdate(prevProps) {
    const { ptListDetails, isRegistrationSearch, onSetStatus } = this.props
    if (ptListDetails && ptListDetails.length && !isEqual(prevProps.ptListDetails, ptListDetails) && isRegistrationSearch) {
      if(ptListDetails.length > 1){
        onSetStatus('PENDING')
      }
      else{
        onSetStatus(ptListDetails[0].ptStatus)
      }
    }
  }

  openCallAction = valuator => {
    this.setState({ isOpen: true, valuatorData: valuator })
  }

  closeCallAction = () => {
    this.setState({ isOpen: false, valuatorData: {} })
  }

  render() {
    const { ptListDetails, page, onGoToSummary, onGoToView, onGoToRTO, onGoToVaahan, onGoToReceived, onGoToDelivered } = this.props
    const {isOpen, valuatorData} = this.state
    return (
      <>
        <div className="table-wraper marginFranchiseTop">
          <Table size="small">
            <TableHead>
              <TableRow>
                {
                  columns.map(column => (
                    <TableCell key={column.id}>
                      {column.label}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                ptListDetails && Boolean(ptListDetails.length) && ptListDetails.map((paperList, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={`${index}`}>
                      <TableCell>
                        {getDate(paperList.soldDate)}
                      </TableCell>
                      <TableCell>
                        {renderString(paperList.storeName)}
                      </TableCell>
                      <TableCell>
                       {renderString(paperList.ptAgent)}
                      </TableCell>
                      <TableCell>
                      <div style={{ display: "flex", flexWrap: "nowrap" }}>
                          <p style={{ minWidth: 80 }}>{renderString(paperList.customerMobileNumber)}</p>
                          <img src={CallIcon} style={{ width: 20, cursor: "pointer" }} onClick={() => this.openCallAction(paperList)} alt="Call To Valuator" />
                        </div>
                        {/* {renderString(paperList.customerMobileNumber)} */}
                      </TableCell>
                      <TableCell>
                        {renderString(paperList.customerName)}
                      </TableCell>
                      <TableCell>
                        {renderString(paperList.cityName)}
                      </TableCell>
                      <TableCell>
                        {renderString(paperList.regNum)}
                      </TableCell>
                      <TableCell>
                        {
                          paperList.ptStatus === 'PENDING' &&
                          <button className="btn-outline--small" style={{color: '#F68D04', borderColor: '#F68D04'}} onClick={() => onGoToSummary(paperList)}>View&nbsp;&amp;&nbsp;Approve</button> 
                        }
                        {
                          paperList.ptStatus === 'COLLECTED' &&
                          <button className="btn-outline--small" style={{color: '#70bbfd', borderColor: '#70bbfd'}} onClick={() => onGoToView(paperList)}>View&nbsp;&amp;&nbsp;Approve</button>
                        }
                        {
                          paperList.ptStatus === 'RTO_SUBMITTED' &&
                          <button className="btn-outline--small blue" onClick={() => onGoToRTO(paperList)}>View&nbsp;&amp;&nbsp;Approve</button>
                        }
                        {
                          paperList.ptStatus === 'VAAHAN_APPROVED' &&
                          <button className="btn-outline--small" style={{color: '#c88ffa', borderColor: '#c88ffa'}} onClick={() => onGoToVaahan(paperList)}>View&nbsp;&amp;&nbsp;Approve</button>
                        }
                        {
                          paperList.ptStatus === 'RECEIVED' &&
                          <button className="btn-outline--small" style={{color: 'rgba(0, 0, 0, 0.87)', borderColor: '#b8e986'}} onClick={() => onGoToReceived(paperList)}>View&nbsp;&amp;&nbsp;Approve</button>
                        }
                        {
                          paperList.ptStatus === 'DELIVERED' &&
                          <button className="btn-outline--small" style={{color: 'rgba(0, 0, 0, 0.87)', borderColor: ' #f6da6e'}} onClick={() => onGoToDelivered(paperList)}>View</button>
                        }
                      </TableCell>
                      <TableCell>
                        {renderString(paperList.ptStatus)}
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              ptListDetails && Boolean(ptListDetails.length) ?
                <Pagination
                  className="float-right"
                  current={page}
                  total={page}
                  pageSize={10}
                  locale={localeInfo}
                  showQuickJumper
                  onChange={this.pageChange}
                /> 
                :
                <NoResultFound />
            }
          </div>
        </div>
        <CallAction
          open={isOpen}
          valuator={valuatorData}
          onClose={this.closeCallAction}
        />
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  ptListDetails: state.paperTransferData.ptListDetails,
  total: state.paperTransferData.count,
  collectedCount: state.paperTransferData.collectedCount,
  pendingCount: state.paperTransferData.pendingCount,
  rtoCount: state.paperTransferData.rtoCount,
  vahanCount: state.paperTransferData.vahanCount,
  deliveredCount: state.paperTransferData.deliveredCount,
  ticketCount: state.paperTransferData.ticketCount,
  receivedCount: state.paperTransferData.receivedCount,
  page: state.paperTransferData.pageNum
})

export default connect(mapStateToProps)(PaperTransferTable)