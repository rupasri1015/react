import React from 'react'
import icon from '../../../shared/img/icons/hambergur-icon.svg'

const TopbarSidebarButton = ({ changeMobileSidebarVisibility, changeSidebarVisibility }) => (
  <div>
    <button type="button" className="topbar__button topbar__button--desktop" onClick={changeSidebarVisibility}>
      <img src={icon} alt="" className="topbar__button-icon" />
    </button>
    <button type="button" className="topbar__button topbar__button--mobile" onClick={changeMobileSidebarVisibility}>
      <img src={icon} alt="" className="topbar__button-icon" />
    </button>
  </div>
)

export default TopbarSidebarButton