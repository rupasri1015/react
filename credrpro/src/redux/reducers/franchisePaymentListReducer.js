import { FRANCHISE_PAYMENT_LIST } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  paymentsTableDataList: [],
  count: 0,
  isLoading: false,
  page: 1,
}

export default function franchisePaymentListReducers(state = intialState, action) {

  switch (action.type) {
    case FRANCHISE_PAYMENT_LIST.REQUEST:
      return getNewState(state, { isLoading: true })

    case FRANCHISE_PAYMENT_LIST.SUCCESS:
      const { allOrderByCityID:paymentsTableDataList, count, page } = action.payload;
      return getNewState(state, { paymentsTableDataList, count, isLoading: false, page })

    case FRANCHISE_PAYMENT_LIST.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case FRANCHISE_PAYMENT_LIST.RESET:
      return intialState

    default:
      return state
  }
}