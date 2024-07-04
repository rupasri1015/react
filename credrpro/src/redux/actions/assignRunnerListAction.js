import { ASSIGN_RUNNER_ACTION } from '../../core/constants/actions'
import { assignRunner } from '../../core/services/logisticServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getRunnerData(payload = { pageNumber: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return assignRunner(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { coordinatorLead, count } = apiResponse
          const { pageNumber } = payload
          dispatch(success({ coordinatorLead, count, pageNumber }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: ASSIGN_RUNNER_ACTION.REQUEST } }
  function success(allRunnerList) { return { type: ASSIGN_RUNNER_ACTION.SUCCESS, payload: { ...allRunnerList } } }
  function failure(error) { return { type: ASSIGN_RUNNER_ACTION.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: ASSIGN_RUNNER_ACTION.RESET }
}