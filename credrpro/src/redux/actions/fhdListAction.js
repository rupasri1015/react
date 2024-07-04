import { getFHDUserList } from '../../core/services/fhdServices'
import { FHD_LIST_ACTION } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getFhdList(payload = { pageNum: 1, userType: "FHD" }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getFHDUserList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const fhdList = apiResponse.userList;
          const total = apiResponse.count
          const { pageNum: page } = payload
          dispatch(success({
            fhdList,
            total,
            page
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: FHD_LIST_ACTION.REQUEST } }
  function success(fhdList) { return { type: FHD_LIST_ACTION.SUCCESS, payload: { ...fhdList } } }
  function failure(error) { return { type: FHD_LIST_ACTION.FAILURE, payload: { ...error } } }
}

export function resetFhdList() {
  return { type: FHD_LIST_ACTION.RESET }
}