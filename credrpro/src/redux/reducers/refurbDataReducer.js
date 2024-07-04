import { REFURB_DATA } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  refurbDashBoardResponse: [],
  refurbDashboardCount: 0,
  isLoading: false,
  count: 0,
  pendingCount: 0,
  refurbCount: 0,
  oneAcount: 0,
  alternateCount: 0,
  pageNum: 1,
  qcCompletedCount:0,
  dropCount: 0
}

export default function refurbDataReducer(state = intialState, action) {

  switch (action.type) {
    case REFURB_DATA.REQUEST:
      return getNewState(state, { isLoading: true })

    case REFURB_DATA.SUCCESS:
      const { refurbDashBoardResponse, refurbDashboardCount, pageNum, count, refurbCount, oneAcount, alternateCount, pendingCount,qcCompletedCount, dropCount } = action.payload;
      return getNewState(state, { refurbDashBoardResponse, count, refurbCount, oneAcount, alternateCount,qcCompletedCount, pendingCount, isLoading: false, pageNum, refurbDashboardCount, dropCount })

    case REFURB_DATA.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case REFURB_DATA.RESET:
      return intialState

    default:
      return state
  }
}