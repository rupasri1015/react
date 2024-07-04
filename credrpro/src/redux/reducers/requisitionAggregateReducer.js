import { GET_REQUISITION_AGGREGATE } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
    data : [],
		message : 'Failed',
		pageNumber: 1,
		isLoading: false,
    warehouseId: '',
    searchText: '',
    filter: ''
}

export default function requisitionAggregateReducer(state = initialState, action) {
	switch (action.type) {
    case GET_REQUISITION_AGGREGATE.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_REQUISITION_AGGREGATE.SUCCESS:
      const { 
        data,
        message,
        totalPages,
        pageNumber,
        warehouseId,
        searchText,
        filter,
      } = action.payload;

      return getNewState(state, { 
        isLoading: false,
        data,
        message,
        totalPages,
        pageNumber,
        warehouseId,
        searchText,
        filter,
      })

    case GET_REQUISITION_AGGREGATE.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_REQUISITION_AGGREGATE.RESET:
      return initialState

    default:
      return state
  }
}
