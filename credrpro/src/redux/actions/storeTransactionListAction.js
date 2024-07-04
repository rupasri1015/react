import { STORE_WALLET_LIST } from '../../core/constants/actions'
import { getStoreTransactionsList } from '../../core/services/shdServices'
import { showLoader, hideLoader } from './loaderAction'

export function getStoreTransactionsDetails(payload) {
    return dispatch => {
        dispatch(request())
        dispatch(showLoader())
        return getStoreTransactionsList(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    const storeTransactionsList = apiResponse.data
                    const count = apiResponse.count
                    const { pageNum } = payload
                    dispatch(success({
                        storeTransactionsList,
                        count,
                        pageNum,
                    }))
                }
                else {
                    dispatch(failure({
                        error: apiResponse.message
                    }))
                }
                dispatch(hideLoader())
            })
    }
    function request() { return { type: STORE_WALLET_LIST.REQUEST } }
    function success(storeTransactionsList) { return { type: STORE_WALLET_LIST.SUCCESS, payload: { ...storeTransactionsList } } }
    function failure(error) { return { type: STORE_WALLET_LIST.FAILURE, payload: { error } } }
}