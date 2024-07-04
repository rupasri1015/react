import http from 'axios'
import { handleError, handleResponse, handleFileResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_LIST_INVENTORY = API_ENDPOINTS.INVENTORY.LIST_INVENTORY_BY_STATUS
const API_ENDPOINT_ACCEPT_INVENTORY = API_ENDPOINTS.INVENTORY.ACCEPT_VEHICLE
const API_ENDPOINT_GET_INVENTORY_IMAGES = API_ENDPOINTS.INVENTORY.GET_VEHICLE_IMAGE
const API_ENDPOINT_GET_ENHANCED_INVENTORY_IMAGES = API_ENDPOINTS.INVENTORY.GET_ENHANCED_VEHICLE_IMAGE
const API_ENDPOINT_UPLOAD_ENHANCED_INVENTORY_IMAGES = API_ENDPOINTS.INVENTORY.UPLPOAD_VEHICLE_IMAGES
const API_ENDPOINT_GET_INVENTORY_IMAGES_ZIP = API_ENDPOINTS.INVENTORY.DOWNLOAD_IMAGES
const API_ENDPOINT_DELETE_IMAGE = API_ENDPOINTS.INVENTORY.DELETE_IMAGE
const API_ENDPOINT_REJECT_INVENTORY = API_ENDPOINTS.INVENTORY.REJECT_VEHICLE
const API_ENDPOINT_SEARCH_INVENTORY = API_ENDPOINTS.INVENTORY.SEARCH_VEHICLE
const API_ENDPOINT_UPDATE_INVENTORY = API_ENDPOINTS.INVENTORY.UPDATE_VEHICLE
const API_ENDPOINT_CONFIRM_INVENTORY_PUBLISH = API_ENDPOINTS.INVENTORY.CONFIRM_PUBLISH
const API_ENDPOINT_MAKES = API_ENDPOINTS.INVENTORY.GET_MAKES_BY_CITYID
const API_ENDPOINT_MODELS = API_ENDPOINTS.INVENTORY.GET_MODELS
const API_ENDPOINT_VARIANT = API_ENDPOINTS.INVENTORY.GET_VARIANTS_BY_MODEL
const API_ENDPOINT_UPDATE_VEHICLE_DETAILS = API_ENDPOINTS.INVENTORY.UPDATE_VEHICLE_DETAILS
const API_ENDPOINT_GET_ENHANCED_IMAGES = API_ENDPOINTS.INVENTORY.GET_BIKE_IMAGES
const API_ENDPOINT_UPLOAD_ENHANCED_IMAGES = API_ENDPOINTS.INVENTORY.UPLOAD_ENHANCED_IMAGES
const API_ENDPOINT_UPDATE_BIKE_INVENTORY = API_ENDPOINTS.INVENTORY.UPDATE_BIKE_INVENTORY
const API_ENDPOINT_GET_VARIANTS_BY_MODEL_ID = API_ENDPOINTS.INVENTORY.GET_VARIANTS_BY_MODEL_ID


export function listInventoryByStatus(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_LIST_INVENTORY, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateBikeInventory(payload) {
  const headers = getAuthHeader()
  return http.put(API_ENDPOINT_UPDATE_BIKE_INVENTORY, payload, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function publishShdBike(payload){
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_CONFIRM_INVENTORY_PUBLISH, payload, {headers})
  .then(handleResponse)
  .catch(handleError)
}

export function acceptInventory(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_ACCEPT_INVENTORY, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function rejectInventory(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_REJECT_INVENTORY, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getInventoryImages(inventoryId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_INVENTORY_IMAGES.replace('<VEHICLE_ID>', inventoryId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getInventoryImagesZip(inventoryId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_INVENTORY_IMAGES_ZIP.replace('<VEHICLE_ID>', inventoryId)
  return http.get(url, { headers, responseType: 'blob' })
    .then(handleFileResponse)
}

export function getEnhancedImages(inventoryId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_ENHANCED_INVENTORY_IMAGES.replace('<VEHICLE_ID>', inventoryId)
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function uplpoadEnhancedImages(payload, inventoryId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_UPLOAD_ENHANCED_INVENTORY_IMAGES.replace('<VEHICLE_ID>', inventoryId)
  return http.post(url, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function deleteBikeImage(imageId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_DELETE_IMAGE.replace('<IMAGE_ID>', imageId)
  return http.delete(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function searchInventory(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SEARCH_INVENTORY, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateInventory(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_UPDATE_INVENTORY, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function getMakes(cityId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_MAKES.replace('<CITY_ID>', cityId)
  return http.get(url, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function getModels(make, cityId) {
  const headers = getAuthHeader()
  let url = API_ENDPOINT_MODELS.replace('<MAKE_NAME>', make)
  url = url.replace('<CITY_ID>', cityId)
  return http.get(url, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function getVariant(modelName) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_VARIANT.replace('<MODEL_NAME>', modelName)
  return http.get(url, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function getVariantById(modelId) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_VARIANTS_BY_MODEL_ID.replace('<MODEL_ID>', modelId)
  return http.get(url, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function updateVehicleDetails(payload) {
  const headers = getAuthHeader()
  return http.put(API_ENDPOINT_UPDATE_VEHICLE_DETAILS, payload, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function getBikeImages(ibdid) {
  const headers = getAuthHeader()
  const url = API_ENDPOINT_GET_ENHANCED_IMAGES.replace('<IBD_ID>', ibdid)
  return http.get(url, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function uploadEnhancedImages(payload){
  const headers = getAuthHeader()
  return http.put(API_ENDPOINT_UPLOAD_ENHANCED_IMAGES, payload, {headers})
    .then(handleResponse)
    .catch(handleError)
}