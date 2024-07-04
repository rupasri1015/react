export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function setStoreId(token) {
  localStorage.setItem('token', token);
}

export function getStoreId() {
  return localStorage.getItem('token');
}

export function clearStoreId() {
  localStorage.removeItem('token');
}

export function getUserInfo() {
  return localStorage.getItem('userType')
}

export function getCityInfo() {
  return localStorage.getItem('userCityList')
}