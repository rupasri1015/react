import { GET_VENDOR_MANAGEMENT } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getVendorManagementTableData } from '../../core/services/vendorManagementServices'
import { getWarehouseID } from '../../core/services/rbacServices';

export default function getVendorManagementData(payload = {
  pageNumber: 1,
  filter: '',
  searchText: '',
  warehouseId: getWarehouseID(),
  }) {
	const filter = payload.filter,
  searchText  = payload.searchText;
  
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getVendorManagementTableData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
					const { pageNumber, warehouseId } = payload;
          const { data, message, totalPages } = apiResponse;
          dispatch(success({
						data, message, pageNumber, filter, searchText, totalPages, warehouseId
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
	

	function request() { return { type: GET_VENDOR_MANAGEMENT.REQUEST } }
  function success(payload) { return { type: GET_VENDOR_MANAGEMENT.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_VENDOR_MANAGEMENT.FAILURE, payload: { ...error } } }
}
