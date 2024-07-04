import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINTS_DOCUMENTATION_LEADS =API_ENDPOINTS.POSTSALES.GET_DOCUMENTATION_LEADS
const API_ENDPOINTS_UPDATE_ALTERNATE_MOBILENUMBER=API_ENDPOINTS.POSTSALES.UPDATE_ALTERNATE_MOBILENUMBER

export function getDocumentationLeads(payload) {
    const headers = getAuthHeader()
    return http.post(API_ENDPOINTS_DOCUMENTATION_LEADS, payload, { headers })
      .then(handleResponse)
      .catch(handleError)
  }
  
  export function updateAlternateMobileNumber(payload) {
    const headers = getAuthHeader()
    return http.post(API_ENDPOINTS_UPDATE_ALTERNATE_MOBILENUMBER, payload, { headers })
      .then(handleResponse)
      .catch(handleError)
  }