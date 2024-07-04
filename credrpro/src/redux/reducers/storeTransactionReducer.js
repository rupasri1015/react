import { STORE_WALLET_LIST } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
    storeTransactionsList: [],
    count: 0,
    pageNum: 1,
    isLoading: false,
    message: "",
}

export default function storeTransactionReducer(state = intialState, action) {

    switch (action.type) {
        case STORE_WALLET_LIST.REQUEST:
            return getNewState(state, { isLoading: true })
        case STORE_WALLET_LIST.SUCCESS:
            const { storeTransactionsList, count, pageNum, message } = action.payload;
            return getNewState(state, { storeTransactionsList, count, pageNum, message, isLoading: false })

        case STORE_WALLET_LIST.FAILURE:
            const { error } = action.payload
            return getNewState(state, { error, ...intialState })

        default:
            return state;
    }
}