import { SHD_COMMISSION } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  shdCommissionList: [],
  isLoading: false,
  pageNum: 1,
  count: 0
}

export default function shdCommissionReducer(state = intialState, action) {

  switch (action.type) {
    case SHD_COMMISSION.REQUEST:
      return getNewState(state, { isLoading: true })

    case SHD_COMMISSION.SUCCESS:
      const { shdCommissionList, pageNum, count   } = action.payload;
      return getNewState(state, { shdCommissionList, isLoading: false, pageNum, count  })

    case SHD_COMMISSION.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    default:
      return state
  }
}