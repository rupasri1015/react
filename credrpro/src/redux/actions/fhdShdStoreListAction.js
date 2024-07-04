import { listStoresFhdShd } from '../../core/services/miscServices'
import { FHD_SHD_STORES_ACTION } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function fhdShdStores(payload = {}) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return listStoresFhdShd(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { storeListByCityId } = apiResponse
          dispatch(success({
            storeListByCityId
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: FHD_SHD_STORES_ACTION.REQUEST } }
  function success(storeListByCityId) { return { type: FHD_SHD_STORES_ACTION.SUCCESS, payload: { ...storeListByCityId } } }
  function failure(error) { return { type: FHD_SHD_STORES_ACTION.FAILURE, payload: { ...error } } }
}

export function resetFhdShdStores() {
  return { type: FHD_SHD_STORES_ACTION.RESET }
}