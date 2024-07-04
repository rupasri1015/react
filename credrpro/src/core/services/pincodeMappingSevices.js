import http from "axios";
import { API_ENDPOINTS } from "../constants/apiConstant";
import { handleError, handleResponse } from '../utility'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINTS_GET_PINCODE = API_ENDPOINTS.VALUATOR.GET_PINCODE_SLOTS
const API_ENDPOINTS_UPDATE_PINCODE = API_ENDPOINTS.VALUATOR.POST_PINCODE_SLOTS     

export function getPincodeSlots(userId){
    const headers = getAuthHeader()
    const url = API_ENDPOINTS_GET_PINCODE.replace("<USER_ID>",userId)
    return http.get(url, {headers})
    .then(handleResponse)
    .catch(handleError)
}
export function postPincodeSlots(payload){
    const headers = getAuthHeader()
    return http.post(API_ENDPOINTS_UPDATE_PINCODE, payload, { headers })
      .then(handleResponse)
      .catch(handleError)
  }
