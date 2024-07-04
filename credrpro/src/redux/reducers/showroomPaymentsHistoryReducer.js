import { SHOWROOM_PAYMENTS_HISTORY } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  transactionHistory: [],
  isLoading: false,
  pageNum: 1,
  count: 0,
  walletAmount: 0,
  storeAmount: 0
}

export default function showroomPaymentsHistoryReducer(state = intialState, action) {

  switch (action.type) {
    case SHOWROOM_PAYMENTS_HISTORY.REQUEST:
      return getNewState(state, { isLoading: true })

    case SHOWROOM_PAYMENTS_HISTORY.SUCCESS:
      const { transactionHistory, count, pageNum, walletAmount, storeAmount   } = action.payload;
      return getNewState(state, { transactionHistory, count, pageNum, walletAmount, storeAmount, isLoading: false  })

    case SHOWROOM_PAYMENTS_HISTORY.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}