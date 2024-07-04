import { PRIMARY_SALES_ACTION_CMS } from '../../core/constants/actions'
import { cmsData } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getCmsData(payload = { pageNum: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return cmsData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { cmsBikeList, count } = apiResponse
          const { pageNum } = payload
          dispatch(success({ cmsBikeList, count, pageNum }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: PRIMARY_SALES_ACTION_CMS.REQUEST } }
  function success(cmsDataa) { return { type: PRIMARY_SALES_ACTION_CMS.SUCCESS, payload: { ...cmsDataa } } }
  function failure(error) { return { type: PRIMARY_SALES_ACTION_CMS.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: PRIMARY_SALES_ACTION_CMS.RESET }
}