import { PENDING_ASSIGN_INVENTORY } from '../../core/constants/actions'
import { pendingAssignList } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getPendingAssignList(payload) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return pendingAssignList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { franchiseBikesResponse: allOrderByCityID, count } = apiResponse
          const { page } = payload;
          dispatch(success({ allOrderByCityID, count, page }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: PENDING_ASSIGN_INVENTORY.REQUEST } }
  function success(pendingAssignList) { return { type: PENDING_ASSIGN_INVENTORY.SUCCESS, payload: { ...pendingAssignList } } }
  function failure(error) { return { type: PENDING_ASSIGN_INVENTORY.FAILURE, payload: { ...error } } }
}

export function resetInventoryList() {
  return { type: PENDING_ASSIGN_INVENTORY.RESET }
}
