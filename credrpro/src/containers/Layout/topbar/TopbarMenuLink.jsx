import React from 'react'

const TopbarMenuLinks = ({ title, icon, onClick }) => (
  <div className="topbar__link" onClick={onClick}>
    <span className={`topbar__link-icon lnr lnr-${icon}`} />
    <p className="topbar__link-title">{title}</p>
  </div>
)

export default TopbarMenuLinks