import React, { Fragment, useState } from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import Divider from '@material-ui/core/Divider'
import Header from '../Header';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { isPositiveFloat, isPageTwoFormFilled, roundUptoTwoDecimal } from './utils';
import FileUpload from '../../../../shared/components/form/UploadImgnPdf'
import { getUserID } from '../../../../core/services/rbacServices';
import { submitInwarding } from '../../../../core/services/liveInventoryUnitServices';
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction';
import { setNotification } from '../../../../redux/actions/notificationAction';

const slaDropdownOptions = [
	{label: 'Pre-Paid', value: 'prePaid'},
	{label: 'Credit', value: 'Credit'},
]

const FormPageTwo = (props) => {
  const dispatch = useDispatch();
	const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

	const  { pageTwoData, setPageTwoData } = props;

	const generatePayload = () => {
		let payload = {};

		payload.payment = {
			"vendorId": props.pageTwoData.vendorName.value,
			"billNumber": props.pageTwoData.billNumber,
			"billDate": props.pageTwoData.date,
			"totalAmount": props.pageTwoData.totalAmount,
			"discount": props.pageTwoData.discount,
			"gst": props.pageTwoData.gst,
			"paymentSLA": props.pageTwoData.paymentSLA.value,
			"remarks": props.pageTwoData.remark
		}

		payload.inwardParts = props.pageOneData.map((rowData) => {
			return(
				{
					"sparePartName": rowData.partName.label,
					"section": rowData.section.value,
					"category": rowData.category.value,
					"sparePartId": rowData.partName.value,
					"warehouseId": props.wareHouse.value,
					"inwardQuantity": rowData.qty, 
					"unitPrice": rowData.unitPrice,
					"modelNumber": rowData.modelNo,
					"sourceType": rowData.sourceType.value,
					"userId": getUserID(), 
					"mmvYears": rowData.mmvYearRange.map((mmv) => {
						return mmv.value
					})
				}
			)
		});

		return payload;
	}

	const handleSubmit = () => {
		
		const jsonPayload = generatePayload();
		const formData = new FormData();
		formData.append("file", props.pageTwoData.attachedFile[0]);
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

	const handleDummyClick = () => {}

	const setVendorName = (vendorName) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		tempPageTwoData.vendorName = vendorName;
		tempPageTwoData.attachedFile = attachedFile;
		setPageTwoData(tempPageTwoData);
	}

	const setBillNumber = (billNumber) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		tempPageTwoData.billNumber = billNumber;
		tempPageTwoData.attachedFile = attachedFile;
		setPageTwoData(tempPageTwoData);
	}

	const setTotalAmount = (totalAmount) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		if(isPositiveFloat(totalAmount) || totalAmount === '') {
			tempPageTwoData.totalAmount = roundUptoTwoDecimal(totalAmount);
		}
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

	const setPaymentSLA = (paymentSLA) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		tempPageTwoData.paymentSLA = paymentSLA;
		tempPageTwoData.attachedFile = attachedFile;
		setPageTwoData(tempPageTwoData);
	}

	const setDiscount = (discount) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		if(isPositiveFloat(discount) || discount === '') {
			tempPageTwoData.discount = roundUptoTwoDecimal(discount);
		}
		tempPageTwoData.attachedFile = attachedFile;
		setPageTwoData(tempPageTwoData);
	}

	const setGST = (gst) => {
		const attachedFile = pageTwoData.attachedFile;
		let tempPageTwoData  = JSON.parse(JSON.stringify(pageTwoData));
		if(isPositiveFloat(gst) || gst === '') {
			tempPageTwoData.gst = roundUptoTwoDecimal(gst);
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

	return(
		<Fragment>
			<Header toWrite='Spare Parts Details'/>
			<Card>
			<CardBody>
				<p className="header-title">Billing Details</p>
				<Divider/>
				<div className="flex-row">
          <div className="spm-form-two-col" >
						<Select
							className="spm-form-two-row"
							options={props.vendorList}
							placeholder="Enter Vendor Name*"
							onChange={setVendorName}
							value={pageTwoData.vendorName}
							isDisabled={props.wareHouse === ''}
						/>
						<TextField
							className="spm-form-two-row"
							value={pageTwoData.billNumber}
							autoFocus
							margin="dense"
							label="Enter Vendor Bill Number*"
							fullWidth
							onChange={ (event) => setBillNumber(event.target.value) }
							disabled={props.wareHouse === ''}
						/>

						<TextField
							className="spm-form-two-row"
							value={ pageTwoData.totalAmount }
							autoFocus
							margin="dense"
							label="Enter Total Amount*"
							fullWidth
							onChange={ (event) => setTotalAmount(event.target.value) }
							disabled={props.wareHouse === ''}
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
								disabled={props.wareHouse === ''}
							/>
						</MuiPickersUtilsProvider>
						
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
						<Select
							className="spm-form-two-row"
							options={slaDropdownOptions}
							placeholder="Select Payment SLA*"
							onChange={setPaymentSLA}
							value={pageTwoData.paymentSLA}
							isDisabled={props.wareHouse === ''}
						/>
						<TextField
							className="spm-form-two-row"
							value={ pageTwoData.discount }
							autoFocus
							margin="dense"
							label="Enter Discount (%)"
							fullWidth
							onChange={(event) => setDiscount(event.target.value)}
							disabled={props.wareHouse === ''}
						/>
						<TextField
							className="spm-form-two-row"
							value={ pageTwoData.gst }
							autoFocus
							margin="dense"
							label="Enter GST*"
							fullWidth
							onChange={(event) => setGST(event.target.value)}
							disabled={props.wareHouse === ''}
						/>
						
						<TextField
							className="spm-form-two-row"
							value={ pageTwoData.remark }
							autoFocus
							margin="dense"
							label="Add Remarks (Max 100 characters)"
							fullWidth
							onChange={(event) => setRemark(event.target.value)}
							disabled={props.wareHouse === ''}
						/>
						<div style={{ float: 'right', color: 'gray' }}>{pageTwoData.remark.length}/{100}</div>
          </div>
				</div>
				
				<Button
					color="success"
					type="button"
					className="rounded no-margin"
					onClick = { () => props.goToPrevPage(pageTwoData) }
				>
					Back
				</Button>
				<Button
					style={{ float: 'right' }}
					color={ isPageTwoFormFilled(pageTwoData) ? 'success' : 'secondary' }
					type="button"
					className="rounded no-margin"
					onClick = { isPageTwoFormFilled(pageTwoData) ? handleSubmit : handleDummyClick }
				>
					Submit
				</Button>
			</CardBody>
				
			</Card>
			
		</Fragment>
	)
}

export default FormPageTwo;