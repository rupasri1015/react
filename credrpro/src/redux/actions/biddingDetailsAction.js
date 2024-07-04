import { getLeadDetails } from '../../core/services/biddingServices'
import { GET_LEAD_DETAILS } from '../../core/constants/actions'
import { setNotification } from './notificationAction'
import { showLoader, hideLoader } from './loaderAction'

export function leadDetails(leadId) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getLeadDetails(leadId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { leadInfo } = apiResponse
          dispatch(success({ leadInfo }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: GET_LEAD_DETAILS.REQUEST } }
  function success(leadInfo) { return { type: GET_LEAD_DETAILS.SUCCESS, payload: { ...leadInfo } } }
  function failure(error) { return { type: GET_LEAD_DETAILS.FAILURE, payload: { ...error } } }
}

export function resetBiddingLead() {
  return { type: GET_LEAD_DETAILS.RESET }
}