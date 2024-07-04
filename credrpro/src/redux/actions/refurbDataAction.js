import { REFURB_DATA } from '../../core/constants/actions'
import { refurbData } from '../../core/services/refurbServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getRefurbdata(payload={pageNum: 1, refurbStatus: "QC_PENDING"}) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return refurbData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { refurbDashBoardResponse,refurbDashboardCount } = apiResponse
          const { allRefurbCount, pendingQcCount, refurbInProgressCount, oneAPassCount, alternateStockCount ,qcCompletedCount, dropCount} = refurbDashboardCount
          const { pageNum } = payload
          dispatch(success({
            refurbDashBoardResponse,
            count: allRefurbCount,
            pendingCount: pendingQcCount,
            refurbCount: refurbInProgressCount,
            oneAcount: oneAPassCount,
            alternateCount: alternateStockCount,
            qcCompletedCount:qcCompletedCount,
            dropCount: dropCount,
            pageNum
          }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: REFURB_DATA.REQUEST } }
  function success(refurbDashBoardResponse) { return { type: REFURB_DATA.SUCCESS, payload: { ...refurbDashBoardResponse } } }
  function failure(error) { return { type: REFURB_DATA.FAILURE, payload: { ...error } } }
}

export function resetRefurbData() {
  return { type: REFURB_DATA }
}