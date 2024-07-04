import { listCities } from '../../core/services/miscServices'
import { CITIES_ACTION } from '../../core/constants/actions'

export function getAllCities() {
  return dispatch => {
    dispatch(request())
    return listCities()
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

  function request() { return { type: CITIES_ACTION.REQUEST } }
  function success(cities) { return { type: CITIES_ACTION.SUCCESS, payload: { ...cities } } }
  function failure(error) { return { type: CITIES_ACTION.FAILURE, payload: { ...error } } }
}