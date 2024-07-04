export const validateMMV = (selectedMMV, fromYear, toYear) => {
    let result = {nameError: false, fromError: false, toError: false, rangeError: false};
    if(!selectedMMV) {
        result.nameError = true;
    } 
    if(fromYear === 'None') {
        result.fromError = true;
    }
    if(toYear === 'None') {
        result.toError = true
    }
    if (parseInt(fromYear) > parseInt(toYear)) {
        result.rangeError = true;
    }
    return result;
}