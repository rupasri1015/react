import { GET_SPAREPARTS_ASSIGNMENT } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getSparePartsAssignmentTableData } from '../../core/services/sparePartsAssignmentServices'
import { getWarehouseID } from '../../core/services/rbacServices';

export function getSparePartsAssignmentData(payload = {
  pageNumber: 1,
  fromDate: '',
	toDate: '',
  serviceCenterName: '',
  warehouseId: getWarehouseID(),
  searchText: '',
  status: 'all'
  }) {

  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getSparePartsAssignmentTableData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
					const {
            pageNumber,
            fromDate,
            toDate,
            serviceCenterName,
            warehouseName,
            searchText,
            status
          } = payload;
          const { data, message, totalPages, tabs } = apiResponse;
          dispatch(success({
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
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }


	function request() { return { type: GET_SPAREPARTS_ASSIGNMENT.REQUEST } }
  function success(payload) { return { type: GET_SPAREPARTS_ASSIGNMENT.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_SPAREPARTS_ASSIGNMENT.FAILURE, payload: { ...error } } }
}

export function setWareHouseId({ warehouseId }) {
  return {
    type: GET_SPAREPARTS_ASSIGNMENT.SET_WAREHOUSE_ID,
    payload: { warehouseId }
  }
}

export function setServiceCenterName({ serviceCenterName }) {
  return {
    type: GET_SPAREPARTS_ASSIGNMENT.SET_SERVICE_CENTER_NAME,
    payload: { serviceCenterName }
  }
}

export default { getSparePartsAssignmentData, setWareHouseId, setServiceCenterName };
