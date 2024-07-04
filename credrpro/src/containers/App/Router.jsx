import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoutes';
import {
  getRole,
  salesStoreRoutes,
  franchiseStoreManagerRoutes,
} from '../../core/services/rbacServices';
import MainWrapper from './MainWrapper';
import SuspenseLoader from './SuspenseLoader';
import Layout from '../Layout';
import Footer from '../Layout/footer';
import LogIn from '../LogIn';
import BusinessEntity from '../BusinessEntity';
import ViewEntity from '../BusinessEntity/components/ViewEntries';
import QuoteConfirmation from '../QuoteConfirmation';
import { getUserActionApplicable } from '../../core/services/userInfoStorageServices';

const AcceptRejectInventory = lazy(() => import('../Inventory/AcceptReject'));
const PublishInventory = lazy(() => import('../Inventory/PublishInventory'));
const Valuator = lazy(() => import('../Valuator'));
const BiddingDashboard = lazy(() => import('../BiddingDashboard'));
const BiddingDetails = lazy(() => import('../BiddingDetails'));
const SecondHandDealer = lazy(() => import('../SHD'));
const FirstHandDealer = lazy(() => import('../FHD'));
const AssignRunner = lazy(() => import('../Logistics/AssignRunner'));
const AssignRunnerNew = lazy(() => import('../Logistics/AssignRunnerNew'));
const VehicleStatus = lazy(() => import('../Logistics/VehicleStatus'));
const WarehouseDelivery = lazy(() => import('../Logistics/WarehouseDelivery'));
const DocumentQc = lazy(() => import('../DocumentQC'));
const DocumentQcDetailsTab = lazy(() => import('../DocumentQcBikeDetails'));
const DocumentQCViewOnly = lazy(() => import('../DocumentQCViewOnly'));
const LiveInventory = lazy(() => import('../FranchiseModule/LiveInventory'));
const PendingAssignInventory = lazy(() =>
  import('../FranchiseModule/AssignInventory/PendingAssignment')
);
const PendingReturnInventory = lazy(() =>
  import('../FranchiseModule/AssignInventory/PendingReturnInventory')
);
const ManageLeads = lazy(() => import('../FranchiseModule/ManageLeads'));
const ManageSales = lazy(() => import('../FranchiseModule/ManageSales'));
const AssignedLeads = lazy(() =>
  import('../FranchiseModule/AssignInventory/AssignedLeads')
);
// const FranchiseSales = lazy(() => import('../FranchiseModule/ManageSales'));
const Documentation = lazy(() => import('../PostSales/Documentation'));
const PaymentPending = lazy(() =>
  import('../FranchisePaymentModule/PaymentPending')
);
const AwaitingApproval = lazy(() =>
  import('../FranchisePaymentModule/PaymentAwaitingApproval')
);
const PaymentCompleted = lazy(() =>
  import('../FranchisePaymentModule/PaymentCompleted')
);
// const ProfDashboard = lazy(() => import('../PerformanceDashboard/container/profDashboard'));
const PricingDashboard = lazy(() =>
  import('../PerformanceDashboard/container/pricing')
);
const TATDashboard = lazy(() =>
  import('../PerformanceDashboard/container/TATData')
);
const OutletWisePerformance = lazy(() =>
  import('../PerformanceDashboard/container/outLetWise')
);
const ValuatorWisePerformance = lazy(() =>
  import('../PerformanceDashboard/container/valuatorWise')
);
const ViewPaymentPending = lazy(() =>
  import('../FranchisePaymentsView/PaymentPending')
);
const AddFHD = lazy(() => import('../../containers/FHD-Onboarding'));
const AddSHD = lazy(() => import('../../containers/SHD-Onboarding'));
const AddValuator = lazy(() => import('../../containers/ValuatorOnboarding'));
const SparepartsMaster = lazy(() => import('../SparepartsMaster'));
const MMVManagement = lazy(() => import('../MMVManagement'));
const LiveInventoryUnit = lazy(() => import('../LiveInventoryUnit'));
const LiveInventoryUnitForm = lazy(() =>
  import('../LiveInventoryUnit/components/forms/LiveInventoryUnitForm')
);
const InventoryAggregate = lazy(() => import('../InventoryAggregate'));
const SparePartsAssignment = lazy(() => import('../SparePartsAssignment'));
const BikeRepairRequest = lazy(() =>
  import('../SparePartsAssignment/components/form/RepairRequest')
);
const PartsRequirement = lazy(() => import('../PartsRequirement'));
const AddNewPartsRequirement = lazy(() =>
  import('../PartsRequirement/components/forms/AddNewPartsRequirement')
);
const CreateRequirementsOrder = lazy(() =>
  import('../PartsRequirement/components/forms/CreateRequirementsOrder')
);
const RequisitionAggregate = lazy(() => import('../RequisitionAggregate'));
const PartsOrderHistory = lazy(() => import('../PartsOrderHistory'));
const PartsOrderHistoryDetails = lazy(() =>
  import('../PartsOrderHistory/components/PartsOrderHistoryDetails')
);
const MyAssignments = lazy(() => import('../MyAssignments'));
const InwardSpareParts = lazy(() => import('../InwardSpareParts'));
const RefurbDashboard = lazy(() => import('../../containers/RefurbDashboard'));
const VendorManagement = lazy(() =>
  import('../../containers/VendorManagement')
);
const AddVendorManagement = lazy(() =>
  import('../VendorManagement/components/AddNewVendor')
);
const EditVendor = lazy(() =>
  import('../VendorManagement/components/EditVendor')
);
const PaymentSPM = lazy(() => import('../PaymentSPM/'));
const DocumentQcCV = lazy(() => import('../DocumentQC-CV'));
const DocumentQcCvDetailsTab = lazy(() =>
  import('../DocumentQcBikeDetailsCON')
);
const DocumentQcCvViewOnly = lazy(() => import('../DocumnetQCViewOnlyCON'));
const AcceptRejectInventorySHD = lazy(() =>
  import('../InventorySHD/AcceptReject')
);
const PublishInventorySHD = lazy(() =>
  import('../InventorySHD/PublishInventory')
);
const ListBikes = lazy(() => import('../ListWebsiteBikes'));
const ValuatorListView = lazy(() => import('../ValuatorListView'));
const BufferOnlineSell = lazy(() => import('../BufferPriceOnlineSell'));
const UpcomingSales = lazy(() =>
  import('../SalesStoreLeadsDashboard/UpcomingSales')
);
const PaperTransferFlow = lazy(() => import('../Paper Transfer'));
const PaperTransformTab = lazy(() => import('../PaperDetails'));
const PaperTransferView = lazy(() => import('../PaperViewDetails'));
const PaperRTODetailsTab = lazy(() => import('../PaperRTODetails'));
const PaperVaahanDetailsTab = lazy(() => import('../PaperVaahanDetails'));
const AuditCalls = lazy(() => import('../AuditCalls'));
const FranchiseStoreReturns = lazy(() =>
  import('../FranchiseStoreManagerDashboard/Returns')
);
const FranchiseStorePendingReturns = lazy(() =>
  import('../FranchiseStoreManagerDashboard/PendingReturns')
);
const PaperReceivedTab = lazy(() => import('../PaperTransferReceived'));
const PaperTransferDeliveredtab = lazy(() =>
  import('../PaperTransferDelivered')
);
const SHDCommission = lazy(() => import('../SHDCommission'));
const FranchiseStoreAssignedInventory = lazy(() =>
  import('../FranchiseStoreManagerDashboard/AssignedInventory')
);
const FranchiseStoreLiveInventory = lazy(() =>
  import('../FranchiseStoreManagerDashboard/LiveInventory')
);
const FranchiseToBeDelivered = lazy(() =>
  import('../FranchiseStoreManagerDashboard/ToBeDelivered')
);
const FranchiseLeads = lazy(() =>
  import('../FranchiseStoreManagerDashboard/StoreLeads')
);
const FranchiseSales = lazy(() =>
  import('../FranchiseStoreManagerDashboard/StoreSales')
);
const FranchiseWallet = lazy(() =>
  import('../FranchiseStoreManagerDashboard/CredRWallet')
);
const PendingOfflinePayment = lazy(() =>
  import('../FranchiseStoreManagerDashboard/PaymentModes/Offline')
);
const PendingOnlinePayment = lazy(() =>
  import('../FranchiseStoreManagerDashboard/PaymentModes/Online')
);
const OfflineApprovalPayment = lazy(() =>
  import('../FranchiseStoreManagerDashboard/PaymentModes/OfflineApproval')
);
const PaymentsHistory = lazy(() =>
  import('../FranchiseStoreManagerDashboard/PaymentsHistory')
);
const FranchiseStoreProfile = lazy(() =>
  import('../FranchiseStoreManagerDashboard/Profile')
);
const FranchiseOpsReturns = lazy(() => import('../FranchiseReturns'));
const ValuatorPincodeMapping = lazy(() => import('../ValuatorPincodeMapping'));
const GSTPage = lazy(() => import('../FranchiseStoreManagerDashboard/GSTPage'));
const GSTPDFPage = lazy(() =>
  import('../FranchiseStoreManagerDashboard/components/PDFDownloadPage')
);
const CredRStore = lazy(() => import('../PrimarySales/CredRStore'));
const Franchise = lazy(() => import('../PrimarySales/Franchise'));
const CMS = lazy(() => import('../PrimarySales/CMS'));
const SecondaryFranchise = lazy(() => import('../SecondarySales/Franchise'));

