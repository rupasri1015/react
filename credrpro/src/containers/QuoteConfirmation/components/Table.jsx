import React, { FC, useState, useEffect, useRef } from 'react'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { renderString, getAmount, renderDate, getDate } from '../../../core/utility/stringUtility'
import { setNotification } from "../../../redux/actions/notificationAction"
import CallToCustomer from './CallActionPopUp'
import OTPPopup from './OTPPopup'
import { useDispatch } from "react-redux"
import { callToCareCustomer, sendOtpToCustomer, confirmOTP } from '../../../core/services/shdServices'
import { getMobile, getRole, getUserID } from '../../../core/services/rbacServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import { Pagination } from '@material-ui/lab';
import NoResultsFound from '../../../shared/components/NoResultFound'
import './Error.scss'
import Timer from './Timer'
import { Button } from 'rsuite'
import { makeStyles } from "@material-ui/core/styles";
import { updateStatus, getHistoryData } from '../../../core/services/shdServices'
import UpdateStatusQuote from './UpdateStatusPop'
import PendingDrawer from './PendingDrawer'
import FollowupDrawer from './FollowUpDrawer'
import UpdateDropStatus from './UpdateDropStatus'
import DropDrawer from './DropDrawer'
import SoldStatusDrawer from './SoldStatusDrawer'
import moment from 'moment'
import { getConfirmationList } from '../../../redux/actions/quoteConfirmationAction'
import EditDialog from './EditModelComponent'
import { EditIcon } from '../../../core/utility/iconHelper'
import StatusSlider from '../StatusSlider'
import CustomerEPEditDialog from './EdiitPriceModal'
import { leadDetails } from '../../../redux/actions/biddingDetailsAction'
import { leadLifecycleDetails } from '../../../redux/actions/biddingLifecycleAction'
import { getShdOrderDeduction } from '../../../redux/actions/shdOrderDeductionAction'

const rows = [
  { id: 'leadId', label: 'Lead\u00a0Id', },
  { id: 'leadcreatedDate', label: 'Lead\u00a0Created Date' },
  { id: 'customerName', label: 'Customer\u00a0Details', },
  { id: 'regNumber', label: 'Vehicle Details', },
  { id: 'cityName', label: 'City Name' },
  { id: 'outletDetails', label: 'Outlet\u00a0Details', },
  // { id: 'auctionCompletedDate', label: 'Auction\u00a0Date' },
  { id: 'customerExpectedPrice', label: ' Customer Expected Price' },
  { id: 'sqi', label: 'Lead SQI' },
  { id: 'auctionStatus', label: 'Auction Status' },
  // { id: 'totalCommission', label: 'Commission' },
  // { id: 'regNumber', label: 'Registration Number', },
  { id: 'averageCpPrice', label: 'CP Procurement Price' },
  { id: 'cpMaxProcurementPrice', label: 'Procurement Price' },
  { id: 'action', label: 'Action' }
];

