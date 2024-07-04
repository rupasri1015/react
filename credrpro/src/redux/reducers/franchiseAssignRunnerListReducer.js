import { FRANCHISE_ASSIGN_RUNNER_LIST_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  vehicles: [],
  totalCount: 0,
  isLoading: false,
  pageNumber: 1,
}

export default function franchiseAssignRunnerReducer(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_ASSIGN_RUNNER_LIST_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_ASSIGN_RUNNER_LIST_ACTION.SUCCESS:
      const { vehicles, totalCount, pageNumber } = action.payload;
      return getNewState(state, { vehicles, totalCount, isLoading: false, pageNumber })

    case FRANCHISE_ASSIGN_RUNNER_LIST_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_ASSIGN_RUNNER_LIST_ACTION.RESET:
      return intialState

    default:
      return state
  }
}