const UpdateProfile = lazy(() => import('../UserProfile'));
const CareConfirmation = lazy(() => import('../QuoteConfirmation'));
const WalletBalanceCP = lazy(() => import('../WalletBalanceCp'));
const InCustodyConfirmation = lazy(() => import('../InCustodyConfirmation'))

const InventoryPages = () => (
  <Switch>
    <Route path="/inventory/:status" component={AcceptRejectInventory} />
  </Switch>
);
const ValuatorPincode = () => (
  <Switch>
    <Route path="/valuatorPincodeMapping" component={ValuatorPincodeMapping} />
  </Switch>
);

const InventoryPagesSHD = () => (
  <Switch>
    <Route path="/inventorySHD/:status" component={AcceptRejectInventorySHD} />
  </Switch>
);

const PublishInventoryPages = () => (
  <Switch>
    <Route path="/publishInventory/:status" component={PublishInventory} />
  </Switch>
);

const PublishInventoryPagesSHD = () => (
  <Switch>
    <Route
      path="/publishInventorySHD/:status"
      component={PublishInventorySHD}
    />
  </Switch>
);

const ValuatorPages = () => (
  <Switch>
    <Route path="/valuator/add" component={AddValuator} />
    <Route path="/valuator" component={Valuator} />
  </Switch>
);

