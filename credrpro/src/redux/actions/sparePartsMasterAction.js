import { GET_SPM_DATA } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getSparePartsMasterData } from '../../core/services/sparePartsMasterServices'

export default function getSPMData(payload = {
  pageNum: 1,
  filter: '',
  searchText: ''
  }) {
	const filter = payload.filter,
	searchText  = payload.searchText;

  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getSparePartsMasterData(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
					const { pageNum } = payload;
          const { data, message, totalPages } = apiResponse;
          dispatch(success({
						data, message, pageNum, filter, searchText, totalPages
          }))
        }
        else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

	function request() { return { type: GET_SPM_DATA.REQUEST } }
  function success(payload) { return { type: GET_SPM_DATA.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_SPM_DATA.FAILURE, payload: { ...error } } }
}
