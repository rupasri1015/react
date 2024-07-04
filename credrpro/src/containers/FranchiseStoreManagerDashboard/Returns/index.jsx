import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from 'reactstrap';

import ReturnsFilter from '../components/ReturnsFilter';
import Table from '../../../shared/components/Table';
import ReturnPolicyDialog from '../components/ReturnPolicyDialog';

import { fetchFSMReturns } from '../../../redux/actions/franchiseStoreReturns';
import { setNotification } from '../../../redux/actions/notificationAction';
import { createFSMRequestReturn } from '../../../redux/actions/createFSMRequestReturn';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { uploadReturnsDocs } from '../../../core/services/franchiseServices';
import { userTypeDetails } from '../../../core/services/authenticationServices';
import { getDatePayload } from '../../../core/utility';
import DialogHeader from '../components/DialogHeader';
import ReturnRequestDialog from '../components/ReturnRequestDialog';
import styles from './styles.module.scss';
import { renderString } from '../../../core/utility'
import { getUserID, getMobile } from '../../../core/services/rbacServices'
import { CallIcon } from '../../../core/utility/iconHelper'
import { callToCustomer } from '../../../core/services/biddingServices'
import CallAction from './CallAction'

const Returns = () => {
	const [isReturnReqDialogVisible, toggleReturnRequestDialog] = useState(false);
	const [isTogglePolicyDialogVisible, togglePolicyDialog] = useState(false);
	const [filters, setFilters] = useState({});
	const [requestReturnObj, setRequestReturnObj] = useState({});
	const [callPayload, setCallPayload] = useState({})
	const [openCall, setOpenCall] = useState(false)
	const [returnPolicyDetails, setReturnPolicyDetails] = useState({});
	const [name, setName] = useState('')
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchFSMReturns());
	}, []);

	const list = useSelector((state) => state.fsmReturns.bikeDetails);
	const count = useSelector((state) => state.fsmReturns.count);
	const pageNumber = useSelector((state) => state.fsmReturns.pageNumber);
	const totalPages = useSelector((state) => state.fsmReturns.totalPages);

	const pageChange = (page) => {
		window.scrollTo(0, 0);
		dispatch(fetchFSMReturns(filters, page));
	};

	const openViewPolicyDialog = (item) => {
		setReturnPolicyDetails({
			name: item.returnsPolicyTitle,
			description: item.returnsPolicyDescription,
			expiry: item.expiryDate
		});

		togglePolicyDialog(true);
	}

	const renderPolicyLink = (item) => {
		return (
			<button onClick={() => openViewPolicyDialog(item)} className="link-button">
				View Policy
			</button>
		);
	};

	const renderMobileNumber = (item) => {
		setName(item.name)
		return (
			<p>
				{renderString('XXXXXXXXXX')}
				<span><img src={CallIcon} style={{ width: 20, cursor: "pointer", marginLeft: '6px' }} alt="Call To Customer" onClick={() => callCustomer(item)} /></span>
			</p>
		)
	}

	const tableHeadCellConfig = [
		{
			label: 'Registration Number',
			key: 'vehicleNumber',
			type: 'string'
		},
		{
			label: 'Name',
			key: 'name',
			type: 'string'
		},
		{
			label: 'Buyer Type',
			key: 'buyerType',
			type: 'string'
		},
		{
			label: 'Phone Number',
			key: 'contactNumber',
			type: 'custom',
			renderItem: renderMobileNumber
		},
		{
			label: 'Sold Date',
			key: 'soldDate',
			type: 'string'
		},
		{
			label: 'Expiry Date',
			key: 'expiryDate',
			type: 'string'
		},
		{
			label: 'Invoiced Amt',
			key: 'invoiceAmount',
			type: 'amount'
		},
		{
			label: 'Retrun Policy',
			key: 'returnsPolicyUrl',
			type: 'custom',
			renderItem: renderPolicyLink
		}
	];

	const openReturnRequestDialog = (returnObj) => {
		setRequestReturnObj(returnObj);
		toggleReturnRequestDialog(true);
	};

	const getActionButton = () => {
		// TODO: Render two buttons conditonaly
		return (
			<Button outline color="warning" className={styles.reqBtn}>
				Request Return
			</Button>
		);
	};

	const callCustomer = (item) => {
		const payload = {
			fromNumber: getMobile(),
			toNumber: item.contactNumber,
			userId: getUserID(),
			leadId: item.leadId,
			callComments: 'Store Manager'
		}
		setOpenCall(true)
		setCallPayload(payload)
		setName(item.name)
	}

	const onCallCustomer = () => {
		callToCustomer(callPayload)
			.then(apiResponse => {
				if (apiResponse.isValid) {
					setOpenCall(false)
					setCallPayload(callPayload)
					setName(null)
					dispatch(setNotification('success', 'SUCCESS', 'Call started'))
				}
			})
	}

	const closeCallAction = () => {
		setOpenCall(false)
		setCallPayload(callPayload)
		setName(null)
	}

	const getDialogTitle = (type) => {
		if (type === 'policy')
			return <DialogHeader title="Return Policy Details" onCloseClick={() => { togglePolicyDialog(false); setReturnPolicyDetails({}) }} />;
		else return <DialogHeader title="Return Request" onCloseClick={() => toggleReturnRequestDialog(false)} />;
	};

	const onApplyFilter = (filterObj) => {
		setFilters(filterObj);
		return dispatch(fetchFSMReturns(filterObj));
	};

	const _onSaveClick = async (returnDetails) => {
		const userId = userTypeDetails().userType.id;
		let payload = {
			comments: returnDetails.comments,
			franchiseManagerId: userId,
			referenceId: requestReturnObj.item.objectId,
			returnPolicyId: requestReturnObj.item.returnsPolicyId,
			returnReason: returnDetails.returnReason,
			requestFrom: requestReturnObj.item.buyerType.toUpperCase(),
			invoiceAmount: requestReturnObj.item.invoiceAmount,
			contactNumber: requestReturnObj.item.contactNumber,
			expiryDate: getDatePayload(requestReturnObj.item.expiryDate),
			ownerName: requestReturnObj.item.name,
			soldDate: getDatePayload(requestReturnObj.item.soldDate),
		};
		if (returnDetails.images.length > 0) {
			dispatch(showLoader());
			const formData = new FormData();
			returnDetails.images.forEach((file) => {
				formData.append('file', file);
			});
			const uploadDocsResp = await uploadReturnsDocs(formData);
			if (uploadDocsResp.isValid) {
				payload = {
					...payload,
					imageUrls: uploadDocsResp.urls
				};
				dispatch(hideLoader());
				dispatch(createFSMRequestReturn(payload, requestReturnObj.item.vehicleNumber));
			} else dispatch(setNotification('danger', 'ERROR', uploadDocsResp.message));
		} else dispatch(createFSMRequestReturn(payload, requestReturnObj.item.vehicleNumber));

		toggleReturnRequestDialog(false);
	};

	const actionButtons = [
		{
			name: 'return',
			component: getActionButton,
			onClickHandler: openReturnRequestDialog
		}
	];

	return (
		<div>
			<h3>Return details</h3>
			<ReturnsFilter onApplyFilter={onApplyFilter} />
			<Table
				tableHeadCellConfig={tableHeadCellConfig}
				items={list}
				rowsPerPage={15}
				totalItemsCount={count}
				pageNum={pageNumber}
				actionButtons={actionButtons}
				onPageChange={pageChange}
				classNames={{ tableActionHeadCellClassName: 'text-center' }}
			/>
			<ReturnPolicyDialog
				isOpen={isTogglePolicyDialogVisible}
				details={returnPolicyDetails}
				title={getDialogTitle('policy')}
				onCloseClick={() => { togglePolicyDialog(false); setReturnPolicyDetails({}) }}
			/>
			<ReturnRequestDialog
				isOpen={isReturnReqDialogVisible}
				title={getDialogTitle('returnReq')}
				cancelText="Cancel"
				confirmText="Save"
				// confirmBtnStyle={{ backgroundColor: '#4DBD74' }}
				onCloseClick={() => toggleReturnRequestDialog(false)}
				onSaveClick={_onSaveClick}
			/>
			<CallAction
				open={openCall}
				onClose={closeCallAction}
				onYes={onCallCustomer}
				name={name}
			/>
		</div>
	);
};

export default Returns;
