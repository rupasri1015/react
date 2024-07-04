import { FRANCHISE_ASSIGN_RUNNER_LIST_ACTION } from '../../core/constants/actions'
import { franchiseAssignRunner } from '../../core/services/franchiseLogisticsServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getFranchiseRunnerData(payload = { pageNumber: 1, vehicleStatus: 'ALL', requestType: 'assignRunner', cityId: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return franchiseAssignRunner(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { vehicles, totalCount } = apiResponse
          const { pageNumber } = payload
          dispatch(success({ vehicles, totalCount, pageNumber }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: FRANCHISE_ASSIGN_RUNNER_LIST_ACTION.REQUEST } }
  function success(allRunnerList) { return { type: FRANCHISE_ASSIGN_RUNNER_LIST_ACTION.SUCCESS, payload: { ...allRunnerList } } }
  function failure(error) { return { type: FRANCHISE_ASSIGN_RUNNER_LIST_ACTION.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: FRANCHISE_ASSIGN_RUNNER_LIST_ACTION.RESET }
}