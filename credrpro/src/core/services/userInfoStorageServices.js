export function saveUserInfo(response) {
  response.firstName === null ? localStorage.setItem('firstName', "") : localStorage.setItem('firstName', response.firstName)
  response.lastName === null ? localStorage.setItem('lastName', "") : localStorage.setItem('lastName', response.lastName)
  response.email === null ? localStorage.setItem('email', "") : localStorage.setItem('email', response.email)
  response.alternateMobile === null ? localStorage.setItem('atlnumber', "") : localStorage.setItem('atlnumber', response.alternateMobile)
  response.profileImage === null ? localStorage.setItem('image', "") : localStorage.setItem('image', response.profileImage)
  response.dob === null ? localStorage.setItem('dob', "") : localStorage.setItem('dob', response.dob)
  response.userCityList === null ? localStorage.setItem('userCityList', "") : localStorage.setItem('userCityList', response.userCityList)
  response.userActionApplicable === null ? localStorage.setItem('userActionApplicable', "") : localStorage.setItem('userActionApplicable', response.userActionApplicable)

    
  }
  export function setImage(image) {
    return localStorage.setItem('image',image)
  }
  export function getFirstName() {
    return localStorage.getItem('firstName')
  }
  export function getLastName() {
    return localStorage.getItem('lastName')
  }
  export function getEmail() {
    return localStorage.getItem('email')
  }
  export function getAltNumber() {
    return localStorage.getItem('atlnumber')
  }
  export function getImage() {
    return localStorage.getItem('image')
  }
  export function getDob() {
    return localStorage.getItem('dob')
  }
  export function getUserCityList() {
    return localStorage.getItem('userCityList')
  }
  export function getUserActionApplicable() {
    return localStorage.getItem('userActionApplicable')
  }
  
  export function clearUserInfo() {
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    localStorage.removeItem('email')
    localStorage.removeItem('atlnumber')
    localStorage.removeItem('dob')
    localStorage.removeItem('image')
    localStorage.removeItem('userCityList')
    localStorage.removeItem('userActionApplicable')



  }