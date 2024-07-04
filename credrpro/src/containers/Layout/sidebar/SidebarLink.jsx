import React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarLink = ({ title, icon, route, onClick }) => (
  <NavLink
    to={route}
    onClick={onClick}
    activeClassName="sidebar__link-active"
  >
    <li className="sidebar__link">
      {icon && <img src={icon} className="sidebar__link-icon" alt="sidebar-icon" />}
      <p className="sidebar__link-title">
        {title}
      </p>
    </li>
  </NavLink>
)

export default SidebarLink