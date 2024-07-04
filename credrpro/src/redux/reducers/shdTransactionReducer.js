import { SHD_TRANSACTIONS_LIST } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
    shdTransactionsList: [],
    count: 0,
    pageNum: 1,
    isLoading: false,
    message: "",
    shdWalletBalance: 0
}

export default function shdTransactionReducer(state = intialState, action) {

    switch (action.type) {
        case SHD_TRANSACTIONS_LIST.REQUEST:
            return getNewState(state, { isLoading: true })
        case SHD_TRANSACTIONS_LIST.SUCCESS:
            const { shdTransactionsList, count, pageNum, message, shdWalletBalance, personalAccountNumber, personalIfscCode } = action.payload;
            return getNewState(state, { shdTransactionsList, count, pageNum, personalAccountNumber, personalIfscCode, message, isLoading: false, shdWalletBalance })


        case SHD_TRANSACTIONS_LIST.FAILURE:
            const { error } = action.payload
            return getNewState(state, { error, ...intialState })

        default:
            return state;
    }
}