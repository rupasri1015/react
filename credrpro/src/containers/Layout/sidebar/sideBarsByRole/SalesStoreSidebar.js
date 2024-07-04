import React, { Fragment } from 'react'
import SidebarLink from '../SidebarLink'
import { InventoryIcon, PostSales, ShowroomLeads, ShowroomSales } from '../../../../core/utility/iconHelper'
import SidebarCategory from '../SidebarCategory'

const SalesStoreSideBar = () => {
  return (
    <Fragment>
      <SidebarLink title="Visiting Leads" route="/sales-store/upcomingWillvisits" icon={InventoryIcon} />
      <SidebarLink title="Live Inventory" route="/sales-store/liveinventory" icon={InventoryIcon} />
      <SidebarLink title="Manage Leads" route="/sales-store/manageleads" icon={ShowroomLeads} />
      <SidebarLink title="Manage Sales" route="/sales-store/managesales" icon={ShowroomSales} />
      <SidebarCategory title="Post Sales" icon={PostSales} >
        <SidebarLink title="Documentation" route="/sales-store/documentation" />
      </SidebarCategory>
    </Fragment>
  );
}

export default SalesStoreSideBar;
