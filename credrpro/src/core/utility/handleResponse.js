export function handleResponse(response) {
	let apiResponse = response.data;
	if (response.status >= 200 && response.status <= 299) {
		if (apiResponse.isValid || apiResponse.valid) {
			return Promise.resolve(apiResponse);
		} else {
			let error = apiResponse.message;
			let newError = new Error();
			newError.message = error;
			newError.name = 'ERROR';
			newError.status = response.status;
			return Promise.reject(newError);
		}
	} else {
		const error = apiResponse.message;
		let newError = new Error();
		newError.message = error;
		newError.name = 'ERROR';
		newError.status = response.status;
		return Promise.reject(newError);
	}
}

export function handleIsValidResponse(response){
	let apiResponse = response.data
	if(response)
	return Promise.resolve(apiResponse);
	else{
		const error = apiResponse.message;
		let newError = new Error();
		newError.message = error;
		newError.name = 'ERROR';
		newError.status = response.status;
		return Promise.reject(newError);
	}
}
