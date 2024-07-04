import { listSHDUsers } from '../../core/services/shdServices'
import { GET_SHD_LIST } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function listAllSHDData(payload = { pageNum: 1, userType: "SHD" }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return listSHDUsers(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const shdList = apiResponse.userList;
          const total = apiResponse.count
          const { pageNum: page } = payload
          dispatch(success({
            shdList,
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

  function request() { return { type: GET_SHD_LIST.REQUEST } }
  function success(shdList) { return { type: GET_SHD_LIST.SUCCESS, payload: { ...shdList } } }
  function failure(error) { return { type: GET_SHD_LIST.FAILURE, payload: { ...error } } }
}

export function resetShdList() {
  return { type: GET_SHD_LIST.RESET }
}