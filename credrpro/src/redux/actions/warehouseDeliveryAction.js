import { WAREHOUSE_DELIVERY_ACTION } from '../../core/constants/actions'
import { listWarehouseDeliveries } from '../../core/services/logisticServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getWarehouseData(payload = { pageNum: 1, vehicleStatus: 'ALL' }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return listWarehouseDeliveries(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { pageNum } = payload
          const { vehicleStatus, allCount, delivered_confirm_pending, delivered, dispute, count, wareHouseTimeResponse } = apiResponse
          let response = { vehicleStatus, allCount, delivered_confirm_pending, delivered, dispute, count, pageNum }
          if (wareHouseTimeResponse) {
            const { between0to24, between24to48, between48to72, above72 } = wareHouseTimeResponse.interval
            response = { ...response, between0to24, between24to48, between48to72, above72 }
          }
          dispatch(success(response))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: WAREHOUSE_DELIVERY_ACTION.REQUEST } }
  function success(allWarehouseList) { return { type: WAREHOUSE_DELIVERY_ACTION.SUCCESS, payload: { ...allWarehouseList } } }
  function failure(error) { return { type: WAREHOUSE_DELIVERY_ACTION.FAILURE, payload: { ...error } } }
}

export function resetWarehouseData() {
  return { type: WAREHOUSE_DELIVERY_ACTION.RESET }
}