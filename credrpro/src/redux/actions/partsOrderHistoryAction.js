import { GET_PARTS_ORDER_HISTORY } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getPartsOrderHistoryTableData } from '../../core/services/partsOrderHistoryServices'
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';

export default function getPartsOrderHistoryData(payload = {
  pageNumber: 1,
  fromDate: '',
  toDate: '',
  warehouseName: getWarehouseName(),
  warehouseId: getWarehouseID(),
  runnerId: '',
  searchText: '',
  filter: '',
  status: 'All'
  }) {
  
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPartsOrderHistoryTableData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
					const { 
            pageNumber,
            fromDate,
            toDate,
            warehouseName,
            warehouseId,
            runnerId,
            searchText,
            filter,
            status
          } = payload;
          const { data, message, totalPages, tabs } = apiResponse;
          dispatch(success({
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
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
	

	function request() { return { type: GET_PARTS_ORDER_HISTORY.REQUEST } }
  function success(payload) { return { type: GET_PARTS_ORDER_HISTORY.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_PARTS_ORDER_HISTORY.FAILURE, payload: { ...error } } }
}
