import React, { useState, FC, useEffect } from 'react';
import { Modal, Grid, Row, Col, Form } from 'rsuite';
import Select from '../../../shared/components/redux-form-new/Select';
import DatePicker from '../../../shared/components/redux-form-new/DatePicker';
import TimePicker from '../../../shared/components/redux-form-new/TimePicker';
import TextArea from '../../../shared/components/redux-form-new/TextArea';
import {
  reduxForm,
  InjectedFormProps,
  Field,
  getFormValues,
  SubmissionError,
} from 'redux-form';
import { connect, ConnectedProps } from 'react-redux';
import validate, { FormData } from './validate';
import {
  getReasonsQuote,
  updateStatus,
} from '../../../core/services/shdServices';
import { getUserID } from '../../../core/services/rbacServices';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationAction';
import moment from 'moment';
import { reset } from 'redux-form';
import {
  sendOtpToCustomer,
  confirmOTP,
} from '../../../core/services/shdServices';
import './Error.scss';
import { FormHelperText } from '@material-ui/core';
import { AlertIconRed, AlertIconWhite, InfoIcon } from '../../../core/utility/iconHelper';

const statusOptionsFollowUp = [
  { value: 'FOLLOW UP', label: 'Follow Up' },
  { value: 'DROP', label: 'Drop' },
  { value: 'Mark as Sell', label: 'Mark as Sell' },
];

const statusOptionsPending = [
  { value: 'FOLLOW UP', label: 'Follow Up' },
  { value: 'Mark as Sell', label: 'Mark as Sell' },
  { value: 'DROP', label: 'Drop' },
];

const statusOptionsPendingCt = [
  { value: 'FOLLOW UP', label: 'Follow Up' },
  { value: 'DROP', label: 'Drop' },
];

const statusOptionsSold = [
  { value: 'DROP', label: 'Drop' },
];

const mapStateToProps = (state) => {
  return {
    formStates: getFormValues('quote-confirmation-form')(state),
  };
};

