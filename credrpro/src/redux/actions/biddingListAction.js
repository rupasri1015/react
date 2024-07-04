import { getBiddingList } from '../../core/services/biddingServices'
import { GET_BIDDING_LIST } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function biddingList(payload = { pageNum: 1, status: 'ALL' }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getBiddingList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const {
            valuatorAuctionList: bidList,
            ongoingCount,
            followUpCount,
            exchangeCount,
            droppedCount,
            auctionCompletedCount,
            centralTagInspectedCount,
            count
          } = apiResponse
          const { pageNum } = payload
          dispatch(success({
            bidList, ongoingCount, followUpCount, exchangeCount, droppedCount, count, pageNum, auctionCompletedCount, centralTagInspectedCount
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: GET_BIDDING_LIST.REQUEST } }
  function success(bidList) { return { type: GET_BIDDING_LIST.SUCCESS, payload: { ...bidList } } }
  function failure(error) { return { type: GET_BIDDING_LIST.FAILURE, payload: { ...error } } }
}

export function resetBiddingList() {
  return { type: GET_BIDDING_LIST.RESET }
}