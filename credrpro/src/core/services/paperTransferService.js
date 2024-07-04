import http from 'axios'
import {API_ENDPOINTS} from '../constants/apiConstant'
import { handleError, handleResponse } from '../utility'
import { getAuthHeader } from '../utility/authHeaders'

const API_ENDPOINT_GET_PAPAPER_TRANSFORM = API_ENDPOINTS.GET_PAPER_TRANSFER.GET_PAPER_TRANSFER_DATA
const API_ENDPOINT_CALL_PT_AGENT = API_ENDPOINTS.GET_PAPER_TRANSFER.CALL_PT_AGENT
const API_ENDPOINT_VIEW_PENDING = API_ENDPOINTS.GET_PAPER_TRANSFER.GET_VIEW_PENDING
const API_ENDPOINT_SUBMIT_STAGE1 = API_ENDPOINTS.GET_PAPER_TRANSFER.SUBMIT_STAGE1
const API_ENDPOINT_VIEW_OTHER_LEADS = API_ENDPOINTS.GET_PAPER_TRANSFER.GET_VIEW_OTHER_LEADS
const API_ENDPOINT_GET_SMS = API_ENDPOINTS.GET_PAPER_TRANSFER.GET_SMS_FOR_STAGES

export function getPaperTransformData(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_GET_PAPAPER_TRANSFORM, payload, { headers })
      .then(handleResponse)
      .catch(handleError)
}

export function callingPtAgent(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_CALL_PT_AGENT, payload, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function viewPendingDetails(leadId) {
  const headers = getAuthHeader()
  const url = (API_ENDPOINT_VIEW_PENDING.replace('<LEAD_ID>', leadId))
  return http.get(url, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function submitStage1Docs(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_SUBMIT_STAGE1, payload, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function viewOtherLeads(leadId) {
  const headers = getAuthHeader()
  const url = (API_ENDPOINT_VIEW_OTHER_LEADS.replace('<LEAD_ID>', leadId))
  return http.get(url, {headers})
    .then(handleResponse)
    .catch(handleError)
}

export function getSMSForStages(payload) {
  const headers = getAuthHeader()
  return http.post(API_ENDPOINT_GET_SMS, payload, {headers})
    .then(handleResponse)
    .catch(handleError)
}