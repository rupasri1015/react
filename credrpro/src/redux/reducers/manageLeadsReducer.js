import { FRANCHISE_STORE_LEADS } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  storeLeads: [],
  count: 0,
  isLoading: false,
  pageNum: 1,
}

export default function manageLeadsReducer(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_STORE_LEADS.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_STORE_LEADS.SUCCESS:
      const { storeLead: storeLeads , count, pageNum,orderType } = action.payload;
      return getNewState(state, { storeLeads, count, isLoading: false, pageNum,orderType })

    case FRANCHISE_STORE_LEADS.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_STORE_LEADS.RESET:
      return intialState

    default:
      return state
  }
}