import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const TABLE_DATA_URL = API_ENDPOINTS.PARTS_REQUIREMENT.GET_TABLE_DATA
const SEARCH_URL = API_ENDPOINTS.PARTS_REQUIREMENT.SEARCH_TABLE_DATA
const SUBMIT_REQUIREMENT_URL = API_ENDPOINTS.PARTS_REQUIREMENT.SUBMIT_REQUIREMENT
const AGGREGATE_ORDER_URL = API_ENDPOINTS.PARTS_REQUIREMENT.AGGREGATE_ORDER
const RUNNER_LIST_URL = API_ENDPOINTS.PARTS_REQUIREMENT.RUNNER_LIST
const VENDOR_LIST_URL = API_ENDPOINTS.PARTS_REQUIREMENT.VENDOR_LIST
const CREATE_ORDER_URL = API_ENDPOINTS.PARTS_REQUIREMENT.CREATE_ORDER

export function getPartsRequirementTableData(payload) {
	const URL = TABLE_DATA_URL.concat(payload.warehouseId);
	const headers = getAuthHeader()
    if (payload.pageNumber === 1
        && payload.filter === ''
        && payload.searchText === ''
        && !payload.fromDate
        && !payload.toDate
    ) {		
		return http.get(URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		const { pageNumber, warehouseId, fromDate, toDate, status } = payload;
		let modifiedPayload = {
			pageNumber,
			warehouseId,
			fromDate,
			toDate,
			status,
		}
		payload.filter
		? modifiedPayload[payload.filter] = payload.searchText
		: modifiedPayload['searchText'] = payload.searchText
		
		return http.post(SEARCH_URL, modifiedPayload, { headers })
			.then(handleResponse)
			.catch(handleError)
	}  
}

export function submitPartRequirementDetails(payload) {
	const headers = getAuthHeader()
	return http.post(SUBMIT_REQUIREMENT_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function aggregateOrder(payload) {
	const headers = getAuthHeader()
	return http.post(AGGREGATE_ORDER_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getRunnerList(warehouseId) {
	const headers = getAuthHeader();
	const RUNNER_LIST_URL_W = RUNNER_LIST_URL.concat(warehouseId);
	return http.get(RUNNER_LIST_URL_W, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getVendorList(warehouseId) {
	const headers = getAuthHeader()
	const VENDOR_LIST_URL_W = VENDOR_LIST_URL.concat(warehouseId)
	return http.get(VENDOR_LIST_URL_W, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function createOrder(payload) {
	const headers = getAuthHeader()
	return http.post(CREATE_ORDER_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}