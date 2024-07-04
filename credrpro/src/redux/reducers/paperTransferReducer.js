import { GET_PAPER_TRANSFER } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  ptListDetails: [],
    count: 0,
    collectedCount: 0,
    pendingCount: 0,
    rtoCount: 0,
    vahanCount: 0,
    pageNum: 1,
    deliveredCount: 0,
    ticketCount: 0,
    receivedCount:0,
    isLoading: false
  }

  export default function getPaperDataReducer(state = intialState, action) {

    switch (action.type) {
      case GET_PAPER_TRANSFER.REQUEST:
        return getNewState(state, { isLoading: true })
  
      case GET_PAPER_TRANSFER.SUCCESS:
        const { ptListDetails: ptListDetails, count, collectedCount, pendingCount,rtoCount, vahanCount, deliveredCount, ticketCount, receivedCount, pageNum } = action.payload;
        return getNewState(state, { ptListDetails, count, collectedCount, pendingCount, rtoCount, vahanCount, deliveredCount, ticketCount, receivedCount, isLoading: false, pageNum })
  
      case GET_PAPER_TRANSFER.FAILURE:
        const { error } = action.payload
        return getNewState(state, { error, ...intialState })
  
      case GET_PAPER_TRANSFER.RESET:
        return intialState
  
      default:
        return state
    }
  }   