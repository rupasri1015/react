import { POSTSALES_DOCUMENTATION_LEADS } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  documentsTransferList: [],
  count: 0,
  isLoading: false,
  page: 1,
}

export default function documentationLeadsReducer(state = intialState, action) {

  switch (action.type) {
    case POSTSALES_DOCUMENTATION_LEADS.REQUEST:
      return getNewState(state, { isLoading: true })

    case POSTSALES_DOCUMENTATION_LEADS.SUCCESS:
      const { documentsTransferList, count, page,orderBy } = action.payload;
      return getNewState(state, { documentsTransferList, count, isLoading: false, page,orderBy })

    case POSTSALES_DOCUMENTATION_LEADS.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case POSTSALES_DOCUMENTATION_LEADS.RESET:
      return intialState

    default:
      return state
  }
}