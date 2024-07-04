import { SHD_TRANSACTIONS_LIST } from '../../core/constants/actions'
import { getShdTransactionsList } from '../../core/services/shdServices'
import { showLoader, hideLoader } from './loaderAction'

export function getShdTransactions(payload) {
    return dispatch => {
        dispatch(request())
        dispatch(showLoader())
        return getShdTransactionsList(payload)
            .then(apiResponse => {
                console.log("shd Transaction List", apiResponse)
                if (apiResponse.isValid) {
                    const shdTransactionsList = apiResponse.data
                    const count = apiResponse.allCount
                    const shdWalletBalance = apiResponse.shdWalletBalance
                    const personalAccountNumber = apiResponse.personalAccountNumber
                    const personalIfscCode = apiResponse.personalIfscCode
                    const { pageNum } = payload
                    dispatch(success({
                        shdTransactionsList,
                        count,
                        pageNum,
                        shdWalletBalance,
                        personalAccountNumber,
                        personalIfscCode
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
    function request() { return { type: SHD_TRANSACTIONS_LIST.REQUEST } }
    function success(shdTransactionsList) { return { type: SHD_TRANSACTIONS_LIST.SUCCESS, payload: { ...shdTransactionsList } } }
    function failure(error) { return { type: SHD_TRANSACTIONS_LIST.FAILURE, payload: { error } } }
}