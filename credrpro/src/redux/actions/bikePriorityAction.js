import { getPriorityList } from '../../core/services/bikePriorityServices'
import { GET_BIKE_PRIORITY } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function priorityList(payload = { cityCategory: true }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPriorityList(payload)
      .then(apiResponse => {
        if (apiResponse) {
          const {
            priorityCategory,
            count
          } = apiResponse
          const { pageNum } = payload
          dispatch(success({
            priorityCategory, pageNum, count
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }
  function request() { return { type: GET_BIKE_PRIORITY.REQUEST } }
  function success(priorityCategory) { return { type: GET_BIKE_PRIORITY.SUCCESS, payload: { ...priorityCategory } } }
  function failure(error) { return { type: GET_BIKE_PRIORITY.FAILURE, payload: { ...error } } }
}

export function resetPriorityList() {
  return { type: GET_BIKE_PRIORITY.RESET }
}