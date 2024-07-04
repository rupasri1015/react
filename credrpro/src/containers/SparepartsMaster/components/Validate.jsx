export const validateAddSparePart = (payload) => {
    let result = {nameError: false, categoryError: false, sectionError: false};
    if(payload.sparePartName === '') {
        result.nameError = true;
    } 
    if(payload.section === '') {
        result.sectionError = true;
    }
    if(payload.category === '' || payload.category === 'None') {
        result.categoryError = true
    }
    return result;
}