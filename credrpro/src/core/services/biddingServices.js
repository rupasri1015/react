import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_GET_BIDDING_LIST = API_ENDPOINTS.BIDDING.GET_BIDDING_LIST
const API_ENDPOINT_GET_BIDDING_DETAILS = API_ENDPOINTS.BIDDING.GET_BIDDING_DETAILS
const API_ENDPOINT_GET_VALUATOR_DETAILS = API_ENDPOINTS.BIDDING.GET_VALUATOR_DETAILS
const API_ENDPOINT_MARK_AS_DROPPED = API_ENDPOINTS.BIDDING.MARK_AS_DROP
const API_ENDPOINT_GET_LEAD_DETAILS = API_ENDPOINTS.BIDDING.GET_LEAD_DETAILS
const API_ENDPOINT_GET_USER_DETAILS = API_ENDPOINTS.BIDDING.GET_USER_DETAILS
const API_ENDPOINT_GET_VEHICLE_DETAILS = API_ENDPOINTS.BIDDING.GET_VEHICLE_DETAILS
const API_ENDPOINT_UPDATE_REGISTRATION_NUMBER = API_ENDPOINTS.BIDDING.UPDATE_REGISTRATION_NUMBER
const API_ENDPOINT_RE_BID = API_ENDPOINTS.BIDDING.RE_BID
const API_ENDPOINT_EXPORT = API_ENDPOINTS.BIDDING.EXPORT_TO_EXEL
const API_ENDPOINT_SHD_RE_BID = API_ENDPOINTS.BIDDING.SHD_RE_BID
const API_ENDPOINT_CALL_TO_CUSTOMER = API_ENDPOINTS.BIDDING.CALL_TO_CUSTOMER
const API_ENDPOINT_UPDATE_BID_AMT = API_ENDPOINTS.BIDDING.UPDATE_BID_AMT
const API_ENDPOINT_REBID_OTP= API_ENDPOINTS.BIDDING.REBID_OTP
const API_ENDPOINT_REBID_OTP_VERIFY= API_ENDPOINTS.BIDDING.REBID_OTP_VERIFY
const API_ENDPOINT_GET_LEAD_LIFECYCLE_DETAILS = API_ENDPOINTS.BIDDING.GET_LEAD_LIFECYCLE_DETAILS
const API_ENDPOINT_RELEASE_AUTH = API_ENDPOINTS.BIDDING.RELEASE_AUTHORIZARTION
const API_ENDPOINT_UPDATE_AUTH = API_ENDPOINTS.BIDDING.UPDATE_RELEASE_AUTH

export function verifyRebidOtp(mnum, otp) {
  const url = API_ENDPOINT_REBID_OTP_VERIFY.replace('<M_NUMBER>', mnum).replace('<OTP>', otp)
  const headers = getAuthHeader()
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function sendRebidOtp(mnum,regno) {
  const url = API_ENDPOINT_REBID_OTP.replace('<M_NUMBER>', mnum).replace('<REG_NO>',regno)
  const headers = getAuthHeader()
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function updateBidAmt(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_BID_AMT, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function getBiddingList(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_GET_BIDDING_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function exportToExel(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_EXPORT, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getBiddingDetails(leadId) {
  const url = API_ENDPOINT_GET_BIDDING_DETAILS.replace('<LEAD_ID>', leadId)
  const headers = getAuthHeader()
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getValuatorDetails(storeId, valuatorId) {
  const url = API_ENDPOINT_GET_VALUATOR_DETAILS.replace('<STORE_ID>', storeId).replace('<VALUATOR_ID>', valuatorId)
  const headers = getAuthHeader()
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getLeadDetails(leadId) {
  const url = API_ENDPOINT_GET_LEAD_DETAILS.replace('<LEAD_ID>', leadId)
  const headers = getAuthHeader()
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function getLeadLifecycleDetails(leadId) {
  const url = API_ENDPOINT_GET_LEAD_LIFECYCLE_DETAILS.replace('<LEAD_ID>', leadId)
  const headers = getAuthHeader()
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getReleaseAuth(leadId){
  const url  = API_ENDPOINT_RELEASE_AUTH.replace('<LEAD_ID>',leadId)
  const headers = getAuthHeader()
  return http.get(url,{headers})
    .then(handleResponse)
    .catch(handleError)
}

export function updateReleaseAuth(payload){
  const url  = API_ENDPOINT_UPDATE_AUTH
  const headers = getAuthHeader()
  return http.post(url,payload,{headers})
    .then(handleResponse)
    .catch(handleError)
}

export function getUserDetails(leadId) {
  const url = API_ENDPOINT_GET_USER_DETAILS.replace('<LEAD_ID>', leadId)
  const headers = getAuthHeader()
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getVehicleDetails(inventoryId) {
  const url = API_ENDPOINT_GET_VEHICLE_DETAILS.replace('<INVENTORY_ID>', inventoryId)
  const headers = getAuthHeader()
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function markAsDropped(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_MARK_AS_DROPPED, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function rebid(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_RE_BID, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function shdRebid(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SHD_RE_BID, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateRegistrationNumber(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_REGISTRATION_NUMBER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function callToCustomer(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_CALL_TO_CUSTOMER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}