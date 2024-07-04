import { NOTIFICATION_ACTION } from '../../core/constants/actions'

export function setNotification(color, title, message) {
  return {
    type: NOTIFICATION_ACTION.SET,
    payload: {
      color,
      title,
      message
    }
  }
}

export function clearNotification() {
  return {
    type: NOTIFICATION_ACTION.CLEAR
  }
}