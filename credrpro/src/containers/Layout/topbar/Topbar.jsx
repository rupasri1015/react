import React from 'react'
import TopbarSidebarButton from './TopbarSidebarButton'
import TopbarProfile from './TopbarProfile'

const Topbar = ({ changeMobileSidebarVisibility, changeSidebarVisibility }) => (
  <div className="topbar">
    <div className="topbar__wrapper">
      <div className="topbar__left">
        <TopbarSidebarButton
          changeMobileSidebarVisibility={changeMobileSidebarVisibility}
          changeSidebarVisibility={changeSidebarVisibility}
        />
        <div className="topbar__logo" />
      </div>
      <div className="topbar__right">
        <TopbarProfile />
      </div>
    </div>
  </div>
)

export default Topbar