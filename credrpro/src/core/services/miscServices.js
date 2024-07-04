import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_LIST_CITIES = API_ENDPOINTS.MISC.GET_CITY_LIST
const API_ENDPOINT_LIST_STORES = API_ENDPOINTS.MISC.STORE_LIST
const API_ENDPOINT_LIST_INSPECTORS = API_ENDPOINTS.MISC.INSPECTOR_LIST
const API_ENDPOINTS_LIST_FHD_SHD_STORES = API_ENDPOINTS.MISC.FHD_SHD_STORE_LIST
const API_ENDPOINTS_LIST_VALUATOR_LIST = API_ENDPOINTS.PERFORMANCE.GET_VALUATOR_PROF_LIST
const API_ENDPOINTS_LIST_STORE_LIST = API_ENDPOINTS.PERFORMANCE.STORE_LIST
const API_ENDPOINT_DOC_QC_CITIES = API_ENDPOINTS.MISC.GET_DOC_QC_CITY_LIST
const API_ENDPOINT_AUDIT_DB = API_ENDPOINTS.AUDIT.GET_AUDIT_INFO
const API_ENDPOINT_SUBMIT_AUDIT_FEEDBACK = API_ENDPOINTS.AUDIT.SUBMIT_AUDIT_FEEDBACK
const API_ENDPOINT_UPDATE_PROFILE = API_ENDPOINTS.MISC.UPDATE_USER_PROFILE
const API_ENDPOINT_UPDATE_IMAGE = API_ENDPOINTS.MISC.UPDATE_USER_IMAGE
const API_ENDPOINT_UPDATE_NAME_EMAIL = API_ENDPOINTS.MISC.UPDATE_NAME_EMAIL
const API_ENDPOINT_UPDATE_CUSTOMER_EXPECTED_PRICE = API_ENDPOINTS.MISC.UPDATE_CUSTOMER_EXPECTED_PRICE
const API_ENDPOINT_MARK_IT_AS_DROPPED = API_ENDPOINTS.MISC.MARK_IT_AS_DROPPED

export function listCities() {
  const headers = getAuthHeader()
  return http.get(API_ENDPOINT_LIST_CITIES, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function updateCustomerDetails(payload) {
  return http.put(API_ENDPOINT_UPDATE_NAME_EMAIL, payload)
    .then(handleResponse)
    .catch(handleError)
}
export function getDocQcCities(userId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_DOC_QC_CITIES.replace('<USER_ID>', userId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function listStores(cityId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_LIST_STORES.replace('<CITY_ID>', cityId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function listInspectors(cityId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_LIST_INSPECTORS.replace('<CITY_ID>', cityId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function listStoresFhdShd(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINTS_LIST_FHD_SHD_STORES, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function valuatorList(payload) {
  return http.post(API_ENDPOINTS_LIST_VALUATOR_LIST, payload)
    .then(handleResponse)
    .catch(handleError)
}
export function pdStoreList(payload) {
  return http.post(API_ENDPOINTS_LIST_STORE_LIST, payload)
    .then(handleResponse)
    .catch(handleError)
}
export function getAuditInfo(userId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_AUDIT_DB.replace('<USER_ID>', userId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function submitAuditFeedback(payload) {
  return http.post(API_ENDPOINT_SUBMIT_AUDIT_FEEDBACK, payload)
    .then(handleResponse)
    .catch(handleError)
}

export function updateProfile(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_PROFILE, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateProfileImage(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_IMAGE, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateCustomerExpectedPrice(payload) {
  const headers = getAuthHeader()
  return http.put(API_ENDPOINT_UPDATE_CUSTOMER_EXPECTED_PRICE, payload, {headers})
  .then(handleResponse)
  .catch(handleError)
}

export function markItAsDropped(payload) {
  const headers = getAuthHeader()
  return http.put(API_ENDPOINT_MARK_IT_AS_DROPPED, payload, {headers})
    .then(handleResponse)
    .catch(handleError)
}