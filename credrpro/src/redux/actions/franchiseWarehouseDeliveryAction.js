import { FRANCHISE_WAREHOUSE_DELIVERY_ACTION } from '../../core/constants/actions'
import { warehouseDelivery } from '../../core/services/franchiseLogisticsServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function geWarehouseData(payload = { pageNumber: 1, vehicleStatus: 'ALL', requestType: 'wareHouseDelivery', cityId: 1}) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return warehouseDelivery(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { vehicles, tabwiseCount, totalCount, deliveredCount, pendingConfirmationCount, 
            deliveryDisputeCount  } = apiResponse
          const { pageNumber } = payload
          dispatch(success({ vehicles, tabwiseCount, totalCount, pageNumber, deliveredCount, pendingConfirmationCount, 
            deliveryDisputeCount}))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: FRANCHISE_WAREHOUSE_DELIVERY_ACTION.REQUEST } }
  function success(allWarehouseData) { return { type: FRANCHISE_WAREHOUSE_DELIVERY_ACTION.SUCCESS, payload: { ...allWarehouseData } } }
  function failure(error) { return { type: FRANCHISE_WAREHOUSE_DELIVERY_ACTION.FAILURE, payload: { ...error } } }
}

export function resetWarehouseData() {
  return { type: FRANCHISE_WAREHOUSE_DELIVERY_ACTION.RESET }
}