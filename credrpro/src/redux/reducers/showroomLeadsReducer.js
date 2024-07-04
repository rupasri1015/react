import { SHOWROOM_LEADS } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  storeLead: [],
  isLoading: false,
  pageNum: 1,
  count: 0
}

export default function showroomLeadsReducer(state = intialState, action) {

  switch (action.type) {
    case SHOWROOM_LEADS.REQUEST:
      return getNewState(state, { isLoading: true })

    case SHOWROOM_LEADS.SUCCESS:
      const { storeLead, pageNum, count   } = action.payload;
      return getNewState(state, { storeLead, isLoading: false, pageNum, count  })

    case SHOWROOM_LEADS.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}