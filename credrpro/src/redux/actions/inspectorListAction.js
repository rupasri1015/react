import { INSPECTOR_LIST_ACTION } from '../../core/constants/actions'
import { listInspectors } from '../../core/services/miscServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getInspectorsList(cityId = 0, showLoading = true) {
  return dispatch => {
    dispatch(request())
    if (showLoading) dispatch(showLoader())
    return listInspectors(cityId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { inspectorList } = apiResponse
          dispatch(success({ inspectorList }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: INSPECTOR_LIST_ACTION.REQUEST } }
  function success(inspectorList) { return { type: INSPECTOR_LIST_ACTION.SUCCESS, payload: { ...inspectorList } } }
  function failure(error) { return { type: INSPECTOR_LIST_ACTION.FAILURE, payload: { ...error } } }
}

export function resetInspectorList() {
  return { type: INSPECTOR_LIST_ACTION.RESET }
}