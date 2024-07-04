import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const TABLE_DATA_URL = API_ENDPOINTS.REQUISITION_AGGREGATE.GET_TABLE_DATA
const SEARCH_URL = API_ENDPOINTS.REQUISITION_AGGREGATE.SEARCH_TABLE_DATA

export function getRequisitionAggregateTableData(payload) {
	const URL = TABLE_DATA_URL.concat(payload.warehouseId).concat('/1');
	const headers = getAuthHeader()
    if (payload.pageNumber === 1
        && payload.filter === ''
        && payload.searchText === ''
    ) {		
		return http.get(URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		const { pageNumber, warehouseId } = payload;
		let modifiedPayload = {
			pageNumber,
			warehouseId,
		}
		payload.filter
		? modifiedPayload[payload.filter] = payload.searchText
		: modifiedPayload['searchText'] = payload.searchText
		
		return http.post(SEARCH_URL, modifiedPayload, { headers })
			.then(handleResponse)
			.catch(handleError)
	}  
}
