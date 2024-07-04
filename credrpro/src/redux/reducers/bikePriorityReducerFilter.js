import { GET_BIKE_PRIORITY_BY_FILTER } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  priorityCategory: {},
  isLoading: false,
  pageNum: 1,
  count: 0
}

export default function priorityListReducerFilter(state = intialState, action) {

  switch (action.type) {
    case GET_BIKE_PRIORITY_BY_FILTER.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_BIKE_PRIORITY_BY_FILTER.SUCCESS:
      const { priorityCategory, pageNum, count } = action.payload;
      return getNewState(state, { priorityCategory, pageNum, isLoading: false, count })

    case GET_BIKE_PRIORITY_BY_FILTER.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case GET_BIKE_PRIORITY_BY_FILTER.RESET:
      return intialState

    default:
      return state
  }
}   