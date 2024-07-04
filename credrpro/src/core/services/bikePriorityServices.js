import http from 'axios'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'
import { handleError, handleResponse } from '../utility'

const API_ENDPOINT_GET_PRIORITY_LIST = API_ENDPOINTS.BIKEPRIORITY.GET_BIKE_PRIORITIES
const SUBMIT_PRIORITY_LIST = API_ENDPOINTS.BIKEPRIORITY.SUBMIT_PRIORITY_LIST
const PREVIEW_PRIORITY_LIST = API_ENDPOINTS.BIKEPRIORITY.PREVIEW_PRIORITY_LIST
const BIKE_PRIORITY_FILTER = API_ENDPOINTS.BIKEPRIORITY.APPLY_BIKE_PRIORITY_FILTER

export function getPriorityList(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_GET_PRIORITY_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function submitPriorityList(payload) {
  const headers = getAuthHeader()
  return http.post(SUBMIT_PRIORITY_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function previewPriorityList(payload) {
  const headers = getAuthHeader()
  return http.post(PREVIEW_PRIORITY_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getPriorityListByFilter(payload) {
  const headers = getAuthHeader()
  return http.post(BIKE_PRIORITY_FILTER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
