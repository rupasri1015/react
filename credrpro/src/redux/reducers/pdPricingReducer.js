import { PRICING_RESULT } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
    pricingResult: [],
    pricingCount:[],
    allCounts: [],
    pageNumber: 1
}

export default function conversionalFunnelList(state = intialState, action) {

  switch (action.type) {
    case PRICING_RESULT.REQUEST:
      return getNewState(state, { isLoading: true })

    case PRICING_RESULT.SUCCESS:
      const { pricingResult, pricingCount, allCounts, pageNumber } = action.payload;
      return getNewState(state, { pricingResult, pricingCount, allCounts, pageNumber, isLoading: false })

    case PRICING_RESULT.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })


    default:
      return state
  }
}   