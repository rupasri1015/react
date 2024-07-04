import { getPaperTransformData } from '../../core/services/paperTransferService'
import { GET_PAPER_TRANSFER } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getPaperData(payload = { pageNum: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPaperTransformData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { ptListDetails, ptStatusCount } = apiResponse
          const { allCount, ptCollectedCount, ptPendingCount, ptRTOSubmittedCount, ptVaahanApprovedCount, ptDeliveredCount, ptTicketRaisedCount, ptReceivedCount } = ptStatusCount
          const { pageNum } = payload
          dispatch(success({
            ptListDetails,
            count: allCount,
            collectedCount: ptCollectedCount,
            pendingCount: ptPendingCount,
            rtoCount: ptRTOSubmittedCount,
            vahanCount: ptVaahanApprovedCount,
            deliveredCount: ptDeliveredCount,
            ticketCount: ptTicketRaisedCount,
            receivedCount: ptReceivedCount,
            pageNum
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: GET_PAPER_TRANSFER.REQUEST } }
  function success(getPaperList) { return { type: GET_PAPER_TRANSFER.SUCCESS, payload: { ...getPaperList } } }
  function failure(error) { return { type: GET_PAPER_TRANSFER.FAILURE, payload: { ...error } } }
}

export function resetPaperData() {
  return { type: GET_PAPER_TRANSFER.RESET }
}