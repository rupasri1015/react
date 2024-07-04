import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import NotificationSystem from 'rc-notification'
import { ThemeProps } from '../../shared/prop-types/ReducerProps'
import Loader from './Loader'
import Notification from '../../shared/components/Notification'
import { clearNotification } from '../../redux/actions/notificationAction'
import { isValid } from '../../core/services/authenticationServices'
import { getRole, getUserName, getUserID, getCityID, getMobile } from '../../core/services/rbacServices'

let notificationSHell = null

const showNotification = (color, title, message) => {
  notificationSHell.notice({
    content: <Notification color={color} title={title} message={message} />,
    duration: 1.5,
    closable: true,
    style: { top: 0, left: 'calc(100vw - 100%)' },
    className: 'right-up'
  })
}

class MainWrapper extends PureComponent {
  static propTypes = {
    theme: ThemeProps.isRequired,
    children: PropTypes.element.isRequired,
  }

  componentDidMount() {
    NotificationSystem.newInstance({ maxCount: 1 }, (n) => notificationSHell = n)
    if (isValid() && process.env.NODE_ENV === 'production') {
      const FS = window.FS
      if (FS) {
        const userData = {
          displayName: `${getUserName()} (${getRole()})`,
          userRole_str: getRole(),
          userId_str: String(getUserID()),
          userMobileNumber_str: String(getMobile()),
          userName_str: getUserName(),
          application_str: "PRO"
        }
        if (getCityID()) {
          userData.userCityId_str = String(getCityID())
        } else {
          userData.userCityId_str = 'Central'
        }
        FS.identify(getUserID(), userData)
      }
    }
  }

  componentDidUpdate() {
    const { dispatch, notification } = this.props
    if (Object.keys(notification).length > 0) {
      showNotification(notification.color, notification.title, notification.message)
      dispatch(clearNotification())
    }
  }

  componentWillUnmount() {
    notificationSHell.destroy()
  }

  render() {
    const { theme, children } = this.props

    return (
      <div className={theme.className}>
        <div className="wrapper">
          {children}
        </div>
        <Loader />
      </div>
    )
  }
}

export default connect(state => ({
  theme: state.theme,
  notification: state.notification
}))(MainWrapper)
