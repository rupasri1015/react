import { LOGISTICS_CITY_LIST } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  cityList: [],
  isLoading: false
}

export default function logisticCityReducer(state = intialState, action) {

  switch (action.type) {
    case LOGISTICS_CITY_LIST.REQUEST:
      return getNewState(state, { isLoading: true })

    case LOGISTICS_CITY_LIST.SUCCESS:
      const { cityList } = action.payload;
      return getNewState(state, { cityList, isLoading: false })

    case LOGISTICS_CITY_LIST.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}