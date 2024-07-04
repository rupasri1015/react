// import http from 'axios'
// import { API_ENDPOINTS } from '../constants/apiConstant'
// import { getAuthHeader } from '../utility/authHeaders'
// import { handleError, handleResponse } from '../utility'

// const API_ENDPOINT_GET_ALL_MAKES = API_ENDPOINTS.BIKE_DETAIL.GET_ALL_MAKES
// const API_ENDPOINT_GET_ALL_MODELS = API_ENDPOINTS.BIKE_DETAIL.GET_ALL_MODELS
// const API_ENDPOINT_GET_ALL_VARIANTS = API_ENDPOINTS.BIKE_DETAIL.GET_ALL_VARIANTS

// export function getAllMakes() {
//     const url = API_ENDPOINT_GET_ALL_MAKES
//     const headers = getAuthHeader()
//     return http.get(url, { headers })
//       .then(handleResponse)
//       .catch(handleError)
// }

// export function getAllModels(makeId) {
//     let url = API_ENDPOINT_GET_ALL_MODELS.replace('<MAKE_ID>', makeId)
//     const headers = getAuthHeader()
//     return http.get(url, { headers })
//       .then(handleResponse)
//       .catch(handleError)
// }

// export function getAllVariants(modelName) {
//     const url = API_ENDPOINT_GET_ALL_VARIANTS.replace("<MODEL_NAME>", modelName);
//     const headers = getAuthHeader()
//     return http.get(url, { headers })
//       .then(handleResponse)
//       .catch(handleError)
// }

