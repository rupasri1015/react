import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_REFURB_DATA = API_ENDPOINTS.REFURBISHMENT.GET_REFURB_DATA
const API_ENDPOINT_GET_REFURB_URL = API_ENDPOINTS.REFURBISHMENT.GET_REFURB_URL
const API_ENDPOINT_GET_INSPECTION_DETAILS = API_ENDPOINTS.REFURBISHMENT.GET_INSPECTION_DETAILS
const API_ENDPOINT_UPDATE_REFUB_COST = API_ENDPOINTS.REFURBISHMENT.UPDATE_REFUB_COST


export function refurbData(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_REFURB_DATA, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function updateRefubCost(payload) {
  const headers = getAuthHeader()
  return http.put(API_ENDPOINT_UPDATE_REFUB_COST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function refurbUrl(id) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_REFURB_URL.replace('<ID>', id)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getInspectionDetails(id) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_INSPECTION_DETAILS.replace('<ID>', id)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}