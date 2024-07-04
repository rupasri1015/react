import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const GET_ALL_ASSIGNMENTS = API_ENDPOINTS.MY_ASSIGNMENTS.GET_ALL_ASSIGNMENTS
const START_RUN_URL = API_ENDPOINTS.MY_ASSIGNMENTS.START_RUN
const CANCEL_RUN = API_ENDPOINTS.MY_ASSIGNMENTS.CANCEL_RUN

export function getAllAssignmentForRunner(runnerId) {
	const headers = getAuthHeader();
	const GET_ALL_ASSIGNMENTS_URL = GET_ALL_ASSIGNMENTS.concat(runnerId);
	return http.get(GET_ALL_ASSIGNMENTS_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function startRun(payload) {
	const headers = getAuthHeader()
	return http.post(START_RUN_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function cancelRun(runnerId) {
	const headers = getAuthHeader();
	const CANCEL_RUN_URL = CANCEL_RUN.concat(runnerId);
	return http.get(CANCEL_RUN_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}