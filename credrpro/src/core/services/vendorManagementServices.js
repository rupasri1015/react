import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const GET_DATA_URL = API_ENDPOINTS.VENDOR_MANAGEMENT.GET_TABLE_DATA
const SEARCH_DATA_URL = API_ENDPOINTS.VENDOR_MANAGEMENT.SEARCH_TABLE_DATA
const ADD_DATA_URL = API_ENDPOINTS.VENDOR_MANAGEMENT.ADD_VENDOR
const GET_VENDOR_URL = API_ENDPOINTS.VENDOR_MANAGEMENT.GET_VENDOR_DETAILS
const DELETE_VENDOR_URL = API_ENDPOINTS.VENDOR_MANAGEMENT.DELETE_VENDOR_DETAILS

export function getVendorManagementTableData(payload) {
	const headers = getAuthHeader()
	if (payload.pageNumber === 1
		&& payload.filter === ''
		&& payload.searchText === ''
		&& payload.warehouseId === 0
	) {
		return http.get(GET_DATA_URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		let modifiedPayload = { pageNumber: payload.pageNumber }
		payload.filter
		? modifiedPayload[payload.filter] = payload.searchText
		: modifiedPayload['searchText'] = payload.searchText
		modifiedPayload.warehouseId = payload.warehouseId;
		
		return http.post(SEARCH_DATA_URL, modifiedPayload, { headers })
			.then(handleResponse)
			.catch(handleError)
	}  
}

export function addNewVendor(payload) {
	const headers = getAuthHeader()
	return http.post(ADD_DATA_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getVendorDetails(id) {
	const headers = getAuthHeader()
	const VENDOR_URL = GET_VENDOR_URL.concat(id);
	return http.get(VENDOR_URL , { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function deleteVendorDetails(id) {
	const headers = getAuthHeader()
	const VENDOR_URL = DELETE_VENDOR_URL.concat(id);
	return http.delete(VENDOR_URL , { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function editVendorDetails(payload) {
	const headers = getAuthHeader()
	return http.put(ADD_DATA_URL , payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}