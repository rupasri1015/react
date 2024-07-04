import { SHOWROOM_PAYMENTS_HISTORY } from '../../core/constants/actions'
import { getPaymentsHistory } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getStoreId } from '../../core/services/rbacServices'

export function getShowroomPaymentsHistory(payload = { }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPaymentsHistory(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { transactionHistory, count, walletAmount, storeAmount } = apiResponse
          const { pageNum } = payload
          dispatch(success({ transactionHistory, count, pageNum, walletAmount, storeAmount }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: SHOWROOM_PAYMENTS_HISTORY.REQUEST } }
  function success(paymentsHistory) { return { type: SHOWROOM_PAYMENTS_HISTORY.SUCCESS, payload: { ...paymentsHistory } } }
  function failure(error) { return { type: SHOWROOM_PAYMENTS_HISTORY.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: SHOWROOM_PAYMENTS_HISTORY.RESET }
}