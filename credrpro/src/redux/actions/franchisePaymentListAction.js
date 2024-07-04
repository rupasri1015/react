import { FRANCHISE_PAYMENT_LIST } from '../../core/constants/actions'
import { getPaymentList } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getFranchisePaymentList(payload={page: 1, paymentstatus: "PENDING"}) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPaymentList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { franchiseBikesResponse : allOrderByCityID,count } = apiResponse
          const { page } = payload
          dispatch(success({ allOrderByCityID,count,page }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: FRANCHISE_PAYMENT_LIST.REQUEST } }
  function success(allOrderByCityID) { return { type: FRANCHISE_PAYMENT_LIST.SUCCESS, payload: { ...allOrderByCityID } } }
  function failure(error) { return { type: FRANCHISE_PAYMENT_LIST.FAILURE, payload: { ...error } } }
}

export function resetFranchisePaymentList() {
  return { type: FRANCHISE_PAYMENT_LIST }
}