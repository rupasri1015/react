import { FRANCHISE_STORE_LEADS } from '../../core/constants/actions'
import { getFranchiseLeads } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getStoreLeads(payload = { }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getFranchiseLeads(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { storeLead, count } = apiResponse
          const { pageNum,orderType } = payload
          dispatch(success({ storeLead, count, pageNum,orderType }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: FRANCHISE_STORE_LEADS.REQUEST } }
  function success(allFranchiseLeads) { return { type: FRANCHISE_STORE_LEADS.SUCCESS, payload: { ...allFranchiseLeads } } }
  function failure(error) { return { type: FRANCHISE_STORE_LEADS.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: FRANCHISE_STORE_LEADS.RESET }
}