import { FRANCHISE_SALES } from '../../core/constants/actions'
import { getFranchiseSales } from '../../core/services/franchiseServices'
import { hideLoader, showLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function getFranchiseSaleList( payload = {} ){
    return dispatch => {
        dispatch(request())
        dispatch(showLoader())
        return getFranchiseSales(payload)
        .then(apiResponse => {
            if(apiResponse.isValid){
                const { manageLeadsResponse, count  } = apiResponse
                const { pageNum,orderType } = payload
                dispatch(success({ manageLeadsResponse, count, pageNum,orderType }))
            }
            else{
                dispatch(failure({ error: apiResponse.message }))
                dispatch(setNotification( 'danger', 'ERROR', apiResponse.message ))
            }
            dispatch(hideLoader())
        })
    }

  function request() { return { type: FRANCHISE_SALES.REQUEST } }
  function success(franchiseSales) { return { type: FRANCHISE_SALES.SUCCESS, payload: { ...franchiseSales } } }
  function failure(error) { return { type: FRANCHISE_SALES.FAILURE, payload: { ...error } } }
}