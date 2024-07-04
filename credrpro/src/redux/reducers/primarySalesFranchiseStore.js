import { PRIMARY_SALES_ACTION_STORE } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  saleDocumentResponse: [],
  count: 0,
  isLoading: false,
  pageNum: 1,
}

export default function primarySalesStoreReducer(state = intialState, action) {

  switch (action.type) {
    case PRIMARY_SALES_ACTION_STORE.REQUEST:
      return getNewState(state, { isLoading: true })

    case PRIMARY_SALES_ACTION_STORE.SUCCESS:
      const { saleDocumentResponse, count, pageNum } = action.payload;
      return getNewState(state, { saleDocumentResponse, count, isLoading: false, pageNum })

    case PRIMARY_SALES_ACTION_STORE.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case PRIMARY_SALES_ACTION_STORE.RESET:
      return intialState

    default:
      return state
  }
}