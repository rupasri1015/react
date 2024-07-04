import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Box, Container } from '@material-ui/core';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Header from './components/header';
import BiddingHistory from './components/BiddingHistory/index';
import LeadDetails from './components/LeadDetails/index';
import DocumentDetails from './components/DocumentDetails/index';
import InspectionDetails from './components/InspectionDetails/index';
import Commission from './components/Commission/index';
import CustomerBreakup from './components/CustomerBreakup/index';
import FhdStoreDetails from './components/FhdStoreDetails/index';
import LeadLifecycle from './components/LeadLifeCycle/index';
import CallToCustomer from '../components/CallActionPopUp';
import { leadDetails } from '../../../redux/actions/biddingDetailsAction'
import { useDispatch, useSelector } from "react-redux"
import { getBiddingDetails, getReleaseAuth } from '../../../core/services/biddingServices'
import { leadLifecycleDetails } from '../../../redux/actions/biddingLifecycleAction'
import { getShdOrderDeduction } from '../../../redux/actions/shdOrderDeductionAction'
import BidModal from '../components/BidActionPopUp'
import UpdateStatusQuote from '../components/UpdateStatusPop';
import ReleaseAuthorize from './components/Commission/ReleaseAuthorization';
import { getMobile, getUserID } from '../../../core/services/rbacServices';
import { hideLoader, showLoader } from '../../../redux/actions/loaderAction';
import { callToCareCustomer, updateStatus } from '../../../core/services/shdServices';
import { setNotification } from '../../../redux/actions/notificationAction';
import { addShdCommission } from '../../../core/services/shdServices'
import CallToCustomerDialog from '../components/CallBiddingDealer'
import CustomerEPEditDialog from '../components/EdiitPriceModal';
import ReassignModal from '../components/ReassignPopUp';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 2,
    backgroundColor: '#F4F7FD',
    display: 'flex',
    height: '89vh', marginTop: '5rem'
  },
  tabs: {
    // borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: '#111328',
    color: 'white',
    width: '20rem',
    '& .MuiTab-textColorInherit': {
      opacity: '1',
      "&[aria-selected = 'true']": {
        color: 'black',
        opacity: '1',
      }
    },
    "& .MuiTab-wrapper": {
      alignItems: "flex-start",
      marginLeft: '1rem'
    },
    '& .MuiTabs-indicator': {
      left: '0',
      width: '3px'
    }
  },
  tabpanel: {
    width: '100%'
  }
}));

const slideStyles = makeStyles({
  drawer: {
    "& .MuiDrawer-paperAnchorBottom": {
      position: 'relative',
      marginTop: '3.6rem',
      borderTopLeftRadius: '1rem',
      borderTopRightRadius: '1rem',
      overflow: 'hidden',
    }
  },
  contentBox: {
    position: 'absolute',
    top: '5rem',
    left: '20rem',
    maxWidth: '76%',
    padding: '2rem',
    border: '2px solid green'
  }
});

