import { getDocumentQcList } from '../../core/services/documentQcServices'
import { GET_DOCUMENTQC_LIST } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getQcList(payload = { pageNum: 1 }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getDocumentQcList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { qcDashBoardList, qcDocStatusCount } = apiResponse
          const { allqcCount, pendingQcCount, approvedQcCount, disputeQcCount, rejectedQcCount, condApprovedQcCount, docReuploadedQcCount } = qcDocStatusCount
          const { pageNum } = payload
          dispatch(success({
            qcDashBoardList,
            count: allqcCount,
            pendingCount: pendingQcCount,
            approvedCount: approvedQcCount,
            disputeCount: disputeQcCount,
            rejectedCount: rejectedQcCount,
            conditionalCount: condApprovedQcCount,
            reuploadedCount: docReuploadedQcCount,
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

  function request() { return { type: GET_DOCUMENTQC_LIST.REQUEST } }
  function success(documentQcList) { return { type: GET_DOCUMENTQC_LIST.SUCCESS, payload: { ...documentQcList } } }
  function failure(error) { return { type: GET_DOCUMENTQC_LIST.FAILURE, payload: { ...error } } }
}

export function resetQcList() {
  return { type: GET_DOCUMENTQC_LIST.RESET }
}