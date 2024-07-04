import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_FRANCHISE_RUNNER_LIST = API_ENDPOINTS.LOGISTICS.GET_FRANCHISE_RUNNER_LIST
const API_ENDPOINT_FRANCHISE_LOGISTICS = API_ENDPOINTS.LOGISTICS.FRANCHISE_LOGISTICS
const API_ENDPOINT_FRANCHISE_ASSIGN_RUNNER = API_ENDPOINTS.LOGISTICS.ASSIGN_RUNNER_TO_FRANCHISE


export function franchiseAssignRunner(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_FRANCHISE_LOGISTICS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getFranchiseRunners(payload) {
  const headers = getAuthHeader()
  return http.get(API_ENDPOINT_FRANCHISE_RUNNER_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function assignRunner(payload) {
  const headers = getAuthHeader()
  return http.get(API_ENDPOINT_FRANCHISE_ASSIGN_RUNNER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function vehicleStatus(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_FRANCHISE_LOGISTICS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function warehouseDelivery(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_FRANCHISE_LOGISTICS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}