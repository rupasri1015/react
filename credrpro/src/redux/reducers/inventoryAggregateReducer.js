import { GET_INVENTORY_AGGREGATE } from '../../core/constants/actions'
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

export default function inventoryAggregateReducer(state = initialState, action) {
	switch (action.type) {
    case GET_INVENTORY_AGGREGATE.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_INVENTORY_AGGREGATE.SUCCESS:
      const { data, message, pageNum, filter, searchText, totalPages } = action.payload;
      return getNewState(state, { data, message, isLoading: false, pageNum, filter, searchText, totalPages })

    case GET_INVENTORY_AGGREGATE.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_INVENTORY_AGGREGATE.RESET:
      return initialState

    default:
      return state
  }
}
