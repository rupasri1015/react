import { FRANCHISE_VIEWUTRRECEIPT_INVENTORY } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
    getViewUtrReceipt: []
}

export default function biddingListReducer(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_VIEWUTRRECEIPT_INVENTORY.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_VIEWUTRRECEIPT_INVENTORY.SUCCESS:
      const { viewUtrReceipt: getViewUtrReceipt } = action.payload
      return getNewState(state, { getViewUtrReceipt, isLoading: false })

    case FRANCHISE_VIEWUTRRECEIPT_INVENTORY.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_VIEWUTRRECEIPT_INVENTORY.RESET:
      return intialState

    default:
      return state
  }
}   