const handleSubmitFail = () => {
  setTimeout(() => {
    const firstElement = document.getElementsByClassName(
      'rs-error-message-wrapper'
    )[0];
    firstElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 50);
};

const connector = connect(mapStateToProps);

function UpdateStatusQuote({
  onClose,
  open,
  handleSubmit,
  rowInfo,
  leadData,
  tableStatus,
  onRefreshRow,
  orderDedctions,
  close,
  leadStatusValue,
  onDropRefresh,
  onFollowUpRefresh,
  onSoldRefresh,
  option
}) {
  const [status, setStatus] = useState(null);
  const [activeClose, setActiveClose] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState([]);
  const [comments, setComments] = useState('');
  const [reasonList, setReasonList] = useState([]);
  const [reason, setReason] = useState('');
  const [openDrop, setOpenDrop] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [openFollowup, setOpenFollowUp] = useState(false);
  const [openSell, setOpenSell] = useState(false);
  const [valueOne, setValueOne] = useState('');
  const [valueTwo, setValueTwo] = useState('');
  const [valueThree, setValueThree] = useState('');
  const [valueFour, setValueFour] = useState('');
  const [wrongOTP, setWrongOtp] = useState(false);
  const [resendOTP, setResendOTP] = useState(false);
  const [openShdErr, setOpenShdErr] = useState(false);
  const [showEmailUsernameError, setEmailUsernameError] = useState(false);
  const [showEmailUsernameErrorMessage, setEmailUsernameErrorMessage] =
    useState('');
  const [extraCommission, setExtraCommission] = useState(orderDedctions && orderDedctions.extraShdCommission && orderDedctions.extraShdCommission ? orderDedctions.extraShdCommission : 0)
  const [leeway, setLeeway] = useState(orderDedctions && orderDedctions.leeway && orderDedctions.leeway ? orderDedctions.leeway : 0)
  const [trafficChallan, setTrafficChallan] = useState(orderDedctions && orderDedctions.userDeductions && orderDedctions.userDeductions.userTrafficChalan && orderDedctions.userDeductions.userTrafficChalan && orderDedctions.userDeductions.userTrafficChalan ? orderDedctions.userDeductions.userTrafficChalan : 0)
  const [hpRto, setHpRto] = useState(orderDedctions && orderDedctions.userDeductions && orderDedctions.userDeductions.userHpRtoCharges && orderDedctions.userDeductions.userHpRtoCharges && orderDedctions.userDeductions.userHpRtoCharges ? orderDedctions.userDeductions.userHpRtoCharges : 0)
  const [docQc2Charges, setDocQc2Charges] = useState(orderDedctions && orderDedctions.docQc2Deductions && orderDedctions.docQc2Deductions ? orderDedctions.docQc2Deductions : 0)
  // const [comments, setComments] = useState((orderDedctions && orderDedctions.comments && orderDedctions.comments) && orderDedctions.comments)
  const [pickUpDate, setPickUpDate] = useState('')
  const [newCommission, setNewCommission] = useState('')
  const dispatch = useDispatch();
  const [negativeAmtError, setNegativeAmtError] = useState(false)
  const [capitalError, setCapitalError] = useState(false)

  const handleStatusChange = (status) => {
    setStatus(status);
    setEmailUsernameError(false);
    setOpenShdErr(false);
    if (status === 'FOLLOW UP') {
      const statusFollowUp = 'FOLLOW UP';
      setOpenFollowUp(true);
      getReasonsQuote(statusFollowUp).then((apiRes) => {
        if (apiRes.isValid) {
          const followUpReasons = apiRes.crmStatusBean.map((reason) => {
            return {
              value: reason.statusId,
              label: reason.statusName,
            };
          });
          setReasonList(followUpReasons);
        }
      });
    } else {
      setOpenFollowUp(false);
    }
    if (status === 'DROP') {
      setOpenDrop(true);
      const statusDrop = 'DROP';
      getReasonsQuote(statusDrop).then((apiRes) => {
        if (apiRes.isValid) {
          const followUpReasons = apiRes.crmStatusBean.map((reason) => {
            return {
              value: reason.statusId,
              label: reason.statusName,
            };
          });
          setReasonList(followUpReasons);
        }
      });
    } else {
      setOpenDrop(false);
    }
    if (status === 'Mark as Sell') {
      setOpenSell(true);
    } else {
      setOpenSell(false);
    }
    dispatch(reset('quote-confirmation-form'));
  };

  const getDelta = (formData) => {
    console.log('delta working')
    const delta = {};
    if (formData.status) {
      delta.status = formData.status;
    }
    if (formData.leadId) {
      delta.leadId = formData.leadId;
    }
    if (formData.fromDate && formData.time) {
      delta.fromDate =
        moment(formData.fromDate).format('YYYY-MM-DD') +
        ' ' +
        moment(formData.time).format('HH:mm:ss');
      setPickUpDate(delta.fromDate)
    }
    if (formData.cityId) {
      delta.cityId = formData.cityId;
    }
    if (formData.comments) {
      delta.comments = formData.comments;
    }
    if (formData.reasonId) {
      delta.reasonId = formData.reasonId;
    }

    return delta;
  };

  const formatDate = (date) => {
    if (!date) {
      return null;
    }
    return date;
  };

  const handleUpdate = handleSubmit((formData) => {
    handleSubmitDetails(formData);
  });

  const labelStatus = () => {
    return (
      <>
        Select Status <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  const labelReason = () => {
    return (
      <>
        Select Reason <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  const labelDate = () => {
    return (
      <>
        {
          status === 'Mark as Sell' ? 'Pickup Date' : 'Select Date'
        }
        <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  const labelTime = () => {
    return (
      <>
        {
          status === 'Mark as Sell' ? 'Pickup Time' : 'Select Time'
        }
        <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  const handleCommentChange = (e) => {
    setComments(e);
  };

  const handleReasonChange = (reason) => {
    setReason(reason);
  };

  const handleSubmitDetails = (data) => {
    setEmailUsernameError(false)
    if (!rowInfo.userEmail && status === "Mark as Sell") {
      setEmailUsernameError(true);
      return setEmailUsernameErrorMessage('Please update Email!');
    } else if (!rowInfo.userName) {
      setEmailUsernameError(true);
      return setEmailUsernameErrorMessage('Please update Customer name!');
    } else if (rowInfo.userName && rowInfo.userName.length<5 && status === "Mark as Sell") {
      setEmailUsernameError(true);
      return setEmailUsernameErrorMessage('Customer name should be as per ID Proof !');
    } else if (!reason && status === "DROP") {
      setEmailUsernameError(true);
      setEmailUsernameErrorMessage('Please select Reason')
    } else if (!comments && status === "DROP") {
      setEmailUsernameError(true);
      setEmailUsernameErrorMessage('Please add valid comment')
    } else if (!data.fromDate && status === "Mark as Sell") {
      setEmailUsernameError(true);
      setEmailUsernameErrorMessage('Please add Pickup date')
    } else if (!data.time && status === "Mark as Sell") {
      setEmailUsernameError(true);
      setEmailUsernameErrorMessage('Please add Pickup time')
    }
    else {
      let delta = getDelta(data);
      delta.userId = getUserID();
      delta.leadId = rowInfo.leadId;
      delta.crmLeadId = rowInfo.crmLeadId;
      if (status === 'DROP') {
        delta.status = 'DROP';
      } else if (status === 'FOLLOW UP') {
        delta.status = 'FOLLOWUP';
      }

      if (status !== 'Mark as Sell') {
        setOpenShdErr(false);
        if (Object.keys(delta).length) {
          if (delta.status !== null) {
            updateStatus(delta).then((apiRes) => {
              if (apiRes.isValid) {
                setEmailUsernameError(false);
                dispatch(setNotification('success', 'Success', apiRes.message));
                getDelta({});
                setOpenDrop(false);
                setOpenFollowUp(false);
                setOpenSell(false);
                dispatch(reset('quote-confirmation-form'));
                onClose();
                close()
                if (delta.status === 'DROP') onDropRefresh();
                if (delta.status === 'FOLLOWUP') onFollowUpRefresh();
                // onRefreshRow();
              } else {
                dispatch(setNotification('danger', 'Error', apiRes.message));
              }

            });
          }
        }
      } else if (
        (rowInfo && rowInfo.shdAddedCommission === null && (orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo === 'CP')) ||
        (rowInfo.shdAddedCommission === '' && (orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo === 'CP'))
      ) {
        setOpenShdErr(true);
      }
      else {
        setOpenShdErr(false);
        // dispatch(showLoader());
        let amount = ''
        var a = option
        if(a === 'Store'){
          amount = finalAmtStore()
        }
        else{
          amount = finalAmtCustomer()
        }
        if(amount < 0){
          setNegativeAmtError(true)
        }
        else{
          setCapitalError(false);
          const paylaod = {
            leadId:rowInfo.leadId,
            customerPrice:finalAmtCustomer(),
            storePrice:finalAmtStore()
          }
          // setOpenOtp(true);
          setNegativeAmtError(false)
          sendOtpToCustomer(paylaod).then((apires) => {
            if (apires.isValid) {
              dispatch(hideLoader());
              setOpenOtp(true);
              dispatch(setNotification('success', 'Success', apires.message));
              setWrongOtp(false);
              setValueOne('');
              setValueTwo('');
              setValueThree('');
              setValueFour('');
            } else {
              dispatch(hideLoader());
              if(apires.message==="Exceeding city credit limit") setCapitalError(true);
              dispatch(setNotification('danger', 'Error', apires.message));
            }
          });
        }
      }
    }
  }

  const finalAmtCustomer = () => {
    if (orderDedctions) {
      return (Number(orderDedctions.highestBid) - totalDeductionCustomer())
    }
  }
  const finalAmtStore = () => {
    if (orderDedctions && orderDedctions.storeProcuredPrice && !newCommission && !(orderDedctions && orderDedctions.newProcurementPrice)) {
        return (Number(orderDedctions.storeProcuredPrice) - totalDeductionCus())

    }
    else if(orderDedctions && orderDedctions.newProcurementPrice && !newCommission){
        return (Number(orderDedctions.newProcurementPrice) - totalDeductionCus())
    } else {
        return (Number(newCommission) - totalDeductionCus())
    }
}
const totalDeductionCus = () => {
  let totalDeductionCP = 0
  if (leeway) totalDeductionCP += Number(leeway);
  if (trafficChallan) totalDeductionCP += Number(trafficChallan);
  if (hpRto) totalDeductionCP += Number(hpRto);
  if (docQc2Charges) totalDeductionCP += Number(docQc2Charges);
  return totalDeductionCP;
}
  const finalAmtCP = () => {
    if (orderDedctions) {
      return (Number(orderDedctions.highestBid) - totalDeductionCP())
    }

    const totalDeductionCP = () => {
      let totalDeductionCP = 0
      // if (leeway) totalDeductionCP += Number(leeway);
      if (trafficChallan) totalDeductionCP += Number(trafficChallan);
      if (hpRto) totalDeductionCP += Number(hpRto);
      if (docQc2Charges) totalDeductionCP += Number(docQc2Charges);
      return totalDeductionCP;
    }
  }
  const totalDeductionCustomer = () => {
    const { cityLevelCommission } = orderDedctions
    let totalDeductionCustomer = 0
    if (extraCommission) totalDeductionCustomer += Number(extraCommission);
    if (cityLevelCommission) totalDeductionCustomer += Number(cityLevelCommission);
    if (leeway) totalDeductionCustomer += Number(leeway);
    if (trafficChallan) totalDeductionCustomer += Number(trafficChallan);
    if (hpRto) totalDeductionCustomer += Number(hpRto);
    if (docQc2Charges) totalDeductionCustomer += Number(docQc2Charges);
    return totalDeductionCustomer;
  }

  const onValueOneChange = (e) => {
    setValueOne(e.target.value);
  };

  const onValueTwoChange = (e) => {
    setValueTwo(e.target.value);
  };

  const onValueThreeChange = (e) => {
    setValueThree(e.target.value);
  };

  const onValueFourChange = (e) => {
    setValueFour(e.target.value);
  };

  const inputfocus = (elmnt) => {
    if (elmnt.key === 'Delete' || elmnt.key === 'Backspace') {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 4) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  const isNumeric = (evt) => {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  };

  const handleBackToStatus = () => {
    setOpenOtp(false);
    setEmailUsernameError(false);
  };

  const verifyOtp = () => {
    let inputValue = valueOne + valueTwo + valueThree + valueFour;
    dispatch(showLoader());
    const paylaod = {
      otp: inputValue,
      leadId: rowInfo.leadId,
      leadPickupDate: pickUpDate
    };
    confirmOTP(paylaod).then((apiRes) => {
      if (apiRes.isValid) {
        dispatch(setNotification('success', 'Success', apiRes.message));
        setWrongOtp(false);
        setOpenOtp(false);
        // window.location.reload()
        dispatch(reset('quote-confirmation-form'));
        dispatch(hideLoader());
        onClose();
        close();
        onSoldRefresh();
        // onRefreshRow();
      } else {
        setWrongOtp(true);
        dispatch(hideLoader());
      }
    });
  };

  const verifyResendOTP = () => {
    const paylaod = {
      leadId:rowInfo.leadId,
      customerPrice:finalAmtCustomer(),
      storePrice:finalAmtStore()
    }

    sendOtpToCustomer(paylaod).then((apires) => {
      if (apires.isValid) {
        dispatch(setNotification('success', 'Success', apires.message));
        setWrongOtp(false);
        setValueOne('');
        setValueTwo('');
        setValueThree('');
        setValueFour('');
      } else {
        dispatch(setNotification('danger', 'Error', apires.message));
      }
      dispatch(hideLoader());
    });
  };

  const handleSubmitOtp = (event) => {
    event.preventDefault();
  };

  const closePopUp = () => {
    setActiveClose(true);
    onClose();
    setOpenOtp(false);
    dispatch(reset('quote-confirmation-form'));
    setEmailUsernameError(false);
    setEmailUsernameErrorMessage('');
  };

  const getOptionsForPending = () => {
    if (leadStatusValue === 'Central_Tagging_Inspected') return statusOptionsPendingCt
    return statusOptionsPending
  }

  return (
    <Form onSubmit={handleSubmit((formData) => handleSubmitDetails(formData))}>
      <Modal
        keyboard={false}
        // onHide={closePopUp}
        show={open}
        size="xs"
      >
          <Modal.Header closeButton  onHide={closePopUp} style={{ textAlign: 'center'}}>
          <Modal.Title
            style={{ color: '#333333', fontFamily: 'ProximaNovaSemibold' }}
          >
            Call in Progress - {rowInfo.regNumber}{' '}
          </Modal.Title>
          <Modal.Title
            style={{ color: '#333333', fontFamily: 'ProximaNovaRegular', textAlign: 'center', marginTop: '1rem' }}
          >
            Selling To : {(orderDedctions && orderDedctions.soldTo && orderDedctions.soldTo === "CP") ? 'Channel Partner' : 'Store'}
          </Modal.Title>
        </Modal.Header>
        <hr style={{ marginBottom: '10px' }} />
        <Modal.Body style={{ paddingBottom: 0, marginTop: '20px' }}>
          <Grid fluid>
            <Row style={{ marginLeft: '' }}>
              <Col style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                {tableStatus === 'PENDING' && (
                  <Field
                    name="status"
                    component={Select}
                    cleanable={false}
                    options={getOptionsForPending()}
                    searchable={false}
                    label={labelStatus()}
                    placeholder="Select Status"
                    onChange={handleStatusChange}
                    disabled={openOtp}
                  />
                )}
                {tableStatus === 'SOLD' && (
                  <Field
                    name="status"
                    component={Select}
                    cleanable={false}
                    options={statusOptionsSold}
                    searchable={false}
                    label={labelStatus()}
                    placeholder="Select Status"
                    onChange={handleStatusChange}
                    disabled={openOtp}
                  />
                )}
                {tableStatus === 'FOLLOWUP' && (
                  <Field
                    name="status"
                    component={Select}
                    cleanable={false}
                    options={getOptionsForPending()}
                    searchable={false}
                    label={labelStatus()}
                    placeholder="Select Status"
                    onChange={handleStatusChange}
                    disabled={openOtp}
                  />
                )}
              </Col>
              {status &&
                <>
                  {!openSell && (
                    <Col
                      style={{
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        marginTop: '15px',
                      }}
                    >
                      <Field
                        name="reasonId"
                        component={Select}
                        cleanable={false}
                        options={reasonList}
                        searchable={false}
                        label={labelReason()}
                        placeholder="Select Reason"
                        onChange={handleReasonChange}
                      />
                    </Col>
                  )}
                  {openShdErr && (
                    <p style={{ padding: '0px 20px', color: '#da2128' }}>
                      Please add commission
                    </p>
                  )}
                  {!openDrop && (
                    <>
                      <Col
                        md={12}
                        style={{
                          paddingLeft: '20px',
                          paddingRight: '6px',
                          marginTop: '15px',
                        }}
                      >
                        <Field
                          name="fromDate"
                          format={formatDate}
                          component={DatePicker}
                          oneTap
                          label={labelDate()}
                          placeholder="DD/MM/YYYY"
                          min={new Date()}
                          max={moment().add(6, 'day').toDate()}
                        />
                      </Col>
                      <Col
                        md={12}
                        style={{
                          paddingLeft: '8px',
                          paddingRight: '20px',
                          marginTop: '15px',
                        }}
                      >
                        <Field
                          name="time"
                          format={formatDate}
                          component={TimePicker}
                          cleanable={false}
                          max={24}
                          min={1}
                          label={labelTime()}
                          placeholder="HH/MM"
                        />
                      </Col>
                    </>
                  )}
                  {!openSell && (
                    <Col
                      md={12}
                      style={{
                        paddingLeft: '20px',
                        paddingRight: '6px',
                        marginTop: '15px',
                      }}
                    >
                      <Field
                        style={{ width: '320px', marginLeft: '0px' }}
                        name="comments"
                        component={TextArea}
                        label="Comments"
                        placeholder="Enter Message"
                        onChange={handleCommentChange}
                        className="commentError"
                      />
                    </Col>
                  )}
                  {openOtp && (
                    <>
                      <Col
                        style={{
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          marginTop: '20px',
                          textAlign: 'center',
                          marginBottom: '20px',
                        }}
                      >
                        <form onSubmit={handleSubmitOtp}>
                          <p style={{ marginBottom: '20px', color: '#333333' }}>
                            Please enter the verification code <br /> sent to
                            customer's mobile number
                          </p>
                          <input
                            maxLength={1}
                            autoComplete="off"
                            value={valueOne}
                            onChange={onValueOneChange}
                            style={{
                              borderRight: 'none',
                              borderLeft: 'none',
                              width: '40px',
                              borderTop: 'none',
                              borderBottomColor: '#80808040',
                              textAlign: 'center',
                              backgroundColor: '#fff',
                            }}
                            tabIndex={1}
                            autoFocus
                            onKeyUp={(e) => inputfocus(e)}
                            onKeyPress={isNumeric}
                          ></input>
                          <input
                            maxLength={1}
                            autoComplete="off"
                            value={valueTwo}
                            onChange={onValueTwoChange}
                            style={{
                              borderRight: 'none',
                              borderLeft: 'none',
                              width: '40px',
                              borderTop: 'none',
                              borderBottomColor: '#80808040',
                              marginLeft: '15px',
                              textAlign: 'center',
                              backgroundColor: '#fff',
                            }}
                            tabIndex={2}
                            onKeyUp={(e) => inputfocus(e)}
                            onKeyPress={isNumeric}
                            disabled={valueOne ? false : true}
                          ></input>
                          <input
                            maxLength={1}
                            autoComplete="off"
                            value={valueThree}
                            onChange={onValueThreeChange}
                            style={{
                              borderRight: 'none',
                              borderLeft: 'none',
                              width: '40px',
                              borderTop: 'none',
                              borderBottomColor: '#80808040',
                              marginLeft: '15px',
                              textAlign: 'center',
                              backgroundColor: '#fff',
                            }}
                            tabIndex={3}
                            onKeyUp={(e) => inputfocus(e)}
                            onKeyPress={isNumeric}
                            disabled={valueTwo ? false : true}
                          ></input>
                          <input
                            maxLength={1}
                            autoComplete="off"
                            value={valueFour}
                            onChange={onValueFourChange}
                            style={{
                              borderRight: 'none',
                              borderLeft: 'none',
                              width: '40px',
                              borderTop: 'none',
                              borderBottomColor: '#80808040',
                              marginLeft: '15px',
                              textAlign: 'center',
                              backgroundColor: '#fff',
                            }}
                            tabIndex={4}
                            onKeyUp={(e) => inputfocus(e)}
                            onKeyPress={isNumeric}
                            disabled={valueThree ? false : true}
                          ></input>
                          <br />
                          {wrongOTP && (
                            <p style={{ color: 'red' }}> Enter correct OTP </p>
                          )}
                          <br />
                          <p style={{ marginTop: '0px', fontSize: '12px' }}>
                            Don’t receive the OTP?{' '}
                            <span
                              style={{ color: '#FF1010', cursor: 'pointer' }}
                              onClick={verifyResendOTP}
                            >
                              {' '}
                              RESEND OTP{' '}
                            </span>
                          </p>
                        </form>
                      </Col>
                    </>
                  )}
                   {capitalError &&
                     <Col

                      style={{
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          marginTop: '100px',
                          textAlign: 'center',
                          height:'40px'
                          // marginBottom: '20px',
                      }}
                   >
  
            <span style={{padding:'10px 12px', background:'#DA2128',textAlign:'center'}}>
            <img src={AlertIconWhite} style={{width:'18px', marginTop:'-2px'}} alt="Working capital not available" />
            <span style={{margin: '0 0 0 5px', color:'white'}}>
            Working capital not available
              </span> 
          </span> 
          </Col>
          }
                </>}
           
            </Row>
          </Grid>

        </Modal.Body>
        <br />
        {
          negativeAmtError && <FormHelperText style={{ color: 'red', marginLeft: '20px' }}>*Negative value detected for Final Amount!</FormHelperText>
        }
         
        {openOtp ? (
          <Modal.Footer style={{ textAlign: 'center' }}>
            <button
              style={{
                marginLeft: 15,
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '22px',
                backgroundColor: '#111328',
                border: '1px solid #111328',
              }}
              onClick={handleBackToStatus}
            >
              Back
            </button>
            <button
              style={{
                marginLeft: 15,
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '22px',
                backgroundColor: '#4DBD74',
                border: '1px solid #35AC5E',
              }}
              onClick={verifyOtp}
            >
              Verify & Proceed
            </button>
          </Modal.Footer>
        ) : (
            <Modal.Footer>
              {showEmailUsernameError && (
                <p style={{ color: 'red', fontSize: 14, position: 'absolute', margin: '-10px 0 0 20px' }}>
                  {showEmailUsernameErrorMessage}
                </p>
              )}
              <br/>
              <button
                style={{
                  marginRight: 15,
                  color: '#ffffff',
                  padding: '8px 20px',
                  borderRadius: '22px',
                  backgroundColor: '#4DBD74',
                  border: '1px solid #35AC5E',
                }}
                onClick={handleUpdate}
              >
                Update
            </button>
            </Modal.Footer>
          )}
      </Modal>
    </Form>
  );
}

const ReduxForm = reduxForm({
  form: 'quote-confirmation-form',
  //   validate,
  //   onSubmitFail: handleSubmitFail,
})(UpdateStatusQuote);

export default connector(ReduxForm);
