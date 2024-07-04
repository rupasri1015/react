import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const SPM_URL = API_ENDPOINTS.SPARE_PARTS_MASTER.GET_SPARE_PARTS_MASTER_DATA
const SPM_SEARCH_URL = API_ENDPOINTS.SPARE_PARTS_MASTER.SPM_DATA_SEARCH
const ADD_SPARE_PART_URL = API_ENDPOINTS.SPARE_PARTS_MASTER.ADD_SPARE_PART

export function getSparePartsMasterData(payload) {
	const headers = getAuthHeader()
	if (payload.pageNum === 1 && payload.filter === '' && payload.searchText === '') {
		return http.get(SPM_URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		let modifiedPayload = { pageNumber: payload.pageNum }
		payload.filter
		? modifiedPayload[payload.filter] = payload.searchText
		: modifiedPayload['searchText'] = payload.searchText
		
		return http.post(SPM_SEARCH_URL, modifiedPayload, { headers })
			.then(handleResponse)
			.catch(handleError)
	}  
}

export function addSparePartToSPM(payload) {
	const headers = getAuthHeader()
	return http.post(ADD_SPARE_PART_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function editSparePartService(payload) {
	const headers = getAuthHeader()
	return http.put(ADD_SPARE_PART_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}