import { GET_ALL_MMV } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'
import { getMMVTableData } from '../../core/services/MMVManagementServices'

export default function getAllMMVs(payload = {
  pageNum: 1,
  filter: '',
  searchText: ''
  }) {
	const filter = payload.filter,
	searchText  = payload.searchText;

  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return getMMVTableData(payload)
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
	

	function request() { return { type: GET_ALL_MMV.REQUEST } }
  function success(payload) { return { type: GET_ALL_MMV.SUCCESS, payload: { ...payload } } }
  function failure(error) { return { type: GET_ALL_MMV.FAILURE, payload: { ...error } } }
}
