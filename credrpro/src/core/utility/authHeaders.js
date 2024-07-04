import { getToken } from '../services/tokenStorageServices'

export function getAuthHeader() {
  // return authorization header with jwt token
  const token = getToken()
  if (token) {
    return { 'Authorization': `Bearer ${token}` }
  } else {
    return {}
  }
}