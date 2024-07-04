import { GET_BIDDING_LIST } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  biddingListParameters: [],
  onGoing: 0,
  followUp: 0,
  exchange: 0,
  drop: 0,
  auctionCompletedCount: 0,
  centralTagInspectedCount: 0,
  count: 0,
  pageNum: 1,
  isLoading: false
}

export default function biddingListReducer(state = intialState, action) {

  switch (action.type) {
    case GET_BIDDING_LIST.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_BIDDING_LIST.SUCCESS:
      const { bidList: biddingListParameters, count, ongoingCount: onGoing, followUpCount: followUp, exchangeCount: exchange, droppedCount: drop, pageNum, auctionCompletedCount, centralTagInspectedCount } = action.payload;
      return getNewState(state, { biddingListParameters, count, onGoing, followUp, exchange, drop, isLoading: false, pageNum, auctionCompletedCount, centralTagInspectedCount })

    case GET_BIDDING_LIST.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case GET_BIDDING_LIST.RESET:
      return intialState

    default:
      return state
  }
}   