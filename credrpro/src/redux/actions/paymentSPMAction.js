import { GET_PAYMENT_SPM } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getPaymentSPMTableData } from '../../core/services/paymentSPMServices'
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';

export default function getPaymentSPMData(payload = {
  pageNumber: 1,
  fromDate: '',
  toDate: '',
  warehouseName: getWarehouseName(),
  warehouseId: getWarehouseID(),
  searchText: '',
  filter: '',
  status: 'All'
  }) {
  
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPaymentSPMTableData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
					const { 
            pageNumber,
            fromDate,
            toDate,
            warehouseName,
            warehouseId,
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
	

	function request() { return { type: GET_PAYMENT_SPM.REQUEST } }
  function success(payload) { return { type: GET_PAYMENT_SPM.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_PAYMENT_SPM.FAILURE, payload: { ...error } } }
}
