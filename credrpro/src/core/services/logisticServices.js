import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_ASSIGN_RUNNER = API_ENDPOINTS.LOGISTICS.ASSIGN_RUNNER
const API_ENDPOINT_ASSIGN_RUNNER_TO_INVENTORY = API_ENDPOINTS.LOGISTICS.ASSIGN_RUNNER_TO_INVENTORY
const API_ENDPOINT_LIST_WAREHOUSE_DELIVERY = API_ENDPOINTS.LOGISTICS.LIST_WAREHOUSE_DELIVERY
const API_ENDPOINT_SEARCH_RUNNER = API_ENDPOINTS.LOGISTICS.SEARCH_RUNNERS
const API_ENDPOINT_VEHICLE_STATUS = API_ENDPOINTS.LOGISTICS.VEHICLE_STATUS
const API_ENDPOINT_GET_RUNNERS = API_ENDPOINTS.LOGISTICS.GET_RUNNER
const API_ENDPOINT_LIST_RUNNERS = API_ENDPOINTS.LOGISTICS.LIST_RUNNERS
const API_ENDPOINT_LIST_COORDINATOR = API_ENDPOINTS.LOGISTICS.LIST_COORDINATOR
const API_ENDPOINT_EXPORT = API_ENDPOINTS.LOGISTICS.EXPORT_TO_EXEL
const API_ENDPOINT_EXPORT_WAREHOUSE = API_ENDPOINTS.LOGISTICS.EXPORT_WAREHOUSE
const API_ENDPOINT_UPLOAD_IMAGES = API_ENDPOINTS.LOGISTICS.UPLOAD_IMAGES
const API_ENDPOINT_WAREHOUSE_DELIVERY_STATUS = API_ENDPOINTS.LOGISTICS.ACCEPT_WAREHAOUSE_DELIVEY
const API_ENDPOINT_STATE_CITIES = API_ENDPOINTS.LOGISTICS.LOGISTICS_STATE_CITIES
const API_ENDPOINT_GET_LOGISTICS_INCUSTODY = API_ENDPOINTS.LOGISTICS.GET_IN_CUSTODY_DATA
const API_ENDPOINT_IN_CUSTODY_ACTION = API_ENDPOINTS.LOGISTICS.IN_CUSTODY_ACTION

export function assignRunner(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ASSIGN_RUNNER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function assignRunnerToInventory(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ASSIGN_RUNNER_TO_INVENTORY, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function listWarehouseDeliveries(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_LIST_WAREHOUSE_DELIVERY, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function uploadImages(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPLOAD_IMAGES, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function exportToExel(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_EXPORT, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function warehouseExportToExel(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_EXPORT_WAREHOUSE, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function listCoordinators(cityId = 0) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_LIST_COORDINATOR.replace('<CITY_ID>', cityId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function searchRunners(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SEARCH_RUNNER, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getRunners(leadId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_RUNNERS.replace('<LEAD_ID>', leadId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getRunnersForFilters(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_LIST_RUNNERS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateWarehouseDeliveryStatus(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_WAREHOUSE_DELIVERY_STATUS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getVehicleStatus(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_VEHICLE_STATUS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getStateCities(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_STATE_CITIES, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getInCustodyData(payload){
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_GET_LOGISTICS_INCUSTODY, payload, { headers })
  .then(handleResponse)
  .catch(handleError)
}

export function submitToInCustody(payload){
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_IN_CUSTODY_ACTION, payload, { headers })
  .then(handleResponse)
  .catch(handleError)
}