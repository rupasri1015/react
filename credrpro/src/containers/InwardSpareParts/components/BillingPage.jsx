import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { Button, Card, CardBody } from 'reactstrap';
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import FileUpload from '../../../shared/components/form/UploadImgnPdf'
import { getUserID } from '../../../core/services/rbacServices';
import { submitInwarding } from '../../../core/services/liveInventoryUnitServices';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';
import { getVendorList } from '../../../core/services/partsRequirementServices';
import { parseForDropDown } from '../../LiveInventoryUnit/components/forms/utils';

const paymentMethodMenu = [
	{value: 2, label: 'Credit'},
	{value: 3, label: 'PayTm'},
	{value: 4, label: 'UPI'},
	{value: 5, label: 'Google Pay'},
    {value: 6, label: 'PhonePe'}
];

const paymentMethodMenuCash = [
	{value: 1, label: 'Cash'},
	{value: 2, label: 'Credit'},
	{value: 3, label: 'PayTm'},
	{value: 4, label: 'UPI'},
	{value: 5, label: 'Google Pay'},
    {value: 6, label: 'PhonePe'}
];

const BillingPage = (props) => {
  const dispatch = useDispatch();
	const [fileSizeExceeded, setFileSizeExceeded] = useState(false);
	const [vendorList, setVendorList] = useState([]);
	const [vendor, setVendor] = useState({});
	const [otherVendor, setOtherVendor] = useState('');
	const [paymentMethod, setPaymentMethod] = useState({});
	const [transactionId, setTransactionId] = useState('');

	const { pageOneData, setPageNo, pageTwoData, setPageTwoData } = props;

	useEffect(() => {
		dispatch(showLoader());
		getVendorList(pageOneData.warehouseId)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				const vendorDropdown = parseForDropDown(apiResponse.data);
				vendorDropdown.splice(0, 0, {value: 0, label: 'Other'});
				setVendorList(vendorDropdown);
				setVendor({value: pageOneData.vendorId, label: pageOneData.vendorName})
				dispatch(hideLoader());
			} else {
				setVendorList([]);
				dispatch(hideLoader());
			}
		})

		const payment = paymentMethodMenuCash.filter(menu => menu.label === pageOneData.paymentMethod);
		setPaymentMethod(payment[0])
	}, [])

	const setBillNumber = (billNumber) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		tempPageTwoData.billNumber = billNumber;
		tempPageTwoData.attachedFile = attachedFile;
		setPageTwoData(tempPageTwoData);
	}

	const setDate = (date) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		if(new Date() > date) {
			tempPageTwoData.date = date;
		}
		tempPageTwoData.attachedFile = attachedFile;
		setPageTwoData(tempPageTwoData);
	}

	const setRemark = (remark) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		if(remark.length <= 100) {
			tempPageTwoData.remark = remark;
		}
		tempPageTwoData.attachedFile = attachedFile;
		setPageTwoData(tempPageTwoData);
	}

	const setFile = (file) => {
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		if(file[0].size/Math.pow(1024, 2) < 10) {
			setFileSizeExceeded(false);
			tempPageTwoData.attachedFile = file;
		}
		else {
			setFileSizeExceeded(true);
			tempPageTwoData.attachedFile = [];
		}
		setPageTwoData(tempPageTwoData);
	}

	const getTotalAmount = () => {
		const allPrices = pageOneData.items.map(item => parseFloat(item.totalPrice));
		const totalAmount = allPrices.reduce((a, b) => a + b, 0);
		return totalAmount.toFixed(2);
	}

	const getReturnedAmount = () => {
		const amount = pageOneData.givenAmount - getTotalAmount();
		return amount.toFixed(2);
	}

	const isPageTwoFormFilled = () => {
		if(
			pageTwoData.billNumber === ''
			|| pageTwoData.attachedFile.length === 0
			|| (vendor.label === 'Other' && otherVendor === '')
			|| (paymentMethod.label !== 'Cash' && paymentMethod.label !== 'Credit' && transactionId === '')
		) {
			return false;
		}
		return true;
	}

	const generatePayload = () => {
		const items = pageOneData.items.map((item) => {
			item.userId = getUserID();
			item.warehouseId = pageOneData.warehouseId;
			delete item.requestIds;
			delete item.mmvYearRanges;
			delete item.requestedQuantity;

			item.prDetails = item.prDetails.map((pr) => {
				delete pr.tempQty;
				return pr;
			})

			return item;
		})

		return {
			"payment": {
				"vendorId": vendor.value,
				"vendorName": vendor.value === 0 ? otherVendor : vendor.label,
        "billNumber": pageTwoData.billNumber,
        "billDate": pageTwoData.date,
        "totalAmount": getTotalAmount(),
				"remarks": pageTwoData.remark,
				"paymentMethod": paymentMethod.label,
				"transactionId": paymentMethod.label !== 'Cash' && paymentMethod.label !== 'Credit'
												 ? transactionId : null
			},
			items
		}
	}

	const handleSubmit = () => {
		const jsonPayload = generatePayload();
		const formData = new FormData();
		formData.append("file", pageTwoData.attachedFile[0]);
		formData.append("json", JSON.stringify(jsonPayload));

		dispatch(showLoader());
		submitInwarding(formData)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				dispatch(hideLoader());
				dispatch(setNotification('success', 'Data Added Successfully', ''));
				props.history.push('/liveInventoryUnit');
			}
			else {
				dispatch(setNotification('danger', 'Data is not added', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}

	const handleDummyClick = () => {};

	return(
		<Fragment>
			<Card>
			<CardBody>
				<div className="header-title" style={{ width: '30%' }}>
					Bill Details<br/>
					Order Id: {pageOneData.orderId}<br/>
					Vendor Name: 
					<Select
						options={vendorList}
						classNamePrefix="city-dropdown"
						onChange={val => setVendor(val)}
						value={vendor}
					/>
					{
						vendor.value === 0
						?
						<TextField
							value={otherVendor}
							margin="dense"
							label="Enter Vendor Name*"
							fullWidth
							style={{ fontWeight: 'normal' }}
							onChange={ (event) => setOtherVendor(event.target.value) }
						/>
						: null
					}
						
					<br/>
					Payment Method: 
					<Select
						options={pageOneData.paymentMethod === 'Credit' ? paymentMethodMenu : []}
						classNamePrefix="city-dropdown"
						onChange={val => setPaymentMethod(val)}
						value={paymentMethod}
					/>
					{
						paymentMethod.label !== 'Cash' && paymentMethod.label !== 'Credit'
						?
						<>
							<TextField
								value={transactionId}
								margin="dense"
								label="Enter Transaction Id*"
								fullWidth
								style={{ fontWeight: 'normal' }}
								onChange={ (event) => setTransactionId(event.target.value) }
							/>
						</>
						:null
					}
					<br/>
					{
						paymentMethod.label === 'Credit'
						?  `SLA: ${pageOneData.paymentSla} days`
						: null
					}
				</div>
				
				<Divider/>
				<div className="flex-row">
          <div className="spm-form-two-col" >
						<TextField
							className="spm-form-two-row"
							value={pageTwoData.billNumber || ''}
							autoFocus
							margin="dense"
							label="Enter Vendor Bill Number*"
							fullWidth
							onChange={ (event) => setBillNumber(event.target.value) }
						/>

						<MuiPickersUtilsProvider utils={DateFnsUtils} >
							<KeyboardDatePicker
								style={{ marginTop: '0.35em' }}
								fullWidth
								variant="inline"
								format="dd/MM/yyyy"
								margin="normal"
								id="bill-date"
								maxDate={new Date()}
								label="Enter Bill Date"
								value={pageTwoData.date}
								onChange={setDate}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
						<TextField
							className="spm-form-two-row"
							value={ pageTwoData.remark }
							margin="dense"
							label="Add Remarks (Max 100 characters)"
							fullWidth
							onChange={(event) => setRemark(event.target.value)}
						/>
						<div style={{ float: 'right', color: 'gray' }}>{pageTwoData.remark.length}/{100}</div>
						
						<div style={{ marginTop: '1em' }}>
							<FileUpload
                accept="image/*, application/pdf"
                onFileChange={setFile}
								name="Upload Invoice*"
              />
							{
								fileSizeExceeded
								? <div style={{ color: '#c00', marginTop: '0.5em' }}>
										** File size exceeded the 10 MB limit.
									</div>
								: <div style={{ color: '#0c0', marginTop: '0.5em' }}>
										{ pageTwoData.attachedFile.length === 0
											? null
											: pageTwoData.attachedFile[0].name 
										}
									</div>
							}
						</div>
              
          </div>
          <div className="spm-form-two-col">
						<TextField
							className="spm-form-two-row"
							value={ getTotalAmount() }
							margin="dense"
							label="Enter Total Amount"
							fullWidth
						/>
						<TextField
							className="spm-form-two-row"
							value={ 
								pageOneData.paymentMethod === 'Cash'
								? pageOneData.givenAmount 
								: 'NA' 
							}
							margin="dense"
							label="Cash Given"
							fullWidth
							disabled={pageOneData.paymentMethod !== 'Cash'}
						/>
						<TextField
							className="spm-form-two-row"
							value={
								pageOneData.paymentMethod === 'Cash'
								? getReturnedAmount()
								: 'NA'
							}
							disabled={pageOneData.paymentMethod === 'Credit'}
							margin="dense"
							label="Cash Returned"
							fullWidth
						/>
						
						
          </div>
				</div>
				
				<Button
					color="success"
					type="button"
					className="rounded no-margin"
					onClick={() => setPageNo(1)}
				>
					Back
				</Button>
				<Button
					style={{ float: 'right' }}
					color={ isPageTwoFormFilled() ? 'success' : 'secondary' }
					type="button"
					className="rounded no-margin"
					onClick = { isPageTwoFormFilled() ? handleSubmit : handleDummyClick }
				>
					Submit
				</Button>
			</CardBody>
			</Card>
		</Fragment>
		

	);
}

export default BillingPage;