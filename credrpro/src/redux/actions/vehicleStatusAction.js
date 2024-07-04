import { VEHICLE_STATUS_ACTION } from '../../core/constants/actions'
import { getVehicleStatus } from '../../core/services/logisticServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getVehicleData(payload = { pageNum: 1, vehicleStatus: 'ALL' }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getVehicleStatus(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { vehicleStatus, allCount, delivered, dispute, assigned, pending, delivered_confirm_pending, intrasist, rejected, unAssigned, pendingConfirmation, count, pickup_dispute, delivery_dispute } = apiResponse
          const { pageNum } = payload
          dispatch(success({ vehicleStatus, allCount, delivered, dispute, assigned, pending, intrasist, rejected, count, pageNum, pendingDelivery: delivered_confirm_pending, unAssigned, pendingConfirmation, pickup_dispute, delivery_dispute }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: VEHICLE_STATUS_ACTION.REQUEST } }
  function success(allvehicleList) { return { type: VEHICLE_STATUS_ACTION.SUCCESS, payload: { ...allvehicleList } } }
  function failure(error) { return { type: VEHICLE_STATUS_ACTION.FAILURE, payload: { ...error } } }
}

export function resetVehicleData() {
  return { type: VEHICLE_STATUS_ACTION.RESET }
}