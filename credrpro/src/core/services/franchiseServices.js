import http from 'axios';
import { handleError, handleResponse } from '../utility';
import { API_ENDPOINTS } from '../constants/apiConstant';
import { getAuthHeader } from '../utility/authHeaders';

const API_ENDPOINTS_FRANCHISE_ASSIGN = API_ENDPOINTS.FRANCHISE.FRANCHISE_ASSIGN;
const API_ENDPOINTS_UPDATE_MOBILE_NUMBER = API_ENDPOINTS.FRANCHISE.UPDATE_MOBILE_NUMBER;
const API_ENDPOINT_UPLOAD_MULTIPLE_IMAGES = API_ENDPOINTS.FRANCHISE.UPLOAD_MULTIPLE_IMAGES;
const API_ENDPOINT_UPDATE_PAYMENT_DETAILS = API_ENDPOINTS.FRANCHISE.UPDATE_PAYMENT_DETAILS;
const API_ENDPOINT_APPROVE_PAYMENT_DETAILS = API_ENDPOINTS.FRANCHISE.APPROVE_PAYMENT_DETAILS;
const API_ENDPOINT_GET_IMAGES = API_ENDPOINTS.FRANCHISE.GET_IMAGES;
const API_ENDPOINT_PENDING_REPORTS = API_ENDPOINTS.FRANCHISE.PENDING_ASSIGNMENT_REPORTS;
const API_ENDPOINT_ASSIGNED_REPORTS = API_ENDPOINTS.FRANCHISE.ASSIGNED_REPORTS;
const API_ENDPOINT_LIVE_INVENTORY_REPORTS = API_ENDPOINTS.FRANCHISE.LIVE_INVENTORY_REPORTS;
const API_ENDPOINT_MANAGE_SALES_REPORTS = API_ENDPOINTS.FRANCHISE.MANAGE_SALES_REPORTS;
const API_ENDPOINT_PENDING_PAYMENT_REPORTS = API_ENDPOINTS.FRANCHISE.PENDING_PAYMENT_REPORTS;
const API_ENDPOINT_APPROVAL_PAYMENT_REPORTS = API_ENDPOINTS.FRANCHISE.APPROVAL_PAYMENT_REPORTS;
const API_ENDPOINT_APPROVED_PAYMENT_REPORTS = API_ENDPOINTS.FRANCHISE.APPROVED_PAYMENT_REPORTS;
const API_ENDPOINT_FRANCHISE_REASSIGN = API_ENDPOINTS.FRANCHISE.FRANCHISE_REASSIGN;
const API_ENDPOINT_FRANCHISE_STORE_MANAGER_RETURNS = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.ELIGIBLE_RETURN_BIKES;
const API_ENDPOINT_FSM_RETURNS_UPLOAD_DOCS = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.UPLOAD_DOCS;
const API_ENDPOINT_FSM_REQUEST_RETURN = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.CREATE_REQUEST_RETURN;
const API_ENDPOINT_FSM_ALL_PENDING_RETURNS = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.ALL_PENDING_RETURNS;
const API_ENDPOINT_DOCUMENT_URLS_BY_ID = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.DOUCMENT_URLS_BY_ID;
const API_ENDPOINTS_FRANCHISE_RETURNS = API_ENDPOINTS.FRANCHISE.GET_RETURNS;
const API_ENDPOINT_UPDATE_RETURN_REQUEST = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.UPDATE_RECORD_DETAILS;
const API_ENDPOINT_FETCH_RETURN_POLICY_DETAILS = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.RETURN_POLICY_DETAILS;
const API_ENDPOINT_FRANCHISE_PENDING_RETURN_INVENTORY = API_ENDPOINTS.FRANCHISE.FRANCHISE_PENDING_RETURN_INVENTORY;
const API_ENDPOINT_FRANCHISE_PENDING_RETURN_CREATE_RETURN_LOGISTIC= API_ENDPOINTS.FRANCHISE.PENDING_RETURN_CREATE_RETURN_LOGISTIC;
const API_ENDPOINT_GET_BUSINESS_ENTITES=API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_BUSINESS_ENTITES;
const API_ENDPOINT_GET_STATES=API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_STATES;
const API_ENDPOINT_GET_CITIES=API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_CITIES;
const API_ENDPOINT_ADD_ENTITY=API_ENDPOINTS.FRANCHISE_STORE_MANAGER.ADD_ENTITY;
const API_ENDPOINT_UPDATE_ENTITY=API_ENDPOINTS.FRANCHISE_STORE_MANAGER.UPDATE_ENTITY;
const API_ENDPOINT_GET_ENTITY=API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_ENTITY;
const API_ENDPOINT_FRANCHISE_LIST_INVENTORY = API_ENDPOINTS.FRANCHISE.FRANCHISE_LIST_INVENTORY;
const API_ENDPOINTS_FRANCHISE_STORES = API_ENDPOINTS.FRANCHISE.FRANCHISE_STORES;
const API_ENDPOINTS_FRANCHISE_CITY_LIST = API_ENDPOINTS.FRANCHISE.GET_FRANCHISE_CITY_LIST;
const API_ENDPOINTS_FRANCHISE_STORE_LEADS = API_ENDPOINTS.FRANCHISE.FRANCHISE_STORE_LEADS;
const API_ENDPOINTS_FRANCHISE_SALES = API_ENDPOINTS.FRANCHISE.FRANCHISE_SALES;
const API_ENDPOINT_UPLOAD_PROFILE_BANNER = API_ENDPOINTS.FRANCHISE.UPLOAD_PROFILE_BANNER_TO_S3;
const API_ENDPOINT_FETCH_FRANCHISE_PROFILE = API_ENDPOINTS.FRANCHISE.FETCH_FRANCHISE_PROFILE;
const API_ENDPOINT_UPDATE_FRANCHISE_PROFILE = API_ENDPOINTS.FRANCHISE.UPDATE_FRANCHISE_PROFILE;
const API_ENDPOINT_UPDATE_FRANCHISE_PROFILE_IMAGES = API_ENDPOINTS.FRANCHISE.UPDATE_FRANCHISE_PROFILE_IMAGES;
const API_ENDPOINT_SHOWROOM_LEADS = API_ENDPOINTS.FRANCHISE.STORE_LEADS
const API_ENDPOINT_SHOWROOM_SALES = API_ENDPOINTS.FRANCHISE.STORE_SALES
const API_ENDPOINT_PAYMENT_HISTORY = API_ENDPOINTS.FRANCHISE.PAYMENT_HISTORY
const API_ENDPOINT_FRANCHISE_WALLET_BALANCE = API_ENDPOINTS.FRANCHISE.FRANCHISE_WALLET_BALANCE
const API_ENDPOINT_FRANCHISE_UPLOAD_PAYMENT_PROOF = API_ENDPOINTS.FRANCHISE.UPLOAD_PAYMENT_PROOF
const API_ENDPOINT_GET_MMV_BY_REG_NUM = API_ENDPOINTS.FRANCHISE.GET_MMV_BY_REG_NUM
const API_ENDPOINT_CREATE_WALK_IN_LEAD = API_ENDPOINTS.FRANCHISE.CREATE_WALK_IN_LEAD
const API_ENDPOINT_MARK_AS_SOLD = API_ENDPOINTS.FRANCHISE.MARK_AS_SOLD
const API_ENDPOINT_GET_ALL_BILLER_IDS = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_ALL_BILLER_IDS
const API_ENDPOINT_GET_HSN_LIST = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_HSN_LIST
const API_ENDPOINT_ADD_RECIPIENT = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.ADD_RECIPIENT
const API_ENDPOINT_GENERATE_OTP = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GENERATE_OTP
const API_ENDPOINT_VERIFY_STORE_OTP = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.VERIFY_STORE_OTP
const API_ENDPOINT_RESEND_OTP = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.RESEND_OTP
const API_ENDPOINT_GET_INVOICE = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_INVOICES
const API_ENDPOINT_GET_STORE_INVENTORY = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_STORE_INVENTORY
const API_ENDPOINT_ASSIGN_INVENTORY = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.ASSIGN_INVENTORY
const API_END_POINT_REFUND_TOKEN = API_ENDPOINTS.FRANCHISE.REFUND_TOKEN
const API_ENDPOINT_GET_SALES_DOCS = API_ENDPOINTS.FRANCHISE.GET_SALES_DOCS
const API_ENDPOINT_FRANCHISE_DELIVERY_STATUS = API_ENDPOINTS.FRANCHISE.FRANCHISE_DELIVERY_STATUS
const API_END_POINT_UPLOAD_CUSTOMER_KYC = API_ENDPOINTS.FRANCHISE.UPLOAD_CUSTOMER_KYC
const API_ENDPOINT_GET_BIKE_SOLD_STATUS = API_ENDPOINTS.FRANCHISE.GET_BIKE_SOLD_STATUS
const API_ENDPOINT_GET_WARRANTY = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_WARRANTY
const API_ENDPOINT_PRIMARY_SECONDARY_SALES_STORE = API_ENDPOINTS.PRIMARY_SECONDARY_SALES.STORE
const API_ENDPOINT_PRIMARY_SECONDARY_SALES_FRANCHISE = API_ENDPOINTS.PRIMARY_SECONDARY_SALES.FRANCHISE
const API_ENDPOINT_PRIMARY_SECONDARY_SALES_CMS = API_ENDPOINTS.PRIMARY_SECONDARY_SALES.CMS
const API_ENDPOINT_PRIMARY_SECONDARY_SALES_SECONDARY_FRANCHISE = API_ENDPOINTS.PRIMARY_SECONDARY_SALES.SECONDARY_FRANCHISE
const API_END_POINT_GET_SERVICE_PLANS = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_SERVICE_CODE
const API_END_POINT_GET_MIN_PRICE = API_ENDPOINTS.FRANCHISE_STORE_MANAGER.GET_MIN_PRICE
const API_END_POINT_GET_REFERRAL_SOURCE= API_ENDPOINTS.FRANCHISE.GET_REFERRAL_SOURCE
const API_END_POINT_EXPORT_CMS_DATA = API_ENDPOINTS.PRIMARY_SECONDARY_SALES.CMS_EXPORT_DATA
const API_END_POINT_EXPORT_STORE_DATA = API_ENDPOINTS.PRIMARY_SECONDARY_SALES.STORE_EXPORT_DATA
const API_END_POINT_EXPORT_FRANCHISE_DATA = API_ENDPOINTS.PRIMARY_SECONDARY_SALES.FRANCHISE_EXPORT_DATA

