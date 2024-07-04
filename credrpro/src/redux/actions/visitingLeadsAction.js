import { getVisitingLeads as getVisitingLeadsService } from '../../core/services/salesStoreServices'
import { GET_VISIT_LEADS_BY_STORE_ID } from '../../core/constants/actions'
import { setNotification } from './notificationAction'
import { showLoader, hideLoader } from './loaderAction'

export function getVisitingLeads(payload) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getVisitingLeadsService(payload)
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
  function request() { return { type: GET_VISIT_LEADS_BY_STORE_ID.REQUEST } }
  function success(leadInfo) { return { type: GET_VISIT_LEADS_BY_STORE_ID.SUCCESS, payload: { ...leadInfo } } }
  function failure(error) { return { type: GET_VISIT_LEADS_BY_STORE_ID.FAILURE, payload: { ...error } } }
}

export function resetBiddingLead() {
  return { type: GET_VISIT_LEADS_BY_STORE_ID.RESET }
}
