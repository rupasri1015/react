import { FETCH_FSM_RETURNS } from '../../core/constants/actions';
import { getNewState } from '../../core/utility';

const initialState = {
	bikeDetails: [],
	count: 0,
	isLoading: false,
	pageNumber: 1,
	totalPages: 0
};

export default function franchiseFSMReturnsReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_FSM_RETURNS.REQUEST:
			return getNewState(state, { isLoading: true });

		case FETCH_FSM_RETURNS.SUCCESS: {
			const { bikeDetails, count, pageNumber, totalPages } = action.payload;
			return getNewState(state, { bikeDetails, count, pageNumber, totalPages, isLoading: false });
		}

		case FETCH_FSM_RETURNS.FAILURE:
			const { error } = action.payload;
			return getNewState(initialState);

		case FETCH_FSM_RETURNS.CREATE_RETURN_REQ_SUCCESS:
			const { bikeDetails } = action.payload;
			return getNewState(state, { bikeDetails, count: state.count - 1 });

		case FETCH_FSM_RETURNS.RESET:
			return initialState;

		default:
			return state;
	}
}
