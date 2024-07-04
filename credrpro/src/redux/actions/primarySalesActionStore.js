import { PRIMARY_SALES_ACTION_STORE } from '../../core/constants/actions'
import { storeData } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getStoreData(payload = { pageNum: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return storeData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { saleDocumentResponse, count } = apiResponse
          const { pageNum } = payload
          dispatch(success({ saleDocumentResponse, count, pageNum }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: PRIMARY_SALES_ACTION_STORE.REQUEST } }
  function success(storeDataa) { return { type: PRIMARY_SALES_ACTION_STORE.SUCCESS, payload: { ...storeDataa } } }
  function failure(error) { return { type: PRIMARY_SALES_ACTION_STORE.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: PRIMARY_SALES_ACTION_STORE.RESET }
}