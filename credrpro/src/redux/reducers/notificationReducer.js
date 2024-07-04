import { NOTIFICATION_ACTION } from '../../core/constants/actions'

export default function (state = {}, action) {
  switch (action.type) {
    case NOTIFICATION_ACTION.SET:
      const { color, title, message } = action.payload
      return { color, title, message }

    case NOTIFICATION_ACTION.CLEAR:
      return {}

    default:
      return state
  }
}