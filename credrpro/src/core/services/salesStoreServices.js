import http from 'axios';
import { handleError, handleResponse } from '../utility';
import { API_ENDPOINTS } from '../constants/apiConstant';
import { getAuthHeader } from '../utility/authHeaders';

const API_ENDPOINT_GET_VISITING_LEADS = API_ENDPOINTS.SALES_STORE_LEADS.GET_VISITING_LEADS;
const API_ENDPOINT_PLACE_CALL_TO_LEAD = API_ENDPOINTS.PLACE_CALL_TO_LEAD;

export function getVisitingLeads(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_GET_VISITING_LEADS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function placeCallToLead(payload) {
	const headers = getAuthHeader();

	return http.post(API_ENDPOINT_PLACE_CALL_TO_LEAD, payload, { headers }).then(handleResponse).catch(handleError);
}
