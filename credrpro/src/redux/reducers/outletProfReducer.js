import { OUTLET_RESULT } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
    outletProfList: [],
    outletProfCount:[]
}

export default function outletProf(state = intialState, action) {

  switch (action.type) {
    case OUTLET_RESULT.REQUEST:
      return getNewState(state, { isLoading: true })

    case OUTLET_RESULT.SUCCESS:
      const { outletProfList, outletProfCount } = action.payload;
      return getNewState(state, { outletProfList, outletProfCount, isLoading: false })

    case OUTLET_RESULT.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })


    default:
      return state
  }
}   