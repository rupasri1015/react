import React, { useState, useEffect, Fragment } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody } from 'reactstrap';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';
import TextField from '@material-ui/core/TextField';
import FileUpload from '../../../shared/components/form/UploadImgnPdf'
import Header from './Header'
import { isPositiveInt } from '../../LiveInventoryUnit/components/forms/utils';
import { getAllWarehouses } from '../../../core/services/liveInventoryUnitServices'
import { parseForDropDown } from '../../LiveInventoryUnit/components/forms/utils';
import { paymentTATDropdown, paymentMethodDropdown } from './constants';
import { fileSizesWithinLimit, allFieldsFilled } from './utils';
import { addNewVendor } from '../../../core/services/vendorManagementServices';
import { getWarehouseID, getWarehouseName } from '../../../core/services/rbacServices';

const AddNewVendor = ({ history }) => {
	const dispatch = useDispatch();
	const [address, setAddress] = useState('');
	const [cityId, setCityId] = useState(null);
	const [cityName, setCityName] = useState('');
	const [emailId, setEmialId] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [pincode, setPincode] = useState('');
	const [warehouseId, setWarehouseId] = useState(null);
	const [warehouseName, setWarehouseName] = useState('');
	const [name, setName] = useState('');
	const [paymentTAT, setPaymentTAT] = useState('');
	const [preferredPayment, setPreferredPayment] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [bankName, setBankName] = useState('');
	const [ifsccode, setIfsccode] = useState('');
	const [panDocs, setPanDocs] = useState([]);
	const [kycDocs, setKycDocs] = useState([]);
	const [panFileSizeExceeded, setPanFileSizeExceeded] = useState(false);
	const [kycFileSizeExceeded, setKycFileSizeExceeded] = useState(false);
	const [warehouseDropdown, setWarehouseDropdown] = useState('');

	useEffect(() => {
		const userWarehouseId = getWarehouseID();
		if(userWarehouseId === 0){
			dispatch(showLoader());
			getAllWarehouses()
			.then(apiResponse => {
				if (apiResponse.isValid) {
					let dropdown = parseForDropDown(apiResponse.data);
					dropdown.shift();
					setWarehouseDropdown(dropdown);
					dispatch(hideLoader());
				}
				else {
					dispatch(setNotification('danger', 'Warehouse list is not added', apiResponse.message));
					dispatch(hideLoader());
				}
			})
		} else {
			setWarehouseDropdown([{ value: userWarehouseId, label: getWarehouseName() }]);
			setWarehouseId(userWarehouseId);
			setWarehouseName(getWarehouseName())
		}
		
	}, [])

	const cityList = useSelector(state => state.cities.cityList);
	let cityDropdownOption = cityList.map(({ cityName: label, ...rest }) => ({ label, ...rest }));
	cityDropdownOption = cityDropdownOption.map(({ cityId: value, ...rest }) => ({ value, ...rest }));


	const handleChangeCity = (city) => {
		setCityId(city.value);
		setCityName(city.label);
	}

	const handleChangePincode = (pincode) => {
		if((isPositiveInt(pincode) || pincode === '') && pincode.length <= 6) {
			setPincode(pincode)
		}
	};

	const handleChangePhonenumber = (phonenumber) => {
		if((isPositiveInt(phonenumber) || phonenumber === '') && phonenumber.length <= 10) {
			setPhoneNumber(phonenumber)
		}
	};

	const handleChangeWarehouse = (warehouse) => {
		setWarehouseName(warehouse.label);
		setWarehouseId(warehouse.value);
	}

	const handleChangeAccountNumber = (accountnumber) => {
		if((isPositiveInt(accountnumber) || accountnumber === '') && accountnumber.length <= 20) {
			setAccountNumber(accountnumber)
		}
	};

	const handleChangeIfscCode = (ifsc) => {
		if(ifsc.length <= 11) {
			setIfsccode(ifsc);
		}
	};

	const handleChangePaymentMethod = (method) => {
		setPreferredPayment(method);
		if(method === 'Cash') {
			setPaymentTAT('');
		}
	}

	const setFile = (files, fileType) => {
		if(fileType === 'pancard') {
			if(fileSizesWithinLimit(files)) {
				setPanDocs(files.slice(0, 2));
				setPanFileSizeExceeded(false);
			} else {
				setPanDocs([]);
				setPanFileSizeExceeded(true);
			}
		}
		if(fileType === 'kycdocs') {
			if(fileSizesWithinLimit(files)) {
				setKycDocs(files.slice(0, 5));
				setKycFileSizeExceeded(false);
			} else {
				setKycDocs([]);
				setKycFileSizeExceeded(true);
			}
		}
	}

	const generatePayload = () => {
		return {
			address: {
				address, cityId, cityName, emailId, phoneNumber, pincode
			},
			kycdocs: kycDocs.map((doc) => { return {imageName: doc.name} }),
			pancards: panDocs.map((doc) => { return {imageName: doc.name} }),
			name,
			paymentTAT: paymentTAT.value,
			preferredPayment,
			vendorBankDetailsBean: { accountNumber, bankName, ifsccode },
			warehouseId,
			warehouseName
		}
	}

	const handleSubmit = () => {
		const payload = generatePayload();
		const formData = new FormData();
		panDocs.forEach(doc => formData.append('images', doc));
		kycDocs.forEach(doc => formData.append('images', doc));
		formData.append("json", JSON.stringify(payload));

		dispatch(showLoader());
		addNewVendor(formData)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				dispatch(hideLoader());
				dispatch(setNotification('success', 'Data Added Successfully', ''));
				history.push('/vendorManagement')
			} else {
				dispatch(setNotification('danger', 'Data is not added', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}

	const validateInputs = () => {
		const vendorData = generatePayload();
		return allFieldsFilled(vendorData)
	}

	return(
		<>
			<Header toWrite='Vendor Management'/>
			<Card>
				<CardBody>
					<div className="flex-row">
						<div className="spm-form-two-col" >
							<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Contact Details</span>
							<TextField
								className="spm-form-two-row"
								value={name}
								autoFocus
								margin="dense"
								label="Vendor Name*"
								fullWidth
								onChange={ (event) => setName(event.target.value) }
							/>
							<TextField
								className="spm-form-two-row"
								value={emailId}
								margin="dense"
								label="Email Id"
								fullWidth
								onChange={ (event) => setEmialId(event.target.value) }
							/>
							<TextField
								className="spm-form-two-row"
								value={address}
								margin="dense"
								label="Address"
								fullWidth
								onChange={ (event) => setAddress(event.target.value) }
							/>

							<div style={{ margin: '1em 0' }}>
								<Select
									options={cityDropdownOption}
									className="basic-multi-select"
									classNamePrefix="select"
									placeholder="Select City*"
									onChange={(city) => handleChangeCity(city)}
								/>
							</div>
							
							
							<TextField
								className="spm-form-two-row"
								value={pincode}
								margin="dense"
								label="PIN Code*"
								fullWidth
								onChange={ (event) => handleChangePincode(event.target.value) }
							/>
							<TextField
								className="spm-form-two-row"
								value={phoneNumber}
								margin="dense"
								label="Phone Number*"
								fullWidth
								onChange={ (event) => handleChangePhonenumber(event.target.value) }
							/>
							
							<div style={{ margin: '1em 0' }}>
								<Select
									options={warehouseDropdown}
									className="basic-multi-select"
									classNamePrefix="select"
									placeholder="Select Warehouse*"
									onChange={(itemId) => handleChangeWarehouse(itemId)}
								/>
							</div>
							<div style={{ marginTop: '1em' }}>
								Maximum Two Images will be accepted<br/>
								<FileUpload
									accept="image/*, application/pdf"
									onFileChange={(files) => setFile(files, 'pancard')}
									name="Upload PAN Card Images*"
									multiple
								/>
								{
									panFileSizeExceeded
									? <div style={{ color: '#c00', marginTop: '0.5em' }}>
											** File size exceeded the 5 MB limit.
										</div>
									: <div style={{ color: '#0c0', marginTop: '0.5em' }}>
											{ panDocs.length === 0
												? null
												: panDocs.map((pan, index) => {
													return(
														<Fragment key={index}>
															{
																pan.type.search('image') === -1
																? null
																:
																	<img
																		style={{ height: '100px', width: 'auto' }} 
																		src={URL.createObjectURL(pan)}
																		alt='Failed to load preview'
																	/>
															}
															<div>{pan.name}</div>
														</Fragment>
													)
												})
											}
										</div>
								}
							</div>
							<div style={{ marginTop: '1em' }}>
								Maximum Five Images will be accepted<br/>
								<FileUpload
									accept="image/*, application/pdf"
									onFileChange={(files) => setFile(files, 'kycdocs')}
									name="Upload Bank KYC Images*"
									multiple
								/>
								{
									kycFileSizeExceeded
									? <div style={{ color: '#c00', marginTop: '0.5em' }}>
											** File size exceeded the 5 MB limit.
										</div>
									: <div style={{ color: '#0c0', marginTop: '0.5em' }}>
											{ kycDocs.length === 0
												? null
												: kycDocs.map((kyc, index) => {
													return(
														<Fragment key={index}>
															{
																kyc.type.search('image') === -1
																? null
																:
																	<img
																		style={{ height: '100px', width: 'auto' }} 
																		src={URL.createObjectURL(kyc)}
																		alt='Failed to load preview'
																	/>
															}
															
															<div>{kyc.name}</div>
														</Fragment>
													)
												})
											}
										</div>
								}
							</div>
								
						</div>
						<div className="spm-form-two-col">
							<span style={{ fontSize: '18px', fontWeight: 'bold' }}>
								Bank and Finance Details
							</span>
							
							
							<TextField
								className="spm-form-two-row"
								value={accountNumber}
								margin="dense"
								label="Account No *"
								fullWidth
								onChange={(event) => {handleChangeAccountNumber(event.target.value)}}
							/>
							<TextField
								className="spm-form-two-row"
								value={bankName}
								margin="dense"
								label="Bank Name*"
								fullWidth
								onChange={(event) => {setBankName(event.target.value)}}
								/>
							<TextField
								className="spm-form-two-row"
								value={ifsccode}
								margin="dense"
								label="IFSC Code*"
								fullWidth
								onChange={(event) => {handleChangeIfscCode(event.target.value)}}

							/>
							<div style={{ margin: '1em 0' }}>
								<Select
									options={paymentMethodDropdown}
									className="basic-multi-select"
									classNamePrefix="select"
									placeholder="Enter Preferred Payment Method*"
									onChange={(itemId) => handleChangePaymentMethod(itemId.value)}
								/>
							</div>
							<div style={{ margin: '2.2em 0' }}>
								<Select
									options={paymentTATDropdown}
									value={paymentTAT}
									className="basic-multi-select"
									classNamePrefix="select"
									placeholder="Payment TAT*"
									onChange={(itemId) => setPaymentTAT(itemId)}
									isDisabled={preferredPayment === 'Cash'}
								/>
							</div>
						</div>
					</div>

					<Link className="btn btn-success rounded no-margin" to="/vendorManagement">
						Back
					</Link>
					
					<Button
						style={{ float: 'right' }}
						type="button"
						className="rounded no-margin"
						color='success'
						onClick = {handleSubmit}
						disabled={!validateInputs() || panDocs.length === 0 || kycDocs.length === 0}
					>
						Submit
					</Button>
				</CardBody>
			</Card>
		</>
	);
}

export default AddNewVendor;