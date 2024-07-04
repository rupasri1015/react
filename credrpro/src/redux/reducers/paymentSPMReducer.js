import { GET_PAYMENT_SPM } from '../../core/constants/actions'
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

export default function paymentSPMReducer(state = initialState, action) {
	switch (action.type) {
    case GET_PAYMENT_SPM.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_PAYMENT_SPM.SUCCESS:
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

    case GET_PAYMENT_SPM.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_PAYMENT_SPM.RESET:
      return initialState

    default:
      return state
  }
}
