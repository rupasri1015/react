import { GET_BUFFER_PRICE_ONLINE } from '../../core/constants/actions'
import { getBufferPriceData } from '../../core/services/bufferSellServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getBufferPriceOnline(payload = { pageNumber: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getBufferPriceData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { data, count, leadStatus } = apiResponse
          const { pageNumber } = payload
          dispatch(success({ data, count, pageNumber, leadStatus }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: GET_BUFFER_PRICE_ONLINE.REQUEST } }
  function success(data) { return { type: GET_BUFFER_PRICE_ONLINE.SUCCESS, payload: { ...data } } }
  function failure(error) { return { type: GET_BUFFER_PRICE_ONLINE.FAILURE, payload: { ...error } } }
}

export function resetBufferPriceOnline() {
  return { type: GET_BUFFER_PRICE_ONLINE.RESET }
}