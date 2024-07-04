import { getToken, getUserInfo, getCityInfo } from './tokenStorageServices';
import jwtDecode from 'jwt-decode';

function getDecodedToken() {
	const token = getToken();
	try {
		return jwtDecode(token);
	} catch {
		return null;
	}
}

export function getRole() {
	const token = getDecodedToken();
	if (token) {
		const { role } = token;
		return role;
	}
	return null;
}

export function getMobile() {
	const token = getDecodedToken();
	if (token) {
		const { userMobile } = token;
		return userMobile;
	}
	return null;
}

export function getStoreId() {
	const token = getDecodedToken();
	if (token) {
		const { userName } = token;
		return userName;
	}
	return null;
}

export function getUserName() {
	const token = getDecodedToken();
	if (token) {
		const { userName } = token;
		return userName;
	}
	return null;
}

export function getUserID() {
	const token = getDecodedToken();
	if (token) {
		const { userId } = token;
		return userId;
	}
	return null;
}

export function getCityID() {
	const token = getDecodedToken();
	if (token) {
		const { cityId } = token;
		return cityId;
	}
	return null;
}

export function getWarehouseID() {
	const token = getDecodedToken();
	if (token) {
		const { warehouseId } = token;
		return warehouseId;
	}
	return null;
}

export function getUserData() {
	const userData = getUserInfo()
	if (userData) {
		return userData
	}
	return null
}

export function getCityData() {
	const cityData = getCityInfo()
	if (cityData) {
		return cityData
	}
	return null
}

export function getWarehouseName() {
	const token = getDecodedToken();
	if (token) {
		const { warehouseName } = token;
		return warehouseName;
	}
	return null;
}
export const franchiseStoreManagerRoutes = ['Franchise_store_manager'];

export const salesStoreRoutes = ['sales_store_leads'];

