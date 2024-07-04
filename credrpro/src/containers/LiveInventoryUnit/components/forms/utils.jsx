export function parseForDropDown (list) {
    let dropdownOption = list.map(({ name: label, ...rest }) => ({ label, ...rest }));
	dropdownOption = dropdownOption.map(({ id: value, ...rest }) => ({ value, ...rest }));
    return dropdownOption;
}

export function parseForMMVDropDown (list) {
    let dropdownOption = list.map(({ mmv: label, ...rest }) => ({ label, ...rest }));
	dropdownOption = dropdownOption.map(({ id: value, ...rest }) => ({ value, ...rest }));
    return dropdownOption;
}

export function isPositiveInt(val) {
    if(/^\+?(0|[1-9]\d*)$/.test(val)) {
        return true
    }
    else {
        return false
    }
}

export function isPositiveFloat(val) {
    if(!isNaN(val) && parseFloat(val) > 0) {
        return true
    }
    else {
        return false
    }
}

export function isTableFilled(tableData) {
	for (const row of tableData){
		if(
			row.section === ''
			|| row.category === ''
			|| row.partName === ''
			// || row.mmvYearRange === ''
			|| row.qty === ''
			|| row.unitPrice === ''
		) {
			return false;
		}
	}
	return true;
}

export function isPageTwoFormFilled(pagetwoData) {
	if(
		pagetwoData.billNumber === ''
		|| pagetwoData.gst === ''
		|| pagetwoData.paymentSLA === ''
		|| pagetwoData.totalAmount === ''
		|| pagetwoData.vendorName === ''
		|| pagetwoData.attachedFile.length === 0
	) {
		return false;
	}
	return true;
}

export function roundUptoTwoDecimal(val) {
	return (val.indexOf(".") >= 0)
		? (val.substr(0, val.indexOf(".")) + val.substr(val.indexOf("."), 3))
		: val;
}

export function getSectionCategoryDropdown(data) {
    const values = Object.keys(data);
    const dropDown = values.map((val) => {
		return { label: val, value: val, data: data[val] }
    })
	return dropDown;
}

export function getPartNameFromSection(section) {
	let partNameDropdown = [];
	Object.entries(section).map((item) => {
		item[1].map((partName) => {
			partNameDropdown.push({
				label: partName.name,
				value: partName.id,
				section: {label: partName.section, value: partName.section},
				category: { label: partName.category, value: partName.category}
			})
			return null;
		});
		return null;
	})
	return partNameDropdown;
}

export function getPartFromCategory(category) {
	return category.map((val) => {
		return {
			label: val.name,
			value: val.id,
			section: {label: val.section, value: val.section},
			category: { label: val.category, value: val.category}
		}
	})
}
