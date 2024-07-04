import qs from 'qs';
import { FETCH_FRANCHISE_RETURNS_LIST } from '../../core/constants/actions';
import { getReturnsList, updateReturnRequestStatus } from '../../core/services/franchiseServices';
import { userTypeDetails } from '../../core/services/authenticationServices';
import { getRole } from '../../core/services/rbacServices';
import { hideLoader, showLoader } from './loaderAction';
import { setNotification } from './notificationAction';

export function fetchFranchiseReturnsList(payload) {
  const userDetails = userTypeDetails();
	const queryParamsStr = Object.keys(payload)
	  ? qs.stringify(
			{
				cityId: getRole() === 'Franchise_ops_manager' ? userDetails.userType.userCityList : undefined,
				...payload
			},
			{ encode: true })
		: null;

	return (dispatch) => {
		dispatch(request());
		dispatch(showLoader());
		return getReturnsList(queryParamsStr).then((apiResponse) => {
			const { resultSet, valid, resultCount, pageSize, pagesCount, pageNumber } = apiResponse;
			if (valid) {
				dispatch(success({ resultSet, resultCount, pageSize, pagesCount, pageNumber }));
			} else {
				dispatch(failure({ error: apiResponse.message }));
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	};

	function request() {
		return { type: FETCH_FRANCHISE_RETURNS_LIST.REQUEST };
	}
	function success(pendingReturns) {
		return { type: FETCH_FRANCHISE_RETURNS_LIST.SUCCESS, payload: pendingReturns };
	}
	function failure(error) {
		return { type: FETCH_FRANCHISE_RETURNS_LIST.FAILURE, payload: error };
	}
}

export function approveReturn(payload) {
	return (dispatch, getState) => {
		dispatch(showLoader());
		return updateReturnRequestStatus(payload.item).then((apiResponse) => {
			const { valid, resultSet } = apiResponse;
			const { franchiseReturns: { returnsList } } = getState();
      if (valid) {
				// If Reject happened other than 'Approve'
				// then don't show that record in that filter
				let newReturnsList = returnsList.filter((item) => item.id !== payload.item.id);

				// If activeFilter (All, Inspection and etc) is 'all' then view the updated record in the table
				if (payload.activeFilter === 'all') newReturnsList = [resultSet, ...returnsList];

				dispatch(success({ returnsList: newReturnsList }));
			} else {
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	}

	function success(returnsList) {
		return { type: FETCH_FRANCHISE_RETURNS_LIST.APPROVE_RETURN, payload: returnsList }
	}
}

export function rejectReturn(payload) {
	return (dispatch, getState) => {
		dispatch(showLoader());
		return updateReturnRequestStatus(payload.item).then((apiResponse) => {
			const { valid, resultSet } = apiResponse;
			const { franchiseReturns: { returnsList } } = getState();
      if (valid) {
				// If Reject happened other than 'Rejected'
				// then don't show that record in that filter
				let newReturnsList = returnsList.filter((item) => item.id !== payload.item.id);

				// If activeFilter (All, Inspection and etc) is 'all' then view the updated record in the table
				if (payload.activeFilter === 'all') newReturnsList = [resultSet, ...returnsList];

				dispatch(success({ returnsList: newReturnsList }));
			} else
					dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			dispatch(hideLoader());
		});
	}

	function success(returnsList) {
		return { type: FETCH_FRANCHISE_RETURNS_LIST.REJECT_RETURN, payload: returnsList }
	}
}
