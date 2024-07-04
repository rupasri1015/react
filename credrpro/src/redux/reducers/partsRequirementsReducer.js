import { GET_PARTS_REQUIREMENT } from '../../core/constants/actions'
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
    searchText: '',
    filter: ''
}

export default function partsRequirementReducer(state = initialState, action) {
	switch (action.type) {
    case GET_PARTS_REQUIREMENT.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_PARTS_REQUIREMENT.SUCCESS:
      const { 
        data,
        message,
        totalPages,
        pageNumber,
        fromDate,
        toDate,
        warehouseName,
        warehouseId,
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
        searchText,
        filter,
        status,
        tabs
      })

    case GET_PARTS_REQUIREMENT.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_PARTS_REQUIREMENT.RESET:
      return initialState

    default:
      return state
  }
}
