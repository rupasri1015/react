import { PUBLISH_INVENTORY_LIST_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  inventoryList: [],
  count: 0,
  page: 1,
  isLoading: false
}

export default function allInventoryListReducer(state = intialState, action) {

  switch (action.type) {
    case PUBLISH_INVENTORY_LIST_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case PUBLISH_INVENTORY_LIST_ACTION.SUCCESS:
      const { inventoryList, count, page } = action.payload;
      return getNewState(state, { inventoryList, count, page, isLoading: false })

    case PUBLISH_INVENTORY_LIST_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case PUBLISH_INVENTORY_LIST_ACTION.RESET:
      return intialState

    default:
      return state
  }
}