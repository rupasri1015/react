import { CITIES_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  cityList: [],
  isLoading: false
}

export default function citiesReducer(state = intialState, action) {

  switch (action.type) {
    case CITIES_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case CITIES_ACTION.SUCCESS:
      const { cityList } = action.payload;
      return getNewState(state, { cityList, isLoading: false })

    case CITIES_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}