import { VALUATOR_LIST_ACTION } from '../../core/constants/actions';
import { listValuators } from '../../core/services/valuatorServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getValuatorList(payload = { pageNum: 1, userType: "valuator" }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return listValuators(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { userList: valuatorList, count } = apiResponse
          const { pageNum: page } = payload
          dispatch(success({ valuatorList, count, page }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: VALUATOR_LIST_ACTION.REQUEST } }
  function success(allInventory) { return { type: VALUATOR_LIST_ACTION.SUCCESS, payload: { ...allInventory } } }
  function failure(error) { return { type: VALUATOR_LIST_ACTION.FAILURE, payload: { ...error } } }
}
export function resetValuatorList() {
  return { type: VALUATOR_LIST_ACTION.RESET }
}