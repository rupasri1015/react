export function getLastYears(numberOfYears = 10) {
  const year = new Date().getFullYear()
  return Array.from({ length: numberOfYears }, (v, i) => year - i)
}
export function getTotalDeductionCos(val1,val2,val3,val4,val5,val6,val7){
let sum=Number(val1)+Number(val2)+Number(val3)+Number(val4)+Number(val5)+Number(val6)+Number(val7)
return sum
}
export function getTotalDeductionSHD(val1,val2,val3,val4,val5){
  let sum=Number(val1)+Number(val2)+Number(val3)+Number(val4)+Number(val5)
  return sum
  }