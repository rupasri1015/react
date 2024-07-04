import { PRIMARY_SALES_ACTION_CMS } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  cmsBikeList: [],
  count: 0,
  isLoading: false,
  pageNum: 1,
}

export default function primarySalesCmsReducer(state = intialState, action) {

  switch (action.type) {
    case PRIMARY_SALES_ACTION_CMS.REQUEST:
      return getNewState(state, { isLoading: true })

    case PRIMARY_SALES_ACTION_CMS.SUCCESS:
      const { cmsBikeList, count, pageNum } = action.payload;
      return getNewState(state, { cmsBikeList, count, isLoading: false, pageNum })

    case PRIMARY_SALES_ACTION_CMS.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case PRIMARY_SALES_ACTION_CMS.RESET:
      return intialState

    default:
      return state
  }
}