export default function StatusSlider({ openState, close, handleValue, value, enable,leadStatus, handleEnable,Cp,Store, selectedLeadId, LeadInfo, LeadLifeInfo, orderDedctions, rowInfo, status, leadData, onRefreshPage, onClosePushMenu, openCEDialog, onReassignUser, goToDropTab,goToFollowUpTab,goToSoldTab, handleRowChange }) {

  const slideClass = slideStyles();
  const classes = useStyles();
  const dispatch = useDispatch()
  const [auctionData, setAuctionData] = useState([])
  const [callPopUp, setCallPopUp] = useState(false)
  const [bidPopUp, setBidPopUp] = useState(false)
  const [statusPopUp, setStatusPopUp] = useState(false)
  const [authorizePopup, setAuthorizePopup] = useState(false)
  // const [enable, setEnable] = useState(true)
  const [authData, setAuthData] = useState([])
  const [newVal, setNewVal] = useState('')
  const [show, setShow] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [formPayload, setFormPayload] = useState({})
  const [openCallModel, setOpenCallModel] = useState(false)
  const [revAuctionData, setRevAuctionData] = useState([])
  const [bidNumIndex, setBidNumIndex] = useState()
  const [price, setPrice] = useState('')
  const [editPrice, setEditPrice] = useState(false)
  const [updateClick, setUpdateClick] = useState('1')
  const payload = useSelector((state) => state.commission);
  const [overrideColor, setOverRideColor] = useState(false)
  const [showCp, setShowCp] = useState(null)
  const [showStore, setShowStore] = useState(null)
  const [option, setOption] = useState('Store');
  const [updateComm, setUpdateComm] = useState(true)
  const [cusAmount, setCusAmount] = useState('')
  const [cpAmount, setCpAmount] = useState('')
  const [storeAmount, setStoreAmount] = useState('')
  const [leadStatusValue, setLeadStatusValue] = useState('')
  const [bidVal,setBidVal] = useState('')
  const [reassignPopUp,setReassignPopUp] = useState(false)

  const handleCusAmt = (val) => {
    setCusAmount(val)
  }
  const handleCpAmt = (val) => {
    setCusAmount(val)
  }
  const handleStoreAmt = (val) => {
    setCusAmount(val)
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
        hidden={value !== index}
        style={{ overflow: 'scroll', paddingBottom: '2rem' }}
      >
        {
          value === index &&
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        }
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  // useEffect(() => {
  //   setRevAuctionData(auctionData[0] && auctionData[0].acutionList && auctionData[0].acutionList.reverse())
  // },auctionData)

  const handleChange = (event, newValue) => {
    if (newValue === 'Bidding History') {
      // if (auctionData && auctionData.transactionId && auctionData.transactionId) {
      getBiddingDetails(rowInfo.leadId).
        then(apiResponse => {
          if (apiResponse.isValid) {
            setAuctionData(apiResponse.auctionBidderInfoList ? apiResponse.auctionBidderInfoList[0] && apiResponse.auctionBidderInfoList[0].acutionList.reverse() : [])
          }else{
            setAuctionData([])
          }
        })
      // }
    }
    handleValue(newValue);
    handleEnable(true);
    setShow(false)
    setShowCp(orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo === 'CP')
    setShowStore(orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo !== 'CP')
    setOption((orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo === 'CP') ? 'Channel Partner' : 'Store')
  };
  const callCustomer = () => {
    setCallPopUp(true)
  }
  const handleCp = val => {
    setShowCp(val)
  }
  const handleStore = val => {
    setShowStore(val)
  }
  const openReassign = () => {
    setReassignPopUp(true)
  }
  const handleOption = val => {
    setOption(val)
    if (option !== val) setOverRideColor(true)
    else setOverRideColor(false)
  }
  const handleOverrideColor = val => {
    setOverRideColor(val)
  }
  const handleUpdateComm = (val) => {
    setUpdateComm(val)
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
      dispatch(setNotification('success', 'Success', apiResponse.message))
      if (status === 'SOLD' || status === 'DROP') {
        // setStatusPopUp(false)
      }
      else {
        // setStatusPopUp(true)
      }
    } else {
      dispatch(setNotification('danger', 'Error', apiResponse.message));
    }
    setCallPopUp(false)
  }
  const reAssignTo = (list) => {
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
        setReassignPopUp(false)
        close()
        onRefreshPage()
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

  const openBid = (val) => {
    if(val === 'no bid')
    onRefreshPage()
    else{
      setBidPopUp(true)
      setBidVal(val)
    }
  }
  const openStatus = (value) => {
    setLeadStatusValue(value)
    setStatusPopUp(true)
  }
  const openAuthorizeModal = (leadId) => {
    setAuthorizePopup(true)
    getReleaseAuth(leadId).
      then(apiResponse => {
        if (apiResponse.isValid) {
          setAuthData(apiResponse.releaseBreakUp)
        }
      })
  }

  const enableCommissionForm = (val) => {
    handleEnable(val)
  }

  const refreshToOld = () => {
    setAuthorizePopup(false)
    onRefreshPage()
  }
  const handleOpenCallModel = (data) => {
    setOpenCallModel(true)
    setBidNumIndex(data)
  }
  const handleCloseCallModel = (data) => {
    setOpenCallModel(false)
    setBidNumIndex('')
  }
  const onOpenEditCEP = (price, rowIndex) => {
    setEditPrice(true)
    setPrice(price)
    setBidNumIndex(rowIndex)
  }
  const onCloseEditCEP = () => {
    if (value === 'Customer Break-Up') {
      getReleaseAuth(rowInfo.leadId).
        then(apiResponse => {
          if (apiResponse.isValid) {
            setAuthData(apiResponse.releaseBreakUp)
          }
        })
    }
    setEditPrice(false)
    setBidNumIndex('')
  }

  const onStatusUpdate = (val, payload) => {
    setUpdateClick('1')
    var retrievedCommission = localStorage.getItem('commissionObject');
    let finalPayload = JSON.parse(retrievedCommission)
    setNewVal(val)
    let newPayload = {
      ...finalPayload,
      leadId: rowInfo.leadId,
      loginId: getUserID(),
      userId: getUserID()
    }
    if (finalPayload) {
      if (showCp !== null ? showCp : Cp) {
        if (newPayload.finalCusAmt < 0 || newPayload.finalCpAmt < 0) {
          dispatch(setNotification('danger', 'Error', 'Negative value detected for Final Amount!'))
        } else {
          delete newPayload.finalCpAmt
          // delete newPayload.finalCusAmt
          delete newPayload.finalStoreAmt
          delete newPayload.newPurchaseCost
          addShdCommission(newPayload).
            then(apiResponse => {
              if (apiResponse.isValid) {
                dispatch(setNotification('success', 'Success', apiResponse.message));
                localStorage.removeItem("commissionObject")
                onClosePushMenu()
              }
              else {
                dispatch(setNotification('danger', 'Error', apiResponse.message));
                // localStorage.removeItem("commissionObject")
              }
            })
        }
      } if (showStore !== null ? showStore : Store) {
        if (newPayload.finalStoreAmt < 0) {
          dispatch(setNotification('danger', 'Error', 'Negative value detected for Final Amount!'))
        } else {
          delete newPayload.finalCpAmt
          // delete newPayload.finalCusAmt
          delete newPayload.finalStoreAmt
          addShdCommission(newPayload).
            then(apiResponse => {
              if (apiResponse.isValid) {
                dispatch(setNotification('success', 'Success', apiResponse.message));
                localStorage.removeItem("commissionObject")
                onClosePushMenu()
              }
              else {
                dispatch(setNotification('danger', 'Error', apiResponse.message));
                // localStorage.removeItem("commissionObject")
              }
            })
        }
      }
    } else {
      const { userDeductions } = orderDedctions
      const payload = {
        extraShdCommission: orderDedctions && orderDedctions.extraShdCommission && orderDedctions.extraShdCommission ? orderDedctions.extraShdCommission : 0,
        cityLevelCommission: orderDedctions && orderDedctions.cityLevelCommission && orderDedctions.cityLevelCommission ? orderDedctions.cityLevelCommission : 0,
        traffic_challan: userDeductions && userDeductions.userTrafficChalan && userDeductions.userTrafficChalan ? userDeductions.userTrafficChalan : 0,
        hp_rto: userDeductions && userDeductions.userHpRtoCharges && userDeductions.userHpRtoCharges ? userDeductions.userHpRtoCharges : 0,
        comments: '',
        leadId: rowInfo.leadId,
        loginId: getUserID(),
        userId: getUserID(),
        rtoCharges: userDeductions && userDeductions.userHpRtoCharges && userDeductions.userHpRtoCharges ? userDeductions.userHpRtoCharges : 0,
        challanCharges: userDeductions && userDeductions.userTrafficChalan && userDeductions.userTrafficChalan ? userDeductions.userTrafficChalan : 0,
        shdAdditionalCommission: orderDedctions && orderDedctions.extraShdCommission && orderDedctions.extraShdCommission ? orderDedctions.extraShdCommission : 0,
        newPurchaseCost: ((orderDedctions && orderDedctions.newProcurementPrice) ? orderDedctions.newProcurementPrice : ((orderDedctions && orderDedctions.storeProcuredPrice)  ? orderDedctions.storeProcuredPrice : 0)),
        leeway: orderDedctions && orderDedctions.leeway && orderDedctions.leeway ? orderDedctions.leeway : 0,
        purchaseFor: showStore ? 'STORE' : 'CP',
        finalCusAmt: cusAmount,
        finalCpAmt: cpAmount,
        finalStoreAmt: storeAmount,
      }
      if (showCp) {
        if (payload.finalCusAmt < 0 || payload.finalCpAmt < 0 || payload.finalStoreAmt < 0) {
          dispatch(setNotification('danger', 'Error', 'Negative value detected for Final Amount!'))
        } else {
          delete payload.finalCpAmt
          // delete payload.finalCusAmt
          delete payload.finalStoreAmt
          addShdCommission(payload).
            then(apiResponse => {
              if (apiResponse.isValid) {
                dispatch(setNotification('success', 'Success', apiResponse.message));
                localStorage.removeItem("commissionObject")
                onClosePushMenu()
              }
              else {
                dispatch(setNotification('danger', 'Error', apiResponse.message));
                localStorage.removeItem("commissionObject")
              }
            })
        }
      } else {
        if (payload.finalStoreAmt < 0) {
          dispatch(setNotification('danger', 'Error', 'Negative value detected for Final Amount!'))
        } else {
          delete payload.finalCpAmt
          // delete payload.finalCusAmt
          delete payload.finalStoreAmt
          addShdCommission(payload).
            then(apiResponse => {
              if (apiResponse.isValid) {
                dispatch(setNotification('success', 'Success', apiResponse.message));
                onClosePushMenu()
              }
              else {
                dispatch(setNotification('danger', 'Error', apiResponse.message));
              }
            })
        }
      }

    }
    handleEnable(true);
  }

  const showResonseMessage = (message) => {
    setShow(true)
    setResponseMessage(message)
    setTimeout(() => {
      setShow(false)
    }, 3000)
  }

  const onUpdateStatusPayload = (payload) => {
    setFormPayload(payload)
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      {}
      <Drawer style={{ zIndex: '1000' }} disableEnforceFocus={true} className={slideClass.drawer} transitionDuration={{ enter: 250, exit: 250 }} anchor='bottom' open={openState} onClose={() => close()}>
        <Box
          style={{ backgroundColor: '#F4F7FD' }}
          role="presentation"
        >
          <Header close={close} status={status} callCustomer={callCustomer} openBid={openBid} enableVal={enable} onUpdateStaus={onStatusUpdate}
            openStatus={openStatus} LeadInfoCustomer={LeadInfo} openAuthorize={openAuthorizeModal} tabValue={value} enableEdit={enableCommissionForm}
            show={show} responseMessage={responseMessage} updateComm={updateComm} paymentStatus={orderDedctions.invPaymentStatus} docStatus={orderDedctions.docQcStatus}
            formPayload={formPayload} auctionComp={leadStatus === "AUCTION_COMPLETED"} leadData = {leadData} onReassign={onReassignUser} openReassign={openReassign}
          />
          <div className={classes.root}>
            <Tabs
              orientation="vertical"
              variant="standard"
              value={value}
              onChange={handleChange}
              className={classes.tabs}
            >
              <Tab label="Lead Details" {...a11yProps(0)} value='Lead Details' />
              <Tab label="Bidding History" {...a11yProps(1)} value="Bidding History" />
              <Tab label="Document Details" {...a11yProps(2)} value="Document Details" />
              <Tab label="Inspection Details" {...a11yProps(3)} value='Inspection Details' />
              {(leadStatus === 'AUCTION_COMPLETED' || leadStatus === 'SELL' || leadStatus === 'EXCHANGE') &&
                <Tab label="Commission" {...a11yProps(4)} value="Commission" />}
              {status === 'SOLD' && <Tab label="Customer Break-Up" {...a11yProps(5)} value="Customer Break-Up" />}
              <Tab label="FHD Store Details" {...a11yProps(6)} value="FHD Store Details" />
              <Tab label="Lead Lifecycle" {...a11yProps(7)} value="Lead Lifecycle" />
            </Tabs>
            <TabPanel value={value} className={classes.tabpanel} index='Lead Details'>
              <LeadDetails
                LeadInfoCustomer={LeadInfo}
                rowInfo={rowInfo}
                status={status}
              />
            </TabPanel>
            <TabPanel value={value} className={classes.tabpanel} index='Bidding History' >
              <BiddingHistory
                auctionData={auctionData}
                callToBidder={handleOpenCallModel}
                openEditDialog={onOpenEditCEP}
              />
            </TabPanel>
            <TabPanel value={value} className={classes.tabpanel} index='Document Details' >
              <DocumentDetails
                VehicleDetails={LeadInfo.vehicleDetails}
                BankDetails={LeadInfo.userBankDocs && LeadInfo.userBankDocs[0] && LeadInfo.userBankDocs[0]}
                Images={LeadInfo.imagesList && LeadInfo.imagesList}
              />
            </TabPanel>
            <TabPanel value={value} className={classes.tabpanel} index='Inspection Details' >
              <InspectionDetails InspectionData={LeadInfo} />
            </TabPanel>
            <TabPanel value={value} className={classes.tabpanel} index='Commission' >
              <Commission
                orderDedctions={orderDedctions}
                rowInfo={rowInfo}
                enable={enable}
                handleEnable={handleEnable}
                enableCommissionForm={enableCommissionForm}
                newVal={newVal}
                status={status}
                leadData={leadData}
                onShowResponseMessage={showResonseMessage}
                updateClick={updateClick}
                onUpdateStatusPayload={(payload) => onUpdateStatusPayload(payload)}
                showCp={showCp !== null ? showCp : Cp}
                showStore={showStore !== null ? showStore : Store}
                handleCp={handleCp}
                handleStore={handleStore}
                option={option}
                handleOption={handleOption}
                overrideColor={overrideColor}
                handleOverrideColor={handleOverrideColor}
                handleUpdateComm={handleUpdateComm}
                cusAmount={cusAmount}
                cpAmount={cpAmount}
                storeAmount={storeAmount}
                handleCpAmt={handleCpAmt}
                handleCusAmt={handleCusAmt}
                handleStoreAmt={handleStoreAmt}
                refresh = {()=>handleRowChange(leadData)}
              />
            </TabPanel>
            <TabPanel value={value} className={classes.tabpanel} index='Customer Break-Up'>
              <CustomerBreakup shdOrderInfo={orderDedctions} />
            </TabPanel>
            <TabPanel value={value} className={classes.tabpanel} index='FHD Store Details'>
              <FhdStoreDetails LeadInfoCustomer={LeadInfo} />
            </TabPanel>
            <TabPanel value={value} className={classes.tabpanel} index='Lead Lifecycle'>
              <LeadLifecycle leadLifeInfoCustomer={LeadLifeInfo} rowInfo={rowInfo} status={status} showStore={showStore !== null ? showStore : Store}/>
            </TabPanel>
          </div>
        </Box>
        {callPopUp &&
          <CallToCustomer
            open={callPopUp}
            onClose={() => setCallPopUp(false)}
            onCallCustomer={callAction}
            leadData={leadData}
            rowInfo={rowInfo}
          />
        }
        {reassignPopUp &&
          <ReassignModal
            open={reassignPopUp}
            onClose={() => setReassignPopUp(false)}
            onReassignUser={reAssignTo}
            leadData={leadData}
            rowInfo={rowInfo}
          />
        }
        {
          bidPopUp &&
          <BidModal
            open={bidPopUp}
            onClose={() => setBidPopUp(false)}
            rowInfo={rowInfo}
            onRefreshPage={onRefreshPage}
            close={close}
            bidVal={bidVal}
          />
        }
        {statusPopUp &&
          <UpdateStatusQuote
            open={statusPopUp}
            onClose={() => setStatusPopUp(false)}
            leadData={leadData}
            rowInfo={rowInfo}
            tableStatus={status}
            onRefreshRow={onRefreshPage}
            orderDedctions={orderDedctions}
            close={close}
            leadStatusValue={leadStatusValue}
            onDropRefresh={goToDropTab}
            onFollowUpRefresh={goToFollowUpTab}
            onSoldRefresh={goToSoldTab}
            option={option}
          />
        }
        {authorizePopup &&
          <ReleaseAuthorize
            open={authorizePopup}
            onClose={() => setAuthorizePopup(false)}
            orderDedctions={orderDedctions}
            rowInfo={rowInfo}
            authData={authData}
            refreshPage={refreshToOld}
          />
        }
        {
          openCallModel &&
          <CallToCustomerDialog
            callOpen={openCallModel}
            onClose={handleCloseCallModel}
            rowData={auctionData[0].bidderInfo[bidNumIndex]}
            callerType="dealer"
            onRefreshPage={onRefreshPage}
          />
        }
        {
          editPrice &&
          <CustomerEPEditDialog
            tabValue={value}
            editPrice={editPrice}
            onClose={onCloseEditCEP}
            leadId={rowInfo.leadId}
            priceVal={price}
            bidData={auctionData[0]}
            rowData={auctionData[0].bidderInfo[bidNumIndex]}
            onRefreshPage={onRefreshPage}
          />
        }
      </Drawer>
    </div>
  );
}