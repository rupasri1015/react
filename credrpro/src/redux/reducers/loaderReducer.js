import { SHOW_LOADER, HIDE_LOADER } from '../actions/loaderAction'
import { getNewState } from '../../core/utility/getNewState'

const initialState = {
  isLoading: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADER:
      return getNewState(state, { isLoading: true })
    case HIDE_LOADER:
      return getNewState(state, { isLoading: false })
    default:
      return state
  }
}
