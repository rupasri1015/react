import { QUOTE_CONFIRMATION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  shdCommissionList: [],
  count: 0,
  isLoading: false,
  pageNum: 1,
}

export default function quoteConfirmationReducer(state = intialState, action) {

  switch (action.type) {
    case QUOTE_CONFIRMATION.REQUEST:
      return getNewState(state, { isLoading: true })

    case QUOTE_CONFIRMATION.SUCCESS:
      const { shdCommissionList, count, pageNum } = action.payload;
      return getNewState(state, { shdCommissionList, count, isLoading: false, pageNum })

    case QUOTE_CONFIRMATION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case QUOTE_CONFIRMATION.RESET:
      return intialState

    default:
      return state
  }
}