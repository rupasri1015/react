import { GET_LIVE_INVENTORY_UNIT } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
	data : [],
	message : 'Failed',
	pageNum: 1,
	isLoading: false,
	filter: '',
	searchText: '',
	totalPages: 1
}

export default function liveInventoryUnitReducer(state = initialState, action) {
	switch (action.type) {
    case GET_LIVE_INVENTORY_UNIT.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_LIVE_INVENTORY_UNIT.SUCCESS:
      const { data, message, pageNum, filter, searchText, totalPages } = action.payload;
      return getNewState(state, { data, message, isLoading: false, pageNum, filter, searchText, totalPages })

    case GET_LIVE_INVENTORY_UNIT.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_LIVE_INVENTORY_UNIT.RESET:
      return initialState

    default:
      return state
  }
}
