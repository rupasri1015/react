import { FRANCHISE_STORES } from '../../core/constants/actions'
import { getFranchiseStores } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getStoresList(cityId = 0) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getFranchiseStores(cityId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { storesbyCityId } = apiResponse
          dispatch(success({ storesbyCityId }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: FRANCHISE_STORES.REQUEST } }
  function success(storeList) { return { type: FRANCHISE_STORES.SUCCESS, payload: { ...storeList } } }
  function failure(error) { return { type: FRANCHISE_STORES.FAILURE, payload: { ...error } } }
}

export function resetStoreList() {
  return { type: FRANCHISE_STORES.RESET }
}
