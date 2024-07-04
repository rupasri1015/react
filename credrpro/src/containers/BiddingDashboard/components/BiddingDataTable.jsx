import React, { Component } from 'react'
import { connect } from 'react-redux'
import { biddingList, resetBiddingList } from '../../../redux/actions/biddingListAction'
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
import { getDate, getAmount, getBikeName, getStatus, getMapedStatus, renderString } from '../../../core/utility'
import Timer from './Timer'
import Chip from '@material-ui/core/Chip';
import { getRole, getUserName, getUserID, getMobile } from '../../../core/services/rbacServices'
import edit from '../../../shared/img/icons/edit-icon.svg'
import { CallIcon, WhiteCallIcon } from '../../../core/utility/iconHelper'
import CallToCustomerDialog from './calltoCustomer'
import CustomerEPEditDialog from './priceEditDialog'
import { setNotification } from '../../../redux/actions/notificationAction'
import OtpVerification from './OtpVerification'
import { getBiddingDetails, sendRebidOtp } from '../../../core/services/biddingServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
const rows = [
  { id: 'leadCreatedDate', label: 'Lead\u00a0Created\u00a0Date' },
  { id: 'orderCreatedDate', label: 'Order\u00a0Created\u00a0Date' },
  { id: 'auctionDate', label: 'Auction\u00a0Date', },
  { id: 'customerDetails', label: 'Customer\u00a0Name', },
  { id: 'vehicleDetails', label: 'Vehicle\u00a0Details', },
  { id: 'outletDetails', label: 'Outlet\u00a0Details', },
  { id: 'biddingDetails', label: 'Bidding\u00a0Details', },
  { id: 'leadVehicleSellType', label: 'Lead\u00a0Type', },
  { id: 'customerExpectedPrice', label: 'Customer Expected Price' },
  { id: 'ADIY', label: "ADIY Inspector" },
  { id: 'cpName', label: 'Caller\u00a0Name', },
  { id: 'details', label: 'Details' },
  { id: 'actions', label: 'Actions' }
];

const shdRows = [
  { id: 'leadCreatedDate', label: 'Lead\u00a0Created\u00a0Date' },
  { id: 'orderCreatedDate', label: 'Order\u00a0Created\u00a0Date' },
  { id: 'auctionDate', label: 'Auction\u00a0Date', },
  { id: 'customerDetails', label: 'Customer\u00a0Name', },
  { id: 'vehicleDetails', label: 'Vehicle\u00a0Details', },
  { id: 'outletDetails', label: 'Outlet\u00a0Details', },
  { id: 'biddingDetails', label: 'Bidding\u00a0Details', },
  { id: 'leadVehicleSellType', label: 'Lead\u00a0Type', },
  { id: 'customerExpectedPrice', label: 'Customer Expected Price' },
  { id: 'leadSQI', label: 'Lead SQI' },
  { id: 'ADIY', label: "ADIY Inspector" },
  { id: 'cpMaxProcurementPrice', label: 'Procurement Price' },
  { id: 'cpName', label: 'Caller\u00a0Name', },
  { id: 'details', label: 'Details' }
]

class BiddingData extends Component {

  state = {
    anchorElement: null,
    auctionData: null,
    status: '',
    sellType: '',
    callOpen: false,
    rowData: {},
    editPrice: false,
    openOtp: false
  }

  componentDidMount() {
    const { dispatch, status } = this.props
    dispatch(biddingList({ pageNum: 1, status, userId: getUserID() }))
  }

  componentDidUpdate() {
    const { biddingListParameters, onStatusChange, isRegistrationSearch } = this.props
    if (isRegistrationSearch && biddingListParameters && biddingListParameters.length === 1) {
      onStatusChange(getMapedStatus(biddingListParameters[0].status))
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetBiddingList())
  }

