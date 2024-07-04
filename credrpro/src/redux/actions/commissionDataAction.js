import { COMMISSION_DATA} from '../../core/constants/actions'

export function setCommissionData(commissionPayload) {
  return {
    type: COMMISSION_DATA.SET,
    payload: {
      ...commissionPayload
    }
  }
}

export function clearNotification() {
  return {
    type: COMMISSION_DATA.CLEAR
  }
}