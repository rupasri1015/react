import { getOutletProf } from '../../core/services/performanceDashboard'
import { OUTLET_RESULT } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getUserID } from '../../core/services/rbacServices'

export function outletProf(payload = { pageNumber: 1, userId: `${getUserID()}` }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getOutletProf(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const outletProfList = apiResponse.outletCount.ouletPerformanceResponseBean
          const outletProfCount = apiResponse.outletCount
          dispatch(success({
            outletProfList, outletProfCount
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: OUTLET_RESULT.REQUEST } }
  function success(outletProfList) { return { type: OUTLET_RESULT.SUCCESS, payload: { ...outletProfList } } }
  function failure(error) { return { type: OUTLET_RESULT.FAILURE, payload: { ...error } } }
}
