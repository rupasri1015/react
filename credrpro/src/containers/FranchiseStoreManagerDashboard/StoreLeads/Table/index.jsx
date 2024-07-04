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
import { getDate, renderString, getAmount, getBikeName } from '../../../../core/utility'
import { getShowRoomLeads } from '../../../../redux/actions/showroomLeadsAction';
import './table_drawer.scss'
import { getCityID, getUserID, getMobile } from '../../../../core/services/rbacServices'
import { userTypeDetails } from '../../../../core/services/authenticationServices';
import SoldPopup from '../Modal'
import { getStoreBikes, markAsSold, getBikeStatus } from '../../../../core/services/franchiseServices'
import { setNotification } from '../../../../redux/actions/notificationAction'
import TableDrawer from './TableDrawer'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import AssignInventory from '../../components/AssignInventory'
import { makeStyles } from "@material-ui/core/styles";
import moment from 'moment'
import { CallIcon } from '../../../../core/utility/iconHelper'
import { callToCustomer } from '../../../../core/services/biddingServices'
import CallAction from './CallAction'

const columns = [
  { id: 'leadCreatedDate', label: 'Lead Created Date' },
  { id: 'regnum', label: 'Registration number' },
  { id: 'mmv', label: 'MMV' },
  { id: 'name', label: 'Name' },
  { id: 'leadMedium', label: 'Lead Source' },
  { id: 'number', label: 'Mobile Number' },
  { id: 'bikeprice', label: 'CSP' }
]

class StoreLeads extends Component {

  state = {
    paymentsIds: [],
    data: [],
    drawerClass: 'table-drawer disable',
    open: false,
    pendingPaymentAmount: 0,
    walletBallance: 0,
    markAsSold: false,
    leadID: '',
    prevLeadId: '',
    rowInfo: '',
    assignInventoryOpen: false,
    storeBikeList: [],
    selectedID: '',
    showSoldMessage: false,
    showOnlyAssignInventory: false,
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
    dispatch(getShowRoomLeads({ pageNum: 1, storeID: storeID, cityID: getCityID() }));
  }

  onRowClick = (info) => {
    if (info.regnum) {
      getBikeStatus(info.regnum).
        then(apiResponse => {
          if (apiResponse.isValid) {
            this.setState({ showAssignText: false })
            if (apiResponse.bikeStatus === 'AVAILABLE')
              this.setState({ showOnlyAssignInventory: false, showSoldMessage: true })
            if (apiResponse.bikeStatus === 'SOLD')
              this.setState({ showOnlyAssignInventory: true })
          }
          else {
            this.setState({ showOnlyAssignInventory: true, showSoldMessage: false })
          }
        })
    }
    else {
      this.setState({ showOnlyAssignInventory: true, showAssignText: true })
    }
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

  openMarkAsSold = () => {
    this.setState({ markAsSold: true })
  }

  closeSoldPopup = () => {
    this.setState({ markAsSold: false })
  }

  markAsToken = (finalPrice, tokenAmount) => {
    const { rowInfo } = this.state
    const { dispatch, storeID } = this.props
    dispatch(showLoader())
    const payload = {
      amountPaid: tokenAmount,
      regnum: rowInfo.regnum,
      name: rowInfo.name,
      number: rowInfo.number,
      make: rowInfo.make,
      model: rowInfo.model,
      variant: rowInfo.variant,
      city: rowInfo.city,
      leadCreatedDate: rowInfo.leadCreatedDate,
      bikeprice: Math.round(rowInfo.bikeprice).toString(),
      discount: rowInfo.discount,
      storeId: userTypeDetails().userType.storeId,
      leadID: rowInfo.leadId,
      // amountPaid: rowInfo.amountPaid,
      paymentStatus: 'Token',
      updatedBy: getUserID(),
      requestType: '',
      paperTransferCost: '',
      insuranceCost: '',
      finalBikePrice: finalPrice,
      createdDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
    markAsSold(payload)
      .then(soldResponse => {
        if (soldResponse.isValid) {
          this.setState({ markAsSold: false, drawerClass: 'table-drawer disable' })
          dispatch(setNotification('success', 'SUCCESS', soldResponse.message))
          dispatch(getShowRoomLeads({ pageNum: 1, storeID: storeID, cityID: getCityID() }));
          window.open(soldResponse.generatedURl)
        }
        else {
          this.setState({ markAsSold: false, drawerClass: 'table-drawer disable' })
          dispatch(setNotification('danger', 'ERROR', soldResponse.message))
        }
      })
    setTimeout(() => {
      dispatch(hideLoader())
    }, 500)
  }

  assignInventory = () => {
    const { storeID, dispatch } = this.props
    getStoreBikes(storeID).
      then(bikeResponse => {
        if (bikeResponse.isValid) {
          this.setState({ storeBikeList: bikeResponse.bikesinstore, assignInventoryOpen: true })
        }
        else {
          dispatch(setNotification('danger', 'ERROR', bikeResponse.message))
        }
      })
  }

  closeAssignInventory = () => {
    this.setState({ assignInventoryOpen: false })
  }

  assignedInventory = () => {
    const { dispatch, storeID } = this.props
    this.setState({ assignInventoryOpen: false, drawerClass: 'table-drawer disable' })
    dispatch(setNotification('success', 'SUCCESS', 'Bike assigned successfully'))
    dispatch(getShowRoomLeads({ pageNum: 1, storeID: storeID, cityID: getCityID() }));
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
      if(apiResponse.isValid){
        this.setState({ openCall: false, callPayload: {}, name: '' })
        dispatch(setNotification('success', 'SUCCESS', 'Call started'))
      }
    })
  }

