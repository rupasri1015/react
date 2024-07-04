import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_GET_FHD_LIST = API_ENDPOINTS.FHD.GET_USER_LIST
const API_ENDPOINT_ADD_FHD_USER = API_ENDPOINTS.FHD.ADD_USER
const API_ENDPOINT_SEARCH_FHD_USER = API_ENDPOINTS.FHD.SEARCH_FHD_USER
const API_ENDPOINT_UPDATE_FHD_USER = API_ENDPOINTS.FHD.UPDATE_USER
const API_ENDPOINT_ADD_FHD = API_ENDPOINTS.FHD.ADD_FHD
const API_ENDPOINT_GET_FHD = API_ENDPOINTS.FHD.GET_FHD_DETAILS

export function updateFHDUser(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_FHD_USER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function searchFHDUser(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SEARCH_FHD_USER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function addFHDUser(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ADD_FHD_USER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getFHDUserList(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_GET_FHD_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function addFHD(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ADD_FHD, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getFhdDetails(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_GET_FHD, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}