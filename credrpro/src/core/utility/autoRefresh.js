import { REFRESH_TIME } from '../constants/settings'
import { SHD_COMMISSION_REFRESH_TIME } from '../constants/settings'

let intervalId = null
let interval = null

export function autoRefresh(callback) {
  intervalId = setInterval(callback, REFRESH_TIME)
}

export function stopRefresh() {
  clearInterval(intervalId)
}

export function autoShdCommissionRefresh(callback){
  interval = setInterval(callback, SHD_COMMISSION_REFRESH_TIME)
}

export function stopShdRefresh(){
  clearInterval(interval)
}