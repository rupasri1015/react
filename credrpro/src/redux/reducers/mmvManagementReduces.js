import { GET_ALL_MMV } from '../../core/constants/actions'
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

export default function mmvManagementReducer(state = initialState, action) {
	switch (action.type) {
    case GET_ALL_MMV.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_ALL_MMV.SUCCESS:
      const { data, message, pageNum, filter, searchText, totalPages } = action.payload;
      return getNewState(state, { data, message, isLoading: false, pageNum, filter, searchText, totalPages })

    case GET_ALL_MMV.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_ALL_MMV.RESET:
      return initialState

    default:
      return state
  }
}
