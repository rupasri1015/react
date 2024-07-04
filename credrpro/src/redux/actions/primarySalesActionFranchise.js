import { PRIMARY_SALES_ACTION_FRANCHISE } from '../../core/constants/actions'
import { franchiseData } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getFranchiseData(payload = { pageNum: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return franchiseData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { saleDocumentResponseFranchise, count } = apiResponse
          const { pageNum } = payload
          dispatch(success({ saleDocumentResponseFranchise, count, pageNum }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: PRIMARY_SALES_ACTION_FRANCHISE.REQUEST } }
  function success(franchiseDataa) { return { type: PRIMARY_SALES_ACTION_FRANCHISE.SUCCESS, payload: { ...franchiseDataa } } }
  function failure(error) { return { type: PRIMARY_SALES_ACTION_FRANCHISE.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: PRIMARY_SALES_ACTION_FRANCHISE.RESET }
}