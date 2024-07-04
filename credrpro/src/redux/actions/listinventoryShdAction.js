import { LIST_INVENTORY_SHD_ACTION } from '../../core/constants/actions'
import { listInventoryByStatus } from '../../core/services/inventoryServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getInventoryByStatusShd(payload = { page: 1, status: 'pending', isShdBike: true }) {
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

  function request() { return { type: LIST_INVENTORY_SHD_ACTION.REQUEST } }
  function success(allInventory) { return { type: LIST_INVENTORY_SHD_ACTION.SUCCESS, payload: { ...allInventory } } }
  function failure(error) { return { type: LIST_INVENTORY_SHD_ACTION.FAILURE, payload: { ...error } } }
}

export function resetInventoryByStatusShd() {
  return { type: LIST_INVENTORY_SHD_ACTION.RESET }
}