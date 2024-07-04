import { getPricingData } from '../../core/services/performanceDashboard'
import { PRICING_RESULT } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function pricingData(payload = {}) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPricingData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const pricingResult = apiResponse.pricePerformanceCountResponse.pricingPerformanceResponseBean
          const pricingCount = apiResponse.pricePerformanceCountResponse.count
          const allCounts = apiResponse.pricePerformanceCountResponse
          const { pageNumber } = payload
          dispatch(success({
            pricingResult, pricingCount, allCounts, pageNumber
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: PRICING_RESULT.REQUEST } }
  function success(pricingResult) { return { type: PRICING_RESULT.SUCCESS, payload: { ...pricingResult } } }
  function failure(error) { return { type: PRICING_RESULT.FAILURE, payload: { ...error } } }
}
