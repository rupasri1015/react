import { VALUATOR_DASHBOARD } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  valuatorList: [],
  isLoading: false,
  pendingCount: 0,
  preDropCount: 0,
  inspectedCount: 0,
  docDisputeCount: 0,
  nocallCount: 0,
  rescheduleCount:0,
  adiyCompletedCount:0,
  pageNum: 1
}

export default function valuatorDashboard(state = intialState, action) {

  switch (action.type) {
    case VALUATOR_DASHBOARD.REQUEST:
      return getNewState(state, { isLoading: true })

    case VALUATOR_DASHBOARD.SUCCESS:
      const { valuatorList, pageNum, pendingCount, preDropCount, inspectedCount, docDisputeCount, nocallCount,rescheduleCount,adiyCompletedCount } = action.payload;
      return getNewState(state, { valuatorList, isLoading: false, pageNum, pendingCount, preDropCount, inspectedCount, docDisputeCount, nocallCount,rescheduleCount,adiyCompletedCount })

    case VALUATOR_DASHBOARD.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}