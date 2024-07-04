import { STORE_LIST_ACTION } from '../../core/constants/actions'
import { listStores } from '../../core/services/miscServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getStoresList(cityId = 0, showLoading = true) {
  return dispatch => {
    dispatch(request())
    if (showLoading) dispatch(showLoader())
    return listStores(cityId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { storeListByCityId } = apiResponse
          dispatch(success({ storeListByCityId }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: STORE_LIST_ACTION.REQUEST } }
  function success(storeList) { return { type: STORE_LIST_ACTION.SUCCESS, payload: { ...storeList } } }
  function failure(error) { return { type: STORE_LIST_ACTION.FAILURE, payload: { ...error } } }
}

export function resetStoreList() {
  return { type: STORE_LIST_ACTION.RESET }
}