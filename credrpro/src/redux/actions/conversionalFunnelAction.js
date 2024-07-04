import { getConversionalData } from '../../core/services/performanceDashboard'
import { CONVERSIONAL_TAT_RESULT } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getUserID } from '../../core/services/rbacServices'

export function conversionalData(payload = { pageNumber: 1, userId: `${getUserID()}` }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getConversionalData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const fhdPerformanceResponse = apiResponse.fhdPerformanceResponse
          const performanceDashoboardCount = apiResponse.perCal
          dispatch(success({
            fhdPerformanceResponse, performanceDashoboardCount
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: CONVERSIONAL_TAT_RESULT.REQUEST } }
  function success(fhdPerformanceResponse) { return { type: CONVERSIONAL_TAT_RESULT.SUCCESS, payload: { ...fhdPerformanceResponse } } }
  function failure(error) { return { type: CONVERSIONAL_TAT_RESULT.FAILURE, payload: { ...error } } }
}
