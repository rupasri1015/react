import { GET_BUFFER_PRICE_ONLINE } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const initialState = {
    data: [],
    count: 0,
    pageNumber: 1,
    isLoading: false,
    leadStatus: []
}

export default function bufferPriceOnlineSellReducer(state=initialState, action ) {
    switch(action.type) {
        case GET_BUFFER_PRICE_ONLINE.REQUEST:
            return getNewState(state, {isLoading: true})

        case GET_BUFFER_PRICE_ONLINE.SUCCESS:
            const { data, count, pageNumber, leadStatus } = action.payload;
            return getNewState(state, {data, count, pageNumber, leadStatus, isLoading: false})

        case GET_BUFFER_PRICE_ONLINE.FAILURE: 
            const { error } = action.payload
            return getNewState(state, {error, ...initialState})

        case GET_BUFFER_PRICE_ONLINE.RESET: 
            return initialState

        default:
         return state
    }
}   