import { COMMISSION_DATA } from '../../core/constants/actions'

export default function (state = {}, action) {
  switch (action.type) {
    case COMMISSION_DATA.SET:
      const { payload } = action
      return { payload }

    case COMMISSION_DATA.CLEAR:
      return {}

    default:
      return state
  }
}