const FHDPages = () => (
  <Switch>
    <Route path="/fhd/add" component={AddFHD} />
    <Route path="/fhd" component={FirstHandDealer} />
  </Switch>
);

const SHDPages = () => (
  <Switch>
    <Route path="/shd/add" component={AddSHD} />
    <Route path="/shd" component={SecondHandDealer} />
  </Switch>
);

const LogisticsPages = () => (
  <Switch>
    <Route path="/logistics/assignRunner" component={AssignRunner} />
    <Route path="/logistics/assignRunnerNew" component={AssignRunnerNew} />
    <Route path="/logistics/vehicleStatus" component={VehicleStatus} />
    <Route path="/logistics/warehouseDelivery" component={WarehouseDelivery} />
    <Route
      path="/logistics/view-bike-details/:leadId"
      component={BiddingDetails}
    />
    <Route path="/logistics/custodyConfirmation" component={InCustodyConfirmation} />
  </Switch>
);

const BiddingRoutes = () => (
  <Switch>
    <Route
      path="/bidding-dashboard/viewDeatils/:leadId"
      component={BiddingDetails}
    />
    <Route path="/bidding-dashboard" component={BiddingDashboard} />
  </Switch>
);

const ValuatorListPages = () => (
  <Switch>
    <Route path="/valuatorlistview" component={ValuatorListView} />
  </Switch>
);

