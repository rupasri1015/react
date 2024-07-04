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
import { getIncustodyList } from '../../../redux/actions/logisticsInCustodyAction'
import { renderString, getAmount, getDate } from '../../../core/utility'
import './incustody.scss'
import { WhiteCallIcon } from '../../../core/utility/iconHelper'
import { getMobile, getUserID } from '../../../core/services/rbacServices'
import { callToCareCustomer } from '../../../core/services/shdServices'
import { hideLoader, showLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import CallToCustomer from './CallActionPopUp'
import InCustodyModal from './InCustodyPopup'


const PendingColoumns = [
  { id: 'leadId', label: 'Lead\u00a0Id' },
  { id: 'pickedUpDate', label: 'Picked\u00a0Up\u00a0Date', },
  { id: 'deliveringTo', label: 'Delivering\u00a0To', },
  { id: 'vehicleDetails', label: 'Vehicle\u00a0Details', },
  { id: 'cityName', label: 'City\u00a0Name', },
  { id: 'runnerName', label: 'Runner\u00a0Name', },
  { id: 'salesAgentName', label: 'Sales\u00a0Agent\u00a0Name', },
  { id: 'conversionCategory', label: 'Conversion\u00a0Category' },
  { id: 'action', label: 'Action' },
];
const CompColoumns = [
  { id: 'leadId', label: 'Lead\u00a0Id' },
  { id: 'pickedUpDate', label: 'Picked\u00a0Up\u00a0Date', },
  { id: 'inCustodyDate', label: 'In\u00a0Custody\u00a0Date', },
  { id: 'deliveringTo', label: 'Delivering\u00a0To', },
  { id: 'vehicleDetails', label: 'Vehicle\u00a0Details', },
  { id: 'cityName', label: 'City\u00a0Name', },
  { id: 'runnerName', label: 'Runner\u00a0Name', },
  { id: 'salesAgentName', label: 'Sales\u00a0Agent\u00a0Name', },
  { id: 'approvedBy', label: 'Approved By' },
  { id: 'conversionCategory', label: 'Conversion\u00a0Category' },
];

class IncustodyTable extends Component {

  state = {
    commissionData: null,
    status: '',
    commission: '',
    id: '',
    callPopUp: false,
    rowInfo:{},
    inCustodyPopup:false,
    leadId:''
  }

  componentDidMount() {
    const { dispatch } = this.props
    let payload = {
      pageNum: 1,
      tabType: 'PENDING'
    }
    dispatch(getIncustodyList(payload))
  }

  handlePageChange = (page) => {
    const { onPageChange } = this.props
    onPageChange(page)
  }

  getClassName = (source) => {
    if (source === 'OSO') return 'osoSource'
    if (source === 'OEM') return 'oemSource'
  }

  getLeadStatusClas = (leadStatus) => {
    if (leadStatus === 'SELL') return 'sellClass'
    if (leadStatus === 'EXCHANGE') return 'exchangeClass'
  }

  inCustody = (leadId) => {
    const { onInCustody } = this.props
    onInCustody(leadId)
    this.setState({inCustodyPopup:false})
  }
  handleCallPopUp = (data) => {
    this.setState({ rowInfo: data})
    this.setState({ callPopUp: true })
  }
  handleClosePopUp = () => {
    this.setState({callPopUp:false})
  }

  handleInCustodyPopup = (leadId) => {
    this.setState({inCustodyPopup:true})
    this.setState({leadId:leadId})
  }
  handleCloseInCustody = () => {
    this.setState({inCustodyPopup:false})
  }

  callAction = async (data, info) => {
    const { dispatch } = this.props
    const payload = {
      fromNumber: getMobile(),
      toNumber: info.runnerMobileNumber,
      userId: getUserID(),
      leadId: info.leadId
    }
    dispatch(showLoader())
    const apiResponse = await callToCareCustomer(payload)
    dispatch(hideLoader())
    if (apiResponse.isValid) {
      dispatch(setNotification('success', 'Success', apiResponse.message))
    } else {
      dispatch(setNotification('danger', 'Error', apiResponse.message));
    }
    this.setState({ callPopUp: false })
  }

  render() {
    const { pageNum, count, incustodyData, status } = this.props
    return (
      <div className="table-wraper" style={{ marginTop: '11px' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {status === "PENDING" &&
                PendingColoumns.map(row => (
                  <TableCell
                    key={row.id}
                  >
                    {row.label}
                  </TableCell>
                ))
              }
              {status === "COMPLETED" &&
                CompColoumns.map(row => (
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
              incustodyData && Boolean(incustodyData.length) &&
              incustodyData.map(incustody => {
                return (
                  <>
                    <TableRow hover tabIndex={-1} >
                      <TableCell>
                        {renderString(incustody.leadId)}
                        <p className={this.getClassName(incustody.source)}>{renderString(incustody.source)}</p>
                      </TableCell>
                      <TableCell>
                        <p> {getDate(incustody.pickUpdate)} </p>
                      </TableCell>
                      {status === "COMPLETED" &&
                        <TableCell>
                          <p > {getDate(incustody.inCustDate)} </p>
                        </TableCell>}
                      <TableCell>
                        {renderString(incustody.deliverdTo)}
                      </TableCell>
                      <TableCell>
                        {<div>
                          <p>{renderString(incustody.regNumber)}</p>
                          <small>{renderString(incustody.mmvy)}</small>
                        </div>
                        }
                      </TableCell>
                      <TableCell >
                        {renderString(incustody.cityName)}
                      </TableCell>
                      <TableCell >
                        {<div>{status === "PENDING" &&
                          <img src={WhiteCallIcon} onClick={() => this.handleCallPopUp(incustody)}
                            style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt='CallIcon' />
                        }
                          {renderString(incustody.runnerName)}
                        </div>}
                      </TableCell>
                      <TableCell >
                        {renderString(incustody.salesAgentName)}
                      </TableCell>
                      {status === "COMPLETED" &&
                        <TableCell >
                          {renderString(incustody.inCustApprovedBy)}
                        </TableCell>}
                      <TableCell >
                        <p className={this.getLeadStatusClas(incustody.leadStatus)}>{renderString(incustody.leadStatus)}</p>
                      </TableCell>
                      {status === "PENDING" &&
                        <TableCell >
                          <button className='actionClass' onClick={() => this.handleInCustodyPopup(incustody.leadId)}> In Custody </button>
                        </TableCell>}
                    </TableRow>

                  </>
                )
              })
            }
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            incustodyData && Boolean(incustodyData.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={count}
                pageSize={12}
                current={pageNum}
                locale={localeInfo}
                onChange={this.handlePageChange}
              />
              :
              <NoResultFound />
          }
        </div>
        {this.state.callPopUp &&
          <CallToCustomer
            open={this.state.callPopUp}
            onClose={this.handleClosePopUp}
            onCallCustomer={this.callAction}
            rowInfo={this.state.rowInfo}
          />}
          {this.state.inCustodyPopup && 
            <InCustodyModal
              open={this.state.inCustodyPopup}
              onClose={this.handleCloseInCustody}
              inCustody={this.inCustody}
              leadId={this.state.leadId}
            />
          }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  incustodyData: state.inCustody.inCustResponse,
  pageNum: state.inCustody.pageNum,
  count: state.inCustody.count,
  pendingCount: state.inCustody.pendingCount,
  adiyCompletedCount: state.inCustody.adiyCompletedCount
})

export default connect(mapStateToProps)(IncustodyTable)