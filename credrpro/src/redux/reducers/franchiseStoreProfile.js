import { FETCH_FRANCHISE_PROFILE } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
    uploadedProfileBanner: '',
    uploadedProfileAvatar: '',
    profile: {},
    isLoading: false,
    error: false,
    success: false,
}

export default function franchiseStoreProfile(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
      case FETCH_FRANCHISE_PROFILE.BANNER_REQUEST:
        return getNewState(state, { isLoading: true, error: false });

      case FETCH_FRANCHISE_PROFILE.BANNER_SUCCESS:
        return getNewState(state, { isLoading: false, uploadedProfileBanner: payload })

      case FETCH_FRANCHISE_PROFILE.AVATAR_SUCCESS:
        return getNewState(state, { isLoading: false, uploadedProfileAvatar: payload })

      case FETCH_FRANCHISE_PROFILE.BANNER_FAILURE:
        return getNewState(state, { error: true, ...initialState })

    case FETCH_FRANCHISE_PROFILE.FETCH_PROFILE_REQUEST:
        return getNewState(state, { isLoading: true, error: false });

    case FETCH_FRANCHISE_PROFILE.FETCH_PROFILE_SUCCESS:
        const { userProfileDetails } = payload;

        return {
            ...state,
            isLoading: false,
            profile: userProfileDetails,
            uploadedProfileBanner: userProfileDetails.backgroundImage,
            uploadedProfileAvatar: userProfileDetails.profileImage
        };

    case FETCH_FRANCHISE_PROFILE.FETCH_PROFILE_FAILURE:
        return getNewState(state, { error: true, ...initialState })

    case FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_REQUEST:
      return getNewState(state, { isLoading: true, error: false });


    case FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_SUCCESS:
      const { updatedDetails } = payload;

      return {
          ...state,
          isLoading: false,
          profile: {
            ...state.profile,
            ...updatedDetails
          },
      };

    case FETCH_FRANCHISE_PROFILE.UPDATE_PROFILE_FAILURE:
      return getNewState(state, { error: true, ...initialState })


      default:
        return state
    }
  }
