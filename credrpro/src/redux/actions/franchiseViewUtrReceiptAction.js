import { getViewUtrReceipt } from '../../core/services/franchiseServices'
import { FRANCHISE_VIEWUTRRECEIPT_INVENTORY } from '../../core/constants/actions'
import { setNotification } from './notificationAction'

export function viewUtrReceipt(orderID) {
  return dispatch => {
    dispatch(request())
    return getViewUtrReceipt(orderID)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { viewUtrReceipt } = uploadImages
          dispatch(success({ viewUtrReceipt }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
      })
  }
  function request() { return { type: FRANCHISE_VIEWUTRRECEIPT_INVENTORY.REQUEST } }
  function success(viewUtrReceipt) { return { type: FRANCHISE_VIEWUTRRECEIPT_INVENTORY.SUCCESS, payload: { ...viewUtrReceipt } } }
  function failure(error) { return { type: FRANCHISE_VIEWUTRRECEIPT_INVENTORY.FAILURE, payload: { ...error } } }
}

export function resetViewUTRReceipt() {
  return { type: FRANCHISE_VIEWUTRRECEIPT_INVENTORY.RESET }
}