const BufferOnlineSellRoutes = () => (
  <Switch>
    <Route path="/bufferonlinesell" component={BufferOnlineSell} />
  </Switch>
);
const FranchiseAdminPages = () => (
  <Switch>
    <Route path="/franchiseAdminPayments/pending" component={PaymentPending} />
    <Route
      path="/franchiseAdminPayments/approval"
      component={AwaitingApproval}
    />
    <Route
      path="/franchiseAdminPayments/completed"
      component={PaymentCompleted}
    />
  </Switch>
);

const FranchiseStoreReturnPage = () => (
  <Switch>
    <Route path="/franchise-store/returns" component={FranchiseStoreReturns} />
    <Route
      path="/franchise-store/pending-returns"
      component={FranchiseStorePendingReturns}
    />
    <Route path="/franchise-store/profile" component={FranchiseStoreProfile} />
    <Route
      path="/franchise-store/assigned_inventory"
      component={FranchiseStoreAssignedInventory}
    />
    <Route
      path="/franchise-store/liveInventory"
      component={FranchiseStoreLiveInventory}
    />
    <Route
      path="/franchise-store/to-be-delivered"
      component={FranchiseToBeDelivered}
    />
    <Route path="/franchise-store/gst-form" component={GSTPage} />
    <Route path="/franchise-store/download-invoices" component={GSTPDFPage} />
    <Route path="/franchise-store/store-leads" component={FranchiseLeads} />
    <Route path="/franchise-store/store-sales" component={FranchiseSales} />
    <Route path="/franchise-store/my-wallet" component={FranchiseWallet} />
    <Route
      path="/franchise-store/offline-payment"
      component={PendingOfflinePayment}
    />
    <Route
      path="/franchise-store/online-payment"
      component={PendingOnlinePayment}
    />
    <Route
      path="/franchise-store/offline-approval"
      component={OfflineApprovalPayment}
    />
    <Route
      path="/franchise-store/payments-history"
      component={PaymentsHistory}
    />
  </Switch>
);

const SHDCommissionPage = () => (
  <Switch>
    <Route path="/shd_commission" component={SHDCommission} />
  </Switch>
);

const QuoteConfirmationPage = () => (
  <Switch>
    <Route path="/quote_confirmation" component={CareConfirmation} />
  </Switch>
);

const WalletBalanceCpPage = () => (
  <Switch>
    <Route path="/Wallet_Balance_CP" component={WalletBalanceCP} />
  </Switch>
);

const DocumentQCRoutes = () => (
  <Switch>
    <Route
      path="/documentQc/Qc2/bikedetails/:leadId"
      component={DocumentQcDetailsTab}
    />
    <Route
      path="/documentQc/Qc2/viewdetails/:leadId"
      component={DocumentQcDetailsTab}
    />
    <Route path="/documentQc/Qc2" component={DocumentQc} />
    <Route
      path="/documentQc/QC1/bikedetails/:leadId/:status"
      component={DocumentQcCvDetailsTab}
    />
    <Route
      path="/documentQc/QC1/viewdetails/:leadId/:status"
      component={DocumentQcCvDetailsTab}
    />
    <Route path="/documentQc/QC1" component={DocumentQcCV} />
  </Switch>
);

