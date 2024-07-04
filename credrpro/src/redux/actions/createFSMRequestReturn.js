import { createRequestReturn } from '../../core/services/franchiseServices';
import { FETCH_FSM_RETURNS } from '../../core/constants/actions';
import { showLoader, hideLoader } from './loaderAction';
import { setNotification } from './notificationAction';

export function createFSMRequestReturn(payload, vehicleNumber) {
	return (dispatch, getState) => {
		dispatch(showLoader());
		return createRequestReturn(payload).then((apiResponse) => {
			const { valid } = apiResponse;
			if (valid) {
				const {
					fsmReturns: { bikeDetails }
				} = getState();
				const newBikeList = bikeDetails.filter((item) => item.vehicleNumber !== vehicleNumber);
				dispatch(success(newBikeList));
				dispatch(setNotification('success', 'SUCCESS', 'Successfully placed request return'));
			} else {
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	};

	function success(newBikeList) {
		return { type: FETCH_FSM_RETURNS.CREATE_RETURN_REQ_SUCCESS, payload: { bikeDetails: newBikeList } };
	}
}
