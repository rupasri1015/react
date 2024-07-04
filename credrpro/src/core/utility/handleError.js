import { logout } from '../services/authenticationServices'
export function handleError(err) {
  const errorResponse = err.response
  if (errorResponse) {
    const { message } = errorResponse.data
    const { status } = errorResponse
    if (status === 403) {
      logout()
      window.location.reload()
    }
    return {
      name: 'Error',
      message,
      status
    }
  } else {
    return {
      name: err.name,
      message: err.message,
      status: err.status
    }
  }
}