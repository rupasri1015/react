import { VALUATOR_LIST_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  valuatorList: [],
  count: 0,
  page: 1,
  isLoading: false
}


export default function valuatorListReducer(state = intialState, action) {

  switch (action.type) {
    case VALUATOR_LIST_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case VALUATOR_LIST_ACTION.SUCCESS:
      const { valuatorList, count, page } = action.payload;
      return getNewState(state, { valuatorList, count, page, isLoading: false })

    case VALUATOR_LIST_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case VALUATOR_LIST_ACTION.RESET:
      return intialState

    default:
      return state
  }
}