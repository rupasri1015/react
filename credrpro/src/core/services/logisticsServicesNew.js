// Only use in action files. Stop using directly in component
import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

export function getAllVehicles(payload) {
  const headers = getAuthHeader();
  return http.post( API_ENDPOINTS.LOGISTICS.GET_ALL_VEHICLES,payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function newAssignRunner(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINTS.LOGISTICS.NEW_ASSIGN_RUNNER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
