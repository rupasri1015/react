import { SHOWROOM_SALES } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  manageLeadsResponse: [],
  isLoading: false,
  pageNum: 1,
  count: 0
}

export default function showroomSalesReducer(state = intialState, action) {

  switch (action.type) {
    case SHOWROOM_SALES.REQUEST:
      return getNewState(state, { isLoading: true })

    case SHOWROOM_SALES.SUCCESS:
      const { manageLeadsResponse, pageNum, count   } = action.payload;
      return getNewState(state, { manageLeadsResponse, isLoading: false, pageNum, count  })

    case SHOWROOM_SALES.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}