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
import { getShowRoomSales } from '../../../../redux/actions/showroomSalesAction';
import { getDate, renderString, getAmount, getStatus } from '../../../../core/utility'
import { getUserID, getMobile } from '../../../../core/services/rbacServices'
import { refundToken, getSaleDocs } from '../../../../core/services/franchiseServices'
import './table_drawer.scss'
import { setNotification } from '../../../../redux/actions/notificationAction'
import TableDrawer from './TableDrawer'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import { makeStyles } from "@material-ui/core/styles";
import RefundConfirmPopup from '../RefundConfirmPopup'
import SoldPopup from '../Modal'
import { CallIcon } from '../../../../core/utility/iconHelper'
import { callToCustomer } from '../../../../core/services/biddingServices'
import CallAction from './CallAction'


const TableColumns = [
  { id: 'soldDate', label: 'Sale Date' },
  { id: 'registrationNumber', label: 'Registration number' },
  { id: 'customerName', label: 'Name' },
  { id: 'Mobile Number', label: 'Customer Mobile Number' },
  { id: 'storeName', label: 'Showroom Name' },
  { id: 'paymentStatus', label: 'Sale Status' },
  { id: 'margin', label: 'Margin' }
]

const FullTableColumns = [
  { id: 'soldDate', label: 'Sale Date' },
  { id: 'registrationNumber', label: 'Registration number' },
  { id: 'customerName', label: 'Name' },
  { id: 'Mobile Number', label: 'Customer Mobile Number' },
  { id: 'rsType', label: 'Referral Source' },
  { id: 'storeName', label: 'Showroom Name' },
  { id: 'paymentStatus', label: 'Sale Status' },
  { id: 'margin', label: 'Margin' }
]

class StoreLeads extends Component {

  state = {
    paymentsIds: [],
    data: [],
    drawerClass: 'table-drawer disable',
    open: false,
    markAsSold: false,
    leadID: '',
    prevLeadId: '',
    rowInfo: '',
    selectedID: '',
    refundOpen: false,
    refundPayload: {},
    soldPopupOpen: false,
    splittedUrls: [],
    saleData: [],
    openCall: false,
    callPayload: {},
    name: ''
  }

  pageChange = (pageNum) => {
    const { onPageChange } = this.props
    this.setState({ drawerClass: 'table-drawer disable' })
    onPageChange(pageNum)
  }

