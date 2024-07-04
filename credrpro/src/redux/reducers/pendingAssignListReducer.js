import { PENDING_ASSIGN_INVENTORY } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
  pendingList: [],
  count: 0,
  isLoading: false,
  page: 1,
}

export default function pendingAssignListReducer(state = initialState, action) {

  switch (action.type) {
    case PENDING_ASSIGN_INVENTORY.REQUEST:
      return getNewState(state, { isLoading: true })

    case PENDING_ASSIGN_INVENTORY.SUCCESS:
      const { allOrderByCityID: pendingList, count, page } = action.payload;
      return getNewState(state, { pendingList, count, page, isLoading: false })

    case PENDING_ASSIGN_INVENTORY.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case PENDING_ASSIGN_INVENTORY.RESET:
      return initialState

    default:
      return state
  }
}
