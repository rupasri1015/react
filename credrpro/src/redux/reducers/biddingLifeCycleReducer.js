import { GET_LEAD_LIFECYCLE_DETAILS } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  leadDetails: {}
}

export default function biddingListLifecycleReducer(state = intialState, action) {

  switch (action.type) {
    case GET_LEAD_LIFECYCLE_DETAILS.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_LEAD_LIFECYCLE_DETAILS.SUCCESS:
      const { leadLifeCycleResponseBean: leadDetails } = action.payload
      return getNewState(state, { leadDetails, isLoading: false })

    case GET_LEAD_LIFECYCLE_DETAILS.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case GET_LEAD_LIFECYCLE_DETAILS.RESET:
      return intialState

    default:
      return state
  }
}   