import React, { Fragment } from 'react';
import SidebarLink from '../SidebarLink';
import SidebarCategory from '../SidebarCategory';
import { InventoryIcon, DocumentQcIcon, ShowroomSales, ValuatorIcon, 
         WalletIcon, AssignedInventoryIcon, LiveInventoryIcon, LeadsandInvoicesIcon, 
         PaymentModeIcon, PaymentHistoryIcon, ReturnsIcon, PendingReturns, BusinessIcon } from '../../../../core/utility/iconHelper';

const FranchiseStoreManagerSideBar = () => {
  return (
    <Fragment>
      <SidebarLink title="Profile" icon={ValuatorIcon} route="/franchise-store/profile" />
      <SidebarLink title="My Wallet" route="/franchise-store/my-wallet" icon={WalletIcon} />
      <SidebarLink title="Assigned Inventory" route="/franchise-store/assigned_inventory" icon={AssignedInventoryIcon} />
      <SidebarCategory title="Payment Modes" icon={PaymentModeIcon}>
        <SidebarLink title="Offline" route="/franchise-store/offline-payment" />
        <SidebarLink title="Offline Approval" route="/franchise-store/offline-approval" />
        <SidebarLink title="Online" route="/franchise-store/online-payment" />
      </SidebarCategory>
      <SidebarLink title="To Be Delivered" icon={ReturnsIcon} route="/franchise-store/to-be-delivered" />
      <SidebarLink title="Live Inventory" route="/franchise-store/liveinventory" icon={LiveInventoryIcon} />
      <SidebarLink title="Leads & Invoices" route="/franchise-store/store-leads" icon={LeadsandInvoicesIcon} />
      <SidebarLink title="Sales" route="/franchise-store/store-sales" icon={ShowroomSales} />
      <SidebarLink title="Payments History" route="/franchise-store/payments-history" icon={PaymentHistoryIcon} />
      <SidebarLink title="Returns" icon={ReturnsIcon} route="/franchise-store/returns" />
      <SidebarLink title="Pending Returns" icon={PendingReturns} route="/franchise-store/pending-returns" />
      <SidebarLink title="Business Entity" icon={BusinessIcon} route="/viewEntity" />
    </Fragment>
  );
};

export default FranchiseStoreManagerSideBar;
