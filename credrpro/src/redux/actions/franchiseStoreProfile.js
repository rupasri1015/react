import { uploadFranchiseProfileBanner, fetchFranchiseProfile, updateFranchiseProfile, updateFranchiseProfileImages } from '../../core/services/franchiseServices';
import { getUserID } from '../../core/services/rbacServices'

import { FETCH_FRANCHISE_PROFILE } from '../../core/constants/actions';

import { hideLoader, showLoader } from './loaderAction';
import { setNotification } from './notificationAction';


export function fetchProfile() {
    const payload = getUserID();
    return (dispatch) => {
		dispatch(request());
		dispatch(showLoader());
		return fetchFranchiseProfile(payload).then((apiResponse) => {
			if (apiResponse.isValid) {
				const { userProfileDetails } = apiResponse;

				dispatch(success({ userProfileDetails: userProfileDetails[0] }));
			} else {
				dispatch(failure({ error: apiResponse.message }));
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	};

	function request() {
		return { type: FETCH_FRANCHISE_PROFILE.FETCH_PROFILE_REQUEST, payload: { } };
	}
	function success(payload) {
		return { type: FETCH_FRANCHISE_PROFILE.FETCH_PROFILE_SUCCESS, payload };
	}
	function failure(error) {
		return { type: FETCH_FRANCHISE_PROFILE.FETCH_PROFILE_FAILURE, payload: { ...error } };
	}
}

// payload - all user details
export function updateProfile(payload) {
    const userId = getUserID();

	return (dispatch) => {
		dispatch(request());
		dispatch(showLoader());
		return updateFranchiseProfile({ userId, ...payload }).then((apiResponse) => {
			if (apiResponse.isValid) {
				dispatch(success({ updatedDetails: payload }));
				dispatch(setNotification('success', 'SUCCESS', apiResponse.message));

			} else {
				dispatch(failure({ error: apiResponse.message }));
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	};

	function request() {
		return { type: FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_REQUEST, payload: { } };
	}
	function success(payload) {
		return { type: FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_SUCCESS, payload };
	}
	function failure(error) {
		return { type: FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_FAILURE, payload: { ...error } };
	}
}

export function uploadProfileImage(payload) {
	const { formdata, type } = payload;
	return (dispatch) => {
		dispatch(request());
		dispatch(showLoader());
		return uploadFranchiseProfileBanner(formdata).then((apiResponse) => {
			if (apiResponse.isValid) {
				const { url } = apiResponse;
				if (type === 'banner') {
					// Linking the uploaded profile banner to user
					dispatch(updateProfileImages({ backgroundImage: url, userId: getUserID() }));
					dispatch(success({ profileBannerUrl: url}));
				} else if (type === 'avatar') {
					// Linking the uploaded profile banner to user
					dispatch(updateProfileImages({ profileImage: url, userId: getUserID() }));
					dispatch(successAvatar({ profileAvatarUrl: url}));
				}
				dispatch(setNotification('success', 'SUCCESS', apiResponse.message));
			} else {
				dispatch(failure({ error: apiResponse.message }));
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	};

	function request() {
		return { type: FETCH_FRANCHISE_PROFILE.BANNER_REQUEST, payload: { } };
	}
	function success({ profileBannerUrl }) {
		return { type: FETCH_FRANCHISE_PROFILE.BANNER_SUCCESS, payload: profileBannerUrl };
	}
	function successAvatar({ profileAvatarUrl }) {
		return { type: FETCH_FRANCHISE_PROFILE.AVATAR_SUCCESS, payload: profileAvatarUrl };
	}
	function failure(error) {
		return { type: FETCH_FRANCHISE_PROFILE.BANNER_FAILURE, payload: { ...error } };
	}
}

// update user images
/**
 *
 * @param {*} payload - { backgroundImage, profileImage, userId }
 * @returns
 */
export function updateProfileImages(payload) {
	return (dispatch) => {
		dispatch(request());
		dispatch(showLoader());
		return updateFranchiseProfileImages(payload).then((apiResponse) => {
			if (apiResponse.isValid) {
				dispatch(success({}));
				dispatch(setNotification('success', 'SUCCESS', apiResponse.message));
			} else {
				dispatch(failure({ error: apiResponse.message }));
				dispatch(setNotification('danger', 'ERROR', apiResponse.message));
			}
			dispatch(hideLoader());
		});
	};

	function request() {
		return { type: FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_IMAGES_REQUEST, payload: { } };
	}
	function success(payload) {
		return { type: FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_IMAGES_SUCCESS, payload };
	}
	function failure(error) {
		return { type: FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_IMAGES_FAILURE, payload: { ...error } };
	}
}
