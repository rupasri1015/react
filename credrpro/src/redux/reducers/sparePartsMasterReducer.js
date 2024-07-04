import { GET_SPM_DATA } from '../../core/constants/actions'
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

export default function sparePartsMAsterReducer(state = initialState, action) {
	switch (action.type) {
    case GET_SPM_DATA.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_SPM_DATA.SUCCESS:
      const { data, message, pageNum, filter, searchText, totalPages } = action.payload;
      return getNewState(state, { data, message, isLoading: false, pageNum, filter, searchText, totalPages })

    case GET_SPM_DATA.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_SPM_DATA.RESET:
      return initialState

    default:
      return state
  }
}
