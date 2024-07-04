import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_GET_BUFFER_ONLINE = API_ENDPOINTS.BUFFER_PRICE_ONLINE_SELL.GET_BUFFER_DATA
const API_ENDPOINT_SAVE_FM_PRICE = API_ENDPOINTS.BUFFER_PRICE_ONLINE_SELL.SAVE_FM_PRICE

export function getBufferPriceData(payload) {
    const headers = getAuthHeader()
    return http.post(API_ENDPOINT_GET_BUFFER_ONLINE, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function saveFMPrice(payload) {
    const headers = getAuthHeader()
    return http.post(API_ENDPOINT_SAVE_FM_PRICE, payload, {headers})
    .then(handleResponse)
    .catch(handleError)
}