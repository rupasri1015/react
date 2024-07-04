import http from 'axios'
import { handleError, handleResponse } from '../utility'
import { getAuthHeader } from '../utility/authHeaders';
import { API_ENDPOINTS } from '../constants/apiConstant'

const API_ENDPOINT_CREATE_CREATE_ORDER = API_ENDPOINTS.RAZORPAY_URLS.PROCESS_PAYMENT
const API_ENDPOINT_VERIFY_PAYMENT = API_ENDPOINTS.RAZORPAY_URLS.VERIFY_PAYMENT
const API_ENDPOINT_VALIDATE_RAZORPAY_LOAD = API_ENDPOINTS.RAZORPAY_URLS.LOAD_PAYMENT
const API_ENDPOINT_FRANCHISE_RAZORPAY = API_ENDPOINTS.RAZORPAY_URLS.FRANCHISE_RAZORPAY
const API_ENDPOINT_REDEEM_FROM_WALLET = API_ENDPOINTS.RAZORPAY_URLS.REDEEM_WALLET
const API_ENDPOINT_SEND_OTP = API_ENDPOINTS.RAZORPAY_URLS.GET_OTP
const API_ENDPOINT_VERIFY_OTP = API_ENDPOINTS.RAZORPAY_URLS.VERIFY_OTP
const API_ENDPOINT_PAYMENTS_HISTORY = API_ENDPOINTS.RAZORPAY_URLS.PAYMENTS_HISTORY

export function createOrder(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_CREATE_CREATE_ORDER, payload, { headers }).then(handleResponse).catch(handleError);
}

export function verifyPayment(payload) {
	const headers = getAuthHeader();
	return http.put(API_ENDPOINT_VERIFY_PAYMENT, payload, { headers }).then(handleResponse).catch(handleError);
}

export function validateRazorPayLoad(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_VALIDATE_RAZORPAY_LOAD, payload, { headers }).then(handleResponse).catch(handleError)
}

export function franchiseRazorPay(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FRANCHISE_RAZORPAY, payload, { headers }).then(handleResponse).catch(handleError)
}

export function redeemUsingWallet(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_REDEEM_FROM_WALLET, payload, { headers }).then(handleResponse).catch(handleError)
}

export function verifyOtp(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_VERIFY_OTP, payload, { headers }).then(handleResponse).catch(handleError)
}

export function sendOtp(id) {
	const headers = getAuthHeader()
	const url = API_ENDPOINT_SEND_OTP.replace('<USER_ID>', id)
	return http.get(url, { headers }).then(handleResponse).catch(handleError)
}

export function getPaymentsHistory(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_PAYMENTS_HISTORY, payload, { headers }).then(handleResponse).catch(handleError)
}