const PaperTransferRoutes = () => (
  <Switch>
    <Route
      path="/paperTransfer/bikedetails/:leadId"
      component={PaperTransformTab}
    />
    <Route
      path="/paperTransfer/viewdetails/:leadId"
      component={PaperTransferView}
    />
    <Route
      path="/paperTransfer/rtoDetails/:leadId"
      component={PaperRTODetailsTab}
    />
    <Route
      path="/paperTransfer/vaahanDetails/:leadId"
      component={PaperVaahanDetailsTab}
    />
    <Route
      path="/paperTransfer/receivedDetails/:leadId"
      component={PaperReceivedTab}
    />
    <Route
      path="/paperTransfer/deliveredDetails/:leadId"
      component={PaperTransferDeliveredtab}
    />
    <Route path="/paperTransfer" component={PaperTransferFlow} />
  </Switch>
);

const FranchisePages = () => (
  <Switch>
    <Route path="/franchise/liveInventory" component={LiveInventory} />
    <Route path="/franchise/pendingData" component={PendingAssignInventory} />
    <Route
      path="/franchise/pendingReturnInventory"
      component={PendingReturnInventory}
    />
    <Route path="/franchise/manageLeads" component={ManageLeads} />
    <Route path="/franchise/assignedLeads" component={AssignedLeads} />
    <Route path="/franchise/manageSales" component={ManageSales} />
    <Route path="/franchise/Documentation" component={Documentation} />
    <Route path="/franchise/returns" component={FranchiseOpsReturns} />
  </Switch>
);

const FranchiseCentralManagerPages = () => (
  <Switch>
    <Route
      path="/franchise/central_manger/valuator_dashboard"
      component={ValuatorListView}
    />
  </Switch>
);

const PaymentViewPages = () => (
  <Switch>
    <Route path="/viewPayments/pending" component={ViewPaymentPending} />
  </Switch>
);

// const PerformanceDashboard = () => (
// 	<Switch>
// 		<Route path="/profDashboard/TATDashboard" component={TATDashboard} />
// 		<Route path="/profDashboard/pricingDashboard" component={PricingDashboard} />
// 		<Route path="/profDashboard/OutletWisePerformance" component={OutletWisePerformance} />
// 		<Route path="/profDashboard/ValuatorWisePerformance" component={ValuatorWisePerformance} />
// 		<Route path="/profDashboard" component={ProfDashboard} />
// 	</Switch>
// );

const SparepartsMasterPage = () => (
  <Switch>
    <Route path="/sparepartsMaster" component={SparepartsMaster} />
  </Switch>
);

const UserUpdateProf = () => (
  <Switch>
    <Route path="/updateprofile" component={UpdateProfile} />
  </Switch>
);

const MMVManagementPage = () => (
  <Switch>
    <Route path="/mmvManagement" component={MMVManagement} />
  </Switch>
);

const LiveInventoryUnitPage = () => (
  <Switch>
    <Route path="/liveInventoryUnit/add" component={LiveInventoryUnitForm} />
    <Route path="/liveInventoryUnit" component={LiveInventoryUnit} />
  </Switch>
);

const InventoryAggregatePage = () => (
  <Switch>
    <Route path="/inventoryAggregate" component={InventoryAggregate} />
  </Switch>
);

const SparePartsAssignmentPage = () => (
  <Switch>
    <Route
      path="/sparePartsAssignment/bikeRepairRequest"
      component={BikeRepairRequest}
    />
    <Route path="/sparePartsAssignment" component={SparePartsAssignment} />
  </Switch>
);

const VendorManagementPage = () => (
  <Switch>
    <Route path="/vendorManagement/edit/" component={EditVendor} />
    <Route path="/vendorManagement/add" component={AddVendorManagement} />
    <Route path="/vendorManagement" component={VendorManagement} />
  </Switch>
);

const PartsRequirementPage = () => (
  <Switch>
    <Route
      path="/partsRequirement/createOrder"
      component={CreateRequirementsOrder}
    />
    <Route path="/partsRequirement/add" component={AddNewPartsRequirement} />
    <Route path="/partsRequirement" component={PartsRequirement} />
  </Switch>
);

