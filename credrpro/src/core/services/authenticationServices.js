import http from 'axios';
import { handleError, handleResponse } from '../utility';
import { API_ENDPOINTS } from '../constants/apiConstant';
import { getToken, clearToken } from './tokenStorageServices';
import { getAuthHeader } from '../utility/authHeaders';
import jwtDecode from 'jwt-decode';

const API_ENDPOINT_LOGIN = API_ENDPOINTS.AUTHENTICATION.LOGIN;
const API_ENDPOINT_STORE_ADDRESS = API_ENDPOINTS.STORE_DETAILS.STORE_ADDRESS;

export function login(credentials) {
	return http.post(API_ENDPOINT_LOGIN, credentials).then(handleResponse).catch(handleError);
}

export function isValid() {
	const token = getToken();
	if (token) {
		try {
			const decoded = jwtDecode(token);
			const { exp } = decoded;
			const currentTime = new Date().getTime() / 1000;
			if (currentTime > exp) {
				clearToken();
				return false;
			} else {
				return true;
			}
		} catch {
			clearToken();
			return false;
		}
	}
	return false;
}

export function logout() {
	clearToken();
	localStorage.removeItem('userType');
	localStorage.removeItem('storeDetails');
}

export function fetchStoreAddress(storeId) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_STORE_ADDRESS.replace('<STORE_ID>', storeId);
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function saveUserDetails(userDetails) {
	localStorage.setItem('userType', JSON.stringify(userDetails));
}
export function getStoreId(){
	const data= JSON.parse(localStorage.getItem('userType'));
	return data.storeId;
}
export function saveStoreDetails(storeDetails) {
	localStorage.setItem('storeDetails', JSON.stringify(storeDetails));
}

export function storeDetails() {
	const data = localStorage.getItem('storeDetails');
	if (!data) return null;
	return JSON.parse(data);
}

export function userTypeDetails() {
	const data = localStorage.getItem('userType');
	if (!data) return null;
	return JSON.parse(data);
}
