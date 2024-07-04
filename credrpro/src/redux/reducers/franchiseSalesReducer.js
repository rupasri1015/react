import { FRANCHISE_SALES } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  franchiseSales: [],
  count: 0,
  isLoading: false,
  pageNum: 1
}

export default function franchiseSalesReducer(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_SALES.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_SALES.SUCCESS:
      const { manageLeadsResponse: franchiseSales, count, pageNum,orderType } = action.payload;
      return getNewState(state, { franchiseSales, count, pageNum, isLoading: false,orderType })

    case FRANCHISE_SALES.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_SALES.RESET:
      return intialState

    default:
      return state
  }
}