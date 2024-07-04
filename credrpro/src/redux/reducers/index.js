import themeReducer from './themeReducer';
import sidebarReducer from './sidebarReducer';
import biddingListReducer from './biddingListReducer';
import biddingDetailsReducer from './biddingDetailsReducer';
import loaderReducer from './loaderReducer';
import inventoryListReducer from './listInventoryReducer';
import assignRunnerReducer from './assignRunnerListReducer';
import vehicleStatusReducer from './vehicleStatusReducer';
import warehouseReducer from './warehouseDeliveryReducer';
import cityListReducer from './cityListReducer';
import notificationReducer from './notificationReducer';
import shdListReducer from './shdListReducer';
import storeListReducer from './storeListReducer';
import inspectorListReducer from './inspectorListReducer';
import publishInventoryReducer from './publishInventoryReducer';
import fhdShdStoreListReducer from './fhdShdStoreListReducer';
import fhdListReducer from './fhdListReducer';
import valuatorReducer from './valuatorReducer';
import documentQcListReducer from './documentQcListReducer';
import franchiseLiveInventoryReducer from './franchiseOpsLiveInventoryReducer';
import pendingAssignListReducer from './pendingAssignListReducer';
import franchiseStoresReducer from './franchiseStoresReducer';
import manageLeadsReducer from './manageLeadsReducer';
import franchiseSalesReducer from './franchiseSalesReducer';
import documentationLeadsReducer from './documentationListReducer';
import franchisePaymentReducers from './franchisePaymentListReducer';
import conversionalFunnnelReducer from './conversionalFunnnelReducer';
import pdPricingReducer from './pdPricingReducer';
import outletProfReducer from './outletProfReducer';
import valuatorProfReducer from './valuatorProfReducer';
import valuatorListReducer from './valuatorListReducer';
import valuatorDataReducers from './valuatorDataReducers';
import franchiseAssignRunnerReducer from './franchiseAssignRunnerListReducer';
import franchiseVehicleStatusReducer from './franchiseVehicleStatusReducer';
import franchiseWarehouseDeliveryReducer from './franchiseWarehosueDeliveryReducer';
import sparePartsMAsterReducer from './sparePartsMasterReducer';
import mmvManagementReducer from './mmvManagementReduces';
import liveInventoryUnitReducer from './liveInventoryUnitReducers';
import inventoryAggregateReducer from './inventoryAggregateReducer';
import refurbDataReducer from './refurbDataReducer';
import sparePartsAssignmentReducer from './sparePartsAssignmentReducer';
import partsRequirementReducer from './partsRequirementsReducer';
import partsRequirementTableReducer from './partsRequirementTableReducer';
import requisitionAggregateReducer from './requisitionAggregateReducer';
import partsOrderHistoryReducer from './partsOrderHistoryReducer';
import vendorManagementReducer from './vendorManagementReducers';
import paymentSPMReducer from './paymentSPMReducer';
import logisticCityReducer from './logisticCityReducer';
import allInventoryListShdReducer from './listInventoryShdReducer';
import priorityListReducer from './bikePriorityReducer';
import priorityListReducerFilter from './bikePriorityReducerFilter';
import valuatorDashboard from './valuatorDashboardListReducer';
import bufferPriceOnlineSellReducer from './bufferPriceSellReducer';
import visitingLeadsReducer from './visitingLeadsReducer';
import franchiseStoreReturnsReducer from './franchiseStoreReturnsReducer';
import fsmPendingReturns from './fsmPendingReturns';
import getPaperDataReducer from './paperTransferReducer';
import shdCommissionReducer from './shdCommissionReducer';
import franchiseReturns from './franchiseReturnsReducer';
import assignRunnerNewReducer from './assignRunnerNew';
import pendingReturnInventoryReducer from './pendingReturnInventory'
import showroomLeads from './showroomLeadsReducer'
import showroomSales from './showroomSaleReducer'
import showroomPaymentsHistoryReducer from './showroomPaymentsHistoryReducer'
import franchiseStoreProfile from './franchiseStoreProfile'
import paymentsHistoryReducer from './paymentsHistoryReducer'
import primarySalesCmsReducer from './primarySalesreducer'
import primarySalesFranchiseReducer from './primarySalesFranchiseReducer'
import primarySalesStoreReducer from './primarySalesFranchiseStore'
import secondarySalesReducer from './secondaryFranchiseSalesData'
import quoteConfirmationReducer from './quoteConfirmationReducer'
import biddingListLifecycleReducer from './biddingLifeCycleReducer'
import shdOrderDeductionReducer from './shdOrderDeductionReducer'
import logisticsInCustodyReducer from './logisticsInCustodyReducer'
import commissionDataReducer from './commissionDataReducer'
import storeTransactionReducer from './storeTransactionReducer'
import shdTransactionReducer from './shdTransactionReducer'

export {
	themeReducer,
	biddingListReducer,
	biddingListLifecycleReducer,
	sidebarReducer,
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
};
