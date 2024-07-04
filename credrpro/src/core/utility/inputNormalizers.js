export const upperCase = value => {
  if (value) return value.toUpperCase()
}


export const onlyPositiveNum = value =>
  value && /^[1-9]+[0-9]*$/i.test(value)
    ? 'Enter Valid Amount'
    : undefined

export const postalCode = value => {
  if (!value) {
    return value
  }
  let postalCodeNormalize = value.replace(/[^\d]/g, '')
  postalCodeNormalize = postalCodeNormalize.replace(/(?!^)+/g, '')
  return postalCodeNormalize.startsWith('0') ? '' : postalCodeNormalize.slice(0, 6)
}

export const amount = (value) => {
  if (!value) {
    return value
  }
  let amountTotal = value.replace(/[^\d]/g, '')
  amountTotal = amountTotal.replace(/(?!^)+/g, '')
  return amountTotal.startsWith('0') ? '' : amountTotal
}


export const onlyNumber = (value) => {
  if (!value) {
    return value
  }
  let onlyNumberData = value.replace(/[^\d]/g, '')
  return onlyNumberData.replace(/(?!^)+/g, '')
}

export const mobileNumber = (value) => {
  if (!value) {
    return value
  }
  let amountTotal = value.replace(/[^\d]/g, '')
  amountTotal = amountTotal.replace(/(?!^)+/g, '')
  return amountTotal.startsWith('0') ? '' : amountTotal.slice(0, 10)
}