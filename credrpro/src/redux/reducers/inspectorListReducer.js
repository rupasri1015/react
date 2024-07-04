import { INSPECTOR_LIST_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  inspectorList: [],
  isLoading: false
}

export default function allInventoryListReducer(state = intialState, action) {

  switch (action.type) {
    case INSPECTOR_LIST_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case INSPECTOR_LIST_ACTION.SUCCESS:
      const { inspectorList } = action.payload;
      return getNewState(state, { inspectorList, isLoading: false })

    case INSPECTOR_LIST_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case INSPECTOR_LIST_ACTION.RESET:
      return intialState

    default:
      return state
  }
}