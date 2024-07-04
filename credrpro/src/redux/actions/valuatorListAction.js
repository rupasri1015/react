import { valuatorList } from '../../core/services/miscServices'
import { VALUATOR_LIST_ACTION } from '../../core/constants/actions'

export function getAllValuator(payload = {}) {
  return dispatch => {
    dispatch(request())
    return valuatorList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { valuatorDetails } = apiResponse
          dispatch(success({
            valuatorDetails
          }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
        }
      })
  }

  function request() { return { type: VALUATOR_LIST_ACTION.REQUEST } }
  function success(valuatorDetails) { return { type: VALUATOR_LIST_ACTION.SUCCESS, payload: { ...valuatorDetails } } }
  function failure(error) { return { type: VALUATOR_LIST_ACTION.FAILURE, payload: { ...error } } }
}