  closeCallAction = () => {
    this.setState({ openCall: false, callPayload: {}, name: '' })
  }

  render() {
    const { list, total, page, filetrDrawer } = this.props
    const { pendingAmount, drawerClass, open, pendingPaymentAmount, walletBallance, markAsSold, rowInfo, assignInventoryOpen, storeBikeList, selectedID, showSoldMessage, showOnlyAssignInventory, showAssignText, openCall, name } = this.state
    return (
      <div className="table-container">
        <div className="table-wraper">
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
                Boolean(list.length) && list.map(info => {
                  const {
                    leadCreatedDate,
                    regnum,
                    name,
                    make,
                    model,
                    variant,
                    number,
                    bikeprice,
                    leadId,
                    leadMedium
                  } = info
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={leadId}
                      onClick={() => this.onRowClick(info)}
                      // onClick={() => this.handleRowChange(info)}
                      selected={selectedID === info.leadId}
                      classes={{ hover: this.useStyles.hover, selected: this.useStyles.selected }}
                      className={this.useStyles.tableRow}>
                      <TableCell>
                        <p>{getDate(leadCreatedDate)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(regnum)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{getBikeName(make, model, variant)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(name)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(leadMedium)}</p>
                      </TableCell>
                      <TableCell>
                        <p>
                          {renderString('XXXXXXXXX')}
                          <span><img src={CallIcon} style={{ width: 20, cursor: "pointer", marginLeft: '6px' }} alt="Call To Customer" onClick={() => this.callCustomer(number, leadId, name)} /></span>
                        </p>
                      </TableCell>
                      <TableCell>
                        <p>{getAmount(bikeprice)}</p>
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
        </div>
        <TableDrawer
          // drawer={Boolean(list.length) ? drawerClass : 'table-drawer disable'}
          drawer={Boolean(list.length)  ? drawerClass : 'table-drawer disable'}
          pendingAmount={pendingAmount}
          transitionDuration={{ enter: 500, exit: 1000 }}
          open={open}
          pendingPaymentAmount={pendingPaymentAmount}
          walletBallance={walletBallance}
          OnInitiateRazorPayPayment={this.initiateRazorPay}
          onPayUsingWalletAndRazor={this.payUsingWalletAndRazor}
          onRedeemFromWallet={this.redeemFromWallet}
          onMarkAsSold={this.openMarkAsSold}
          onAssignInventory={this.assignInventory}
          rowInfo={rowInfo}
          showSoldMessage={showSoldMessage}
          showOnlyAssignInventory={showOnlyAssignInventory}
          showAssignText={showAssignText}
        />
        {
          markAsSold &&
          <SoldPopup
            open={markAsSold}
            onClose={this.closeSoldPopup}
            rowInfo={rowInfo}
            onMarkAsSoldToken={this.markAsToken}
            fromSales={false}
          />
        }
        {
          assignInventoryOpen &&
          <AssignInventory
            open={assignInventoryOpen}
            onClose={this.closeAssignInventory}
            storeBikeList={storeBikeList}
            rowInfo={rowInfo}
            onAssignedInventory={this.assignedInventory}
          />
        }
        <CallAction
          open={openCall}
          onClose={this.closeCallAction}
          onYes={this.onCallCustomer}
          name={name}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  list: state.showroom.storeLead,
  total: state.showroom.count,
  page: state.showroom.pageNum
})

export default connect(mapStateToProps)(StoreLeads)