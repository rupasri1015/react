import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_ADD_VALUATOR = API_ENDPOINTS.VALUATOR.ADD_USER
const API_ENDPOINT_LIST_VALUATORS = API_ENDPOINTS.VALUATOR.GET_USER_LIST
const API_ENDPOINT_SEARCH_VALUATORS = API_ENDPOINTS.VALUATOR.SEARCH_VALUATOR_USER
const API_ENDPOINT_UPDATE_VALUATOR = API_ENDPOINTS.VALUATOR.UPDATE_USER
const API_ENDPOINT_GET_VALUATOR = API_ENDPOINTS.VALUATOR.GET_USER
const API_ENDPOINT_UPLOAD_DOCUMENTS = API_ENDPOINTS.VALUATOR.UPLOAD_DOCUMENTS
const API_ENDPOINT_ONBOARD_VALUATOR = API_ENDPOINTS.VALUATOR.ADD_VALUATOR
const API_ENDPOINT_VALUATOR_DASHBOARD_LIST = API_ENDPOINTS.VALUATOR_DASHBOARD.LIST
const API_ENDPOINT_VALUATOR_DASHBOARD_AUDIT_CALL = API_ENDPOINTS.VALUATOR_DASHBOARD.AUDIT_CALL_RECORD
const API_ENDPOINT_VALUATOR_DASHBOARD_REASSIGN_RESCHEDULE = API_ENDPOINTS.VALUATOR_DASHBOARD.REASSIGN_RESCHEDULE
const API_ENDPOINT_GET_VALUATOR_LIST = API_ENDPOINTS.MISC.GET_VALUATOR_LIST
const API_ENDPOINT_GET_VALUATOR_PINCODES = API_ENDPOINTS.VALUATOR.GET_VALUATOR_PINCODES
const API_ENDPOINT_SEARCHABLE_PINCODES = API_ENDPOINTS.VALUATOR.SEARCHABLE_PINCODES
const API_ENDPOINT_UPDATE_PINCODES = API_ENDPOINTS.VALUATOR.UPDATE_PINCODES
const API_ENDPOINT_DROP_LEAD = API_ENDPOINTS.VALUATOR_DASHBOARD.DROP_LEAD

const API_ENDPOINT_DROP_REASONS_VALUATOR = API_ENDPOINTS.VALUATOR_DASHBOARD.GET_DROP_REASONS_VDB
const API_ENDPOINT_DROP_REASONS = API_ENDPOINTS.MISC.DROP_REASONS

export function addValuator(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ADD_VALUATOR, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function getPincodes(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_GET_VALUATOR_PINCODES, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function getSearchPincodes(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SEARCHABLE_PINCODES, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function updatePincodes(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_PINCODES, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function listValuators(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_LIST_VALUATORS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getValuatorList(cityId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_VALUATOR_LIST.replace('<CITY_ID>', cityId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function searchValuators(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SEARCH_VALUATORS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateValuator(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_VALUATOR, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getValuator(valuatorId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_VALUATOR.replace('<VALUATOR_ID>', valuatorId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function uploadDocuments(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPLOAD_DOCUMENTS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function onboardValuator(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ONBOARD_VALUATOR, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getValuatorDashBoardList(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_VALUATOR_DASHBOARD_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getAuditCalls(leadId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_VALUATOR_DASHBOARD_AUDIT_CALL.replace('<LEAD_ID>', leadId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function reAssignOrReSchedule(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_VALUATOR_DASHBOARD_REASSIGN_RESCHEDULE, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getValuatorDropReasons() {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_DROP_REASONS_VALUATOR
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function dropLead(payload) {
  const headers = getAuthHeader()
  return http.put(API_ENDPOINT_DROP_LEAD, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getDropReasons() {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_DROP_REASONS
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}