import { getOrderDeductions } from '../../core/services/shdServices'
import { SHD_ORDER_DEDUCTIONS } from '../../core/constants/actions'
import { setNotification } from './notificationAction'
import { showLoader, hideLoader } from './loaderAction'

export function getShdOrderDeduction(leadId) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getOrderDeductions(leadId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { orderDeductionsResponse } = apiResponse
          dispatch(success({ orderDeductionsResponse }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: SHD_ORDER_DEDUCTIONS.REQUEST } }
  function success(orderDeductionsResponse) { return { type: SHD_ORDER_DEDUCTIONS.SUCCESS, payload: { ...orderDeductionsResponse } } }
  function failure(error) { return { type: SHD_ORDER_DEDUCTIONS.FAILURE, payload: { ...error } } }
}

export function resetBiddingLead() {
  return { type: SHD_ORDER_DEDUCTIONS.RESET }
}