export function getHomePage() {
	const role = getRole();

	const biddingRoutes = ['PRO_ADMIN', 'PRO_BID'];
	const valuatorListRoutes = ['PRO_ADMIN'];
	const inventoryRoutes = ['PRO_PUBLISH'];
	const logisticRoutes = ['LOGISTICS_COORDINATOR', 'LOGISTICS_COORDINATOR_CENTRAL'];
	const franchiseRoutes = ['Franchise_ops_manager', 'Franchise_ops_manager_central', 'FRANCHISE_ADMIN'];
	const franchiseAdminRoutes = ['FRANCHISE_ADMIN'];
	const viewPaymentRoutes = ['Franchise_ops_manager', 'Franchise_ops_manager_central'];
	const performanceRoute = ['PRO_PROF_DASHBOARD'];
	const docQCRoutes = ['DOC_QC'];
	const refurbRoute = ['REFUB'];
	const centralManagerSupplyRoutes = ['CENTRAL_MANAGER_SUPPLY'];
	const bufferRoute = ['FRANCHISE_ADMIN', 'FRANCHISE_MANAGER'];
	const paperRoute = ['PAPER_TRANSFER_AGENT'];
	const auditRoute = ['Calling_Audit'];
	const shdCommissionRoute = ['SHD_COMMISSION']
	const cxoRoute = ['CXO_INSIGHTS']

	const sparePartsMasterRoutes = RBAC_LINK.sparepartsMaster;
	const mmvManagementRoutes = RBAC_LINK.mmvManagement;
	const sparePartsAssignmentRoutes = RBAC_LINK.sparePartsAssignment;
	const PartsRequirementsRoutes = RBAC_LINK.PartsRequirement;
	const partsOrderHistoryRoutes = RBAC_LINK.partsOrderHistory;
	const myAssignmentsRoutes = RBAC_LINK.myAssignments;
	const InwardSparePartsRoutes = RBAC_LINK.inwardSpareParts;
	const vendorManagementRoutes = RBAC_LINK.vendorManagement;
	const paymentSPMRoutes = RBAC_LINK.paymentSPM;
	const liveInventoryUnitRoutes = RBAC_LINK.liveInventoryUnit;
	const inventoryAggregateRoutes = RBAC_LINK.InventoryAggregate;
	const requisitionAggregateRoutes = RBAC_LINK.requisitionAggregate;

	const refurbRoutes = ['PRO_ADMIN', 'FLOOR_MANAGER_CITY'];

	if (biddingRoutes.includes(role)) {
		return '/bidding-dashboard';
	}
	if (valuatorListRoutes.includes(role)) {
		return '/valuatorlistview';
	}
	if (bufferRoute.includes(role)) {
		return '/franchise/pendingData';
	}
	if (inventoryRoutes.includes(role)) {
		return '/inventory/pending';
	}
	if (logisticRoutes.includes(role)) {
		return '/logistics/assignRunner';
	}
	if (franchiseRoutes.includes(role)) {
		return '/franchise/pendingData';
	}
	if (centralManagerSupplyRoutes.includes(role)) {
		return '/franchise/central_manger/valuator_dashboard';
	}
	if (franchiseAdminRoutes.includes(role)) {
		return '/franchiseAdminPayments/pending';
	}
	if (viewPaymentRoutes.includes(role)) {
		return '/viewPayments/pending';
	}
	if (performanceRoute.includes(role)) {
		return '/profDashboard';
	}
	if (sparePartsMasterRoutes.includes(role)) {
		return '/sparepartsMaster';
	}
	if (mmvManagementRoutes.includes(role)) {
		return '/mmvManagement';
	}
	if (liveInventoryUnitRoutes.includes(role)) {
		return '/liveInventoryUnit';
	}
	if (inventoryAggregateRoutes.includes(role)) {
		return '/inventoryAggregate';
	}
	if (sparePartsAssignmentRoutes.includes(role)) {
		return '/refurbDashboard';
	}
	if (PartsRequirementsRoutes.includes(role)) {
		return '/partsRequirement';
	}
	if (requisitionAggregateRoutes.includes(role)) {
		return '/requisitionAggregate';
	}
	if (partsOrderHistoryRoutes.includes(role)) {
		return '/partsOrderHistory';
	}
	if (myAssignmentsRoutes.includes(role)) {
		return '/myAssignments';
	}
	if (InwardSparePartsRoutes.includes(role)) {
		return '/inwardSpareParts';
	}
	if (vendorManagementRoutes.includes(role)) {
		return '/vendorManagement';
	}
	if (paymentSPMRoutes.includes(role)) {
		return '/sparePartsPayment';
	}
	if (refurbRoute.includes(role)) {
		return '/refurbDashboard';
	}
	if (docQCRoutes.includes(role)) {
		return '/documentQc/QC1';
	}

	if (salesStoreRoutes.includes(role)) {
		return '/sales-store/upcomingWillvisits';
	}

	if (franchiseStoreManagerRoutes.includes(role)) {
		return '/franchise-store/profile';
	}

	if (paperRoute.includes(role)) {
		return '/paperTransfer'
	}
	if (franchiseStoreManagerRoutes.includes(role)) {
		return '/franchise-store/profile';
	}

	if (auditRoute.includes(role)) {
		return '/auditCalls';
	}

	if (shdCommissionRoute.includes(role)) {
		return '/quote_confirmation'
	}
	if (franchiseStoreManagerRoutes.includes(role)) {
		return '/franchise-store/returns';
	}
	if (cxoRoute.includes(role)){
		return '/primary-sales/credr-store'
	}

	return false;
}

