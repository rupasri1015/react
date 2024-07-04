export const REFRESH_TIME = 60000

export const SHD_COMMISSION_REFRESH_TIME = 100000

export const FHD_SHD_STEPS = ['Outlet Details', 'Profile', 'Bank Details']

export const VALUATOR_STEPS = ['Profile', 'Documents', 'Outlet Details']

export const PAN_REGEX = /^[A-Za-z]{3}[ABCFGHLJPTEabcfghljpte]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$/

export const PIN_CODE_REGEX = /^[1-9][0-9]{5}$/

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const PROFILE_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@credr.com$/

export const REGESTRATION_REGEX =  /^[A-Za-z]{2}[0-9]{1,2}(?:[A-Za-z])?(?:[A-Za-z]*)?[0-9]{4}$/

export const ALPHA_NUMERIC = /^[a-z0-9]+$/i

export const FHD_USER_TYPES = [
  { name: 'FHD OWNER', value: 'FHD_OWNER' },
  { name: 'FHD MANAGER', value: 'FHD_MANAGER' },
  { name: 'FHD SALES EXECUTIVE', value: 'FHD_SALES_EXECUTIVE' }
]

export const SHD_USER_TYPES = [
  // { name: 'SHD OWNER', value: 'SHD_OWNER' },
  // { name: 'SHD MANAGER', value: 'SHD_MANAGER' },
  // { name: 'SHD SALES EXECUTIVE', value: 'SHD_SALES_EXECUTIVE' }
  { name: 'SHD', value: 'SHD' }
]

export const ID_PRROFS = [
  { name: 'Aadhar', value: 'AADHAR' },
  { name: 'PAN', value: 'PAN' },
  { name: 'License', value: 'LICENSE' },
  { name: 'Voter ID', value: 'VOTERID' },
  { name: 'Passport', value: 'PASSPORT' },
  { name: 'Others', value: 'OTHERS' }
]

export const OEM_LIST = ["KTM", "Piaggio", "Triumph", "UM Motorcycles", "Honda", "Harley Davidson",
  "TVS", "Suzuki", "Hero Honda", "Royal Enfield", "Bajaj", "Yamaha", "Vibgyor", "TVS Suzuki", "Kinetic",
  "LML", "Ducati", "BMW", "Mahindra", "Moto Morini", "Hyosung", "Aprilia", "Hero", "Benelli", "Kawasaki"];
