import React, { useState } from 'react';
import { Collapse } from 'reactstrap';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

const SidebarCategory = ({ title, route, icon, children }) => {
  const [collapse, setCollapse] = useState(false);
  const categoryClass = classNames({
    'sidebar__category-wrap': true,
    'sidebar__category-wrap--open': collapse,
  });

  const renderCategory = () => {
    return (
      <div className={categoryClass}>
        <button
          type="button"
          className="sidebar__link sidebar__category"
          onClick={() => setCollapse(!collapse)}
        >
          {icon && (
            <img src={icon} className="sidebar__link-icon" alt="sidebar-icon" />
          )}
          <p className="sidebar__link-title">{title}</p>
          <span className="sidebar__category-icon lnr lnr-chevron-right" />
        </button>
        <Collapse isOpen={collapse} className="sidebar__submenu-wrap">
          <ul className="sidebar__submenu">
            <div>{children}</div>
          </ul>
        </Collapse>
      </div>
    );
  };

  if (route) {
    return (
      <NavLink to={route} activeClassName="sidebar__link-active">
        {renderCategory()}
      </NavLink>
    );
  }

  return renderCategory();
};

export default SidebarCategory;
