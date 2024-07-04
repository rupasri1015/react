import React from 'react'
import Scrollbar from 'react-smooth-scrollbar'
import classNames from 'classnames'
import SidebarContent from './SidebarContent'
import { getEmail, getFirstName, getLastName } from '../../../core/services/userInfoStorageServices'

const Sidebar = ({ changeToDark, changeToLight, changeMobileSidebarVisibility, sidebar }) => {

  const sidebarClass = classNames({
    sidebar: true,
    'sidebar--show': sidebar.show,
    'sidebar--collapse': sidebar.collapse
  })
  const userInfoExists = getEmail() && getFirstName() && getLastName()
  return (
    <div className={sidebarClass}>
      <button type="button" className="sidebar__back" onClick={changeMobileSidebarVisibility} />
      <Scrollbar className={"sidebar__scroll scroll" + (!userInfoExists &&  " sidebar__no__pointer")}>
        <div className="sidebar__wrapper sidebar__wrapper--desktop">
            <SidebarContent
              changeToDark={changeToDark}
              changeToLight={changeToLight}
            />
        </div>
        <div className="sidebar__wrapper sidebar__wrapper--mobile">
            <SidebarContent
              onClick={changeMobileSidebarVisibility}
              changeToDark={changeToDark}
              changeToLight={changeToLight}
            />
        </div>
      </Scrollbar>
    </div>
  )
}

export default Sidebar