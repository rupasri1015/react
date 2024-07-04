import { VALUATOR_DATA } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  valuatorDetails: [],
  isLoading: false
}

export default function valuatoreReducer(state = intialState, action) {

  switch (action.type) {
    case VALUATOR_DATA.REQUEST:
      return getNewState(state, { isLoading: true })

    case VALUATOR_DATA.SUCCESS:
      const { valuatorDetails } = action.payload;
      return getNewState(state, { valuatorDetails, isLoading: false })

    case VALUATOR_DATA.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}