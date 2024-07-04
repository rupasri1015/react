import { CONVERSIONAL_TAT_RESULT } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
    fhdPerformanceResponse: [],
    performanceDashoboardCount:[]
}

export default function conversionalFunnelList(state = intialState, action) {

  switch (action.type) {
    case CONVERSIONAL_TAT_RESULT.REQUEST:
      return getNewState(state, { isLoading: true })

    case CONVERSIONAL_TAT_RESULT.SUCCESS:
      const { fhdPerformanceResponse, performanceDashoboardCount} = action.payload;
      return getNewState(state, { fhdPerformanceResponse, performanceDashoboardCount, isLoading: false })

    case CONVERSIONAL_TAT_RESULT.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}   