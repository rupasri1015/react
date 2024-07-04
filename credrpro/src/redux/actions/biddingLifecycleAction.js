import { getLeadLifecycleDetails } from '../../core/services/biddingServices'
import { GET_LEAD_LIFECYCLE_DETAILS } from '../../core/constants/actions'
import { setNotification } from './notificationAction'
import { showLoader, hideLoader } from './loaderAction'

export function leadLifecycleDetails(leadId) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getLeadLifecycleDetails(leadId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { leadLifeCycleResponseBean } = apiResponse
          dispatch(success({ leadLifeCycleResponseBean }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: GET_LEAD_LIFECYCLE_DETAILS.REQUEST } }
  function success(leadLifeCycleResponseBean) { return { type: GET_LEAD_LIFECYCLE_DETAILS.SUCCESS, payload: { ...leadLifeCycleResponseBean } } }
  function failure(error) { return { type: GET_LEAD_LIFECYCLE_DETAILS.FAILURE, payload: { ...error } } }
}

export function resetBiddingLead() {
  return { type: GET_LEAD_LIFECYCLE_DETAILS.RESET }
}