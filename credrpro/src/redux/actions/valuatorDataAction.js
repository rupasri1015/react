import { getValuatorData } from '../../core/services/performanceDashboard'
import { VALUATOR_DATA } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function valuatorProf(payload = { pageNumber: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getValuatorData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const valuatorProfList = apiResponse.valuatorPerformanceResponseBean
          dispatch(success({
            valuatorProfList
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: VALUATOR_DATA.REQUEST } }
  function success(valuatorProfList) { return { type: VALUATOR_DATA.SUCCESS, payload: { ...valuatorProfList } } }
  function failure(error) { return { type: VALUATOR_DATA.FAILURE, payload: { ...error } } }
}
