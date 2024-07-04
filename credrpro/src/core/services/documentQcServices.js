import http from 'axios';
import { API_ENDPOINTS } from '../constants/apiConstant';
import { getAuthHeader } from '../utility/authHeaders';
import { handleError, handleResponse, handleIsValidResponse } from '../utility';

const API_ENDPOINT_GET_QC_LIST = API_ENDPOINTS.DOCUMENTQC.GET_QC_LIST;
const API_ENDPOINT_GET_QCBIKEDOCUMENTS =
  API_ENDPOINTS.DOCUMENTQC.GET_QCBIKEDOCUMENTS;
const API_ENDPOINT_UPDATE_DOCUMENTQC_STATUS =
  API_ENDPOINTS.DOCUMENTQC.UPDATE_DOCUMENTQC_STATUS;
const API_ENDPOINT_UPLOAD_MULTIPLE_IMAGES =
  API_ENDPOINTS.DOCUMENTQC.UPLOAD_MULTIPLE_IMAGES;
const API_ENDPOINT_GET_QC_RJECTION = API_ENDPOINTS.DOCUMENTQC.GET_REASON;
const API_ENDPOINT_CALL_VALUATOR = API_ENDPOINTS.DOCUMENTQC.CALL_TO_VALUATOR;
const API_ENDPOINT_EDIT_YEAR = API_ENDPOINTS.DOCUMENTQC.EDIT_VEHICLE_YEAR;
const API_ENDPOINT_GET_REASON = API_ENDPOINTS.DOCUMENTQC.GET_REASONS;
const API_ENDPOINT_EDIT_REG_NUMBER = API_ENDPOINTS.DOCUMENTQC.EDIT_REG_NUMBER;
const API_ENDPOINT_UPDATE_MMV = API_ENDPOINTS.DOCUMENTQC.UPDATE_MMV;
const API_ENDPOINT_UPDATE_BANK_DETAILS = API_ENDPOINTS.DOCUMENTQC.UPDATE_BANK_DETAILS;
const API_ENDPOINT_UPDATE_RAZORPAY_NAME = API_ENDPOINTS.DOCUMENTQC.UPDATE_RAZORPAY_NAME;
const API_ENDPOINT_UPDATE_BANK_STATUS = API_ENDPOINTS.DOCUMENTQC.UPDATE_BANK_STATUS;
const API_ENDPOINT_VALIDATE_ACCOUNT_DETAILS = API_ENDPOINTS.DOCUMENTQC.VALIDATE_ACCOUNT_DETAILS;
const API_ENDPOINT_GET_DETAILS_FUND_ID = API_ENDPOINTS.DOCUMENTQC.GET_DETAILS_FUND_ID;

export function getDocumentQcList(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_GET_QC_LIST, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}
export function updateMMVData(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_UPDATE_MMV, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function getQcBikeDocuments(leadId, type) {
  const headers = getAuthHeader();
  const url = API_ENDPOINT_GET_QCBIKEDOCUMENTS.replace(
    '<LEAD_ID>',
    leadId
  ).replace('<qc_approval_type>', type);
  return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function updateDocumentQcBikeStatus(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_UPDATE_DOCUMENTQC_STATUS, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function uploadMultiImages(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_UPLOAD_MULTIPLE_IMAGES, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function getReasonForRejection(leadId) {
  const headers = getAuthHeader();
  const url = API_ENDPOINT_GET_QC_RJECTION.replace('<LEAD_ID>', leadId);
  return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function callToValuator(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_CALL_VALUATOR, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function editYearOrRegNo(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_EDIT_YEAR, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function getReasons(qcId) {
  const headers = getAuthHeader();
  const url = API_ENDPOINT_GET_REASON.replace('<QC_ID>', qcId);
  return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function editRegNumber(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_EDIT_REG_NUMBER, payload, { headers })
    .then(handleResponse)
    .catch(handleError);
}

export function editBankDetails(payload) {
  const headers = getAuthHeader();
  return http
    .put(API_ENDPOINT_UPDATE_BANK_DETAILS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function editRazorpayName(payload) {
  const headers = getAuthHeader();
  return http
    .put(API_ENDPOINT_UPDATE_RAZORPAY_NAME, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function updateBankDetailStatus(payload) {
  const headers = getAuthHeader();
  return http
    .put(API_ENDPOINT_UPDATE_BANK_STATUS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}

export function validateAccountDetails(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_VALIDATE_ACCOUNT_DETAILS, payload, { headers })
    .then(handleResponse)
    .catch(handleError)
}
export function getDetailsByFundId(payload) {
  const headers = getAuthHeader();
  return http
    .post(API_ENDPOINT_GET_DETAILS_FUND_ID, payload, { headers })
    .then(handleIsValidResponse)
    .catch(handleError)
}