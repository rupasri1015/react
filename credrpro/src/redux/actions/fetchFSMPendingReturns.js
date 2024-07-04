import qs from 'qs';
import { FETCH_FSM_PENDING_RETURNS } from '../../core/constants/actions';
import { getAllPendingReturns, updateReturnRequestStatus } from '../../core/services/franchiseServices';
import { storeDetails } from '../../core/services/authenticationServices';
import { hideLoader, showLoader } from './loaderAction';
import { setNotification } from './notificationAction';

export function fetchFSMPendingReturns(payload) {
	const queryParamsStr = qs.stringify(
		{
			storeId: storeDetails().storeId,
			...payload
		},
		{ encode: true }
	);

	return (dispatch) => {
		dispatch(request());
		dispatch(showLoader());
		return getAllPendingReturns(queryParamsStr).then((apiResponse) => {
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
		return { type: FETCH_FSM_PENDING_RETURNS.REQUEST };
	}
	function success(pendingReturns) {
		return { type: FETCH_FSM_PENDING_RETURNS.SUCCESS, payload: pendingReturns };
	}
	function failure(error) {
		return { type: FETCH_FSM_PENDING_RETURNS.FAILURE, payload: error };
	}
}

export function cancelPendingReturnRequest(payload) {
	return (dispatch, getState) => {
		dispatch(showLoader());
		return updateReturnRequestStatus(payload.item).then((apiResponse) => {
			const { valid, resultSet } = apiResponse;
			if (valid) {
				const { fsmPendingReturns: { pendingReturns } } = getState();
				let newPendingReturnsList = pendingReturns.filter((item) => item.id !== payload.item.id);

				if (payload.activeFilter === 'all') newPendingReturnsList = [resultSet, ...newPendingReturnsList];

				dispatch(createSuccess({ pendingReturns: newPendingReturnsList }));
			} else dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			dispatch(hideLoader());
		});
	}

	function createSuccess(pendingReturns) {
		return { type: FETCH_FSM_PENDING_RETURNS.UPDATE_RETURN_REQUEST, payload: pendingReturns }
	}
}

export function approveReturn(payload) {
	return (dispatch, getState) => {
		dispatch(showLoader());
		return updateReturnRequestStatus(payload.item).then((apiResponse) => {
			const { valid, resultSet } = apiResponse;
			const { fsmPendingReturns: { pendingReturns } } = getState();
      if (valid) {
				let newReturnsList = pendingReturns.filter((item) => item.id !== payload.item.id);

				dispatch(success({ pendingReturns: [resultSet, ...newReturnsList] }));
			} else {
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	}

	function success(pendingReturns) {
		return { type: FETCH_FSM_PENDING_RETURNS.UPDATE_RETURN_REQUEST, payload: pendingReturns }
	}
}

export function rejectReturn(payload) {
	return (dispatch, getState) => {
		dispatch(showLoader());
		return updateReturnRequestStatus(payload.item).then((apiResponse) => {
			const { valid, resultSet } = apiResponse;
			const { fsmPendingReturns: { pendingReturns } } = getState();
      if (valid) {
				// If Reject happened other than 'Rejected'
				// then don't show that record in that filter
				let newReturnsList = pendingReturns.filter((item) => item.id !== payload.item.id);

				// If activeFilter (All, Inspection and etc) is 'all' then view the updated record in the table
				if (payload.activeFilter === 'all') newReturnsList = [resultSet, ...newReturnsList];

				dispatch(success({ pendingReturns: newReturnsList }));
			} else
					dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			dispatch(hideLoader());
		});
	}

	function success(pendingReturns) {
		return { type: FETCH_FSM_PENDING_RETURNS.UPDATE_RETURN_REQUEST, payload: pendingReturns }
	}
}
