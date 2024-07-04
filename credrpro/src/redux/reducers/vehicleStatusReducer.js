import { VEHICLE_STATUS_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  vehicleStatus: [],
  count: 0,
  isLoading: false,
  allCount: 0,
  delivered: 0,
  dispute: 0,
  assigned: 0,
  pending: 0,
  intrasist: 0,
  rejected: 0,
  pendingDelivery: 0,
  unAssigned: 0,
  pendingConfirmation: 0,
  pickup_dispute:0,
  delivery_dispute: 0,
  pageNum: 1,
}

export default function vehicleStatusReducer(state = intialState, action) {

  switch (action.type) {
    case VEHICLE_STATUS_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case VEHICLE_STATUS_ACTION.SUCCESS:
      const { vehicleStatus, allCount, delivered, dispute, assigned, pending, intrasist, rejected, count, pageNum, pendingDelivery, unAssigned, pendingConfirmation, pickup_dispute, delivery_dispute } = action.payload;
      return getNewState(state, { vehicleStatus, allCount, delivered, dispute, assigned, pending, intrasist, rejected, count, pageNum, pendingDelivery, unAssigned, pendingConfirmation, pickup_dispute, delivery_dispute, isLoading: false })

    case VEHICLE_STATUS_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case VEHICLE_STATUS_ACTION.RESET:
      return intialState

    default:
      return state
  }
}