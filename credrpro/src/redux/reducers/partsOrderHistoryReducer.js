import { GET_PARTS_ORDER_HISTORY } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
    data : [],
		message : 'Failed',
		pageNumber: 1,
		isLoading: false,
		fromDate: '',
    toDate: '',
    warehouseName: '',
    warehouseId: '',
    runnerId: '',
    searchText: '',
    filter: ''
}

export default function partsOrderHistoryReducer(state = initialState, action) {
	switch (action.type) {
    case GET_PARTS_ORDER_HISTORY.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_PARTS_ORDER_HISTORY.SUCCESS:
      const { 
        data,
        message,
        totalPages,
        pageNumber,
        fromDate,
        toDate,
        warehouseName,
        warehouseId,
        runnerId,
        searchText,
        filter,
        status,
        tabs
      } = action.payload;
      return getNewState(state, { 
        isLoading: false,
        data,
        message,
        totalPages,
        pageNumber,
        fromDate,
        toDate,
        warehouseName,
        warehouseId,
        runnerId,
        searchText,
        filter,
        status,
        tabs
      })

    case GET_PARTS_ORDER_HISTORY.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_PARTS_ORDER_HISTORY.RESET:
      return initialState

    default:
      return state
  }
}
