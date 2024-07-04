import { GET_DOCUMENTQC_LIST } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  documentQcList: [],
  count: 0,
  pendingCount: 0,
  approvedCount: 0,
  disputeCount: 0,
  rejectedCount: 0,
  pageNum: 1,
  conditionalCount: 0,
  reuploadedCount: 0,
  isLoading: false
}

export default function documentQcListReducer(state = intialState, action) {

  switch (action.type) {
    case GET_DOCUMENTQC_LIST.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_DOCUMENTQC_LIST.SUCCESS:
      const { qcDashBoardList: documentQcList, count, approvedCount, disputeCount,reuploadedCount, rejectedCount, pendingCount, conditionalCount, pageNum } = action.payload;
      return getNewState(state, { documentQcList, count, approvedCount, disputeCount, reuploadedCount, rejectedCount, pendingCount, conditionalCount, isLoading: false, pageNum })

    case GET_DOCUMENTQC_LIST.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case GET_DOCUMENTQC_LIST.RESET:
      return intialState

    default:
      return state
  }
}   