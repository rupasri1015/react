import React, { Component } from 'react'
import { connect } from 'react-redux'
import { valuatorDashbaordList } from '../../../redux/actions/valuatorDasboardListAction'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import ActionIcon from '../../../shared/img/icons/action-icon.svg'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import NoResultFound from '../../../shared/components/NoResultFound'
import { getDate, renderDateSlot, renderString, getBikeName, renderDate } from '../../../core/utility'
import isEqual from 'lodash/isEqual'
import { WhiteCallIcon } from '../../../core/utility/iconHelper'
import CalltoCustomer from './CalltoCustomer'
import DropReason from './DropReason'
import { InfoIcon } from '../../../core/utility/iconHelper'
import Tooltip from '@material-ui/core/Tooltip';

const rows = [
  { id: 'city', label: 'City' },
  { id: 'valuatorName', label: 'Valuator\u00a0Name' },
  { id: 'leadId', label: 'Lead\u00a0ID' },
  { id: 'customerName', label: 'Customer\u00a0Name' },
  { id: 'mmv', label: 'MMV', },
  // { id: 'crmStaus', label: 'Inspection\u00a0Status', },
  { id: 'dateSlots', label: 'Date\u00a0+ \u00a0Slot' },
  { id: 'leadCreatedDate', label: 'Lead\u00a0Created\u00a0Date' },
  { id: 'pincode', label: 'Pincode' },
  { id: 'address', label: 'Address' },
  { id: 'inspectedDate', label: 'Inspected\u00a0Date' },
  { id: 'leadBikeType', label: 'Inspect\u00a0Type' },
  { id: 'callCount', label: 'Call\u00a0Count' },
  { id: 'dropreason', label: 'Drop\u00a0Reason' },
  { id: 'action', label: 'Actions' }
];

const pendingRows = [
  { id: 'city', label: 'City' },
  { id: 'valuatorName', label: 'Valuator\u00a0Name' },
  { id: 'leadId', label: 'Lead\u00a0ID' },
  { id: 'customerName', label: 'Customer\u00a0Name' },
  { id: 'mmv', label: 'MMV', },
  // { id: 'crmStaus', label: 'Inspection\u00a0Status', },
  { id: 'dateSlots', label: 'Date\u00a0+\u00a0Slot' },
  { id: 'leadCreatedDate', label: 'Lead\u00a0Created\u00a0Date' },
  { id: 'pincode', label: 'Pincode' },
  { id: 'address', label: 'Address' },
  { id: 'inspectedDate', label: 'Inspected\u00a0Date' },
  { id: 'leadBikeType', label: 'Inspect\u00a0Type' },
  { id: 'callCount', label: 'Call\u00a0Count' },
  { id: 'action', label: 'Actions' }
]

const preDroppedRows = [
  { id: 'city', label: 'City' },
  { id: 'valuatorName', label: 'Valuator\u00a0Name' },
  { id: 'leadId', label: 'Lead\u00a0ID' },
  { id: 'customerName', label: 'Customer\u00a0Name' },
  { id: 'mmv', label: 'MMV', },
  // { id: 'crmStaus', label: 'Inspection\u00a0Status', },
  { id: 'dateSlots', label: 'Date\u00a0+\u00a0Slot' },
  { id: 'pincode', label: 'Pincode' },
  { id: 'address', label: 'Address' },
  { id: 'inspectedDate', label: 'Inspected\u00a0Date' },
  { id: 'leadCreatedDate', label: 'Lead\u00a0Created\u00a0Date' },
  { id: 'leadBikeType', label: 'Inspect\u00a0Type' },
  { id: 'callCount', label: 'Call\u00a0Count' },
  { id: 'dropreason', label: 'Drop\u00a0Reason' },
  { id: 'valdropreason', label: 'Valuator\u00a0Drop\u00a0Reason' },
  { id: 'droppedBy', label: 'Dropped\u00a0By&Date' },
  { id: 'action', label: 'Actions' }
]

class ValuatorDataTable extends Component {

  state = {
    anchorElement: null,
    auctionData: null,
    status: '',
    sellType: '',
    openCall: false,
    rowData: {},
    openDrop: false
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(valuatorDashbaordList({ pageNum: 1, status: 'PENDING' }))
  }

