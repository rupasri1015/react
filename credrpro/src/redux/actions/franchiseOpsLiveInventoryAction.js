import { FRANCHISE_LIVE_INVENTORY } from '../../core/constants/actions'
import { franchiseLiveInventoryList } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function liveInventoryList(payload = {}) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return franchiseLiveInventoryList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { franchiseBikesResponse :allOrderByCityID, count } = apiResponse
          const { page } = payload
          dispatch(success({ allOrderByCityID, count, page }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: FRANCHISE_LIVE_INVENTORY.REQUEST } }
  function success(franchiseLiveInventoryList) { return { type: FRANCHISE_LIVE_INVENTORY.SUCCESS, payload: { ...franchiseLiveInventoryList } } }
  function failure(error) { return { type: FRANCHISE_LIVE_INVENTORY.FAILURE, payload: { ...error } } }
}

export function resetInventoryList() {
  return { type: FRANCHISE_LIVE_INVENTORY.RESET }
}