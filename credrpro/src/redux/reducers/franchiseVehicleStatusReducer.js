import { FRANCHISE_VEHICLE_STATUS_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  vehicles: [],
  tabwiseCount: 0,
  isLoading: false,
  pageNumber: 1,
  totalCount: 0,
  assignedCount: 0,
  deliveredCount: 0,
  deliveryDisputeCount: 0,
  inTransitCount: 0,
  pendingAssignmentCount: 0,
  pendingConfirmationCount: 0,
  pendingPickupCount: 0,
  pickupDisputeCount: 0
}

export default function franchiseVehicleStatusReducer(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_VEHICLE_STATUS_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_VEHICLE_STATUS_ACTION.SUCCESS:
      const { vehicles, pageNumber, totalCount, assignedCount, deliveredCount, deliveryDisputeCount, 
        inTransitCount, pendingAssignmentCount, pendingConfirmationCount, pendingPickupCount, pickupDisputeCount } = action.payload;
      return getNewState(state, { vehicles, isLoading: false, pageNumber, totalCount, assignedCount, deliveredCount, deliveryDisputeCount, 
        inTransitCount, pendingAssignmentCount, pendingConfirmationCount, pendingPickupCount, pickupDisputeCount })

    case FRANCHISE_VEHICLE_STATUS_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_VEHICLE_STATUS_ACTION.RESET:
      return intialState

    default:
      return state
  }
}