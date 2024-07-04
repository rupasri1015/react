import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import thunkMiddleware from 'redux-thunk';
import {
	themeReducer,
	sidebarReducer,
	biddingListReducer,
	biddingListLifecycleReducer,
	biddingDetailsReducer,
	loaderReducer,
	inventoryListReducer,
	assignRunnerReducer,
	vehicleStatusReducer,
	warehouseReducer,
	cityListReducer,
	notificationReducer,
	shdListReducer,
	storeListReducer,
	inspectorListReducer,
	publishInventoryReducer,
	fhdShdStoreListReducer,
	fhdListReducer,
	valuatorReducer,
	documentQcListReducer,
	franchiseLiveInventoryReducer,
	pendingAssignListReducer,
	franchiseStoresReducer,
	manageLeadsReducer,
	franchiseSalesReducer,
	documentationLeadsReducer,
	franchisePaymentReducers,
	conversionalFunnnelReducer,
	pdPricingReducer,
	outletProfReducer,
	valuatorProfReducer,
	valuatorListReducer,
	valuatorDataReducers,
	franchiseAssignRunnerReducer,
	franchiseVehicleStatusReducer,
	franchiseWarehouseDeliveryReducer,
	refurbDataReducer,
	sparePartsMAsterReducer,
	mmvManagementReducer,
	liveInventoryUnitReducer,
	inventoryAggregateReducer,
	sparePartsAssignmentReducer,
	partsRequirementReducer,
	partsRequirementTableReducer,
	requisitionAggregateReducer,
	partsOrderHistoryReducer,
	vendorManagementReducer,
	paymentSPMReducer,
	logisticCityReducer,
	allInventoryListShdReducer,
	priorityListReducer,
	priorityListReducerFilter,
	valuatorDashboard,
	bufferPriceOnlineSellReducer,
	visitingLeadsReducer,
	franchiseStoreReturnsReducer,
	fsmPendingReturns,
	getPaperDataReducer,
	shdCommissionReducer,
	franchiseReturns,
	assignRunnerNewReducer,
	pendingReturnInventoryReducer,
	showroomLeads,
	showroomSales,
	showroomPaymentsHistoryReducer,
	franchiseStoreProfile,
	paymentsHistoryReducer,
	primarySalesCmsReducer,
	primarySalesFranchiseReducer,
	primarySalesStoreReducer,
	secondarySalesReducer,
	quoteConfirmationReducer,
	shdOrderDeductionReducer,
	logisticsInCustodyReducer,
	commissionDataReducer,
	storeTransactionReducer,
	shdTransactionReducer,
} from '../../redux/reducers/index';

const reducer = combineReducers({
	form: reduxFormReducer,
	theme: themeReducer,
	sidebar: sidebarReducer,
	biddingList: biddingListReducer,
	biddingListLifecycleReducer: biddingListLifecycleReducer,
	biddingDetails: biddingDetailsReducer,
	loader: loaderReducer,
	inventory: inventoryListReducer,
	inventoryShd: allInventoryListShdReducer,
	runner: assignRunnerReducer,
	vehicle: vehicleStatusReducer,
	warehouse: warehouseReducer,
	cities: cityListReducer,
	notification: notificationReducer,
	shdData: shdListReducer,
	storeList: storeListReducer,
	inspectorList: inspectorListReducer,
	publishInventory: publishInventoryReducer,
	valuator: valuatorReducer,
	storeListFhdShd: fhdShdStoreListReducer,
	fhdData: fhdListReducer,
	documentQcData: documentQcListReducer,
	franchise: franchiseLiveInventoryReducer,
	pending: pendingAssignListReducer,
	franchiseStores: franchiseStoresReducer,
	manageLeads: manageLeadsReducer,
	franchiseSales: franchiseSalesReducer,
	franchisePaymentList: franchisePaymentReducers,
	documentationList: documentationLeadsReducer,
	conversionalFunnnel: conversionalFunnnelReducer,
	pdPricingResult: pdPricingReducer,
	outlProfList: outletProfReducer,
	valuatorProfList: valuatorProfReducer,
	valuatorData: valuatorListReducer,
	valuatorDataList: valuatorDataReducers,
	franchiseRunner: franchiseAssignRunnerReducer,
	vehicleStatus: franchiseVehicleStatusReducer,
	refurb: refurbDataReducer,
	warehouseFranchise: franchiseWarehouseDeliveryReducer,
	sparePartsMaster: sparePartsMAsterReducer,
	mmvManagement: mmvManagementReducer,
	liveInventoryUnit: liveInventoryUnitReducer,
	inventoryAggregate: inventoryAggregateReducer,
	sparePartsAssignment: sparePartsAssignmentReducer,
	partsRequirement: partsRequirementReducer,
	tableCheckBox: partsRequirementTableReducer,
	requisitionAggregate: requisitionAggregateReducer,
	partsOrderHistory: partsOrderHistoryReducer,
	vendorManagement: vendorManagementReducer,
	paymentSPM: paymentSPMReducer,
	logisticsCities: logisticCityReducer,
	priorityList: priorityListReducer,
	filterListView: priorityListReducerFilter,
	valuatorList: valuatorDashboard,
	bufferPriceData: bufferPriceOnlineSellReducer,
	visitingLeads: visitingLeadsReducer,
	fsmReturns: franchiseStoreReturnsReducer,
	fsmPendingReturns: fsmPendingReturns,
	paperTransferData: getPaperDataReducer,
	shdCommission: shdCommissionReducer,
	franchiseReturns: franchiseReturns,
	assignRunnerNew: assignRunnerNewReducer,
	pendingReturnInventory: pendingReturnInventoryReducer,
	showroom: showroomLeads,
	showroomSales: showroomSales,
	walletHistory: showroomPaymentsHistoryReducer,
	franchiseStoreProfile: franchiseStoreProfile,
	paymentsHistory: paymentsHistoryReducer,
	primarySalesCms: primarySalesCmsReducer,
	primarySalesFranchise: primarySalesFranchiseReducer,
	primarySalesStore: primarySalesStoreReducer,
	secondary: secondarySalesReducer,
	quoteConfirm: quoteConfirmationReducer,
	orderDeductions:shdOrderDeductionReducer,
	inCustody: logisticsInCustodyReducer,
	commission: commissionDataReducer,
	storeTrans: storeTransactionReducer,
	shdTransaction: shdTransactionReducer,
});

const middleWares = [thunkMiddleware];

// Redux dev tools setup
let enhancer;
const middleWareEnhancer = applyMiddleware(...middleWares);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

if (
	process.env.NODE_ENV !== 'production' &&
	window.location.hostname === 'localhost' &&
	typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
) {
	enhancer = composeEnhancers(middleWareEnhancer);
} else {
	enhancer = middleWareEnhancer;
}

const store = createStore(reducer, enhancer);

export default store;