const rowsForPending = [
  { id: 'leadId', label: 'Lead\u00a0Id', },
  { id: 'leadcreatedDate', label: 'Lead\u00a0Created Date' },
  { id: 'auctionCompletedDate', label: 'Auction\u00a0Date' },
  { id: 'customerName', label: 'Customer\u00a0Details', },
  { id: 'regNumber', label: 'Vehicle Details', },
  { id: 'cityName', label: 'City Name' },
  { id: 'agentName', label: 'Agent\u00a0Name' },
  // { id: 'orderAmount', label: 'Final Quote Price' },
  // { id: 'outletDetails', label: 'Outlet\u00a0Details', },
  { id: 'highestBid', label: 'Highest Bid'},
  { id: 'customerExpectedPrice', label: ' Customer Expected Price' },
  { id: 'leadSQI', label: 'Lead SQI' },
  // { id: 'totalCommission', label: 'Commission' },
  { id: 'averageCpPrice', label: 'CP Procurement Price' },
  { id: 'cpMaxProcurementPrice', label: 'Procurement Price' },
  { id: 'auctionStatus', label: 'Auction Status' }
]
const rowsForSold = [
  { id: 'leadId', label: 'Lead\u00a0Id', },
  { id: 'leadcreatedDate', label: 'Lead\u00a0Created Date' },
  { id: 'auctionCompletedDate', label: 'Auction\u00a0Date' },
  { id: 'soldData', label: 'Sold\u00a0Data' },
  { id: 'customerName', label: 'Customer\u00a0Details', },
  { id: 'regNumber', label: 'Vehicle Details', },
  { id: 'cityName', label: 'City Name' },
  { id: 'agentName', label: 'Agent\u00a0Name' },
  // { id: 'quotePrice', label: 'Final\u00a0Quote\u00a0Price' },
  { id: 'highestBid', label: 'Highest Bid'},
  { id: 'customerExpectedPrice', label: ' Customer Expected Price' },
  { id: 'leadSQI', label: 'Lead SQI' },
  { id: 'averageCpPrice', label: 'CP Procurement Price' },
  { id: 'cpMaxProcurementPrice', label: 'Procurement Price' },
  { id: 'auctionStatus', label: 'Auction Status' }
]
const rowsForDrop = [
  { id: 'leadId', label: 'Lead\u00a0Id', },
  { id: 'leadcreatedDate', label: 'Lead\u00a0Created Date' },
  { id: 'auctionCompletedDate', label: 'Auction\u00a0Date' },
  { id: 'droppedDate', label: 'Dropped\u00a0Date' },
  { id: 'customerName', label: 'Customer\u00a0Details', },
  { id: 'regNumber', label: 'Vehicle Details', },
  { id: 'cityName', label: 'City Name' },
  { id: 'agentName', label: 'Agent\u00a0Name' },
  // { id: 'orderAmount', label: 'Final Quote Price' },
  { id: 'highestBid', label: 'Highest Bid'},
  { id: 'customerExpectedPrice', label: ' Customer Expected Price' },
  { id: 'leadSQI', label: 'Lead SQI' },
  { id: 'averageCpPrice', label: 'CP Procurement Price' },
  { id: 'cpMaxProcurementPrice', label: 'Procurement Price' },
  // { id: 'regNumber', label: 'Registration Number', },
]

const rowsForFollowup = [
  { id: 'leadId', label: 'Lead\u00a0Id', },
  { id: 'leadcreatedDate', label: 'Lead\u00a0Created Date' },
  { id: 'auctionCompletedDate', label: 'Auction\u00a0Date' },
  { id: 'followupDate', label: 'Followup\u00a0Date' },
  { id: 'customerName', label: 'Customer\u00a0Details', },
  { id: 'regNumber', label: 'Vehicle Details', },
  { id: 'cityName', label: 'City Name' },
  { id: 'agentName', label: 'Agent\u00a0Name' },
  { id: 'reason', label: 'Followup\u00a0Reason' },
  // { id: 'outletDetails', label: 'Outlet\u00a0Details', },
  { id: 'highestBid', label: 'Highest Bid'},
  { id: 'customerExpectedPrice', label: ' Customer Expected Price' },
  { id: 'leadSQI', label: 'Lead SQI' },
  // { id: 'totalCommission', label: 'Commission' },
  { id: 'averageCpPrice', label: 'CP Procurement Price' },
  { id: 'cpMaxProcurementPrice', label: 'Procurement Price' },
  { id: 'auctionStatus', label: 'Auction Status' }
]

