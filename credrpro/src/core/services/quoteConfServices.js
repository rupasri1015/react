import http from "axios";
import { API_ENDPOINTS } from "../constants/apiConstant";
import { handleError, handleResponse } from '../utility'
import { getAuthHeader } from '../utility/authHeaders'

const API_END_POINT_UPDATE_STATUS = API_ENDPOINTS.SUPPLY.UPDATE_STATUS_QUOTE;
const API_ENDPOINT_GET_REASONS = API_ENDPOINTS.SUPPLY.GET_REASONS_QUOTE;
const API_ENDPOINT_GET_HISTORY = API_ENDPOINTS.SUPPLY.HISTORY_DATA_QUOTE
const API_ENDPOINT_OVERRIDE_TO_STORE = API_ENDPOINTS.BIDDING.OVERRIDE_TO_STORE

export function updateStatus(payload) {
    const headers = getAuthHeader()
    return http.post(API_END_POINT_UPDATE_STATUS, {...payload}, {headers})
      .then(handleResponse)
      .catch(handleError)
  }

export function getReasonsQuote(status) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_REASONS.replace('<STATUS>', status)
  return http.get(url, {headers})
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

export function overRideToStore(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_OVERRIDE_TO_STORE, {...payload}, {headers})
    .then(handleResponse)
    .catch(handleError)
}