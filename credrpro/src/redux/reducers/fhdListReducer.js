import { FHD_LIST_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  fhdList: [],
  total: 0,
  page: 1,
  isLoading: false
}

export default function fhdListReducer(state = intialState, action) {

  switch (action.type) {
    case FHD_LIST_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case FHD_LIST_ACTION.SUCCESS:
      const { fhdList, total, page } = action.payload;
      return getNewState(state, { fhdList, total, page, isLoading: false })

    case FHD_LIST_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FHD_LIST_ACTION.RESET:
      return intialState

    default:
      return state
  }
}   