import { LOGISTICS_IN_CUSTODY } from '../../core/constants/actions'
import { getInCustodyData } from '../../core/services/logisticServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getIncustodyList(payload = { }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getInCustodyData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { inCustResponse, count, pendingCount, adiyCompletedCount } = apiResponse
          const { pageNum } = payload
          dispatch(success({ inCustResponse, count, pageNum, pendingCount, adiyCompletedCount }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: LOGISTICS_IN_CUSTODY.REQUEST } }
  function success(allFranchiseLeads) { return { type: LOGISTICS_IN_CUSTODY.SUCCESS, payload: { ...allFranchiseLeads } } }
  function failure(error) { return { type: LOGISTICS_IN_CUSTODY.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: LOGISTICS_IN_CUSTODY.RESET }
}