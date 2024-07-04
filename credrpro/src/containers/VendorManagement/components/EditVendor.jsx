import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody } from 'reactstrap';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Header from './Header';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';
import { getAllWarehouses } from '../../../core/services/liveInventoryUnitServices';
import { deleteVendorDetails, editVendorDetails } from '../../../core/services/vendorManagementServices';
import { parseForDropDown } from '../../LiveInventoryUnit/components/forms/utils';
import { getVendorDetails } from '../../../core/services/vendorManagementServices';
import { getRepairRequestId, } from '../../SparePartsAssignment/components/form/utils';
import { isPositiveInt } from '../../LiveInventoryUnit/components/forms/utils';
import { allFieldsFilled } from './utils';
import { paymentTATDropdown, paymentMethodDropdown } from './constants';
import { getRole } from '../../../core/services/rbacServices';

const EditVendor = ({ history }) => {
	const dispatch = useDispatch();
	const [vendorData, setVendorData] = useState({});
	const [selectedCity, setSelectedCity] = useState('');
	const [warehouseDropdown, setWarehouseDropdown] = useState('');
	const [selectedWarehouse, setSelectedWarehouse] = useState('');
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
	const [paymentTAT, setPaymentTAT] = useState('');
	const [enableEdit, setEnableEdit] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);

	useEffect(() => {
		const currentPath = window.location.pathname;
    dispatch(showLoader());
		getVendorDetails(getRepairRequestId(currentPath))
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setVendorData(apiResponse.data);
				setSelectedCity({
					label: apiResponse.data.address.cityName,
					value: apiResponse.data.address.cityId
				});
				setSelectedWarehouse({
					label: apiResponse.data.warehouseName,
					value: apiResponse.data.warehouseId
				});
				setSelectedPaymentMethod({
					value: apiResponse.data.preferredPayment,
					label: apiResponse.data.preferredPayment === 'Cash' ? 'Cash' : 'Credit'
				});
				setPaymentTAT({
					value: apiResponse.data.paymentTAT,
					label: apiResponse.data.paymentTAT.toString().concat(' Days')
				});
				setEnableEdit(true);
				dispatch(hideLoader());
			} else {
				dispatch(setNotification('danger', 'Can not load vendor details', apiResponse.message));
				dispatch(hideLoader());
			}
		})

		dispatch(showLoader());
		getAllWarehouses()
		.then(apiResponse => {
			if (apiResponse.isValid) {
				let dropdown = parseForDropDown(apiResponse.data);
				dropdown.shift();
				getRole() === 'SPARE_PARTS_MANAGER_CITY'
					? setWarehouseDropdown([])
					: setWarehouseDropdown(dropdown);
				dispatch(hideLoader());
			}
			else {
				dispatch(setNotification('danger', 'Can not load warehouse list', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}, [])

	const cityList = useSelector(state => state.cities.cityList);
	let cityDropdownOption = cityList.map(({ cityName: label, ...rest }) => ({ label, ...rest }));
	cityDropdownOption = cityDropdownOption.map(({ cityId: value, ...rest }) => ({ value, ...rest }));

	const handleChangeName = (name) => {
		let tempVendorData = JSON.parse(JSON.stringify(vendorData));
		tempVendorData.name = name;
		setVendorData(tempVendorData);
	} 

	const handleChangeEmail = (mail) => {
		let tempVendorData = JSON.parse(JSON.stringify(vendorData));
		tempVendorData.address.emailId = mail;
		setVendorData(tempVendorData);
	} 

	const handleChangeAddress = (address) => {
		let tempVendorData = JSON.parse(JSON.stringify(vendorData));
		tempVendorData.address.address = address;
		setVendorData(tempVendorData);
	}

	const handleChangeCity = (city) => {
		let tempVendorData = JSON.parse(JSON.stringify(vendorData));
		tempVendorData.address.cityId = city.value;
		tempVendorData.address.cityName = city.label;
		setSelectedCity(city);
		setVendorData(tempVendorData);
	}

	const handleChangePincode = (pin) => {
		if((isPositiveInt(pin) || pin === '') && pin.length <= 6) {
			let tempVendorData = JSON.parse(JSON.stringify(vendorData));
			tempVendorData.address.pincode = pin;
			setVendorData(tempVendorData);
		}
	}

	const handleChangePhonenumber = (phone) => {
		if((isPositiveInt(phone) || phone === '') && phone.length <= 10) {
			let tempVendorData = JSON.parse(JSON.stringify(vendorData));
			tempVendorData.address.phoneNumber = phone;
			setVendorData(tempVendorData);
		}
	}

	const handleChangeWarehouse = (warehouse) => {
		let tempVendorData = JSON.parse(JSON.stringify(vendorData));
		tempVendorData.warehouseId = warehouse.value;
		tempVendorData.warehouseName = warehouse.label;
		setSelectedWarehouse(warehouse)
		setVendorData(tempVendorData);
	}

	const handleChangeAccountNumber = (account) => {
		if((isPositiveInt(account) || account === '') && account.length <= 20) {
			let tempVendorData = JSON.parse(JSON.stringify(vendorData));
			tempVendorData.vendorBankDetailsBean.accountNumber = account;
			setVendorData(tempVendorData);
		}
	}

	const handleChangeBank = (bank) => {
		let tempVendorData = JSON.parse(JSON.stringify(vendorData));
		tempVendorData.vendorBankDetailsBean.bankName = bank;
		setVendorData(tempVendorData);
	}

	const handleChangeIfscCode = (ifsc) => {
		if(ifsc === '' || ifsc.length <= 11) {
			let tempVendorData = JSON.parse(JSON.stringify(vendorData));
			tempVendorData.vendorBankDetailsBean.ifsccode = ifsc;
			setVendorData(tempVendorData);
		}
	}

	const handleChangePaymentMethod = (paymentmethod) => {
		let tempVendorData = JSON.parse(JSON.stringify(vendorData));
		tempVendorData.preferredPayment = paymentmethod.value;
		if(paymentmethod.value === 'Cash') {
			tempVendorData.paymentTAT = '';
			setPaymentTAT('');
		}
		setSelectedPaymentMethod(paymentmethod);
		setVendorData(tempVendorData);
	}

	const handleChangePaymentTAT = (paymenttat) => {
		let tempVendorData = JSON.parse(JSON.stringify(vendorData));
		tempVendorData.paymentTAT = paymenttat.value;
		setPaymentTAT(paymenttat);
		setVendorData(tempVendorData);
	}

	const handleSave = () => {
		setPopUpOpen(false);
		dispatch(showLoader());
		editVendorDetails(vendorData)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				dispatch(setNotification('success', 'Edited vendor Details', apiResponse.message));
				dispatch(hideLoader());
				history.push('/vendorManagement');
			}
			else {
				dispatch(setNotification('danger', 'Can not edit vendor details', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	};

	const handlePopUpOpen = () => {
    setPopUpOpen(true);
  }

  const handlePopUpClose = () => {
    setPopUpOpen(false);
	}

	const handleDeleteDetails = () => {
		setPopUpOpen(false);
		dispatch(showLoader());
		deleteVendorDetails(vendorData.vendorId)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				dispatch(setNotification('success', 'Deleted vendor Details', apiResponse.message));
				dispatch(hideLoader());
				history.push('/vendorManagement');
			}
			else {
				dispatch(setNotification('danger', 'Can not delete vendor details', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}

	return(
		<>
		<Dialog
        open={popUpOpen}
        onClose={handlePopUpClose}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth
			>
        <DialogTitle id="form-dialog-title">
          Once confirmed the data will be deleted permanently.
					Are you sure that you want to delete this vendor details?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handlePopUpClose} color="secondary" className="rounded no-margin">
            No
          </Button>
          <Button onClick={handleDeleteDetails} color="danger" className="rounded no-margin">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
			<Header toWrite='Vendor Management'/>
			<Card>
				<CardBody>
					<div className="flex-row">
						<div className="spm-form-two-col" >
							<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Contact Details</span>
							<TextField
								className="spm-form-two-row"
								value={vendorData.name || ''}
								margin="dense"
								label="Vendor Name*"
								fullWidth
								disabled={!enableEdit}
								onChange={ (event) => handleChangeName(event.target.value) }
							/>
							<TextField
								className="spm-form-two-row"
								value={(vendorData.address && vendorData.address.emailId) || ''}
								margin="dense"
								label="Email"
								fullWidth
								disabled={!enableEdit}
								autoFocus
								onChange={ (event) => handleChangeEmail(event.target.value) }
							/>
							<TextField
								className="spm-form-two-row"
								value={(vendorData.address && vendorData.address.address) || ''}
								margin="dense"
								label="Address"
								disabled={!enableEdit}
								fullWidth
								onChange={ (event) => handleChangeAddress(event.target.value) }
							/>

							<div style={{ margin: '1em 0' }}>
								<Select
									options={cityDropdownOption}
									value={selectedCity}
									className="basic-multi-select"
									classNamePrefix="select"
									placeholder="Select City*"
									isDisabled={!enableEdit}
									onChange={(city) => handleChangeCity(city)}
								/>
							</div>
							
							
							<TextField
								className="spm-form-two-row"
								value={(vendorData.address && vendorData.address.pincode) || ''}
								margin="dense"
								label="PIN Code*"
								fullWidth
								disabled={!enableEdit}
								onChange={ (event) => handleChangePincode(event.target.value) }
							/>
							<TextField
								className="spm-form-two-row"
								value={(vendorData.address && vendorData.address.phoneNumber) || ''}
								margin="dense"
								label="Phone Number*"
								fullWidth
								disabled={!enableEdit}
								onChange={ (event) => handleChangePhonenumber(event.target.value) }
							/>
							
							<div style={{ margin: '1em 0' }}>
								<Select
									options={warehouseDropdown}
									value={selectedWarehouse}
									className="basic-multi-select"
									classNamePrefix="select"
									placeholder="Select Warehouse"
									isDisabled={!enableEdit}
									onChange={(itemId) => handleChangeWarehouse(itemId)}
								/>
							</div>
							<div style={{ marginTop: '1em' }}>
								KYC Images<br/>
								{
									vendorData.kycdocs
									?
										<div style={{ display:' flex', flexDirection: 'row'  }}>
											{
												vendorData.kycdocs.map((doc, ind) => {
													return(
														<div key={ind} style={{ marginRight: '2em' }}>
															<img
																src={doc.url}
																alt='Preview not available'
																style={{ height: '100px', width: 'auto' }}
															/>
															<div>
																<a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.imageName}</a>
															</div>
														</div>
													);
												})
											}
										</div>
									: null
								}
							</div>
							<div style={{ marginTop: '1em' }}>
								PAN Card Images<br/>
								{
									vendorData.pancards
									?
										<div style={{ display:' flex', flexDirection: 'row'  }}>
											{
												vendorData.pancards.map((doc, ind) => {
													return(
														<div key={ind} style={{ marginRight: '2em' }}>
															<img
																src={doc.url}
																alt='Preview not available'
																style={{ height: '100px', width: 'auto' }}
															/>
															<div>
																<a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.imageName}</a>
															</div>
														</div>
													);
												})
											}	
										</div>
									: null
								}
							</div>
								
						</div>
						<div className="spm-form-two-col">
							<span style={{ fontSize: '18px', fontWeight: 'bold' }}>
								Bank and Finance Details
							</span>
							
							
							<TextField
								className="spm-form-two-row"
								value={(
									vendorData.vendorBankDetailsBean
									&& vendorData.vendorBankDetailsBean.accountNumber
								) || ''}
								margin="dense"
								label="Account No*"
								fullWidth
								disabled={!enableEdit}
								onChange={(event) => {handleChangeAccountNumber(event.target.value)}}
							/>
							<TextField
								className="spm-form-two-row"
								value={(
									vendorData.vendorBankDetailsBean
									&& vendorData.vendorBankDetailsBean.bankName
								) || ''}
								margin="dense"
								label="Bank Name*"
								fullWidth
								disabled={!enableEdit}
								onChange={(event) => {handleChangeBank(event.target.value)}}
								/>
							<TextField
								className="spm-form-two-row"
								value={(
									vendorData.vendorBankDetailsBean
									&& vendorData.vendorBankDetailsBean.ifsccode
								) || ''}
								margin="dense"
								label="IFSC Code*"
								fullWidth
								disabled={!enableEdit}
								onChange={(event) => {handleChangeIfscCode(event.target.value)}}

							/>
							<div style={{ margin: '1em 0' }}>
								<Select
									value={selectedPaymentMethod}
									options={paymentMethodDropdown}
									className="basic-multi-select"
									classNamePrefix="select"
									placeholder="Preferred Payment Method"
									onChange={(itemId) => handleChangePaymentMethod(itemId)}
									isDisabled={!enableEdit}
								/>
							</div>
							<div style={{ margin: '2.2em 0' }}>
								<Select
									options={paymentTATDropdown}
									value={paymentTAT}
									className="basic-multi-select"
									classNamePrefix="select"
									placeholder="Payment TAT"
									onChange={(itemId) => handleChangePaymentTAT(itemId)}
									isDisabled={
										selectedPaymentMethod.value === 'Cash'
										|| !enableEdit
									}
								/>
							</div>
						</div>
					</div>

					<Link className="btn btn-success rounded no-margin" to="/vendorManagement">
						Back
					</Link>

					<Button
						style={{ float: 'right', marginLeft: '1em' }}
						type="button"
						className="rounded no-margin"
						color='danger'
						onClick = {handlePopUpOpen}
					>
						Delete
					</Button>
					
					<Button
						style={{ float: 'right' }}
						type="button"
						className="rounded no-margin"
						color='success'
						onClick = {enableEdit ? handleSave : () => setEnableEdit(true)}
						disabled={!allFieldsFilled(vendorData)}
					>
						{enableEdit ? 'Save' : 'Edit'}
					</Button>
					
				</CardBody>
			</Card>
		</>
	);
}

export default EditVendor;