export function franchiseLiveInventoryList(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FRANCHISE_LIST_INVENTORY, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getPaymentList(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FRANCHISE_LIST_INVENTORY, payload, { headers }).then(handleResponse).catch(handleError);
}

export function pendingAssignList(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FRANCHISE_LIST_INVENTORY, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getOnlineList(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FRANCHISE_LIST_INVENTORY, payload, { headers }).then(handleResponse).catch(handleError);
}

export function uploadFranchiseProfileBanner(payload) {
	const headers = getAuthHeader();

	return http.post(API_ENDPOINT_UPLOAD_PROFILE_BANNER, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getRefrrelSource() {
	const headers = getAuthHeader();
	const url = API_END_POINT_GET_REFERRAL_SOURCE
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}


export function fetchFranchiseProfile(userId) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_FETCH_FRANCHISE_PROFILE.replace('<USER_ID>', userId)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function updateFranchiseProfile(payload) {
	const headers = getAuthHeader();

	return http.post(API_ENDPOINT_UPDATE_FRANCHISE_PROFILE, payload, { headers }).then(handleResponse).catch(handleError);
}

// updates both profile avatar, profile banner
export function updateFranchiseProfileImages(payload) {
	const headers = getAuthHeader();

	return http.post(API_ENDPOINT_UPDATE_FRANCHISE_PROFILE_IMAGES, payload, { headers }).then(handleResponse).catch(handleError);
}

export function uploadMultiImages(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_UPLOAD_MULTIPLE_IMAGES, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getFranchiseLeads(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINTS_FRANCHISE_STORE_LEADS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function updatePaymentDetails(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_UPDATE_PAYMENT_DETAILS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getFranchiseSales(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINTS_FRANCHISE_SALES, payload, { headers }).then(handleResponse).catch(handleError);
}

export function addEntity(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_ADD_ENTITY, payload, { headers }).then(handleResponse).catch(handleError);
}
export function updateEntity(payload) {
	const headers = getAuthHeader();
	return http.put(API_ENDPOINT_UPDATE_ENTITY, payload, { headers }).then(handleResponse).catch(handleError);
}
export function getFranchiseStores(cityId) {
	const headers = getAuthHeader();
	const url = API_ENDPOINTS_FRANCHISE_STORES.replace('<CITY_ID>', cityId);
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function getEntites(store_id) {
	const headers = getAuthHeader();
	const url=API_ENDPOINT_GET_BUSINESS_ENTITES.replace('<ID>',store_id)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}
export function getEntity(id) {
	const headers = getAuthHeader();
	const url=API_ENDPOINT_GET_ENTITY.replace('<ID>',id)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}
export function getStates() {
	const headers = getAuthHeader();
	return http.get(API_ENDPOINT_GET_STATES, { headers }).then(handleResponse).catch(handleError);
}
export function getCities(stateId) {
	const headers = getAuthHeader();
	const url=API_ENDPOINT_GET_CITIES.replace('<ID>',stateId)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function getFranchiseCities() {
	const headers = getAuthHeader();
	const url = API_ENDPOINTS_FRANCHISE_CITY_LIST;
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function approvepaymentDetails(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_APPROVE_PAYMENT_DETAILS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getImages(orderID) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_GET_IMAGES.replace('<ORDER_ID>', orderID);
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function assignToFranchise(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINTS_FRANCHISE_ASSIGN, payload, { headers }).then(handleResponse).catch(handleError);
}

export function updateMobileNumber(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINTS_UPDATE_MOBILE_NUMBER, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getPendingInventoryReports(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_PENDING_REPORTS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getAssignedBikesReports(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_ASSIGNED_REPORTS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getLiveInventoryReports(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_LIVE_INVENTORY_REPORTS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getManageSalesReports(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_MANAGE_SALES_REPORTS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getPendingPaymentReports(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_PENDING_PAYMENT_REPORTS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getApprovalPaymentReports(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_APPROVAL_PAYMENT_REPORTS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getApprovedPaymentReports(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_APPROVED_PAYMENT_REPORTS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function reAssignToFranchise(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FRANCHISE_REASSIGN, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getEligibleReturnBikes(payload) {
	const headers = getAuthHeader();
	return http
		.post(API_ENDPOINT_FRANCHISE_STORE_MANAGER_RETURNS, payload, { headers })
		.then(handleResponse)
		.catch(handleError);
}

export function getAllPendingReturns(payload) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_FSM_ALL_PENDING_RETURNS.replace('<QUERY_PARAMS>', payload);
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function uploadReturnsDocs(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FSM_RETURNS_UPLOAD_DOCS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function createRequestReturn(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FSM_REQUEST_RETURN, payload, { headers }).then(handleResponse).catch(handleError);
}

export function fetchDocumentUrlsById(payload) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_DOCUMENT_URLS_BY_ID.replace('<ID>', payload);
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function updateReturnRequestStatus(payload) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_UPDATE_RETURN_REQUEST.replace('<ID>', payload.id);
	return http.put(url, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getReturnsList(payload) {
	const headers = getAuthHeader();
	const url = API_ENDPOINTS_FRANCHISE_RETURNS.replace('<QUERY_PARAMS>', payload);
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function getReturnPolicyDetails(payload) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_FETCH_RETURN_POLICY_DETAILS.replace('<ID>', payload);
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function pendingReturnAssignList(payload) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_FRANCHISE_PENDING_RETURN_INVENTORY.replace('<QUERY_PARAMS>', payload);
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function createReturnLogistic(payload) {
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_FRANCHISE_PENDING_RETURN_CREATE_RETURN_LOGISTIC, payload, { headers }).then(handleResponse).catch(handleError);
}
export function getShowroomLeads(payload){
	return http.post(API_ENDPOINT_SHOWROOM_LEADS, payload).then(handleResponse).catch(handleError);
}

export function getShowroomSales(payload){
	return http.post(API_ENDPOINT_SHOWROOM_SALES, payload).then(handleResponse).catch(handleError);
}

export function getPaymentsHistory(payload){
	return http.post(API_ENDPOINT_PAYMENT_HISTORY, payload).then(handleResponse).catch(handleError);
}

export function getWalletBalance(payload){
	return http.post(API_ENDPOINT_FRANCHISE_WALLET_BALANCE, payload).then(handleResponse).catch(handleError);
}

export function uploadPaymentProof(payload){
	return http.post(API_ENDPOINT_FRANCHISE_UPLOAD_PAYMENT_PROOF, payload).then(handleResponse).catch(handleError);
}

export function fetchMmvByRegNum(payload){
	return http.post(API_ENDPOINT_GET_MMV_BY_REG_NUM, payload).then(handleResponse).catch(handleError);
}

export function createWalkinLead(payload){
	return http.post(API_ENDPOINT_CREATE_WALK_IN_LEAD, payload).then(handleResponse).catch(handleError);
}

export function markAsSold(payload){
	return http.post(API_ENDPOINT_MARK_AS_SOLD, payload).then(handleResponse).catch(handleError);
}

export function getAllBillerIds(id) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_GET_ALL_BILLER_IDS.replace('<ID>',id)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function getHsnList() {
	const headers = getAuthHeader();
	return http.get(API_ENDPOINT_GET_HSN_LIST, { headers }).then(handleResponse).catch(handleError);
}

export function addRecipient(payload){
	return http.post(API_ENDPOINT_ADD_RECIPIENT, payload).then(handleResponse).catch(handleError);
}

export function generateOtp(payload){
	return http.post(API_ENDPOINT_GENERATE_OTP, payload).then(handleResponse).catch(handleError);
}

export function verifyStoreOtp(payload){
	return http.post(API_ENDPOINT_VERIFY_STORE_OTP, payload).then(handleResponse).catch(handleError);
}

export function resendOTP(payload){
	return http.post(API_ENDPOINT_RESEND_OTP, payload).then(handleResponse).catch(handleError);
}

export function getInvoicees(payload){
	return http.post(API_ENDPOINT_GET_INVOICE, payload).then(handleResponse).catch(handleError);
}

export function getStoreBikes(storeId) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_GET_STORE_INVENTORY.replace('<STORE_ID>', storeId)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function assignInventory(payload){
	return http.post(API_ENDPOINT_ASSIGN_INVENTORY, payload).then(handleResponse).catch(handleError);
}

export function refundToken(payload){
	return http.post(API_END_POINT_REFUND_TOKEN, payload).then(handleResponse).catch(handleError);
}

export function getSaleDocs(storeId) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_GET_SALES_DOCS.replace('<LEAD_ID>', storeId)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function franchiseDeliveryStatus(payload){
	return http.post(API_ENDPOINT_FRANCHISE_DELIVERY_STATUS, payload).then(handleResponse).catch(handleError);
}

export function uploadCustomerKyc(payload){
	return http.post(API_END_POINT_UPLOAD_CUSTOMER_KYC, payload).then(handleResponse).catch(handleError);
}

export function getBikeStatus(regnum) {
	const headers = getAuthHeader();
	const url = API_ENDPOINT_GET_BIKE_SOLD_STATUS.replace('<REG_NUM>', regnum)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function getWarranty() {
	const headers = getAuthHeader();
	return http.get(API_ENDPOINT_GET_WARRANTY, { headers }).then(handleResponse).catch(handleError);
}

export function storeData(payload){
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_PRIMARY_SECONDARY_SALES_STORE, payload, { headers }).then(handleResponse).catch(handleError);
}

export function franchiseData(payload){
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_PRIMARY_SECONDARY_SALES_FRANCHISE, payload, { headers }).then(handleResponse).catch(handleError);
}

export function cmsData(payload){
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_PRIMARY_SECONDARY_SALES_CMS, payload, { headers }).then(handleResponse).catch(handleError);
}

export function secondarySalesData(payload){
	const headers = getAuthHeader();
	return http.post(API_ENDPOINT_PRIMARY_SECONDARY_SALES_SECONDARY_FRANCHISE, payload, { headers }).then(handleResponse).catch(handleError);
}

export function getServicePlans() {
	const headers = getAuthHeader();
	return http.get(API_END_POINT_GET_SERVICE_PLANS, { headers }).then(handleResponse).catch(handleError);
}

export function getMinPrice(regnum) {
	const headers = getAuthHeader();
	const url = API_END_POINT_GET_MIN_PRICE.replace('<REG_NUM>', regnum)
	return http.get(url, { headers }).then(handleResponse).catch(handleError);
}

export function exportCmsData(payload) {
	const headers = getAuthHeader();
	return http.post(API_END_POINT_EXPORT_CMS_DATA, payload, { headers }).then(handleResponse).catch(handleError);
}

export function exportStoreData(payload) {
	const headers = getAuthHeader();
	return http.post(API_END_POINT_EXPORT_STORE_DATA, payload, { headers }).then(handleResponse).catch(handleError);
}

export function exportFranchiseData(payload) {
	const headers = getAuthHeader();
	return http.post(API_END_POINT_EXPORT_FRANCHISE_DATA, payload, { headers }).then(handleResponse).catch(handleError);
}

