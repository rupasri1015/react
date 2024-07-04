import { PUBLISH_INVENTORY_LIST_ACTION } from '../../core/constants/actions'
import { listInventoryByStatus } from '../../core/services/inventoryServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getInventoryByStatus(payload = { page: 1, status: 'pending' }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return listInventoryByStatus(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { inventoryList, count } = apiResponse
          const { page } = payload
          dispatch(success({ inventoryList, count, page }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: PUBLISH_INVENTORY_LIST_ACTION.REQUEST } }
  function success(allInventory) { return { type: PUBLISH_INVENTORY_LIST_ACTION.SUCCESS, payload: { ...allInventory } } }
  function failure(error) { return { type: PUBLISH_INVENTORY_LIST_ACTION.FAILURE, payload: { ...error } } }
}

export function resetInvetory() {
  return { type: PUBLISH_INVENTORY_LIST_ACTION.RESET }
}