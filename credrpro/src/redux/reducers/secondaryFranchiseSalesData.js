import { SECONDARY_SALES_FRANCHISE } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  salesDocumentForSecondaryFranchiseSales: [],
  count: 0,
  isLoading: false,
  pageNum: 1,
}

export default function secondarySalesReducer(state = intialState, action) {

  switch (action.type) {
    case SECONDARY_SALES_FRANCHISE.REQUEST:
      return getNewState(state, { isLoading: true })

    case SECONDARY_SALES_FRANCHISE.SUCCESS:
      const { salesDocumentForSecondaryFranchiseSales, count, pageNum } = action.payload;
      return getNewState(state, { salesDocumentForSecondaryFranchiseSales, count, isLoading: false, pageNum })

    case SECONDARY_SALES_FRANCHISE.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case SECONDARY_SALES_FRANCHISE.RESET:
      return intialState

    default:
      return state
  }
}