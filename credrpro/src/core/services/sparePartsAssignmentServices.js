import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const GET_DATA_URL = API_ENDPOINTS.SPARE_PARTS_ASSIGNMENT.GET_TABLE_DATA
const SEARCH_DATA_URL = API_ENDPOINTS.SPARE_PARTS_ASSIGNMENT.SEARCH_TABLE_DATA
const REAPIR_REQUEST_URL = API_ENDPOINTS.SPARE_PARTS_ASSIGNMENT.REPAIR_REQUEST_DATA
const SUBMIT_REAPIR_REQUEST_URL = API_ENDPOINTS.SPARE_PARTS_ASSIGNMENT.SUBMIT_REPAIR_REQUEST
const DOWNLOAD_DATA_URL = API_ENDPOINTS.SPARE_PARTS_ASSIGNMENT.DOWNLOAD_DATA
const WAREHOUSE_AND_REPAIRCENTER_URL = API_ENDPOINTS.SPARE_PARTS_ASSIGNMENT.WAREHOUSE_AND_REPAIRCENTER
const CREATE_PARTS_REQUISITION_URL = API_ENDPOINTS.SPARE_PARTS_ASSIGNMENT.CREATE_PARTS_REQUISITION

export function getSparePartsAssignmentTableData(payload) {
	const headers = getAuthHeader()
	const { 
		pageNumber,
		fromDate,
		toDate,
		warehouseName,
		serviceCenterName,
		searchText,
		status
	} = payload;

	if (pageNumber === 1
			&& warehouseName === ''
			&& serviceCenterName === ''
			&& searchText === ''
			&& status === 'all'
			&& !fromDate
			&& !toDate
		) {		
		return http.get(GET_DATA_URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		return http.post(SEARCH_DATA_URL, payload, { headers })
			.then(handleResponse)
			.catch(handleError)
	}  
}

export function getAllWarehousesAndRepairCenters() {
	const headers = getAuthHeader()
	return http.get(WAREHOUSE_AND_REPAIRCENTER_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getRepairRequestData(requestNum) {
	const headers = getAuthHeader()
	const NEW_URL = REAPIR_REQUEST_URL.concat(requestNum);
	return http.get(NEW_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function submitRepairRequest(payload) {
	const headers = getAuthHeader()
	return http.post(SUBMIT_REAPIR_REQUEST_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function downloadData(payload) {
	const headers = getAuthHeader()
	return http.post(DOWNLOAD_DATA_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function createPartsRequisition(requestNum) {
	const headers = getAuthHeader()
	const NEW_URL = CREATE_PARTS_REQUISITION_URL.concat(requestNum);
	return http.get(NEW_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}