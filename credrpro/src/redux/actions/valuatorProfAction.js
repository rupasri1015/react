import { getValuatorProf } from '../../core/services/performanceDashboard'
import { VALUATOR_RESULT } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getUserID } from '../../core/services/rbacServices'

export function valuatorProf(payload = { pageNumber: 1, userId: `${getUserID()}` }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getValuatorProf(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const valuatorProfList = apiResponse.valuatorPerformanceResponseBean
          const valuatorCount = apiResponse.valuatorPerfCountResponse
          dispatch(success({
            valuatorProfList, valuatorCount
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: VALUATOR_RESULT.REQUEST } }
  function success(valuatorProfList) { return { type: VALUATOR_RESULT.SUCCESS, payload: { ...valuatorProfList } } }
  function failure(error) { return { type: VALUATOR_RESULT.FAILURE, payload: { ...error } } }
}
