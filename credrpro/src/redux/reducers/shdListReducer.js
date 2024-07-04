import { GET_SHD_LIST } from '../../core/constants/actions'
import { getNewState } from '../../core/utility'

const intialState = {
  shdList: [],
  total: 0,
  page: 1,
  isLoading: false
}

export default function shdListReducer(state = intialState, action) {

  switch (action.type) {
    case GET_SHD_LIST.REQUEST:
      return getNewState(state, { isLoading: true })

    case GET_SHD_LIST.SUCCESS:
      const { shdList, total, page } = action.payload;
      return getNewState(state, { shdList, total, page, isLoading: false })

    case GET_SHD_LIST.FAILURE:
      const { error } = action.payload
      return getNewState(state, { error, ...intialState })

    case GET_SHD_LIST.RESET:
      return intialState

    default:
      return state
  }
}   