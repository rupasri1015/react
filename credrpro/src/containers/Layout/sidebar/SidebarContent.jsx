import React, { Fragment } from 'react';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import {
  getRole,
  RBAC_LINK,
  PERMISSIONS,
} from '../../../core/services/rbacServices';
import {
  InventoryIcon,
  ValuatorIcon,
  LogisticsIcon,
  FHDIcon,
  SHDIcon,
  DashboardIcon,
  DocumentQcIcon,
  PostSales,
  ShowroomLeads,
  ShowroomSales,
  PaymentsIcon,
  RefurbIcon,
  PerformanceDBIcon,
} from '../../../core/utility/iconHelper';
import FranchiseStoreManagerSideBar from './sideBarsByRole/FranchiseStoreManagerSideBar';
import SalesStoreSideBar from './sideBarsByRole/SalesStoreSidebar';

const SidebarContent = () => {
  const role = getRole();

  return (
    <div className="sidebar__content">
      <ul className="sidebar__block">
        {RBAC_LINK.biddingRoutes.includes(role) && (
          <SidebarLink
            title={role === 'SHD_COMMISSION' ? `Ongoing` :  `Bidding Dashboard`}
            icon={DashboardIcon}
            route="/bidding-dashboard"
          />
        )}
        {/* {RBAC_LINK.shdCommissionRoute.includes(role) && (
          <SidebarLink
            title="Commission"
            route="/shd_commission"
            icon={ValuatorIcon}
          />
        )} */}
        {RBAC_LINK.shdCommissionRoute.includes(role) && (
          <SidebarLink
            title="Quote Confirmation"
            icon={DashboardIcon}
            route="/quote_confirmation"
          />
        )}
        {RBAC_LINK.shdCommissionRoute.includes(role) && (
          <SidebarLink
            title="Wallet Balance - CP"
            icon={DashboardIcon}
            route="/Wallet_Balance_CP"
          />
        )}
        {RBAC_LINK.fhdRoutes.includes(role) && (
          <SidebarLink title="First Hand Dealer" icon={FHDIcon} route="/fhd" />
        )}
        {RBAC_LINK.shdRoutes.includes(role) && (
          <SidebarLink title="Second Hand Dealer" icon={SHDIcon} route="/shd" />
        )}
        {RBAC_LINK.valuatorRoutes.includes(role) && (
          <SidebarLink title="Valuator" route="/valuator" icon={ValuatorIcon} />
        )}
        {RBAC_LINK.listingRoute.includes(role) && (
          <SidebarLink
            title="List Bikes"
            route="/list-website-bikes"
            icon={ValuatorIcon}
          />
        )}
        {RBAC_LINK.valuatorListRoutes.includes(role) && (
          <SidebarLink
            title="Valuator List View"
            route="/valuatorlistview"
            icon={ValuatorIcon}
          />
        )}

        {RBAC_LINK.auditRoute.includes(role) && (
          <SidebarLink
            title="Audit Calls"
            route="/auditCalls"
            icon={ValuatorIcon}
          />
        )}
        {RBAC_LINK.bufferRoute.includes(role) && (
          <SidebarLink
            title="Buffer Online Sell"
            route="/bufferonlinesell"
            icon={ValuatorIcon}
          />
        )}
        {RBAC_LINK.inventoryRoutes.includes(role) && (
          <SidebarCategory title="Inventory-Showroom" icon={InventoryIcon}>
            <SidebarLink title="Accept/Reject" route="/inventory/pending" />
            <SidebarLink
              title="Publish Inventory"
              route="/publishInventory/published"
            />
          </SidebarCategory>
        )}
        {RBAC_LINK.inventoryRoutes.includes(role) && (
          <SidebarCategory
            title="Inventory-ChannelPartner"
            icon={InventoryIcon}
          >
            <SidebarLink title="Publish/Reject" route="/inventorySHD/pending" />
            {/* <SidebarLink
              title="Publish Inventory"
              route="/publishInventorySHD/published"
            /> */}
          </SidebarCategory>
        )}
        {RBAC_LINK.centralManagerSupplyRoutes.includes(role) && (
          <SidebarLink
            title="Valuator List View"
            route="/franchise/central_manger/valuator_dashboard"
          />
        )}
        {RBAC_LINK.documentQCRoutes.includes(role) && (
          <SidebarCategory title="Documents QC" icon={DocumentQcIcon}>
            <SidebarLink title="Documents QC-1" route="/documentQc/QC1" />
            <SidebarLink title="Documents QC-2" route="/documentQc/Qc2" />
          </SidebarCategory>
        )}
        {RBAC_LINK.paperRoute.includes(role) && (
          <SidebarLink
            title="Paper Transfer"
            route="/paperTransfer"
            icon={DocumentQcIcon}
          />
        )}
        {/* {RBAC_ROUTES..includes(role) && (
          <SidebarLink title="Paper Transfer" route="/paperTransfer" icon={DocumentQcIcon} />
        )} */}
        {RBAC_LINK.logisticRoutes.includes(role) && (
          <SidebarCategory title="Logistics" icon={LogisticsIcon}>
            <SidebarLink
              title="Assign Runner"
              route="/logistics/assignRunner"
            />
            <SidebarLink
              title="Assign Runner New"
              route="/logistics/assignRunnerNew"
            />
            <SidebarLink
              title="Logistic Dashboard"
              route="/logistics/vehicleStatus"
            />
            <SidebarLink
              title="Warehouse Delivery"
              route="/logistics/warehouseDelivery"
            />
            <SidebarLink
              title="In Custody Confirmation"
              route="/logistics/custodyConfirmation"
            />
          </SidebarCategory>
        )}
        {RBAC_LINK.franchiseRoutes.includes(role) && (
          <Fragment>
            <SidebarCategory title="Assign Inventory" icon={InventoryIcon}>
              <SidebarLink
                title="Pending Assign Inventory"
                route="/franchise/pendingData"
              />
              <SidebarLink
                title="Assigned Inventory"
                route="/franchise/assignedLeads"
              />
              <SidebarLink
                title="Pending return inventory"
                route="/franchise/pendingReturnInventory"
              />
            </SidebarCategory>
            <SidebarLink
              title="Live Inventory"
              route="/franchise/liveInventory"
              icon={InventoryIcon}
            />
            <SidebarLink
              title="Showroom Leads"
              route="/franchise/manageLeads"
              icon={ShowroomLeads}
            />
            <SidebarLink
              title="Showroom Sales"
              route="/franchise/manageSales"
              icon={ShowroomSales}
            />
            <SidebarCategory title="Post Sales" icon={PostSales}>
              <SidebarLink
                title="Documentation"
                route="/franchise/Documentation"
              />
            </SidebarCategory>
          </Fragment>
        )}
        {RBAC_LINK.docQCRoutes.includes(role) && (
          <SidebarCategory title="Documents QC" icon={DocumentQcIcon}>
            <SidebarLink title="Documents QC-1" route="/documentQc/QC1" />
            <SidebarLink title="Documents QC-2" route="/documentQc/Qc2" />
          </SidebarCategory>
        )}
        {RBAC_LINK.viewPaymentRoutes.includes(role) && (
          <Fragment>
            <SidebarCategory title="Payments" icon={PaymentsIcon}>
              <SidebarLink title="Pending" route="/viewPayments/pending" />
            </SidebarCategory>
            <SidebarLink title="Returns" route="/franchise/returns" />
          </Fragment>
        )}
        {RBAC_LINK.franchiseAdminRoutes.includes(role) && (
          <SidebarCategory title="Payments" icon={PaymentsIcon}>
            <SidebarLink
              title="Pending"
              route="/franchiseAdminPayments/pending"
            />
            <SidebarLink
              title="Awaiting Approval"
              route="/franchiseAdminPayments/approval"
            />
            <SidebarLink
              title="Completed"
              route="/franchiseAdminPayments/completed"
            />
          </SidebarCategory>
        )}
        {/* {RBAC_LINK.prformanceDashboard.includes(role) && (
          <SidebarLink title="Performance Dashboard" route="/profDashboard" icon={PerformanceDBIcon} />
        )} */}
        {/* {RBAC_LINK.refurbDashboard.includes(role) && (
          <SidebarLink title="Refurb Dashboard" route="/refurbDashboard" icon={RefurbIcon} />
        )} */}
        {RBAC_LINK.refurbRoute.includes(role) && (
          <SidebarLink
            title="Refurb Dashboard"
            route="/refurbDashboard"
            icon={RefurbIcon}
          />
        )}
        {RBAC_LINK.salesStoreRoutes.includes(role) && <SalesStoreSideBar />}
        <Fragment>
          {PERMISSIONS.SPM_PARTS_CONFIGURATION_GROUP.includes(role) && (
            <SidebarCategory
              title="SPM - Parts Configuration"
              icon={LogisticsIcon}
            >
              {RBAC_LINK.sparepartsMaster.includes(role) && (
                <SidebarLink
                  title="Spare Parts Master"
                  route="/sparepartsMaster"
                />
              )}
              {RBAC_LINK.mmvManagement.includes(role) && (
                <SidebarLink title="MMV Management" route="/mmvManagement" />
              )}
            </SidebarCategory>
          )}
          {PERMISSIONS.SPM_OPERATIONS_GROUP.includes(role) && (
            <SidebarCategory title="SPM - Operations" icon={LogisticsIcon}>
              {RBAC_LINK.sparePartsAssignment.includes(role) && (
                <SidebarLink
                  title="Spare Parts Requisitions"
                  route="/sparePartsAssignment"
                />
              )}
              {RBAC_LINK.PartsRequirement.includes(role) && (
                <SidebarLink
                  title="Spare Parts Assignment"
                  route="/partsRequirement"
                />
              )}
              {RBAC_LINK.partsOrderHistory.includes(role) && (
                <SidebarLink
                  title="Order Management"
                  route="/partsOrderHistory"
                />
              )}
              {RBAC_LINK.myAssignments.includes(role) && (
                <SidebarLink title="My Assignments" route="/myAssignments/" />
              )}
              {RBAC_LINK.inwardSpareParts.includes(role) && (
                <SidebarLink
                  title="Fulfil Spare Parts"
                  route="/inwardSpareParts/"
                />
              )}
            </SidebarCategory>
          )}
          {PERMISSIONS.SPM_VENDOR_MANAGEMENT_GROUP.includes(role) && (
            <SidebarCategory title="Vendor Management" icon={LogisticsIcon}>
              {RBAC_LINK.vendorManagement.includes(role) && (
                <SidebarLink
                  title="Vendor Management"
                  route="/vendorManagement"
                />
              )}
            </SidebarCategory>
          )}
          {PERMISSIONS.SPM_PAYMENT_GROUP.includes(role) && (
            <SidebarCategory title="SPM - Payments" icon={LogisticsIcon}>
              {RBAC_LINK.paymentSPM.includes(role) && (
                <SidebarLink title="Payments" route="/sparePartsPayment" />
              )}
            </SidebarCategory>
          )}
          {PERMISSIONS.SPM_SUMMARY_VIEW_GROUP.includes(role) && (
            <SidebarCategory title="SPM - Summary View" icon={LogisticsIcon}>
              {RBAC_LINK.liveInventoryUnit.includes(role) && (
                <SidebarLink
                  title="Inventory - Fulfilled"
                  route="/liveInventoryUnit"
                />
              )}
              {RBAC_LINK.InventoryAggregate.includes(role) && (
                <SidebarLink
                  title="Inventory - Aggregate"
                  route="/inventoryAggregate"
                />
              )}
              {RBAC_LINK.requisitionAggregate.includes(role) && (
                <SidebarLink
                  title="Requisitions - Aggregate"
                  route="/requisitionAggregate"
                />
              )}
            </SidebarCategory>
          )}
          {RBAC_LINK.franchiseStoreManagerRoutes.includes(role) && (
            <FranchiseStoreManagerSideBar />
          )}
        </Fragment>
        {RBAC_LINK.pincodeMapping.includes(role) && (
          <SidebarLink
            title="Pincode Mapping"
            route="/valuatorPincodeMapping"
            icon={ValuatorIcon}
          />
        )}
        {/* {RBAC_LINK.primarySecondaryRoutes.includes(role) && (
          <>
            <SidebarCategory title="Primary Sales" icon={LogisticsIcon}>
              <SidebarLink
                title="CredR Showroom"
                route="/primary-sales/credr-store"
              />
              <SidebarLink title="Franchise" route="/primary-sales/franchise" />
              <SidebarLink title="CMS" route="/primary-sales/cms" />
            </SidebarCategory>
          </>
        )}
        {RBAC_LINK.primarySecondaryRoutes.includes(role) && (
          <>
            <SidebarCategory title="Secondary Sales" icon={LogisticsIcon}>
              <SidebarLink
                title="Franchise"
                route="/secondary-sales/franchise"
              />
            </SidebarCategory>
          </>
        )} */}
         {RBAC_LINK.cxoRoute.includes(role) && (
          <>
            <SidebarCategory title="Primary Sales" icon={LogisticsIcon}>
              <SidebarLink
                title="CredR Showroom"
                route="/primary-sales/credr-store"
              />
              <SidebarLink title="Franchise" route="/primary-sales/franchise" />
              <SidebarLink title="CMS" route="/primary-sales/cms" />
            </SidebarCategory>
          </>
        )}
        {/* {RBAC_LINK.cxoRoute.includes(role) && (
          <>
            <SidebarCategory title="Secondary Sales" icon={LogisticsIcon}>
              <SidebarLink
                title="Franchise"
                route="/secondary-sales/franchise"
              />
            </SidebarCategory>
          </>
        )} */}
      </ul>
    </div>
  );
};

export default SidebarContent;
