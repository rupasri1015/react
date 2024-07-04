import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const GET_DATA_URL = API_ENDPOINTS.INVENTORY_AGGREGATE.GET_TABLE_DATA
const SEARCH_DATA_URL = API_ENDPOINTS.INVENTORY_AGGREGATE.SEARCH_TABLE_DATA

export function getInventoryAggregateTableData(payload) {
	const URL = GET_DATA_URL.concat(payload.warehouseId);
	const headers = getAuthHeader()
	if (payload.pageNum === 1
			&& payload.warehouseId === 0
			&& payload.filter === ''
			&& payload.searchText === ''
			&& !payload.showUnavailable
		) {		
		return http.get(URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		let modifiedPayload = {
			pageNumber: payload.pageNum,
			warehouseId: payload.warehouseId,
			showUnavailable: payload.showUnavailable
		}
		// let modifiedPayload = { pageNumber: payload.pageNum }
		payload.filter
		? modifiedPayload[payload.filter] = payload.searchText
		: modifiedPayload['searchText'] = payload.searchText
		
		return http.post(SEARCH_DATA_URL, modifiedPayload, { headers })
			.then(handleResponse)
			.catch(handleError)
	}  
}