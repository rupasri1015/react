import { STORE_LIST_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  storeListByCityId: [],
  isLoading: false
}

export default function allInventoryListReducer(state = intialState, action) {

  switch (action.type) {
    case STORE_LIST_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case STORE_LIST_ACTION.SUCCESS:
      const { storeListByCityId } = action.payload;
      return getNewState(state, { storeListByCityId, isLoading: false })

    case STORE_LIST_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case STORE_LIST_ACTION.RESET:
      return intialState

    default:
      return state
  }
}