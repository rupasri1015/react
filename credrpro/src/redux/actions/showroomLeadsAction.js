import { SHOWROOM_LEADS } from '../../core/constants/actions'
import { getShowroomLeads } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getCityID } from '../../core/services/rbacServices'
import { userTypeDetails } from '../../core/services/authenticationServices';

export function getShowRoomLeads(payload = { pageNum: 1, storeID: userTypeDetails().userType.storeId, cityID: getCityID()}) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getShowroomLeads(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { storeLead, count } = apiResponse
          const { pageNum} = payload
          dispatch(success({ storeLead, count, pageNum }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: SHOWROOM_LEADS.REQUEST } }
  function success(storeLeads) { return { type: SHOWROOM_LEADS.SUCCESS, payload: { ...storeLeads } } }
  function failure(error) { return { type: SHOWROOM_LEADS.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: SHOWROOM_LEADS.RESET }
}