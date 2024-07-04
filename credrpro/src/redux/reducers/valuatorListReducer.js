import { VALUATOR_LIST } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  valuatorDetails: [],
  isLoading: false
}

export default function valuatorList(state = intialState, action) {

  switch (action.type) {
    case VALUATOR_LIST.REQUEST:
      return getNewState(state, { isLoading: true })

    case VALUATOR_LIST.SUCCESS:
      const { valuatorDetails } = action.payload;
      return getNewState(state, { valuatorDetails, isLoading: false })

    case VALUATOR_LIST.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}