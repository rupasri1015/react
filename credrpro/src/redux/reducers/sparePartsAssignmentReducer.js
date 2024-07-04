import { GET_SPAREPARTS_ASSIGNMENT } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
    data : [],
		message : 'Failed',
		pageNumber: 1,
		isLoading: false,
		fromDate: '',
    toDate: '',
    serviceCenterName: '',
    warehouseName: '',
    warehouseId: '',
    searchText: '',
    status: 'all'
}

export default function inventoryAggregateReducer(state = initialState, action) {
	switch (action.type) {
    case GET_SPAREPARTS_ASSIGNMENT.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_SPAREPARTS_ASSIGNMENT.SUCCESS: {
      const {
        data,
        message,
        totalPages,
        tabs,
        pageNumber,
        fromDate,
        toDate,
        serviceCenterName,
        warehouseName,
        searchText,
        status } = action.payload;
      return getNewState(state, {
        isLoading: false,
        data,
        message,
        totalPages,
        tabs,
        pageNumber,
        fromDate,
        toDate,
        serviceCenterName,
        warehouseName,
        searchText,
        status
      })
    }

    case GET_SPAREPARTS_ASSIGNMENT.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...initialState })

    case GET_SPAREPARTS_ASSIGNMENT.RESET:
      return

    case GET_SPAREPARTS_ASSIGNMENT.SET_WAREHOUSE_ID:
      const { warehouseId } = action.payload;

      return getNewState(state, { warehouseId })

    case GET_SPAREPARTS_ASSIGNMENT.SET_SERVICE_CENTER_NAME:
      const { serviceCenterName } = action.payload;

      return getNewState(state, { serviceCenterName })

    default:
      return state
  }
}
