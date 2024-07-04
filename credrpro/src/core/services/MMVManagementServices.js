import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const MMV_URL = API_ENDPOINTS.MMV_MANAGEMENT.GET_MMV_TABLE
const MMV_SEARCH_URL = API_ENDPOINTS.MMV_MANAGEMENT.MMV_DATA_SEARCH
const ADD_MMV_URL = API_ENDPOINTS.MMV_MANAGEMENT.ADD_NEW_MMV
const MMV_LIST_URL = API_ENDPOINTS.MMV_MANAGEMENT.GET_MMV_LIST

export function getMMVTableData(payload) {
	const headers = getAuthHeader()
	if (payload.pageNum === 1 && payload.filter === '' && payload.searchText === '') {
		return http.get(MMV_URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		let modifiedPayload = { pageNumber: payload.pageNum }
		payload.filter
		? modifiedPayload[payload.filter] = payload.searchText
		: modifiedPayload['searchText'] = payload.searchText
		
		return http.post(MMV_SEARCH_URL, modifiedPayload, { headers })
			.then(handleResponse)
			.catch(handleError)
	}  
}

export function addToMMV(payload) {
	const headers = getAuthHeader()
	return http.post(ADD_MMV_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function editMMV(payload) {
	const headers = getAuthHeader()
	return http.put(ADD_MMV_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getMMVListService() {
	const headers = getAuthHeader()
	return http.get(MMV_LIST_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}