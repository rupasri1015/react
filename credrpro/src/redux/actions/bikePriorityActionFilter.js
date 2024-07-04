import { getPriorityListByFilter } from '../../core/services/bikePriorityServices'
import { GET_BIKE_PRIORITY_BY_FILTER } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function priorityListFilter(payload = { cityCategory: true }) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getPriorityListByFilter(payload)
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
  function request() { return { type: GET_BIKE_PRIORITY_BY_FILTER.REQUEST } }
  function success(priorityCategory) { return { type: GET_BIKE_PRIORITY_BY_FILTER.SUCCESS, payload: { ...priorityCategory } } }
  function failure(error) { return { type: GET_BIKE_PRIORITY_BY_FILTER.FAILURE, payload: { ...error } } }
}

export function resetPriorityListFilter() {
  return { type: GET_BIKE_PRIORITY_BY_FILTER.RESET }
}