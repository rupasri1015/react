export const ValidateEmail = (mail) => {
	if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
		return true;
	}
	return false;
};

export const fileSizesWithinLimit = (files, limit = 5) => {
	for (let index = 0; index < files.length; index++) {
		if (files[index].size / Math.pow(1024, 2) > limit) {
			return false;
		}
	}
	return true;
};

export const allFieldsFilled = (vendorData) => {
	if (
		vendorData.name !== '' &&
		vendorData.address &&
		vendorData.address.pincode.length === 6 &&
		vendorData.address.cityName !== '' &&
		vendorData.address.phoneNumber.length === 10 &&
		vendorData.vendorBankDetailsBean.accountNumber !== '' &&
		vendorData.vendorBankDetailsBean.bankName !== '' &&
		vendorData.vendorBankDetailsBean.ifsccode !== '' &&
		vendorData.paymentTAT !== '' &&
		vendorData.warehouseName !== '' &&
		vendorData.preferredPayment !== '' &&
		(!vendorData.address.emailId || ValidateEmail(vendorData.address.emailId))
	) {
		return true;
	} else {
		return false;
	}
};
