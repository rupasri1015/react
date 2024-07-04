import {LOGISTICS_CITY_LIST} from '../../core/constants/actions'
import {getStateCities} from '../../core/services/logisticServices'

export function logisticCityAction(payload = {}){
  return dispatch => {
    dispatch(request())
    return getStateCities(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { cityList } = apiResponse
          dispatch(success({
            cityList
          }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
        }
      })
  }

  function request() { return { type: LOGISTICS_CITY_LIST.REQUEST } }
  function success(cities) { return { type: LOGISTICS_CITY_LIST.SUCCESS, payload: { ...cities } } }
  function failure(error) { return { type: LOGISTICS_CITY_LIST.FAILURE, payload: { ...error } } }
}