export const RBAC_LINK = {
	biddingRoutes: ['PRO_ADMIN', 'PRO_BID', 'SHD_COMMISSION'],
	fhdRoutes: ['PRO_ADMIN', 'PRO_BID'],
	listingRoute: ['PRO_ADMIN'],
	shdRoutes: ['PRO_ADMIN', 'PRO_BID'],
	valuatorRoutes: ['PRO_ADMIN', 'PRO_BID'],
	inventoryRoutes: ['PRO_ADMIN', 'PRO_PUBLISH'],
	documentQCRoutes: ['PRO_ADMIN'],
	logisticRoutes: ['PRO_ADMIN', 'LOGISTICS_COORDINATOR', 'LOGISTICS_COORDINATOR_CENTRAL', 'LOGISTCS_STATE_HEAD'],
	pincodeMapping: ['DIY_ASSIST', 'CENTRAL_MANAGER_SUPPLY'],
	franchiseRoutes: ['Franchise_ops_manager', 'Franchise_ops_manager_central', 'FRANCHISE_ADMIN'],
	franchiseAdminRoutes: ['FRANCHISE_ADMIN'],
	viewPaymentRoutes: ['Franchise_ops_manager', 'Franchise_ops_manager_central'],
	prformanceDashboard: ['PRO_ADMIN', 'PRO_PROF_DASHBOARD', 'PRO_BID'],
	sparepartsManagement: ['PRO_ADMIN'],
	docQCRoutes: ['DOC_QC'],
	refurbRoute: ['REFUB'],
	valuatorListRoutes: ['PRO_ADMIN'],
	auditRoute: ['Calling_Audit'],
	centralManagerSupplyRoutes: ['CENTRAL_MANAGER_SUPPLY'],
	shdCommissionRoute: ['SHD_COMMISSION'],
	// primarySecondaryRoutes: ['CXO_INSIGHTS'],
	cxoRoute: ['CXO_INSIGHTS'],

	bufferRoute: ['FRANCHISE_ADMIN', 'FRANCHISE_MANAGER'],

	paperRoute: ['PAPER_TRANSFER_AGENT'],
	sparepartsMaster: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'REFUB'
	],
	mmvManagement: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'REFUB'
	],

	sparePartsAssignment: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'FLOOR_MANAGER',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],
	PartsRequirement: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'FLOOR_MANAGER',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],
	partsOrderHistory: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'FLOOR_MANAGER',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],
	myAssignments: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SPARE_PARTS_EXECUTIVE',
		'SPARE_PARTS_RUNNER',
		'REFUB'
	],
	inwardSpareParts: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SPARE_PARTS_EXECUTIVE',
		'SPARE_PARTS_RUNNER',
		'REFUB'
	],

	vendorManagement: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],
	paymentSPM: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],

	liveInventoryUnit: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'FLOOR_MANAGER',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],
	InventoryAggregate: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'FLOOR_MANAGER',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],
	requisitionAggregate: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'FLOOR_MANAGER',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],

	refurbDashboard: ['PRO_ADMIN'],

	// crm
	salesStoreRoutes: ['sales_store_leads'],
	franchiseStoreManagerRoutes: ['Franchise_store_manager']
};

export const PERMISSIONS = {
	LOGISTICS: ['LOGISTICS_COORDINATOR', 'LOGISTICS_COORDINATOR_CENTRAL', 'LOGISTCS_STATE_HEAD'],
	LOGISTICS_CITY_FILTER: ['LOGISTICS_COORDINATOR_CENTRAL', 'PRO_ADMIN'],
	FRANCHISE: ['Franchise_ops_manager'],
	FRANCHISE_ADMIN: ['FRANCHISE_ADMIN', 'Franchise_ops_manager_central'],
	FRANCHISE_CENTRAL: ['Franchise_ops_manager_central', 'FRANCHISE_ADMIN'],

	SPAREPARTS_MASTER: ['PRO_ADMIN', 'SPARE_PARTS_ADMIN', 'REFUB'],
	MMV_MANAGEMENT: ['PRO_ADMIN', 'SPARE_PARTS_ADMIN', 'REFUB'],

	SPAREPARTS_ASSIGNMENT: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_EXECUTIVE',
		'REFUB'
	],

	PARTS_REQUIREMENT: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_EXECUTIVE',
		'REFUB'
	],

	PARTS_ORDER_HISTORY: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_EXECUTIVE',
		'REFUB'
	],

	VENDOR_MANAGEMENT: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'REFUB'
	],

	SPM_PARTS_CONFIGURATION_GROUP: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'REFUB'
	],
	SPM_OPERATIONS_GROUP: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'FLOOR_MANAGER',
		'SPARE_PARTS_CITY_HEAD',
		'SPARE_PARTS_RUNNER',
		'REFUB'
	],
	SPM_VENDOR_MANAGEMENT_GROUP: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],
	SPM_PAYMENT_GROUP: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	],
	SPM_SUMMARY_VIEW_GROUP: [
		'PRO_ADMIN',
		'SPARE_PARTS_ADMIN',
		'SPARE_PARTS_MANAGER_CITY',
		'SPARE_PARTS_MANAGER_CENTRAL',
		'SUPPLY_CATEGORY_MANAGER',
		'REFURB_CATEGORY_MANAGER',
		'SPARE_PARTS_EXECUTIVE',
		'FLOOR_MANAGER',
		'SPARE_PARTS_CITY_HEAD',
		'REFUB'
	]
};
