import { FRANCHISE_STORES } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  storeListByCityId: [],
  isLoading: false
}

export default function franchiseStoresReducer(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_STORES.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_STORES.SUCCESS:
      const { storesbyCityId } = action.payload;
      return getNewState(state, { storeListByCityId: storesbyCityId, isLoading: false })

    case FRANCHISE_STORES.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_STORES.RESET:
      return intialState

    default:
      return state
  }
}