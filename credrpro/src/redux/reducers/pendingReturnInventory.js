import { PENDING_RETURN_INVENTORY } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
  pendingReturnInventory: [],
  count: 0,
  isLoading: false,
  pageNumber: 1,
}

export default function pendingReturnInventoryReducer(state = initialState, action) {

  switch (action.type) {
    case PENDING_RETURN_INVENTORY.REQUEST:
      return getNewState(state, { isLoading: true })

    case PENDING_RETURN_INVENTORY.SUCCESS:
      const { pendingReturnInventory, count, pageNumber } = action.payload;
      return getNewState(state, { pendingReturnInventory, count, pageNumber: pageNumber + 1, isLoading: false })

    case PENDING_RETURN_INVENTORY.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case PENDING_RETURN_INVENTORY.RESET:
      return initialState

    default:
      return state
  }
}
