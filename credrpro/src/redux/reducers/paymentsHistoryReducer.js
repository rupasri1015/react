import { PAYMENTS_HISTORY } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  transactionHistory: [],
  isLoading: false,
  pageNum: 1,
  count: 0
}

export default function paymentsHistoryReducer(state = intialState, action) {

  switch (action.type) {
    case PAYMENTS_HISTORY.REQUEST:
      return getNewState(state, { isLoading: true })

    case PAYMENTS_HISTORY.SUCCESS:
      const { transactionHistory, pageNum, count   } = action.payload;
      return getNewState(state, { transactionHistory, isLoading: false, pageNum, count  })

    case PAYMENTS_HISTORY.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}