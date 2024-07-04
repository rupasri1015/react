import { QUOTE_CONFIRMATION } from '../../core/constants/actions'
import { getCareConfirmationList } from '../../core/services/shdServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getConfirmationList(payload = { pageNum: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getCareConfirmationList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { shdCommissionList, count } = apiResponse
          const { pageNum } = payload
          dispatch(success({ shdCommissionList, count, pageNum }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: QUOTE_CONFIRMATION.REQUEST } }
  function success(shdCommissionList) { return { type: QUOTE_CONFIRMATION.SUCCESS, payload: { ...shdCommissionList } } }
  function failure(error) { return { type: QUOTE_CONFIRMATION.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: QUOTE_CONFIRMATION.RESET }
}