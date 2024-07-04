import { FETCH_FRANCHISE_RETURNS_LIST } from '../../core/constants/actions';
import { getNewState } from '../../core/utility';

const initialState = {
	returnsList: [],
	count: 0,
	isLoading: false,
	pageNum: 1,
	pageSize: 0,
	error: false
};

export default function fetchReturnsListReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_FRANCHISE_RETURNS_LIST.REQUEST:
			return getNewState(state, { isLoading: true });

		case FETCH_FRANCHISE_RETURNS_LIST.SUCCESS:
			const { resultSet, resultCount, pageSize, pagesCount, pageNumber } = action.payload;

			return getNewState(state, {
				returnsList: resultSet,
				count: resultCount,
				pageSize,
				pagesCount,
				pageNum: pageNumber,
				isLoading: false,
				error: false
			});

		case FETCH_FRANCHISE_RETURNS_LIST.APPROVE_RETURN: {
			const { returnsList } = action.payload;

			return getNewState(state, {
				returnsList,
			});
		}

		case FETCH_FRANCHISE_RETURNS_LIST.REJECT_RETURN: {
			const { returnsList } = action.payload;

			return getNewState(state, {
				returnsList,
			});
		}

		case FETCH_FRANCHISE_RETURNS_LIST.FAILURE:
			const { error } = action.payload;
			return getNewState(state, { error, ...initialState });

		default:
			return state;
	}
}
