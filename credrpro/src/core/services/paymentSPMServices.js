import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const TABLE_DATA_URL = API_ENDPOINTS.PAYMENT_SPM.GET_TABLE_DATA
const SEARCH_URL = API_ENDPOINTS.PAYMENT_SPM.SEARCH_TABLE_DATA
const DOWNLOAD_URL = API_ENDPOINTS.PAYMENT_SPM.DOWNLOAD_DATA

export function getPaymentSPMTableData(payload) {
	const headers = getAuthHeader()
    if (payload.pageNumber === 1
        && payload.filter === ''
        && payload.searchText === ''
        && !payload.fromDate
		&& !payload.toDate
		&& payload.warehouseId === 0
    ) {		
		return http.get(TABLE_DATA_URL, { headers })
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

export function downloadData(payload) {
	const headers = getAuthHeader()
	return http.post(DOWNLOAD_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}