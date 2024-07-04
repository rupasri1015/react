import { FRANCHISE_VEHICLE_STATUS_ACTION } from '../../core/constants/actions'
import { vehicleStatus } from '../../core/services/franchiseLogisticsServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getVehicleStatusData(payload = { pageNumber: 1, vehicleStatus: 'ALL' }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return vehicleStatus(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { vehicles, totalCount, assignedCount, deliveredCount, deliveryDisputeCount, 
            inTransitCount, pendingAssignmentCount, pendingConfirmationCount, pendingPickupCount, pickupDisputeCount } = apiResponse
          const { pageNumber } = payload
          dispatch(success({ vehicles, pageNumber, totalCount, assignedCount, deliveredCount, deliveryDisputeCount, 
            inTransitCount, pendingAssignmentCount, pendingConfirmationCount, pendingPickupCount, pickupDisputeCount }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: FRANCHISE_VEHICLE_STATUS_ACTION.REQUEST } }
  function success(allVehicleStatus) { return { type: FRANCHISE_VEHICLE_STATUS_ACTION.SUCCESS, payload: { ...allVehicleStatus } } }
  function failure(error) { return { type: FRANCHISE_VEHICLE_STATUS_ACTION.FAILURE, payload: { ...error } } }
}

export function resetVehicleStatus() {
  return { type: FRANCHISE_VEHICLE_STATUS_ACTION.RESET }
}