  componentDidMount() {
    const { dispatch, storeID } = this.props
    dispatch(getShowRoomSales({ pageNum: 1, storeId: storeID, paymentStatus: 'TOKEN' }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps && prevProps.status !== this.props.status) {
      this.setState({ drawerClass: 'table-drawer disable' })
    }
  }

  onRowClick = (info) => {
    this.setState({ saleData: [] })
    const { status } = this.props
    let splitUrls = info.tranactionreciptUrls.split('$')
    this.setState({ splittedUrls: splitUrls })
    const { prevLeadId, drawerClass } = this.state
    this.setState({ prevLeadId: info.leadId, rowInfo: info })
    const { leadId: leadIdd } = info
    if (!prevLeadId) {
      this.setState({ drawerClass: 'table-drawer open', selectedID: info.leadId })
    }
    if (prevLeadId === leadIdd) {
      if (drawerClass === 'table-drawer disable') {
        this.setState({ drawerClass: 'table-drawer open' })
      } else {
        this.setState({ drawerClass: 'table-drawer disable' })
      }
    }
    else {
      this.setState({ drawerClass: 'table-drawer open' })
    }
    this.setState({ prevLeadId: leadIdd, selectedID: info.leadId })
    window.scrollTo(0, 0)
    if (status === 'FULL') {
      getSaleDocs(info.leadId).
        then(saleDocResponse => {
          if (saleDocResponse.isValid) {
            this.setState({
              saleData: saleDocResponse.leadIdList
            })
          }
        })
    }
  }

  useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto"
    },
    table: {
      minWidth: 700
    },
    tableRow: {
      "&$selected, &$selected:hover": {
        backgroundColor: "#FBEEED"
      }
    },
    tableCell: {
      "$selected &": {
        color: "yellow"
      }
    },
    hover: {},
    selected: {}
  })
  )

  refundAmount = () => {
    this.setState({ refundOpen: true })
  }

  markAsSold = () => {
    this.setState({ soldPopupOpen: true })
  }

  closeSoldPopup = () => {
    this.setState({ soldPopupOpen: false })
  }

  closeRefundPopup = () => {
    this.setState({ refundOpen: false })
  }

  confirmRefund = () => {
    const { rowInfo } = this.state
    const { dispatch, onStatusChange } = this.props
    const payload = {
      leadId: rowInfo.leadId,
      invId: rowInfo.invId
    }
    dispatch(showLoader())
    refundToken(payload).
      then(refundResponse => {
        if (refundResponse.isValid) {
          this.setState({ refundOpen: false, drawerClass: 'table-drawer disable' })
          dispatch(setNotification('success', 'SUCCESS', refundResponse.message))
          onStatusChange('REFUND')
        }
        else {
          this.setState({ refundOpen: false, drawerClass: 'table-drawer disable' })
          dispatch(setNotification('danger', 'ERROR', refundResponse.message))
        }
      })
    setTimeout(() => {
      dispatch(hideLoader())
    }, 500)
  }

  getStatus = () => {
    const { status } = this.props
    if (status === 'TOKEN' || status === 'FULL')
      return true
    else return false
  }

  callCustomer = (mobileNumber, leadId, name) => {
    const payload = {
      fromNumber: getMobile(),
      toNumber: mobileNumber,
      userId: getUserID(),
      leadId: leadId,
      callComments: 'Store Manager'
    }
    this.setState({ openCall: true, callPayload: payload, name })
  }

  onCallCustomer = () => {
    const { dispatch } = this.props
    const { callPayload } = this.state
    callToCustomer(callPayload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({ openCall: false, callPayload: {}, name: '' })
          dispatch(setNotification('success', 'SUCCESS', 'Call started'))
        }
      })
  }

  closeCallAction = () => {
    this.setState({ openCall: false, callPayload: {}, name: '' })
  }

  render() {
    const { list, total, page, status, filetrDrawer } = this.props
    const { drawerClass, open, selectedID, rowInfo, refundOpen, soldPopupOpen, splittedUrls, saleData, openCall, name } = this.state
    return (
      <div className="table-container">
        <div className="table-wraper">
          <Table size="small">
            <TableHead>
              <TableRow>
                {status === 'FULL' ?
                FullTableColumns.map(column => (
                  <TableCell key={column.id}>
                    {column.label}
                  </TableCell>
                )) :
                TableColumns.map(column => (
                  <TableCell key={column.id}>
                    {column.label}
                  </TableCell>
                ))
              }
                
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Boolean(list.length) && list.map(info => {
                  const {
                    soldDate,
                    registrationNumber,
                    customerName,
                    customerMobileName,
                    paymentStatus,
                    margin,
                    leadId,
                    storeName,
                    rsType
                  } = info
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={leadId}
                      onClick={() => this.onRowClick(info)}
                      selected={selectedID === info.leadId}
                      classes={{ hover: this.useStyles.hover, selected: this.useStyles.selected }}
                      className={this.useStyles.tableRow}>
                      <TableCell>
                        <p>{getDate(soldDate)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(registrationNumber)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(customerName)}</p>
                      </TableCell>
                      <TableCell>
                        <p>
                          {renderString('XXXXXXXXXX')}
                          <span><img src={CallIcon} style={{ width: 20, cursor: "pointer", marginLeft: '6px' }} alt="Call To Customer" onClick={() => this.callCustomer(customerMobileName, leadId, customerName)} /></span>
                        </p>
                      </TableCell>
                      {status === 'FULL' && (
                        <TableCell>
                          <p>{renderString(rsType)}</p>
                        </TableCell>
                      )}
                      <TableCell>
                        <p>{renderString(storeName)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(paymentStatus)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{getAmount(margin)}</p>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(list.length) ?
                <Pagination
                  className="float-right"
                  current={page}
                  locale={localeInfo}
                  total={total}
                  pageSize={15}
                  onChange={this.pageChange}
                /> :
                <NoResultFound />
            }
          </div>
          <RefundConfirmPopup
            open={refundOpen}
            onClose={this.closeRefundPopup}
            onConfirm={this.confirmRefund}
          />
          {
            soldPopupOpen &&
            <SoldPopup
              open={soldPopupOpen}
              rowInfo={rowInfo}
              onClose={this.closeSoldPopup}
            />
          }
          <CallAction
            open={openCall}
            onClose={this.closeCallAction}
            onYes={this.onCallCustomer}
            name={name}
          />
        </div>
        {
          list && Boolean(list.length) && this.getStatus() &&
          <TableDrawer
            drawer={Boolean(list.length) ? filetrDrawer ? 'table-drawer disable' : drawerClass : 'table-drawer disable'}
            transitionDuration={{ enter: 500, exit: 1000 }}
            open={open}
            onRefund={this.refundAmount}
            onMarkAsSold={this.markAsSold}
            rowInfo={rowInfo}
            splittedUrls={splittedUrls}
            status={status}
            saleData={saleData}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  list: state.showroomSales.manageLeadsResponse,
  total: state.showroomSales.count,
  page: state.showroomSales.pageNum
})

export default connect(mapStateToProps)(StoreLeads)