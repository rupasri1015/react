import { shdCommission } from '../../core/services/shdServices'
import { SHD_COMMISSION } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'

export function getShdCommission(payload) {
  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return shdCommission(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const { shdCommissionList, count } = apiResponse
          const { pageNum } = payload
          dispatch(success({
            shdCommissionList,
            count,
            pageNum
          }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: SHD_COMMISSION.REQUEST } }
  function success(shdCommissionList) { return { type: SHD_COMMISSION.SUCCESS, payload: { ...shdCommissionList } } }
  function failure(error) { return { type: SHD_COMMISSION.FAILURE, payload: { ...error } } }
}

export function resetShdCommissionList() {
  return { type: SHD_COMMISSION.RESET }
}