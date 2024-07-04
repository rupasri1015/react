import { ASSIGN_RUNNER_ACTION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  coordinatorLead: [],
  count: 0,
  isLoading: false,
  pageNumber: 1,
}

export default function assignRunnerReducer(state = intialState, action) {

  switch (action.type) {
    case ASSIGN_RUNNER_ACTION.REQUEST:
      return getNewState(state, { isLoading: true })

    case ASSIGN_RUNNER_ACTION.SUCCESS:
      const { coordinatorLead, count, pageNumber } = action.payload;
      return getNewState(state, { coordinatorLead, count, isLoading: false, pageNumber })

    case ASSIGN_RUNNER_ACTION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case ASSIGN_RUNNER_ACTION.RESET:
      return intialState

    default:
      return state
  }
}