  componentDidUpdate(prevProps) {
    const { valuatorList, onStatusChange, isRegistrationSearch } = this.props
    if (!isEqual(valuatorList, prevProps.valuatorList)) {
      if (valuatorList && valuatorList.length === 1) {
        // onStatusChange(valuatorList[0].status)
      }
    }
  }

  handlePageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }


  viewSummary = data => {
    const { onViewSummary } = this.props
    if (onViewSummary) {
      onViewSummary(data)
    }
  }

  valuatorDetails = details => {
    const { onValuatorDetails } = this.props
    if (onValuatorDetails) {
      onValuatorDetails({ storeId: details.storeId, valuatorId: details.valuatorId })
    }
  }

  setAnchorElement = (anchorElement = null, auctionData = null) => {
    if (auctionData && auctionData.status !== 'AUCTION_STARTED' && auctionData.status !== 'REAUCTION_STARTED' && auctionData.status !== 'DROPPED') {
      this.setState({ status: auctionData.status, sellType: auctionData.leadVehicleSellType })
      this.setState({ anchorElement, auctionData })
    }
    else {
      if (anchorElement === null) {
        this.setState({ status: '' })
        this.setState({ anchorElement, auctionData })
      }
    }
  }

  schedule = () => {
    const { onSchedule } = this.props
    if (onSchedule) {
      onSchedule(this.state.auctionData)
    }
    this.setAnchorElement()
  }

  assigned = () => {
    const { onAssign } = this.props
    if (onAssign) {
      onAssign(this.state.auctionData)
    }
    this.setAnchorElement()
  }

  auditRecord = () => {
    const { onRecord } = this.props
    if (onRecord) {
      onRecord(this.state.auctionData)
    }
    this.setAnchorElement()
  }

  dropped = () => {
    const { onDrop } = this.props
    if (onDrop) {
      onDrop(this.state.auctionData)
    }
    this.setAnchorElement()
  }

  dropLead = () => {
    this.setState({ openDrop: true })
  }

  getMenuItems = () => {
    const menu = []
    const { status, valuatorList } = this.props
    if (status === 'PENDING' || status === 'RESCHEDULE' || valuatorList.length && valuatorList[0].status === 'Reschedule' || valuatorList.length && valuatorList[0].status === 'Pending') {
      menu.push(<MenuItem key="reschedule" onClick={this.schedule}>Reschedule</MenuItem>)
      menu.push(<MenuItem key="reassign" onClick={this.assigned}>Reassign</MenuItem>)
      menu.push(<MenuItem key="drop" onClick={this.dropped}>Drop</MenuItem>)
      // menu.push(<MenuItem key="drop" onClick={this.dropped}>Dropped</MenuItem>)
    }
    menu.push(<MenuItem key="callrecord" onClick={this.auditRecord}>Audit Call Record</MenuItem>)
    // }
    return menu
  }

  getCount = () => {
    const { pendingConut, preDropCount, inspectedCount, docDisputeCount, status, pageNum, rescheduleCount, adiyCompletedCount } = this.props
    switch (status.toLowerCase()) {
      case 'pending': return pendingConut
      case 'predrop': return preDropCount
      // case 'no-call': return noCallCount
      case 'inspected': return inspectedCount
      case 'docdispute': return docDisputeCount
      case 'reschedule': return rescheduleCount
      case 'adiy_completed': return adiyCompletedCount
      default: return 0
    }
  }

  onOpenCallTocustomer = () => {
    this.setState({
      openCall: true
    })
  }

  handleRowChange = (auctionData) => {
    this.setState({
      rowData: auctionData
    })
  }

  onClose = () => {
    this.setState({
      openCall: false
    })
  }

  onDropClose = () => {
    this.setState({ openDrop: false })
  }

  getRows = (status) => {
    if (status === 'PENDING') return pendingRows
    else if (status === 'PREDROP') return preDroppedRows
    else return rows
  }

  render() {
    const { valuatorList, pageNum, count, status } = this.props
    const { anchorElement, sellType, openCall, rowData, openDrop } = this.state
    return (
      <div className="table-wraper">
        <Table size="small">
          <TableHead>
            <TableRow>
              {
                this.getRows(status).map(row => (
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
              Boolean(valuatorList.length) &&
              valuatorList.map((valData, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={`${valData.leadId}${index}`}
                    onClick={() => this.handleRowChange(valData)}
                  >
                    <TableCell>
                      {valData.cityName}
                    </TableCell>
                    <TableCell>
                      {valData.valuatorName}
                    </TableCell>
                    <TableCell>
                      {valData.leadId}
                    </TableCell>
                    <TableCell>
                      {/* {valData.customerName} */}
                      <p><img src={WhiteCallIcon} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} onClick={this.onOpenCallTocustomer} alt='CallIcon' /> {`${valData.customerName}`} </p>
                    </TableCell>
                    <TableCell>
                      {renderString(valData.mmv)}
                    </TableCell>
                    {/* <TableCell>
                      {renderString(valData.crmStaus)}
                    </TableCell> */}
                    <TableCell>
                      {renderDateSlot(valData.dateAndSlot)}
                    </TableCell>
                    <TableCell>
                      {getDate(valData.leadCreatedDate)}
                    </TableCell>
                    <TableCell>
                      {valData.pincode ? valData.pincode :"-"}
                    </TableCell>
                    <TableCell>
                      {valData.address ? valData.address :"-"}
                    </TableCell>
                    
                    <TableCell>
                      {getDate(valData.inspectedDate)}
                    </TableCell>
                    <TableCell>
                      {renderString(valData.leadBikeType)}
                    </TableCell>
                    <TableCell>
                      {renderString(valData.callCount)}
                    </TableCell>
                    {
                      status !== 'PENDING' &&
                     <>
                      <TableCell>
                        <p>{renderString(valData.dropReason)}
                          {
                            valData.dropReason &&
                            <>
                              <Tooltip title={renderString(valData.comments)} placement="bottom">
                                <span style={{ float: 'right' }}><img src={InfoIcon} alt='info icon'></img></span>
                              </Tooltip>
                            </>
                          }
                        </p>
                      </TableCell>
                      </>
                    }
                    {
                      status === 'PREDROP' &&
                      <TableCell>
                        <p>{renderString(valData.droppedBy)}</p>
                        <p>{renderDate(valData.droppedDate)}</p>
                      </TableCell>
                    }
                    <TableCell>
                      <img alt="Menu" role="button" src={ActionIcon} className="action-icon" style={{ padding: 5, boxSizing: 'content-box' }} id={valData.auctionTransactionId} onClick={(e) => this.setAnchorElement(e.currentTarget, valData)} />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(valuatorList.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={this.getCount()}
                pageSize={15}
                current={pageNum}
                locale={localeInfo}
                showQuickJumper
                onChange={this.handlePageChange}
              />
              :
              <NoResultFound />
          }
        </div>
        <Menu
          id="simple-menu"
          anchorEl={anchorElement}
          keepMounted
          open={Boolean(anchorElement)}
          onClose={() => this.setAnchorElement()}
        >
          {/* {
            Boolean(status) && this.getMenuItems()
          } */}
          {
            this.getMenuItems()
          }
        </Menu>
        {
          openCall &&
          <CalltoCustomer
            openCall={openCall}
            rowData={rowData}
            onClose={this.onClose}
          />
        }
        {
          openDrop &&
          <DropReason
            openCall={openDrop}
            rowData={rowData}
            onClose={this.onDropClose}
            dropTheLead={this.dropTheLed}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  valuatorList: state.valuatorList.valuatorList,
  count: state.valuatorList.count,
  pendingConut: state.valuatorList.pendingCount,
  preDropCount: state.valuatorList.preDropCount,
  inspectedCount: state.valuatorList.inspectedCount,
  docDisputeCount: state.valuatorList.docDisputeCount,
  rescheduleCount:state.valuatorList.rescheduleCount,
  adiyCompletedCount: state.valuatorList.adiyCompletedCount,
  // noCallCount: state.valuatorList.nocallCount,
  pageNum: state.valuatorList.pageNum
})

export default connect(mapStateToProps)(ValuatorDataTable)