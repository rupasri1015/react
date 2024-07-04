import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const TABLE_DATA_URL = API_ENDPOINTS.PARTS_ORDER_HISTORY.GET_TABLE_DATA
const SEARCH_URL = API_ENDPOINTS.PARTS_ORDER_HISTORY.SEARCH_TABLE_DATA
const ORDER_DETAILS = API_ENDPOINTS.PARTS_ORDER_HISTORY.ORDER_DETAILS
const DISCARD_ORDER = API_ENDPOINTS.PARTS_ORDER_HISTORY.DISCARD_ORDER

export function getPartsOrderHistoryTableData(payload) {
	const URL = TABLE_DATA_URL;
	const headers = getAuthHeader()
    if (payload.pageNumber === 1
        && payload.filter === ''
        && payload.searchText === ''
        && !payload.fromDate
		&& !payload.toDate
		&& payload.warehouseId === 0
		&& payload.runnerId === ''

    ) {		
		return http.get(URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		const { pageNumber, warehouseId, fromDate, toDate, status, runnerId } = payload;
		let modifiedPayload = {
			pageNumber,
			warehouseId,
			runnerId,
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

export function getOrderDetails(orderId) {
	const headers = getAuthHeader();
	const ORDER_DETAILS_URL = ORDER_DETAILS.concat(orderId);
	return http.get(ORDER_DETAILS_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function updatePartsOrder(payload) {
	const headers = getAuthHeader()
	return http.put(ORDER_DETAILS, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function discardPartOrder(orderId) {
	const headers = getAuthHeader();
	const DISCARD_ORDER_URL = DISCARD_ORDER.concat(orderId);
	
	return http.get(DISCARD_ORDER_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}
