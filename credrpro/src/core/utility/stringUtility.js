import moment from 'moment'

export function getDate(date) {
  if (date && moment(date).isValid()) {
    const time = moment(date).format('hh:mm A')
    const datefield = moment(date).format('DD-MMM-YYYY')
    return `${datefield}\n${time}`
  }
  return '-'
}

export function getOnlyDate(date) {
  if (date && moment(date).isValid()) {
    const datefield = moment(date).format('DD-MMM-YYYY')
    return `${datefield}`
  }
  return '-'
}

export function getElapsedTime(time) {
  if (time) {
    const minutes = parseInt(time)
    let long = 0
    let short = 0
    if (minutes > 1439) {
      long = Math.floor(minutes / 1440)
      short = Math.floor((minutes % 1440) / 60)
      return `${long}D:${short}H`
    }
    else {
      long = Math.floor(minutes / 60)
      short = minutes % 60
      return `${long}H:${short}M`
    }
  }
  return '-'
}

export function getDatePayload(date) {
  if (date) {
    return moment(date).format('YYYY-MM-DD')
  }
  return '-'
}

export function getBikeName(make, model, variant) {
  return `${make ? `${make}` : ''}${model ? ` ${model}` : ''}${variant ? ` ${variant}` : ''}`
}

export function getBikeNameYear(make, model, variant, year) {
  return `${make ? `${make}` : ''}${model ? ` ${model}` : ''}${variant ? ` ${variant}` : ''}${year ? ` ${year}` : ''}`
}

export function getKmsDriven(km) {
  if (km) {
    return `${getComaSeparated(km)} KM Driven`
  }
  return '-'
}

export function getKmsDrivenComma(km) {
  if (km) {
    return `${getComaSeparated(km)}`
  }
  return '-'
}

export function getStatus(status) {
  if (status && typeof status === "string")
    return status.split('_').join(' ')
  return '-'
}
export function onlyNumber(number) {
  if (number) {
    const NumberRegex = /^[0-9]*$/;
    return NumberRegex.test(number);
  }
}
export function getAmount(amount) {
  if (amount !== undefined && amount !== null) {
    if (`${amount}`.includes('.')) {
      const seperateWithDot = `${amount}`.split('.')
      const newSeparatedAmount = getComaSeparated(seperateWithDot[0])
      return `\u20B9${newSeparatedAmount}`
    }
    if (amount === 'NA') {
      return '-'
    }
    if (amount === '') {
      return '-'
    }
    if (amount === '-') {
      return '-'
    }
    else {
        const newAmount = getComaSeparated(amount)
        return `\u20B9${newAmount}`
    }
  }
  return "\u20B90";
}

export function getComaSeparated(amount) {
  const amountString = `${amount}`
  var lastThree = amountString.substring(amountString.length - 3);
  var otherNumbers = amountString.substring(0, amountString.length - 3);
  if (otherNumbers !== '')
    lastThree = ',' + lastThree;
  const convertedAmount = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return `${convertedAmount}`
}

export function getTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  }


export function capaitalize(data) {
  if (data) {
    const capitalize = data.split('_').join(' ').toLowerCase()
    return capitalize.replace(/(?:^|\s)\S/g, a => a.toUpperCase())
  }
  return data
}

export function renderString(data) {
  if (typeof data === "boolean")
    return data ? 'Yes' : 'No'
  return Boolean(data) ? `${data}` : '-'
}

export function renderCommaSeparated(data) {
  if (data) {
    var changedData = data.replace(/,/g, '\n')
    return changedData
  }
  return data
}
export function nullChecker(value) {
  if (value) {
    return value
  }
  else {
    return "NA"
  }

}

export function renderDateSlot(data) {
  if (data && data !== 'null : null') {
    return data
  }
  return '-'
}

export function isRegistrationNumber(number) {
  if (number) {
    const registrationNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/
    return registrationNumberRegex.test(number)
  }
}

export function getMapedStatus(status) {
  if (status) {
    switch (status.toLowerCase()) {
      case 'auction_started':
      case 'reauction_started': return 'ONGOING'
      case 'auction_completed': return status.toUpperCase()
      case 'exchange':
      case 'sell': return 'EXCHANGE'
      default: return status.toUpperCase()
    }
  }
}
export function getYear(year) {
  if (year) {
    var changedYear = year.split("-")
    return changedYear[0]
  }
}

export function getMmvYear(mmv, year) {
  if (year && mmv) {
    year = year.split("-")
    return `${mmv} - ${year[0]}`
  }
  else {
    return '-'
  }
}

export function getMmvYearFranchise(mmv, year) {
  if (mmv && year)
    return `${mmv} - ${year}`
  else {
    return '-'
  }
}
export function getFmEditPrice(fmPrice) {
  if (fmPrice) {
    return getAmount(fmPrice)
  }
  else {
    return '-'
  }
}

export function getCredrMargin(cfp, voucherPrice) {
  return `${Number(cfp ? cfp : '0') - Number(voucherPrice ? voucherPrice : '0')}`
}


export function formatTimeStamp(str) {
  var today = new Date();

  var date = new Date(str)
  var mnth = ("0" + (date.getMonth() + 1)).slice(-2)
  var day = ("0" + date.getDate()).slice(-2)
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  return [date.getFullYear(), mnth, day].join("-") + ' ' + time;
}
export function disableDates(min, max, date) {
  if (min && max) {
    if (moment(date).isSameOrAfter(min, "date") && moment(date).isSameOrBefore(max, "date")) {
      return false
    }
    return true
  } else {
    if (max) {
      if (moment(date).isSameOrBefore(max, "date")) {
        return false
      }
      return true
    }
    if (min) {
      if (moment(date).isSameOrAfter(min, "date")) {
        return false
      }
      return true
    }
    return false
  }
}

export function renderDate(date, format = "DD-MMMM-YYYY") {
  if (date && moment(date).isValid()) {
    return moment(date).format(format)
  }
  return '-'
}

export function renderTime(date, format = "HH:mm:ss") {
  if (date && moment(date).isValid()) {
    return moment(date).format(format)
  }
  return '-'
}


