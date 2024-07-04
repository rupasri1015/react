import { VALUATOR_RESULT } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
    valuatorProfList: [],
    valuatorCount:[]
}

export default function valuatorProf(state = intialState, action) {

  switch (action.type) {
    case VALUATOR_RESULT.REQUEST:
      return getNewState(state, { isLoading: true })

    case VALUATOR_RESULT.SUCCESS:
      const { valuatorProfList, valuatorCount } = action.payload;
      return getNewState(state, { valuatorProfList, valuatorCount, isLoading: false })

    case VALUATOR_RESULT.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })


    default:
      return state
  }
}   