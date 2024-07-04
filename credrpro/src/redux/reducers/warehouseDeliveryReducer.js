import { WAREHOUSE_DELIVERY_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  vehicleStatus: [],
  wareHouseTimeResponse: {},
  allCount: 0,
  delivered_confirm_pending: 0,
  delivered: 0,
  dispute: 0,
  count: 0,
  pageNum: 1,
  between0to24: 0,
  between24to48: 0,
  between48to72: 0,
  above72: 0
}

export default function warehouseReducer(state = intialState, action) {

  switch (action.type) {
    case WAREHOUSE_DELIVERY_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case WAREHOUSE_DELIVERY_ACTION.SUCCESS:
      const { vehicleStatus, allCount, delivered_confirm_pending, delivered, dispute, count, pageNum, between0to24 = 0, between24to48 = 0, between48to72 = 0, above72 = 0 } = action.payload;
      return getNewState(state, {
        vehicleStatus,
        allCount,
        delivered_confirm_pending,
        delivered,
        dispute,
        count,
        pageNum,
        between0to24,
        between24to48,
        between48to72,
        above72,
        isLoading: false
      })

    case WAREHOUSE_DELIVERY_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case WAREHOUSE_DELIVERY_ACTION.RESET:
      return intialState

    default:
      return state
  }
}