const RequisitionAggregatePage = () => (
  <Switch>
    <Route path="/requisitionAggregate" component={RequisitionAggregate} />
  </Switch>
);

const PartsOrderHistoryPage = () => (
  <Switch>
    <Route
      path="/partsOrderHistory/details"
      component={PartsOrderHistoryDetails}
    />
    <Route path="/partsOrderHistory" component={PartsOrderHistory} />
  </Switch>
);

const MyAssignmentsPage = () => (
  <Switch>
    <Route path="/myAssignments/" component={MyAssignments} />
  </Switch>
);

const InwardSparePartsPage = () => (
  <Switch>
    <Route path="/inwardSpareParts/" component={InwardSpareParts} />
  </Switch>
);

const PaymentSPMPage = () => (
  <Switch>
    <Route path="/sparePartsPayment/" component={PaymentSPM} />
  </Switch>
);

const RefurbDashboardPage = () => (
  <Switch>
    <Route path="/refurbDashboard" component={RefurbDashboard} />
  </Switch>
);

const ListingPage = () => (
  <Switch>
    <Route path="/list-website-bikes" component={ListBikes} />
  </Switch>
);

const AuditCallsPage = () => (
  <Switch>
    <Route path="/auditCalls" component={AuditCalls} />
  </Switch>
);

const BusinessEntityPage = () => (
  <Switch>
    <Route path="/business_entity" component={BusinessEntity} />
  </Switch>
);
const ViewEntityPage = () => (
  <Switch>
    <Route path="/viewEntity" component={ViewEntity} />
  </Switch>
);

const PrimarySalesPage = () => (
  <Switch>
    <Route path="/primary-sales/credr-store" component={CredRStore} />
    <Route path="/primary-sales/franchise" component={Franchise} />
    <Route path="/primary-sales/cms" component={CMS} />
  </Switch>
);

// const SecondarySalesPage = () => (
//   <Switch>
//     <Route path="/secondary-sales/franchise" component={SecondaryFranchise} />
//   </Switch>
// );

