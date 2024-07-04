import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'

const CONVERSIONAL_FUNNEL = API_ENDPOINTS.PERFORMANCE.GET_CONVERSIONAL_LIST
const PRICING_DATA = API_ENDPOINTS.PERFORMANCE.GET_PRICING_LIST
const OUTLET_PROF = API_ENDPOINTS.PERFORMANCE.GET_OUTLET_PROF_LIST
const VALUATOR_PROF = API_ENDPOINTS.PERFORMANCE.GET_VALUATOR_PROF_LIST
const VALUATOR_DATA = API_ENDPOINTS.PERFORMANCE.GET_VALUATOR_DATA

export function getConversionalData(payload) {
  return http.post(CONVERSIONAL_FUNNEL, payload)
    .then(handleResponse)
    .catch(handleError)
}
export function getPricingData(payload) {
  return http.post(PRICING_DATA, payload)
    .then(handleResponse)
    .catch(handleError)
}

export function getOutletProf(payload) {
  return http.post(OUTLET_PROF, payload)
    .then(handleResponse)
    .catch(handleError)
}

export function getValuatorProf(payload) {
  return http.post(VALUATOR_PROF, payload)
    .then(handleResponse)
    .catch(handleError)
}

export function getValuatorData(payload) {
  return http.post(VALUATOR_DATA, payload)
    .then(handleResponse)
    .catch(handleError)
}