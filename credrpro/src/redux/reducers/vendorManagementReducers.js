import { GET_VENDOR_MANAGEMENT } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
    data : [],
		message : 'Failed',
		pageNumber: 1,
		isLoading: false,
		filter: '',
    searchText: '',
    totalPages: 1,
    warehouseId: ''
}

export default function vendorManagementReducer(state = initialState, action) {
	switch (action.type) {
    case GET_VENDOR_MANAGEMENT.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_VENDOR_MANAGEMENT.SUCCESS:
      const { data, message, pageNumber, filter, searchText, totalPages, warehouseId } = action.payload;
      return getNewState(state, { data, message, isLoading: false, pageNumber, filter, searchText, totalPages, warehouseId })

    case GET_VENDOR_MANAGEMENT.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_VENDOR_MANAGEMENT.RESET:
      return initialState

    default:
      return state
  }
}
