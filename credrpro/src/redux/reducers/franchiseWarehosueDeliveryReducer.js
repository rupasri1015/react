import { FRANCHISE_WAREHOUSE_DELIVERY_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  vehicles: [],
  tabwiseCount: 0,
  isLoading: false,
  pageNumber: 1,
  totalCount: 0,
  deliveredCount: 0,
  pendingConfirmationCount: 0,
  deliveryDisputeCount: 0
}

export default function franchiseWarehouseReducer(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_WAREHOUSE_DELIVERY_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_WAREHOUSE_DELIVERY_ACTION.SUCCESS:
      const { vehicles, tabwiseCount, totalCount, pageNumber, deliveredCount, pendingConfirmationCount, 
        deliveryDisputeCount } = action.payload;
      return getNewState(state, { vehicles, tabwiseCount, totalCount, isLoading: false, pageNumber, deliveredCount, pendingConfirmationCount, 
        deliveryDisputeCount })

    case FRANCHISE_WAREHOUSE_DELIVERY_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_WAREHOUSE_DELIVERY_ACTION.RESET:
      return intialState

    default:
      return state
  }
}