  setAnchorElement = (anchorElement = null, auctionData = null) => {
    if (auctionData) {
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

  rebid = () => {
    const { onRebid, dispatch, onBidDetails } = this.props
    const { auctionData } = this.state
    dispatch(showLoader())
    // if(getRole() === "SHD_COMMISSION" && auctionData.cityId === "1" && this.state.auctionData.auctionTransactionId )
    // {
    //   getBiddingDetails(this.state.auctionData.auctionTransactionId)
    //   .then(response => {
    //    if(response.isValid)
    //    {
    //     if ( response.auctionBidderInfoList && response.auctionBidderInfoList[0] && response.auctionBidderInfoList[0].acutionList.length > 1 ) {
    //       // 9916006434
    //       // 9700333658
    //       sendRebidOtp(9591039597,auctionData.registrationNumber)
    //         .then(apiResponse => {
    //           if (apiResponse.isValid) {
    //             dispatch(hideLoader())
    //             this.setState({ openOtp: true })
    //             this.setState({auctionData:auctionData})
    //             dispatch(setNotification('success', "Success", apiResponse.message))
    //           }
    //           else
    //          {
    //           dispatch(hideLoader())
    //           dispatch(setNotification('danger', "Error", apiResponse.message))
    //          }
    //         })
    //     }
    //     else {
    //       dispatch(hideLoader())
    //       onRebid(auctionData)
    //     }

    //    }
    //    else{
    //     dispatch(hideLoader())
    //     dispatch(setNotification('danger', "Error", response.message))
    //    }
    //   })
    // }
    // else {
    dispatch(hideLoader())
    onRebid(auctionData)
    // }


    // if (getRole() === "SHD_COMMISSION") {
    //   if (this.state.auctionData.valuatorStoreName.toLowerCase().includes("online")) {
    //     if (onRebid) {
    //       onRebid(this.state.auctionData)
    //     }
    //   }
    //   else {
    //     dispatch(setNotification('danger', "Error", "Access Denied : OEM Lead"))
    //   }
    // }
    // else {
    // if (onRebid) {
    //   onRebid(this.state.auctionData)
    // }
    // }

    this.setAnchorElement()
  }

  markedAsDrop = () => {
    const { onMarkedAsDroped } = this.props
    if (onMarkedAsDroped) {
      onMarkedAsDroped(this.state.auctionData)
    }
    this.setAnchorElement()
  }

  changeRegistrationNumber = () => {
    const { onChangeRegistrationNumber } = this.props
    if (onChangeRegistrationNumber) {
      onChangeRegistrationNumber(this.state.auctionData)
    }
    this.setAnchorElement()
  }

  handlePageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }

  onShowSizeChange = (current, pageSize) => {
    console.log(current);
    console.log(pageSize);
  }

  customerDetails = leadCustId => {
    const { onCustomerDetails } = this.props
    if (onCustomerDetails) {
      onCustomerDetails(leadCustId)
    }
  }

  bikeDetails = leadId => {
    const { onBikeDetails } = this.props
    if (onBikeDetails) {
      onBikeDetails(leadId)
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


  bidDetails = details => {
    const { onBidDetails } = this.props
    if (onBidDetails) {
      onBidDetails(details)
    }
  }

  getMenuItems = () => {

    const { status, auctionData, sellType } = this.state
    const menu = []
    switch (status) {
      case 'SELL':
        if (getUserID() === 415631) {
          menu.push(<MenuItem key="rebid" onClick={this.rebid}>Rebid</MenuItem>)
          menu.push(<MenuItem key="droped" onClick={this.markedAsDrop}>Mark as Dropped</MenuItem>)
          menu.push(<MenuItem key="change" onClick={this.changeRegistrationNumber}>Change Registraion Number</MenuItem>)

        }
        else {
          menu.push(<MenuItem key="droped" onClick={this.markedAsDrop}>Mark as Dropped</MenuItem>)
          menu.push(<MenuItem key="change" onClick={this.changeRegistrationNumber}>Change Registraion Number</MenuItem>)

        }
        break
      // case 'EXCHANGE':
      case 'DROPPED':
        menu.push(<MenuItem key="rebid" onClick={this.rebid}>Rebid</MenuItem>)
        menu.push(<MenuItem key="change" onClick={this.changeRegistrationNumber}>Change Registraion Number</MenuItem>)
        break
      case 'Central_Tagging_Inspected':
        sellType !== 'TP' && menu.push(<MenuItem key="rebid" onClick={this.rebid}>Rebid</MenuItem>)
        menu.push(<MenuItem key="droped" onClick={this.markedAsDrop}>Mark as Dropped</MenuItem>)
        menu.push(<MenuItem key="change" onClick={this.changeRegistrationNumber}>Change Registraion Number</MenuItem>)
        break
      case 'FOLLOWUP':
        menu.push(<MenuItem key="droped" onClick={this.markedAsDrop}>Mark as Dropped</MenuItem>)
        menu.push(<MenuItem key="change" onClick={this.changeRegistrationNumber}>Change Registraion Number</MenuItem>)
        break
      default:
        menu.push(<MenuItem key="rebid" onClick={this.rebid}>Rebid</MenuItem>)
        menu.push(<MenuItem key="droped" onClick={this.markedAsDrop}>Mark as Dropped</MenuItem>)
        menu.push(<MenuItem key="change" onClick={this.changeRegistrationNumber}>Change Registraion Number</MenuItem>)
    }
    return menu
  }

  getCount = () => {
    const { onGoingCount, followUpCount, exchangeCount, dropCount, count, status, ctInspectedCount, pageNum, auctionCompletedCount } = this.props
    switch (status.toLowerCase()) {
      case 'all': return count
      case 'ongoing':
      case 'auction_completed': return auctionCompletedCount
      case 'followup': return followUpCount
      case 'exchange': return exchangeCount
      case 'dropped': return dropCount
      case 'central_tagging_inspected': return ctInspectedCount
      default: return count
    }
  }

  onOpenCallTocustomer = () => {
    this.setState({
      callOpen: true
    })
  }

  onOpenEditCEP = () => {
    this.setState({
      editPrice: true
    })
  }

  onCloseCall = () => {
    this.setState({
      callOpen: false,
      editPrice: false
    })
  }

  handleRowChange = (list) => {
    this.setState({
      rowData: list
    })
  }

  getRows = () => {
    if (getRole() !== 'SHD_COMMISSION')
      return rows
    else return shdRows
  }
  handleRebid = () => {
    const { onRebid } = this.props
    const { auctionData } = this.state
    onRebid(this.state.auctionData)
  }

  handleOtpClose = () => {
    this.setState({ openOtp: false })
  }
  render() {
    const { biddingListParameters, pageNum, onRefreshPage } = this.props
    const { anchorElement, status, sellType, callOpen, rowData, editPrice, openOtp, auctionData } = this.state
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
              Boolean(biddingListParameters.length) &&
              biddingListParameters.map((auctionData, index) => {
                return (
                  <>
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={`${auctionData.auctionTransactionId}${index}`}
                      onClick={() => this.handleRowChange(auctionData)}
                    >
                      <TableCell>
                        {getDate(auctionData.leadCreateAt)}
                      </TableCell>
                      <TableCell>
                        {getDate(auctionData.orderCreatedAt)}
                      </TableCell>
                      <TableCell>
                        {getDate(auctionData.endTime)}
                      </TableCell>
                      <TableCell>
                        <p><img src={WhiteCallIcon} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} onClick={this.onOpenCallTocustomer} alt='CallIcon' /> {`${auctionData.leadCustName}`} </p>
                        {/* <p className="link" onClick={() => this.customerDetails(auctionData.leadCustId)}>{`${auctionData.leadCustName}`}</p> */}
                        {/* <p>{auctionData.leadCustNumber}</p> */}
                      </TableCell>
                      <TableCell>
                        <p className="link" onClick={() => this.bikeDetails(auctionData.leadId)}>{getBikeName(auctionData.bikeMake, auctionData.bikeModel, auctionData.bikeVariant)}</p>
                        <p>{auctionData.registrationNumber}</p>
                        <small>
                          <span style={{ backgroundColor: "#dce7fd", padding: "2px", marginRight: "2px" }}>{auctionData.leadId}</span>
                          {Number(auctionData.premiumBikeFlag) === 1 && <span style={{ backgroundColor: '#E98000', color: 'white', textAlign: 'center', width: '3rem', borderRadius: '4px', padding: '2px 4px' }}>Premium</span>}
                        </small>
                      </TableCell>
                      <TableCell>
                        <p className="link" onClick={() => this.valuatorDetails(auctionData)}>{auctionData.valuatorName}</p>
                        <p>{auctionData.valuatorNumber}</p>
                      </TableCell>
                      <TableCell>
                        <p >{getAmount(auctionData.highestBid)}</p>
                        {/* <p>{auctionData.highestBidderName}</p> */}
                        <button
                          className="btn-outline--small blue"
                          onClick={() => this.bidDetails(auctionData.leadId)}
                        >
                          View&nbsp;All
                        </button>
                      </TableCell>
                      <TableCell>
                        <p >{renderString(auctionData.leadVehicleSellType)}</p>
                      </TableCell>
                      <TableCell>
                        <p> <img src={edit} onClick={this.onOpenEditCEP} style={{ width: '18px', marginRight: '5px', cursor: 'pointer' }} alt="edit" /> {getAmount(auctionData.customerExpectedPrice)} </p>
                      </TableCell>
                      {getRole() === 'SHD_COMMISSION' &&
                        <TableCell>
                          <p>{renderString(auctionData.leadSQI)}</p>
                        </TableCell>}
                      {
                        <TableCell>
                          <p>{renderString(auctionData.cldServiceRunnerName)}</p>
                        </TableCell>
                      }
                      {
                        getRole() === 'SHD_COMMISSION' &&
                        <TableCell>
                          <p>  {getAmount(auctionData.cpMaxProcurementPrice)} </p>
                        </TableCell>
                      }
                      <TableCell>
                        <div>
                          <p style={{ fontSize: '12px' }}>{renderString(auctionData.cpCallerName)}
                          </p>
                        </div>
                        {
                          auctionData.cpStatus && auctionData.cpStatus !== '-' &&
                          <div style={{ color: 'blue', border: '1px solid #0000FF', backgroundColor: '#FFF', borderRadius: '7px', padding: '3px 3px', marginTop: '3px', fontSize: '9px', paddingLeft: '15px' }}>
                            {auctionData.cpStatus}
                          </div>
                        }
                      </TableCell>
                      <TableCell>
                        {
                          Boolean(auctionData.status === 'AUCTION_STARTED' || auctionData.status === 'REAUCTION_STARTED') && <Timer time={auctionData.endTime} />
                        }
                        {
                          Boolean(auctionData.status !== 'AUCTION_STARTED' && auctionData.status !== 'REAUCTION_STARTED') && <p style={{ marginLeft: 5 }}>{getStatus(auctionData.status)}</p>
                        }
                        <button
                          className="btn-outline--small blue"
                          onClick={() => this.viewSummary(auctionData)}
                        >
                          View&nbsp;Summary
                        </button>
                      </TableCell>
                      <TableCell>
                          {
                            getRole() !== 'SHD_COMMISSION' &&
                            Boolean(auctionData.status !== 'AUCTION_STARTED' || auctionData.status !== 'REAUCTION_STARTED') ?
                              <img alt="Menu" role="button" src={ActionIcon} className="action-icon" style={{ padding: 5, boxSizing: 'content-box' }} id={auctionData.auctionTransactionId} onClick={(e) => this.setAnchorElement(e.currentTarget, auctionData)} /> :
                              <img alt="Menu" role="button" src={ActionIcon} className="action-icon" style={{ padding: 5, boxSizing: 'content-box' }} id={auctionData.auctionTransactionId} />
                          }
                        </TableCell>
                    </TableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(biddingListParameters.length) ?
              <Pagination
                className='float-right'
                showQuickJumper
                showSizeChanger={false}
                total={this.getCount()}
                pageSize={10}
                current={pageNum}
                locale={localeInfo}
                onShowSizeChange={this.onShowSizeChange}
                onChange={this.handlePageChange}
              /> :
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
          {
            Boolean(status) && this.getMenuItems()
          }
        </Menu>
        {
          callOpen &&
          <CallToCustomerDialog
            callOpen={callOpen}
            onClose={this.onCloseCall}
            rowData={rowData}
            onRefreshPage={onRefreshPage}
          />
        }
        {
          openOtp &&
          <OtpVerification
            open={openOtp}
            onRebid={this.handleRebid}
            onClose={this.handleOtpClose}
            auctionData={auctionData} />
        }
        {
          editPrice &&
          <CustomerEPEditDialog
            editPrice={editPrice}
            onClose={this.onCloseCall}
            rowData={rowData}
            onRefreshPage={onRefreshPage}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  biddingListParameters: state.biddingList.biddingListParameters,
  count: state.biddingList.count,
  onGoingCount: state.biddingList.onGoing,
  followUpCount: state.biddingList.followUp,
  exchangeCount: state.biddingList.exchange,
  dropCount: state.biddingList.drop,
  ctInspectedCount: state.biddingList.centralTagInspectedCount,
  pageNum: state.biddingList.pageNum,
  auctionCompletedCount: state.biddingList.auctionCompletedCount
})

export default connect(mapStateToProps)(BiddingData)