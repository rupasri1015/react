import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Topbar from './topbar/Topbar'
import Sidebar from './sidebar/Sidebar'
import { changeThemeToDark, changeThemeToLight } from '../../redux/actions/themeActions'
import { changeMobileSidebarVisibility, changeSidebarVisibility } from '../../redux/actions/sidebarActions'
import Popup from '../Layout/ProfileUpdatePopUp/PopUpDialog'

class Layout extends Component {
  changeSidebarVisibility = () => {
    const { dispatch } = this.props
    dispatch(changeSidebarVisibility())
  }

  changeMobileSidebarVisibility = () => {
    const { dispatch } = this.props
    dispatch(changeMobileSidebarVisibility())
  }

  changeToDark = () => {
    const { dispatch } = this.props
    dispatch(changeThemeToDark())
  }

  changeToLight = () => {
    const { dispatch } = this.props
    dispatch(changeThemeToLight())
  }

  render() {
    const { sidebar } = this.props

    const layoutClass = classNames({
      layout: true,
      'layout--collapse': sidebar.collapse
    })

    return (
      <div className={layoutClass}>
        <Topbar
          changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
          changeSidebarVisibility={this.changeSidebarVisibility}
        />
        <Sidebar
          sidebar={sidebar}
          changeToDark={this.changeToDark}
          changeToLight={this.changeToLight}
          changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
        />
        <Popup />
      </div>
    )
  }
}

export default withRouter(connect(state => ({
  sidebar: state.sidebar
}))(Layout))
