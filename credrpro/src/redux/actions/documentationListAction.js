import { POSTSALES_DOCUMENTATION_LEADS } from '../../core/constants/actions'
import { getDocumentationLeads } from '../../core/services/postSalesServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getDocumentationList(payload = { page: 1, orderBy: 'desc' })  {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getDocumentationLeads(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { documentsTransferList,count } = apiResponse
          const {page,orderBy } = payload
          dispatch(success({ documentsTransferList, count, page,orderBy }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: POSTSALES_DOCUMENTATION_LEADS.REQUEST } }
  function success(documentationLead) { return { type: POSTSALES_DOCUMENTATION_LEADS.SUCCESS, payload: { ...documentationLead } } }
  function failure(error) { return { type: POSTSALES_DOCUMENTATION_LEADS.FAILURE, payload: { ...error } } }
}

export function resetDocumentationList() {
  return { type: POSTSALES_DOCUMENTATION_LEADS.RESET }
}