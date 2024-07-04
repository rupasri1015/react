import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { API_ENDPOINTS } from '../constants/apiConstant'
import { getAuthHeader } from '../utility/authHeaders'

const LIUNIT_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.GET_LIUNIT_TABLE
const ALL_WAREHOUSES_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.GET_ALL_WAREHOUSES
const SEARCH_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.LIUNIT_SEARCH
const VENDOR_ULR = API_ENDPOINTS.LIVE_INVENTORY_UNIT.GET_ALL_VENDORS
const PART_NAME_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.GET_ALL_SPAREPARTS
const PART_NAME_WITH_SECTION_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.GET_ALL_SPAREPARTS_WITH_SECTION
const MMV_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.GET_ALL_MMV_RANGE
const SUBMIT_INWARDING_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.SUBMIT_INWARDING
const SAVE_INWARDING_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.SAVE_INWARDING
const ALL_CATEGORY_URL = API_ENDPOINTS.LIVE_INVENTORY_UNIT.GET_ALL_CATEGORIES

export function getLIUNITTableData(payload) {
	const URL = LIUNIT_URL.concat(payload.warehouseNum);
	const headers = getAuthHeader()
	if (payload.pageNum === 1 && payload.filter === '' && payload.searchText === '') {		
		return http.get(URL, { headers })
			.then(handleResponse)
			.catch(handleError)
	}
	else {
		let modifiedPayload = { pageNumber: payload.pageNum, warehouseId: payload.warehouseNum }
		payload.filter
		? modifiedPayload[payload.filter] = payload.searchText
		: modifiedPayload['searchText'] = payload.searchText
		
		return http.post(SEARCH_URL, modifiedPayload, { headers })
			.then(handleResponse)
			.catch(handleError)
	}  
}

export function getAllWarehouses() {
	const headers = getAuthHeader()
	return http.get(ALL_WAREHOUSES_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getAllVendors() {
	const headers = getAuthHeader()
	return http.get(VENDOR_ULR, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getAllSparePartNames() {
	const headers = getAuthHeader()
	return http.get(PART_NAME_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getAllMMVYearRange() {
	const headers = getAuthHeader()
	return http.get(MMV_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getAllSparePartNamesWithSection() {
	const headers = getAuthHeader()
	return http.get(PART_NAME_WITH_SECTION_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function getAllCategories() {
	const headers = getAuthHeader()
	return http.get(ALL_CATEGORY_URL, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function submitInwarding(payload) {
	const headers = getAuthHeader()
	return http.post(SUBMIT_INWARDING_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}

export function saveInwardingParts(payload) {
	const headers = getAuthHeader()
	return http.post(SAVE_INWARDING_URL, payload, { headers })
		.then(handleResponse)
		.catch(handleError)
}