const RBAC_ROUTES = [
  {
    path: '/updateprofile',
    component: UserUpdateProf,
    canAccess: [
      'SHD_COMMISSION',
      'PRO_BID',
      'Calling_Audit',
      'FRANCHISE_MANAGER',
      'FLOOR_MANAGER',
      'FRANCHISE_ADMIN',
      'Franchise_ops_manager',
      'LOGISTICS_COORDINATOR_CENTRAL',
      'LOGISTICS_COORDINATOR',
      'PRO_ADMIN',
      'REFUB',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_CITY_HEAD',
      'SPARE_PARTS_EXECUTIVE',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_RUNNER',
      'PRO_PUBLISH',
      'DOC_QC',
      'PAPER_TRANSFER_AGENT',
      'Franchise_store_manager',
      'PRO_PROF_DASHBOARD',
      'CENTRAL_MANAGER_SUPPLY',
      'LOGISTCS_STATE_HEAD',
      'Franchise_ops_manager_central',
      'SUPPLY_CATEGORY_MANAGER',
      'CXO_INSIGHTStem'
    ],
  },
  {
    path: '/business_entity',
    component: BusinessEntityPage,
    canAccess: ['Franchise_store_manager'],
  },
  {
    path: '/valuatorPincodeMapping',
    component: ValuatorPincode,
    canAccess: ['CENTRAL_MANAGER_SUPPLY', 'DIY_ASSIST'],
  },
  {
    path: '/viewEntity',
    component: ViewEntityPage,
    canAccess: ['Franchise_store_manager'],
  },
  {
    path: '/shd',
    component: SHDPages,
    canAccess: ['PRO_ADMIN'],
  },
  {
    path: '/fhd',
    component: FHDPages,
    canAccess: ['PRO_ADMIN'],
  },
  {
    path: '/bidding-dashboard',
    component: BiddingRoutes,
    canAccess: ['PRO_ADMIN', 'PRO_BID', 'SHD_COMMISSION'],
  },
  {
    path: '/valuatorlistview',
    component: ValuatorListPages,
    canAccess: ['PRO_ADMIN'],
  },
  {
    path: '/auditCalls',
    component: AuditCallsPage,
    canAccess: ['Calling_Audit'],
  },
  // {
  //   path: '/shd_commission',
  //   component: SHDCommissionPage,
  //   canAccess: ['SHD_COMMISSION'],
  // },
  {
    path: '/quote_confirmation',
    component: QuoteConfirmationPage,
    canAccess: ['SHD_COMMISSION'],
  },
  {
    path: '/Wallet_Balance_CP',
    component: WalletBalanceCpPage,
    canAccess: getUserActionApplicable() ? ['SHD_COMMISSION']: [],
  },
  {
    path: '/bufferonlinesell',
    component: BufferOnlineSellRoutes,
    canAccess: ['FRANCHISE_ADMIN', 'FRANCHISE_MANAGER'],
  },
  {
    path: '/inventory',
    component: InventoryPages,
    canAccess: ['PRO_ADMIN', 'PRO_PUBLISH'],
  },
  {
    path: '/publishInventory',
    component: PublishInventoryPages,
    canAccess: ['PRO_ADMIN', 'PRO_PUBLISH'],
  },
  {
    path: '/documentQc',
    component: DocumentQCRoutes,
    canAccess: ['PRO_ADMIN', 'DOC_QC'],
  },
  {
    path: '/paperTransfer',
    component: PaperTransferRoutes,
    canAccess: ['PAPER_TRANSFER_AGENT'],
  },
  {
    path: '/franchise/central_manger',
    component: FranchiseCentralManagerPages,
    canAccess: ['CENTRAL_MANAGER_SUPPLY'],
  },
  {
    path: '/franchiseAdminPayments',
    component: FranchiseAdminPages,
    canAccess: ['FRANCHISE_ADMIN'],
  },
  {
    path: '/primary-sales',
    component: PrimarySalesPage,
    canAccess: ['CXO_INSIGHTS'],
  },
  // {
  //   path: '/secondary-sales',
  //   component: SecondarySalesPage,
  //   canAccess: ['CXO_INSIGHTS'],
  // },
  {
    path: '/sparepartsMaster',
    component: SparepartsMasterPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'REFUB',
    ],
  },
  {
    path: '/liveInventoryUnit',
    component: LiveInventoryUnitPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_EXECUTIVE',
      'FLOOR_MANAGER',
      'SPARE_PARTS_CITY_HEAD',
      'REFUB',
    ],
  },
  {
    path: '/inventoryAggregate',
    component: InventoryAggregatePage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_EXECUTIVE',
      'FLOOR_MANAGER',
      'SPARE_PARTS_CITY_HEAD',
      'REFUB',
    ],
  },
  {
    path: '/sparePartsAssignment',
    component: SparePartsAssignmentPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_EXECUTIVE',
      'FLOOR_MANAGER',
      'SPARE_PARTS_CITY_HEAD',
      'REFUB',
    ],
  },
  {
    path: '/partsRequirement',
    component: PartsRequirementPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_EXECUTIVE',
      'FLOOR_MANAGER',
      'SPARE_PARTS_CITY_HEAD',
      'REFUB',
    ],
  },

  {
    path: '/logistics',
    component: LogisticsPages,
    canAccess: [
      'PRO_ADMIN',
      'LOGISTICS_COORDINATOR',
      'LOGISTICS_COORDINATOR_CENTRAL',
      'LOGISTCS_STATE_HEAD',
    ],
  },
  {
    path: '/publishInventorySHD',
    component: PublishInventoryPagesSHD,
    canAccess: ['PRO_ADMIN', 'PRO_PUBLISH'],
    // canAccess: ['PRO_ADMIN']
  },
  {
    path: '/valuator',
    component: ValuatorPages,
    canAccess: ['PRO_ADMIN'],
  },
  {
    path: '/franchise',
    component: FranchisePages,
    canAccess: [
      'Franchise_ops_manager',
      'Franchise_ops_manager_central',
      'FRANCHISE_ADMIN',
    ],
  },
  {
    path: '/inventorySHD',
    component: InventoryPagesSHD,
    canAccess: ['PRO_ADMIN', 'PRO_PUBLISH'],
    // canAccess: ['PRO_ADMIN']
  },
  // {
  // 	path: '/profDashboard',
  // 	component: PerformanceDashboard,
  // 	canAccess: ['PRO_PROF_DASHBOARD', 'PRO_ADMIN']
  // },
  {
    path: '/mmvManagement',
    component: MMVManagementPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'REFUB',
    ],
  },
  {
    path: '/requisitionAggregate',
    component: RequisitionAggregatePage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_EXECUTIVE',
      'FLOOR_MANAGER',
      'SPARE_PARTS_CITY_HEAD',
      'REFUB',
    ],
  },
  {
    path: '/partsOrderHistory',
    component: PartsOrderHistoryPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_EXECUTIVE',
      'FLOOR_MANAGER',
      'SPARE_PARTS_CITY_HEAD',
      'REFUB',
    ],
  },
  {
    path: '/myAssignments/',
    component: MyAssignmentsPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SPARE_PARTS_EXECUTIVE',
      'SPARE_PARTS_RUNNER',
      'REFUB',
    ],
  },
  {
    path: '/inwardSpareParts/',
    component: InwardSparePartsPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SPARE_PARTS_EXECUTIVE',
      'SPARE_PARTS_RUNNER',
      'REFUB',
    ],
  },
  {
    path: '/vendorManagement',
    component: VendorManagementPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_EXECUTIVE',
      'SPARE_PARTS_CITY_HEAD',
      'REFUB',
    ],
  },
  {
    path: '/sparePartsPayment',
    component: PaymentSPMPage,
    canAccess: [
      'PRO_ADMIN',
      'SPARE_PARTS_ADMIN',
      'SPARE_PARTS_MANAGER_CITY',
      'SPARE_PARTS_MANAGER_CENTRAL',
      'SUPPLY_CATEGORY_MANAGER',
      'REFURB_CATEGORY_MANAGER',
      'SPARE_PARTS_EXECUTIVE',
      'SPARE_PARTS_CITY_HEAD',
      'REFUB',
    ],
  },
  {
    path: '/refurbDashboard',
    component: RefurbDashboardPage,
    canAccess: ['REFUB'],
  },
  {
    path: '/viewPayments',
    component: PaymentViewPages,
    canAccess: ['Franchise_ops_manager', 'Franchise_ops_manager_central'],
  },
  {
    path: '/list-website-bikes',
    component: ListingPage,
    canAccess: ['PRO_ADMIN'],
  },
  // {
  // 	path: '/sales-store',
  // 	component: SalesStoreLeads,
  // 	canAccess: salesStoreRoutes
  // },
  {
    path: '/franchise-store',
    component: FranchiseStoreReturnPage,
    canAccess: franchiseStoreManagerRoutes,
  },
];

const wrappedRoutes = () => (
  <div>
    <Layout />
    <Suspense fallback={<SuspenseLoader />}>
      <div className="container__wrap">
        {RBAC_ROUTES.filter((route) => route.canAccess.includes(getRole())).map(
          (route) => (
            <PrivateRoute
              path={route.path}
              key={route.path}
              component={route.component}
            />
          )
        )}
      </div>
    </Suspense>
    <Footer />
  </div>
);

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/" component={LogIn} />
        <Route exact path="/login" component={LogIn} />
        <PrivateRoute path="/" component={wrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
