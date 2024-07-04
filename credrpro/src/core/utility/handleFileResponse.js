import { logout } from '../services/authenticationServices'
export function handleFileResponse(response) {
  let apiResponse = response.data
  if (response.status >= 200 && response.status <= 299) {
    return Promise.resolve(apiResponse)
  }
  if (response.status === 403) {
    logout()
    window.location.reload()
    return Promise.resolve(null)
  }
  return Promise.resolve(null)
}