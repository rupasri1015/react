import { SHOWROOM_SALES } from '../../core/constants/actions'
import { getShowroomSales } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getStoreId } from '../../core/services/rbacServices'

export function getShowRoomSales(payload = { pageNum: 1, storeID: getStoreId(), paymentStatus: 'TOKEN' }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getShowroomSales(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { manageLeadsResponse, count } = apiResponse
          const { pageNum} = payload
          dispatch(success({ manageLeadsResponse, count, pageNum }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: SHOWROOM_SALES.REQUEST } }
  function success(storeSales) { return { type: SHOWROOM_SALES.SUCCESS, payload: { ...storeSales } } }
  function failure(error) { return { type: SHOWROOM_SALES.FAILURE, payload: { ...error } } }
}

export function resetRunnerList() {
  return { type: SHOWROOM_SALES.RESET }
}