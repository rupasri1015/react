import { LIST_INVENTORY_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  inventoryList: [],
  count: 0,
  page: 1,
  isLoading: false
}

export default function allInventoryListReducer(state = intialState, action) {

  switch (action.type) {
    case LIST_INVENTORY_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case LIST_INVENTORY_ACTION.SUCCESS:
      const { inventoryList, count, page } = action.payload;
      return getNewState(state, { inventoryList, count, page, isLoading: false })

    case LIST_INVENTORY_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case LIST_INVENTORY_ACTION.RESET:
      return intialState

    default:
      return state
  }
}