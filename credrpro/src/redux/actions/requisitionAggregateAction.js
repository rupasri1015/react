import { GET_REQUISITION_AGGREGATE } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getRequisitionAggregateTableData } from '../../core/services/requisitionAggregateServices'
import { getWarehouseID } from '../../core/services/rbacServices';

export default function getRequisitionAggregateData(payload = {
  pageNumber: 1,
  warehouseId: getWarehouseID(),
  searchText: '',
  filter: '',
  }) {
  
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getRequisitionAggregateTableData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
					const { 
            pageNumber,
            warehouseId,
            searchText,
            filter,
          } = payload;
          const { data, message, totalPages } = apiResponse;
          
          dispatch(success({
            data,
            message,
            totalPages,
            pageNumber,
            warehouseId,
            searchText,
            filter,
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
	

	function request() { return { type: GET_REQUISITION_AGGREGATE.REQUEST } }
  function success(payload) { return { type: GET_REQUISITION_AGGREGATE.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_REQUISITION_AGGREGATE.FAILURE, payload: { ...error } } }
}