const ConfirmationTable = ({ onChangePage, status,handleStatusFilter, refreshPage, confirmList, currentPage, totalCount, onValuatorDetails, value, handleValue, onPendingRefresh, refreshDropPage,refreshFollowUpPage,refreshSoldPage }) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
      overflowX: "auto"
    },
    table: {
      '& .MuiTableCell-root': {
        minWidth: '8rem'
      }
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

  const [leadData, setLeadData] = useState({})
  const [callPopUp, setCallPopUp] = useState(false)
  const [otpPopup, setOtpPopUp] = useState(false)
  const [wrongOtp, setWrongOtp] = useState(false)
  const [selectedID, setSelectedID] = useState('');
  const [drawerClass, setDrawerclass] = useState('table-shd-drawer')
  const dispatch = useDispatch()
  const [rowInfo, setRowInfo] = useState({})
  const [statusPopUp, setStatusPopup] = useState(false)
  const [historyData, setHistoryData] = useState({});
  const [historyDataFollowup, setHistoryDataFollowUp] = useState({})
  const [dropstatusPopUp, setDropStatusPopup] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [leadId, setLeadId] = useState('')
  const [openSlider, setOpenSlider] = useState(false)
  const [editPrice, setEditPrice] = useState(false)
  const [price, setPrice] = useState('')
  const classes = useStyles()
  const [leadDetailsData, setLeadDetailsData] = useState({})
  const [enable, setEnable] = useState(true)
  const LeadInfo = useSelector((state) => state.biddingDetails.leadDetails)
  const LeadLifeInfo = useSelector((state => state.biddingListLifecycleReducer.leadDetails))
  const orderDedctions = useSelector((state) => state.orderDeductions.leadDetails)

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current
  };

  const prevStatus = usePrevious(status)

  useEffect(() => {
    if (prevStatus !== status) {
      setDrawerclass('table-shd-drawer')
    }
  }, [status])

  const handlePageChange = (event, pageNumber) => {
    if (pageNumber !== currentPage) {
      onChangePage(pageNumber)
    }
  }
  const handleRefresh = (value) => {
    setOpenSlider(false)
    refreshPage(value)
  }

  const onRefreshDrop = () => {
    setOpenSlider(false)
    refreshDropPage()
  }
  const onRefreshFollowUp = () => {
    setOpenSlider(false)
    refreshFollowUpPage()
  }
  const onRefreshSold = () => {
    setOpenSlider(false)
    refreshSoldPage()
  }

  const callToCustomer = (data) => {
    setLeadData(data)
    setCallPopUp(true)
  }
  const closeSlider = () => {
    setOpenSlider(false)
    setEnable(true)
    localStorage.removeItem("optionValue")
  }
  const handleEnable = val => {
    setEnable(val)
  }

  const sendOtp = async (data) => {
    setLeadData(data)
    setOtpPopUp(true)
    dispatch(showLoader())
    const apiResponse = await sendOtpToCustomer(data.leadId)
    dispatch(hideLoader())
    if (apiResponse.isValid) {
      dispatch(setNotification({
        type: 'success',
        message: apiResponse.message,
        title: 'Success'
      }))
    } else {
      dispatch(setNotification({
        type: 'error',
        message: apiResponse.message,
        title: 'Error'
      }))
    }
  }

  const callAction = async (data, info) => {
    const payload = {
      fromNumber: getMobile(),
      toNumber: info.userMobileNumber,
      userId: getUserID(),
      leadId: info.leadId
    }
    dispatch(showLoader())
    const apiResponse = await callToCareCustomer(payload)
    dispatch(hideLoader())
    if (apiResponse.isValid) {
      dispatch(setNotification({
        type: 'success',
        message: apiResponse.message,
        title: 'Success'
      }))
      if (status === 'SOLD' || status === 'DROP') {
        setStatusPopup(false)
      }
      else {
        setStatusPopup(true)
      }
    } else {
      dispatch(setNotification({
        type: 'error',
        message: apiResponse.message,
        title: 'Error'
      }))
    }
    setCallPopUp(false)
  }

  const otpVerify = async (otpVal, data) => {
    dispatch(showLoader())
    const payload = {
      otp: otpVal,
      leadId: data.leadId
    }
    const apiResponse = await confirmOTP(payload)
    dispatch(hideLoader())
    if (apiResponse.isValid) {
      dispatch(setNotification({
        type: 'success',
        message: apiResponse.message,
        title: 'Success'
      }))
      setOtpPopUp(false)
      setWrongOtp(false)
      window.location.reload()
    } else {
      setWrongOtp(true)
    }
  }

  const closePopUp = () => {
    setOtpPopUp(false)
    setWrongOtp(false)
  }

  const handleRowChange = (list) => {
    // if (drawerClass === 'table-shd-drawer') {
    //   setDrawerclass('table-shd-drawer open')
    //   setSelectedID(list.leadId)
    //   if (status !== 'UNASSIGNED' && status !== 'PENDING') {
    //     if (status === 'FOLLOWUP') {
    //       status = 'FOLLOW UP'
    //       getHistoryData(list.leadId, status)
    //         .then(apiResponse => {
    //           if (apiResponse.isValid) {
    //             setHistoryData(apiResponse.diyCallHistoryResponse)
    //           }
    //         })
    //     }
    //     else {
    //       getHistoryData(list.leadId, status)
    //         .then(apiResponse => {
    //           if (apiResponse.isValid) {
    //             setHistoryData(apiResponse.diyCallHistoryResponse)
    //           }
    //         })
    //     }
    //   }
    // }
    // else {
    //   setDrawerclass('table-shd-drawer')
    //   setSelectedID(list.leadId)
    // }
    setSelectedID(list.leadId)
    setRowInfo(list)
    setLeadData(list)
    dispatch(leadDetails(list.leadId))
    dispatch(leadLifecycleDetails(list.leadId))
    dispatch(getShdOrderDeduction(list.leadId))
    setOpenSlider(true)
    handleValue('')
    // handleStatusFilter('')
  }

  const handleAssignChange = (event, list) => {
    event.stopPropagation();
    const payload = {
      userId: getUserID(),
      leadId: list.leadId,
      status: 'ASSIGN',
      crmLeadId: list.crmLeadId
    }
    dispatch(showLoader())
    updateStatus(payload)
      .then(apiRes => {
        if (apiRes.isValid) {
          dispatch(hideLoader())
          dispatch(setNotification({
            type: 'success',
            message: apiRes.message,
            title: 'Success'
          }))
          onPendingRefresh()
        }
        else {
          dispatch(setNotification({
            type: 'error',
            message: apiRes.message,
            title: 'Error'
          }))
        }
      })
  }

  const onRefreshRow = () => {
    setDrawerclass('table-shd-drawer')
    refreshPage()
  }

  const handleDropStatus = () => {
    setDropStatusPopup(true)
  }

  const getFinalQuote = (list) => {
    let a = Number(list.bidAmount)
    let b = Number(list.cityLevelCommission)
    return a - b;
  }

  const updateStatusForm = () => {
    setStatusPopup(true)
  }
  const openEditDialog = (e, leadId, name, email) => {
    e.stopPropagation();
    setOpenDialog(true)
    setLeadId(leadId)
    setUserName(name)
    setEmail(email)
  }
  const closeDialog = () => {
    setOpenDialog(false)
    setLeadId('')
    setUserName('')
    setEmail('')
  }
  const onOpenEditCEP = (e, price, leadId) => {
    e.stopPropagation();
    setEditPrice(true)
    setPrice(price)
    setLeadId(leadId)

  }
  const onCloseEditCEP = () => {
    setEditPrice(false)
  }
  const closeAndRefresh = () => {
    setOpenSlider(false)
    refreshPage()
  }

  const valuatorDetails = details => {
    if (onValuatorDetails) {
      onValuatorDetails({ storeId: details.storeId, valuatorId: details.valuatorId })
    }
  }

  const getStatus = (leadStatus, time) => {
    if(leadStatus === 'AUCTION_COMPLETED'){
      return <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 5px', borderRadius: '4px',width:'102px' }}>Auction Completed</span> 
    }
    if(leadStatus === 'Central_Tagging_Inspected'){
      return <span style={{ backgroundColor: '#FFE1C5', color: '#B96716', padding: '1px 5px', borderRadius: '4px',width:'102px' }}>CT Inspected</span>
    }
    if(leadStatus === 'DROPPED'){
      return <span style={{ backgroundColor: '#FFD4D6', color: '#DA2128', padding: '1px 5px', borderRadius: '4px',width:'102px' }}>Dropped</span>
    }
    else{
      return (<>
        <span style={{ backgroundColor: '#E9F4FF', color: '#366896', padding: '1px 15px', borderRadius: '4px' }}> Ongoing </span>
        <Timer time={time} />
      </>)
    }
  }

  const reAssignTo = (list) => {
    setOpenSlider(false)
    const payload = {
      userId: getUserID(),
      leadId: list.leadId,
      status: 'ASSIGN',
      crmLeadId: list.crmLeadId
    }
    updateStatus(payload)
    .then(apiRes => {
      if (apiRes.isValid) {
        dispatch(hideLoader())
        dispatch(setNotification({
          type: 'success',
          message: apiRes.message,
          title: 'Success'
        }))
        onPendingRefresh()
      }
      else {
        dispatch(setNotification({
          type: 'error',
          message: apiRes.message,
          title: 'Error'
        }))
      }
    })
  }

  return (
    <div className="table-wraper">
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            {
              status === 'PENDING' &&
              rowsForPending.map(row => (
                <TableCell
                  key={row.id}
                >
                  {row.label}
                </TableCell>
              ))
            }
            {
              status === 'SOLD' &&
              rowsForSold.map(row => (
                <TableCell
                  key={row.id}
                >
                  {row.label}
                </TableCell>
              ))
            }
            {
              status === 'FOLLOWUP' &&
              rowsForFollowup.map(row => (
                <TableCell
                  key={row.id}
                >
                  {row.label}
                </TableCell>
              ))
            }
            {
              status === 'DROP' &&
              rowsForDrop.map(row => (
                <TableCell
                  key={row.id}
                >
                  {row.label}
                </TableCell>
              ))
            }
            {
              status === 'UNASSIGNED' &&
              rows.map(row => (
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
            Boolean(confirmList.length) &&
            confirmList.map((list, index) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={`${list.leadId}${index}`}
                  onClick={() => handleRowChange(list)}
                  selected={selectedID === list.leadId}
                // classes={{ hover: classes.hover, selected: classes.selected }}
                // className={classes.tableRow}
                >
                  <TableCell>
                    {list.leadId}
                    {Number(list.premiumBikeFlag) === 1 && <div style={{ backgroundColor: '#E98000', color: 'white', padding: '4px 2px',textAlign:'center',width:'4rem', borderRadius: '4px' }}>Premium</div>}
                    {
                      status === 'FOLLOWUP' &&
                      (
                        moment(getDate(list.followupDate)).diff(moment(getDate(moment()))) > 0 ?
                          <></>
                          :
                          <p style={{ color: '#D92128' }}>Delayed</p>
                      )
                    }
                  </TableCell>
                  <TableCell>
                    {getDate(list.leadcreatedDate)}
                  </TableCell>
                  {status !== 'UNASSIGNED' &&
                    <TableCell>
                      {getDate(list.auctionCompletedDate)}
                    </TableCell>}
                  {status === 'SOLD' &&
                    <TableCell>
                      {getDate(list.soldDate)}
                    </TableCell>}
                    {
                    status === 'FOLLOWUP' && 
                    <TableCell>
                      {getDate(list.followupDate)}
                    </TableCell>
                  }

                  {status === 'DROP' &&
                    <TableCell>{getDate(list.dropDate)}</TableCell>
                  }
                  <TableCell style={{ minWidth: '11rem' }}>
                    <div >
                      <p style={{ display: 'flex' }}>
                        <b>{`${renderString(list.userName)}`}</b>
                        {status !== 'DROP' &&
                          <img src={EditIcon} style={{ marginLeft: '1.5rem', marginTop: '5px', cursor: 'pointer' }} onClick={(e) => openEditDialog(e, list.leadId, list.userName, list.userEmail)} height="15px" />}
                      </p>
                      <small style={{ color: "gray", fontSize: "9px", wordBreak: "break-all" }}>{`${renderString(list.userEmail)}`}</small>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div >
                      <p>{renderString(list.regNumber)}</p>
                      <p style={{margin:'0px'}}><small style={{ color: "gray", fontSize: "9px", wordBreak: "break-all" }}>{renderString(list.mmv)}</small></p>
                      <p style={{margin:'0px'}}><small style={{ color: "gray", fontSize: "9px", wordBreak: "break-all" }}>{renderString(list.mfgYear)}</small></p>
                    </div>
                    {/* {
                      list.leadType.startsWith('TP') ?
                        <span style={{ border: '1px solid #C7FACB', backgroundColor: '#D9FFDC', color: '#4DBD74', padding: '1px 5px', borderRadius: '4px' }}> {list.leadType} </span> :
                        <span style={{ border: '1px solid #FFDAD6', backgroundColor: '#FCE9E7', color: '#FA5C4B', padding: '1px 5px', borderRadius: '4px' }}>{list.leadType}</span>
                    } */}
                  </TableCell>
                  <TableCell>
                    {renderString(list.cityName)}
                  </TableCell>
                  {status !== 'UNASSIGNED' &&
                    <TableCell>{renderString(list.agentName)}</TableCell>
                  }
                  { status === 'UNASSIGNED' &&
                    <TableCell>
                      <p className="link" onClick={() => this.valuatorDetails(list)}>{list.outletName}</p>
                      <p>{list.outletPhoneNumber}</p>
                    </TableCell>}
                  {/* {
                    status !== 'UNASSIGNED' &&
                    <TableCell>{getAmount(list.finalQuotePrice)}</TableCell>
                  } */}
                   {
                    status === 'FOLLOWUP' && 
                    <TableCell>
                        {renderString(list.reason)}
                    </TableCell>
                  }
                  {status !== 'UNASSIGNED' &&
                    <TableCell>
                        {getAmount(list.bidAmount)}
                    </TableCell>
                  }
                  <TableCell>
                    {getAmount(list.customerExpectedPrice)}
                    {status !== "SOLD" && status !== 'DROP' &&
                      <img src={EditIcon} style={{ marginLeft: '1.5rem', marginTop: '-2rem', cursor: 'pointer' }} onClick={(e) => onOpenEditCEP(e, list.customerExpectedPrice, list.leadId)} height="15px" />
                    }
                  </TableCell>
                  <TableCell>
                    {list.leadSqi}
                  </TableCell>
                  {/* {
                    status === 'FOLLOWUP' &&
                    <TableCell>
                      {renderDate(list.followupDate)}
                    </TableCell>
                  } */}
                   {
                    status === 'UNASSIGNED' &&
                    <TableCell>
                      {list.leadStatus === 'AUCTION_COMPLETED' ?
                        <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '5px', borderRadius: '8px', width: '102px' }}>Auction Completed</span> :
                        <>
                          <span style={{ backgroundColor: '#FFE1C5', color: '#B96716', padding: '5px', borderRadius: '8px', width: '102px' }}> CT Inspected </span>
                        </>}
                    </TableCell>
                  }
                   <TableCell>
                    {getAmount(list.averageCpPrice)}
                  </TableCell>
                  <TableCell>
                    {getAmount(list.procPrice)}
                  </TableCell>

                  {/* <TableCell>
                       {getAmount(list.totalCommission)} 
                    </TableCell> */}
                  {
                    (status === 'FOLLOWUP' || status === 'PENDING') &&
                    <TableCell style={{minWidth:'9rem'}}>
                        {getStatus(list.leadStatus,list.auctionCompletedDate)}
                    </TableCell>
                  }
                  {status === 'SOLD' &&
                    <TableCell>
                      {list.leadStatus === 'SELL' ?
                        <span style={{ backgroundColor: '#DAF2DD', color: '#196834', padding: '1px 15px', borderRadius: '4px' }}> Sell </span> :
                        <span style={{ backgroundColor: '#E9F4FF', color: '#366896', padding: '1px 15px', borderRadius: '4px' }}> Exchange </span>}
                    </TableCell>}

                  {
                    status === 'UNASSIGNED' &&
                    <TableCell>
                      <Button
                        color="green"
                        style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold' }}
                        onClick={(event) => handleAssignChange(event, list)}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  }
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
      <div className="table-paginator">
        {
          Boolean(confirmList.length) ?
            <Pagination
              variant="outlined"
              style={{ float: 'right' }}
              count={Math.ceil(totalCount / 10)}
              showQuickJumper
              className='float-right'
              page={currentPage}
              onChange={(event, pageNumber) => handlePageChange(event, pageNumber)}
            />
            :
            <NoResultsFound />
        }
      </div>
      {
        <CallToCustomer
          open={callPopUp}
          onClose={() => setCallPopUp(false)}
          onCallCustomer={callAction}
          leadData={leadData}
          rowInfo={rowInfo}
        />
      }
      {
        <UpdateStatusQuote
          open={statusPopUp}
          onClose={() => setStatusPopup(false)}
          leadData={leadData}
          rowInfo={rowInfo}
          tableStatus={status}
          onRefreshRow={onRefreshRow}
        />
      }
      {
        <UpdateDropStatus
          open={dropstatusPopUp}
          onClose={() => setDropStatusPopup(false)}
          leadData={leadData}
          rowInfo={rowInfo}
          tableStatus={status}
          onRefreshRow={onRefreshRow}
        />
      }
      {
        <OTPPopup
          open={otpPopup}
          onClose={() => closePopUp()}
          onVerifyOtp={otpVerify}
          leadData={leadData}
          wrongOtp={wrongOtp}
          onClearWrongOTP={() => setWrongOtp(false)}
        />
      }
      {/* {
        status === 'PENDING' &&
        <PendingDrawer
          drawer={Boolean(confirmList.length) ? drawerClass : 'table-shd-drawer'}
          open={callToCustomer}
          confirmList={confirmList}
          rowInfo={rowInfo}
          openForm={updateStatusForm}
        />
      } */}
      {/* {
        status === 'FOLLOWUP' &&
        <FollowupDrawer
          drawer={Boolean(confirmList.length) ? drawerClass : 'table-shd-drawer'}
          open={callToCustomer}
          confirmList={confirmList}
          rowInfo={rowInfo}
          historyData={historyData}
          handleDropStatus={handleDropStatus}
          openForm={updateStatusForm}
        />
      } */}
      {/* {
        status === 'DROP' &&
        <DropDrawer
          drawer={Boolean(confirmList.length) ? drawerClass : 'table-shd-drawer'}
          open={callToCustomer}
          confirmList={confirmList}
          rowInfo={rowInfo}
          historyData={historyData}
          handleDropStatus={handleDropStatus}
          status={status}
        />
      } */}
      {/* {
        status === 'SOLD' &&
        <SoldStatusDrawer
          drawer={Boolean(confirmList.length) ? drawerClass : 'table-shd-drawer'}
          open={callToCustomer}
          confirmList={confirmList}
          rowInfo={rowInfo}
          historyData={historyData}
          handleDropStatus={handleDropStatus}
        />
      } */}
      {
        openDialog &&
        <EditDialog
          open={openDialog}
          onClose={closeDialog}
          leadId={leadId}
          name={username}
          email={email}
          refreshPage={refreshPage}
        />
      }

      <StatusSlider
        openState={openSlider}
        close={closeSlider}
        selectedLeadId={selectedID}
        rowInfo={rowInfo}
        status={status}
        leadData={leadData}
        confirmList={confirmList}
        onRefreshPage={handleRefresh}
        onClosePushMenu={closeAndRefresh}
        openCEDialog={onOpenEditCEP}
        LeadInfo={LeadInfo}
        LeadLifeInfo={LeadLifeInfo}
        orderDedctions={orderDedctions}
        value={value}
        handleValue={handleValue}
        enable={enable}
        handleEnable={handleEnable}
        Cp={orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo === 'CP'}
        Store={orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo !== 'CP'}
        leadStatus={LeadInfo && LeadInfo.vehicleDetails && LeadInfo.vehicleDetails.leadStatus && LeadInfo.vehicleDetails.leadStatus}
        onReassignUser={reAssignTo}
        goToDropTab={onRefreshDrop}
        goToFollowUpTab={onRefreshFollowUp}
        goToSoldTab={onRefreshSold}
        handleRowChange = {(val)=> {
          handleRowChange(val)
          handleValue("Commission")
        }}
      />
      {
        editPrice &&
        <CustomerEPEditDialog
          editPrice={editPrice}
          onClose={onCloseEditCEP}
          leadId={leadId}
          priceVal={price}
          onRefreshPage={refreshPage}
        />
      }
    </div>
  )
}

export default connect()(ConfirmationTable)