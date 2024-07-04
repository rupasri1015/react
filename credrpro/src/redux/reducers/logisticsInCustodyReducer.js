import { LOGISTICS_IN_CUSTODY } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  inCustResponse: [],
  count: 0,
  isLoading: false,
  pageNum: 1,
  pendingCount: 0,
  adiyCompletedCount: 0
}

export default function logisticsInCustodyReducer(state = intialState, action) {

  switch (action.type) {
    case LOGISTICS_IN_CUSTODY.REQUEST:
      return getNewState(state, { isLoading: true })

    case LOGISTICS_IN_CUSTODY.SUCCESS:
      const { inCustResponse , count, pendingCount, adiyCompletedCount, pageNum } = action.payload;
      return getNewState(state, { inCustResponse, count, isLoading: false, pageNum, pendingCount, adiyCompletedCount })

    case LOGISTICS_IN_CUSTODY.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case LOGISTICS_IN_CUSTODY.RESET:
      return intialState

    default:
      return state
  }
}