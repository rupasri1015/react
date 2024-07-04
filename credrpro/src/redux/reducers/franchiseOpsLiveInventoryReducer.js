import { FRANCHISE_LIVE_INVENTORY } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  inventoryList: [],
  count: 0,
  isLoading: false,
  page: 1,
}

export default function franchiseLiveInventoryReducer(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_LIVE_INVENTORY.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_LIVE_INVENTORY.SUCCESS:
      const { allOrderByCityID: inventoryList, count, page } = action.payload;
      return getNewState(state, { inventoryList, count, page, isLoading: false })

    case FRANCHISE_LIVE_INVENTORY.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_LIVE_INVENTORY.RESET:
      return intialState

    default:
      return state
  }
}