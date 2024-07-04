import { FHD_SHD_STORES_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  storeListByCityId: []
}

export default function fhdShdStoreListReducer(state = intialState, action) {

  switch (action.type) {
    case FHD_SHD_STORES_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case FHD_SHD_STORES_ACTION.SUCCESS:
      const { storeListByCityId } = action.payload
      return getNewState(state, { storeListByCityId, isLoading: false })

    case FHD_SHD_STORES_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FHD_SHD_STORES_ACTION.RESET:
      return intialState

    default:
      return state;
  }
}   