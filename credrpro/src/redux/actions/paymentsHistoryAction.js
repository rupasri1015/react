import { PAYMENTS_HISTORY } from '../../core/constants/actions'
import { getPaymentsHistory } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getStoreId } from '../../core/services/rbacServices'

export function getPaymentsHistoryByShowroom(payload = { pageNum: 1, storeID: [getStoreId()] }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPaymentsHistory(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { transactionHistory, count } = apiResponse
          const { pageNum} = payload
          dispatch(success({ transactionHistory, count, pageNum }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: PAYMENTS_HISTORY.REQUEST } }
  function success(transactionHistory) { return { type: PAYMENTS_HISTORY.SUCCESS, payload: { ...transactionHistory } } }
  function failure(error) { return { type: PAYMENTS_HISTORY.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: PAYMENTS_HISTORY.RESET }
}