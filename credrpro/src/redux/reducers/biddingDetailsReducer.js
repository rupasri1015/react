import { GET_LEAD_DETAILS } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  leadDetails: {}
}

export default function biddingListReducer(state = intialState, action) {

  switch (action.type) {
    case GET_LEAD_DETAILS.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_LEAD_DETAILS.SUCCESS:
      const { leadInfo: leadDetails } = action.payload
      return getNewState(state, { leadDetails, isLoading: false })

    case GET_LEAD_DETAILS.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case GET_LEAD_DETAILS.RESET:
      return intialState

    default:
      return state
  }
}   