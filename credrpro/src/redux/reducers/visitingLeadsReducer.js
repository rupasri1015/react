import { GET_VISIT_LEADS_BY_STORE_ID } from '../../core/constants/actions';
import { getNewState } from '../../core/utility';

const initialState = {
	visitingLeads: {
		data: [],
		loading: false,
		error: false
	}
};

export default function visitingLeadsReducer(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_VISIT_LEADS_BY_STORE_ID.REQUEST: {
			return getNewState(state, {
				visitingLeads: {
					...state.visitingLeads,
					loading: true
				}
			});
		}

    case GET_VISIT_LEADS_BY_STORE_ID.SUCCESS: {
      return getNewState(state, {
				visitingLeads: {
					...state.visitingLeads,
					loading: false,
          // TODO: Add data
          data: []
				}
			});
    }

    case GET_VISIT_LEADS_BY_STORE_ID.FAILURE: {
      return getNewState(state, {
				visitingLeads: {
					...state.visitingLeads,
					loading: false,
          error: true
				}
			});
    }

    default:
      return state;
	}
}
