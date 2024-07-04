import { SHD_ORDER_DEDUCTIONS } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
    leadDetails: {}
  }

export default function shdOrderDeductionReducer(state = intialState, action) {

    switch (action.type) {
        case SHD_ORDER_DEDUCTIONS.REQUEST:
          return getNewState(state, { isLoading: true })
    
        case SHD_ORDER_DEDUCTIONS.SUCCESS:
          const { orderDeductionsResponse: leadDetails } = action.payload
          return getNewState(state, { leadDetails, isLoading: false })
    
        case SHD_ORDER_DEDUCTIONS.FAILURE:
          const { error } = action.payload
          return getNewState(state, { error, ...intialState })
    
        case SHD_ORDER_DEDUCTIONS.RESET:
          return intialState
    
        default:
          return state
      }

}