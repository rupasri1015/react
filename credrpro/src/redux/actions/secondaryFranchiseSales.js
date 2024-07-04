import { SECONDARY_SALES_FRANCHISE } from '../../core/constants/actions'
import { secondarySalesData } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getSecondarySalesData(payload = { pageNum: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return secondarySalesData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { salesDocumentForSecondaryFranchiseSales, count } = apiResponse
          const { pageNum } = payload
          dispatch(success({ salesDocumentForSecondaryFranchiseSales, count, pageNum }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: SECONDARY_SALES_FRANCHISE.REQUEST } }
  function success(cmsDataa) { return { type: SECONDARY_SALES_FRANCHISE.SUCCESS, payload: { ...cmsDataa } } }
  function failure(error) { return { type: SECONDARY_SALES_FRANCHISE.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: SECONDARY_SALES_FRANCHISE.RESET }
}