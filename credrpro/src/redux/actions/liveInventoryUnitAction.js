import { GET_LIVE_INVENTORY_UNIT } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getLIUNITTableData } from '../../core/services/liveInventoryUnitServices'
import { getWarehouseID } from '../../core/services/rbacServices';

export default function getLiveInventoryUnitData(payload = {
  pageNum: 1,
  filter: '',
	searchText: '',
	warehouseNum: getWarehouseID()
  }) {
	const filter = payload.filter,
	searchText  = payload.searchText;

  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getLIUNITTableData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
					const { pageNum } = payload;
          const { data, message, totalPages } = apiResponse;
          dispatch(success({
						data, message, pageNum, filter, searchText, totalPages
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
	

	function request() { return { type: GET_LIVE_INVENTORY_UNIT.REQUEST } }
  function success(payload) { return { type: GET_LIVE_INVENTORY_UNIT.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_LIVE_INVENTORY_UNIT.FAILURE, payload: { ...error } } }
}
