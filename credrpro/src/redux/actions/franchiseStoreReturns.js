import { FETCH_FSM_RETURNS } from '../../core/constants/actions';
import { getEligibleReturnBikes } from '../../core/services/franchiseServices';
import { userTypeDetails } from '../../core/services/authenticationServices';
import { hideLoader, showLoader } from './loaderAction';
import { setNotification } from './notificationAction';

export function fetchFSMReturns(filterObj, pageNumber) {
	const userDetails = userTypeDetails();

	const body = {
		filter: filterObj,
		pageNumber,
		userID: Number(userDetails.userType.id),
		userType: userDetails.userType.userType,
		storeId: Number(userDetails.storeId)
	};
	return (dispatch) => {
		dispatch(request());
		dispatch(showLoader());
		return getEligibleReturnBikes(body).then((apiResponse) => {
			if (apiResponse.isValid) {
				const { bikeDetails, totalRecords, pageNumber, totalPages } = apiResponse;
				dispatch(success({ bikeDetails, count: totalRecords, pageNumber, totalPages }));
			} else {
				dispatch(failure({ error: apiResponse.message }));
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	};

	function request() {
		return { type: FETCH_FSM_RETURNS.REQUEST, payload: { updateList: false } };
	}
	function success(franchiseSales) {
		return { type: FETCH_FSM_RETURNS.SUCCESS, payload: { ...franchiseSales, updateList: false } };
	}
	function failure(error) {
		return { type: FETCH_FSM_RETURNS.FAILURE, payload: { ...error } };
	}
}
