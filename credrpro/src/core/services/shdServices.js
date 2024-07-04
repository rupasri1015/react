import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_ADD_SHD_USER = API_ENDPOINTS.SHD.ADD_USER
const API_ENDPOINT_LIST_SHD_USER = API_ENDPOINTS.SHD.GET_USER_LIST
const API_ENDPOINT_SEARCH_SHD_USER = API_ENDPOINTS.SHD.SEARCH_SHD_USER
const API_ENDPOINT_UPDATE_SHD_USER = API_ENDPOINTS.SHD.UPDATE_USER
const API_ENDPOINT_ADD_SHD = API_ENDPOINTS.SHD.ADD_SHD
const API_ENDPOINT_SHD_COMMISSION = API_ENDPOINTS.SHD.SHD_COMMISSION
const API_ENDPOINT_ADD_SHD_COMMISION = API_ENDPOINTS.SHD.ADD_SHD_COMMISSION
const API_ENDPOINT_SHD_DETAILS = API_ENDPOINTS.SHD.GET_SHD_DETAILS
const API_GET_ORDER_DEDUCTION=API_ENDPOINTS.SHD.GET_ORDER_DEDUCTIONS
const API_ENDPOINT_CARE_CONFIRMATION_LIST = API_ENDPOINTS.SHD.CARE_CONFIRMATION_LIST
const API_END_POINT_UPDATE_STATUS = API_ENDPOINTS.SHD.UPDATE_STATUS_QUOTE
const API_ENDPOINT_GET_REASONS = API_ENDPOINTS.SHD.GET_REASONS_QUOTE
const API_END_POINT_CALL_TOCARE_CUSTOMER = API_ENDPOINTS.SHD.CALL_TO_CUSTOMER
const API_END_POINT_SELL_SEND_OTP = API_ENDPOINTS.SHD.SELL_SEND_OTP
const API_END_POINT_SELL_CONFIRMATION_OTP = API_ENDPOINTS.SHD.SELL_CONFIRM_OTP
const API_ENDPOINT_GET_HISTORY = API_ENDPOINTS.SHD.HISTORY_DATA_QUOTE
const API_ENDPOINT_GET_AGENTS_LIST = API_ENDPOINTS.SHD.AGENTS_LIST
const GET_STORE_TRANSACTION_LIST = API_ENDPOINTS.SHD.GET_STORE_TRANSACTIONS_LIST
const GET_SHD_TRANSACTION_DETAILS = API_ENDPOINTS.SHD.GET_SHD_TRANSACTION_DETAILS
const EXPORT_TO_EXCEL_WALLET_CP = API_ENDPOINTS.SHD.EXPORT_TO_EXCEL_WALLET_CP
// const GET_CITY_CREDIT_LIMITS = API_ENDPOINTS.SHD.VIEW_CITY_CREDIT_LIMIT
const VIEW_USER_CREDIT = API_ENDPOINTS.SHD.VIEW_USER_CREDIT
const GENERATE_WALLET_OTP = API_ENDPOINTS.SHD.GENERATE_WALLET_OTP
const UPDATE_WALLET_CREDIT_LIMIT = API_ENDPOINTS.SHD.UPDATE_WALLET_CREDIT_LIMIT
const EXPORT_TO_EXCEL_WALLET_DETAILS = API_ENDPOINTS.SHD.EXPORT_WALLET_DETAILS


export function addSHDUser(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ADD_SHD_USER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function listSHDUsers(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_LIST_SHD_USER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function searchSHDUsers(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SEARCH_SHD_USER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateSHDUser(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_SHD_USER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function addSHD(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ADD_SHD, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function shdCommission(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SHD_COMMISSION, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function addShdCommission(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ADD_SHD_COMMISION, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getShdDetailsById(id) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_SHD_DETAILS.replace('<TRANSACTION_ID>', id)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getOrderDeductions(id) {
  const headers = getAuthHeader()
  const url = API_GET_ORDER_DEDUCTION.replace('<ORDER_ID>', id)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getCareConfirmationList(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_CARE_CONFIRMATION_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateStatus(payload) {
  const headers = getAuthHeader()
  return http.post(API_END_POINT_UPDATE_STATUS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getReasonsQuote(status) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_REASONS.replace('<STATUS>', status)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function callToCareCustomer(payload) {
  const headers = getAuthHeader()
  return http.post(API_END_POINT_CALL_TOCARE_CUSTOMER, {...payload}, { headers })
  .then(handleResponse)
  .catch(handleError)
}

export function sendOtpToCustomer(payload) {
  const headers = getAuthHeader();
  const url = API_END_POINT_SELL_SEND_OTP;
  return http.post(url,{...payload}, { headers })
  .then(handleResponse)
  .catch(handleError);
}

export function confirmOTP(payload) {
  const headers = getAuthHeader()
  return http.post(API_END_POINT_SELL_CONFIRMATION_OTP, {...payload}, { headers })
  .then(handleResponse)
  .catch(handleError)
}

export function getHistoryData(leadID, status) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_HISTORY.replace('<LEAD_ID>', leadID).replace('<STATUS>', status)
  return http.get(url, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function getAgentsList(){
  const headers = getAuthHeader()
  return http.get(API_ENDPOINT_GET_AGENTS_LIST, { headers })
  .then(handleResponse)
  .catch(handleError)
}

export function getStoreTransactionsList(payload) {
  const headers = getAuthHeader();
  return http
    .post(GET_STORE_TRANSACTION_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function getShdTransactionsList(payload) {
  const headers = getAuthHeader();
  return http
    .post(GET_SHD_TRANSACTION_DETAILS, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function exportToExcelCP(storeId) {
  const headers = getAuthHeader();
  const url = EXPORT_TO_EXCEL_WALLET_CP.replace('<STORE_ID>', storeId);
  return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

// export function getCityCreditLimit() { // praveen
//   const headers = getAuthHeader();
//   const url = GET_CITY_CREDIT_LIMITS
//   return http.get(url, { headers }).then(handleResponse).catch(handleError);
// }
export function getUserCreditLimit(walletId) {
  const headers = getAuthHeader();
  const url = VIEW_USER_CREDIT.replace('<WALLET_ID>', walletId);
  return http.get(url, { headers }).then(handleResponse).catch(handleError);
}
export function generateWalletOTP(userID) {
  const headers = getAuthHeader();
  const url = GENERATE_WALLET_OTP.replace('<USER_ID>', userID);
  return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function updateWalletCreditLimit(payload) {
  const headers = getAuthHeader();
  return http
    .post(UPDATE_WALLET_CREDIT_LIMIT, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function exportWalletDetails(payload) {
  const headers = getAuthHeader();
  const url = EXPORT_TO_EXCEL_WALLET_DETAILS
  return http.post(url, payload, { headers })
      .then(handleResponse).catch(handleError);
}
