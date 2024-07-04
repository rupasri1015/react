import { PRIMARY_SALES_ACTION_FRANCHISE } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  saleDocumentResponseFranchise: [],
  count: 0,
  isLoading: false,
  pageNum: 1,
}

export default function primarySalesFranchiseReducer(state = intialState, action) {

  switch (action.type) {
    case PRIMARY_SALES_ACTION_FRANCHISE.REQUEST:
      return getNewState(state, { isLoading: true })

    case PRIMARY_SALES_ACTION_FRANCHISE.SUCCESS:
      const { saleDocumentResponseFranchise, count, pageNum } = action.payload;
      return getNewState(state, { saleDocumentResponseFranchise, count, isLoading: false, pageNum })

    case PRIMARY_SALES_ACTION_FRANCHISE.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case PRIMARY_SALES_ACTION_FRANCHISE.RESET:
      return intialState

    default:
      return state
  }
}