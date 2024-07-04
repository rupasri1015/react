import { getNewState } from '../../core/utility'
import { ASSIGN_RUNNER_NEW } from '../../core/constants/actions'


const initialState = {
  data: [],
  resultCount: 0,
  pageNumber: 0,

  loading: {
    getAll: false
  },

  error: {
    getAll: false
  },

  // search, filters
}

export default function assignRunnerNew(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ASSIGN_RUNNER_NEW.GET_ALL_VEHICLES_REQUEST: {
      return getNewState(
        state,
        {
          loading: {
            ...state.loading,
            getAll: true
          }
        }
      )
    }

    case ASSIGN_RUNNER_NEW.GET_ALL_VEHICLES_SUCCESS: {
      const { pageNumber, pageSize, resultSet, resultCount } = payload;

      return getNewState(
        state,
        {
          loading: {
            ...state.loading,
            getAll: false
          },
          data: resultSet,
          resultCount,
          pageNumber,
          pageSize
        }
      )
    }

    case ASSIGN_RUNNER_NEW.GET_ALL_VEHICLES_FAILURE: {
      return getNewState(
        state,
        {
          loading: {
            ...state.loading,
            getAll: false
          },
          error: {
            ...state.error,
            getAll: true
          }
        }
      )
    }

    default:
			return state;
  }
}
