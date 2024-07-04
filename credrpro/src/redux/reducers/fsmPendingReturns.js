import { FETCH_FSM_PENDING_RETURNS } from '../../core/constants/actions';
import { getNewState } from '../../core/utility';

const initialState = {
	pendingReturns: [],
	count: 0,
	isLoading: false,
	pageNum: 1,
	pageSize: 0,
	error: false
};

export default function fsmPendingReturns(state = initialState, action) {
	switch (action.type) {
		case FETCH_FSM_PENDING_RETURNS.REQUEST:
			return getNewState(state, { isLoading: true });

		case FETCH_FSM_PENDING_RETURNS.SUCCESS:
			const { resultSet, resultCount, pageSize, pagesCount, pageNumber } = action.payload;
			return getNewState(state, {
				pendingReturns: resultSet,
				count: resultCount,
				pageSize,
				pagesCount,
				pageNum: pageNumber,
				isLoading: false,
				error: false
			});

		case FETCH_FSM_PENDING_RETURNS.FAILURE:
			const { error } = action.payload;
			return getNewState(state, { error, ...initialState });

		case FETCH_FSM_PENDING_RETURNS.UPDATE_RETURN_REQUEST: {
			const { pendingReturns } = action.payload;

			return getNewState(state, {
				pendingReturns,
			});
		}

		case FETCH_FSM_PENDING_RETURNS.RESET:
			return initialState;

		default:
			return state;
	}
}
