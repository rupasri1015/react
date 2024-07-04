import { GET_INVENTORY_AGGREGATE } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getInventoryAggregateTableData } from '../../core/services/inventoryAggregateServices'
import { getWarehouseID } from '../../core/services/rbacServices';

export default function getInventoryAggregateData(payload = {
  pageNum: 1,
  filter: '',
	searchText: '',
  warehouseId: getWarehouseID(),
  showUnavailable: false
  }) {
	const filter = payload.filter,
	searchText  = payload.searchText;
  
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getInventoryAggregateTableData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
					const { pageNum, warehouseId } = payload;
          const { data, message, totalPages } = apiResponse;
          dispatch(success({
						data, message, pageNum, filter, searchText, totalPages, warehouseId
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
	

	function request() { return { type: GET_INVENTORY_AGGREGATE.REQUEST } }
  function success(payload) { return { type: GET_INVENTORY_AGGREGATE.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_INVENTORY_AGGREGATE.FAILURE, payload: { ...error } } }
}