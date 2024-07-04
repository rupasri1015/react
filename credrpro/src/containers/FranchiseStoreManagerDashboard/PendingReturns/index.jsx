import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import MuiTable from '@material-ui/core/Table';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Table from '../../../shared/components/Table';
import TableHead from '../../../shared/components/Table/components/TableHead';
import NoResultFound from '../../../shared/components/NoResultFound';
import ReturnsFilter from '../components/ReturnsFilter';
import ReturnPolicyDialog from '../components/ReturnPolicyDialog';
import DialogHeader from '../components/DialogHeader';
import ApprovalStatusFilter from '../components/ApprovalStatusFilter';
import ViewDocsDialog from '../components/ViewDocsDialog';
import ViewCommentsDialog from '../components/ViewCommentsDialog ';

import {
	fetchFSMPendingReturns,
	cancelPendingReturnRequest,
	approveReturn,
	rejectReturn
} from '../../../redux/actions/fetchFSMPendingReturns';

import { fetchDocumentUrlsById, getReturnPolicyDetails } from '../../../core/services/franchiseServices';
import { userTypeDetails } from '../../../core/services/authenticationServices';

import { capaitalize, getOnlyDate } from '../../../core/utility';
import menuIcon from '../../../shared/img/icons/action-icon.svg';
import styles from './styles.module.scss';

const PendingReturns = () => {
	const PageSize = 12;
	const dispatch = useDispatch();

	const {
		pendingReturns: list,
		count,
		pageNum: pageNumber,
		pageSize
	} = useSelector((state) => state.fsmPendingReturns);

	const [isTogglePolicyDialogVisible, togglePolicyDialog] = useState(false);
	const [activeStatus, setActiveStatus] = useState('all');
	const [isViewDocsDialogVisible, toggleViewDocsDialog] = useState(false);
	const [isViewCommentsDialogVisible, toggleViewCommentsDialog] = useState(false);
	const [showMenu, setShowMenu] = useState(null);
	const [filters, setFilters] = useState({});
	const [comments, setComments] = useState('');
	const [documentUrls, setDocumentUrls] = useState([]);
	let [item, setItemToBeUpdated] = useState({});
	const [disableApproveOrReject, _disableApproveOrReject] = useState(false);
	const [disableCancel, _disableCancel] = useState(false);
	const [name, setName] = useState('')
	const [callPayload, setCallPayload] = useState({})
	const [openCall, setOpenCall] = useState(false)
	const [returnPolicyDetails, setReturnPolicyDetails] = useState({});

	useEffect(() => {
		dispatch(fetchFSMPendingReturns({ PageSize }));
	}, []);

	const dateTypes = [
		{
			id: 1,
			label: 'Sold Date',
			value: 'purchaseDate'
		},
		{
			id: 2,
			label: 'Return Request Date',
			value: 'returnRequestedDate'
		}
	];

	const getDialogTitle = (type) => {
		return <DialogHeader title="Return Policy Details" onCloseClick={() => { togglePolicyDialog(false); setReturnPolicyDetails({}) }} />;
	};

	const pageChange = (page) => {
		window.scrollTo(0, 0);
		if (activeStatus === 'all')
			return dispatch(fetchFSMPendingReturns({ PageNo: page, PageSize, ...filters }));

		dispatch(fetchFSMPendingReturns({
			PageNo: page,
			PageSize, ...filters,
			returnStatus: activeStatus
		}));
	};

	const onApplyFilter = (filterObj) => {
		let filterPayload = {};
		let returnStatus = '';

		if (filterObj) {
			if (filterObj.dateType) {
				filterPayload = {
					PageSize,
					dateColumn: filterObj.dateType && filterObj.dateType,
					from: filterObj.fromDate && filterObj.fromDate,
					to: filterObj.toDate && filterObj.toDate,
				};
			}
			filterPayload = {
				...filterPayload,
				searchString: filterObj.searchTerm && filterObj.searchTerm
			}
		}
		setFilters(filterPayload);

		if (activeStatus !== 'all') {
			returnStatus = activeStatus.toUpperCase();

			return dispatch(fetchFSMPendingReturns({
				...filterPayload,
				returnStatus
			}));
		}

		return dispatch(fetchFSMPendingReturns(filterPayload));
	};

	const openCommentsDialog = (comments) => {
		setComments(comments);
		toggleViewCommentsDialog(true);
	}

	const openDocsDialog = (id) => {
		toggleViewDocsDialog(true);
		let urls = [];
		fetchDocumentUrlsById(id).then(response => {
			if (response.valid) {
				urls = response.resultSet.map(item => {
					return item.documentUrl;
				});
			}
			setDocumentUrls(urls);
		});
	}

	const openViewPolicyDialog = async (item) => {
		if (item.returnPolicyId) {
			const response = await getReturnPolicyDetails(item.returnPolicyId);
			if (response.valid) {
				const { resultSet: { policyDescription, policyExpirationDate, policyName } } = response;

				setReturnPolicyDetails({
					name: policyName,
					description: policyDescription,
					expiry: getOnlyDate(policyExpirationDate)
				});
			}
		} else {
			setReturnPolicyDetails({
				name: '-',
				description: '-',
				expiry: '-'
			});
		}

		togglePolicyDialog(true);
	}

	const renderReturnReason = (item, index) => {
		return (
			<div className={styles.returnReason}>
				{item.returnReason ? <span>{item.returnReason}</span> : <span>-</span>}
				{item.comments && item.comments.length ?
					<div className={styles.linkButton} onClick={() => openCommentsDialog(item.comments)}>
						View Comments
					</div>
					: <span />
				}
			</div>
		);
	};

	const renderViewDocBtn = (item, index) => {
		return (
			<div className={styles.linkButton} onClick={() => openDocsDialog(item.id)}>
				View Documents
			</div>
		);
	};

	const renderApprovalStatus = (item, index) => {
		const chipColor = item.returnStatus === 'CANCELLED' ? 'default' : 'primary';
		return (
			<Chip
				className={styles.statusText}
				label={capaitalize(item.returnStatus)}
				classes={{ colorPrimary: capaitalize(item.returnStatus) }}
				color={chipColor}
				size="small"
			/>
		);
	};

	const renderPolicyLink = (item) => {
		if (!item.returnPolicyId) return <div>NA</div>

		return (
			<button onClick={() => openViewPolicyDialog(item)} className="link-button">
				View Policy
			</button>
		);
	};

	const tableHeadCellConfig = [
		{
			label: 'Inventory Id',
			key: 'ibdId',
			type: 'string'
		},
		{
			label: 'Registration Number',
			key: 'vehicleNumber',
			type: 'string'
		},
		{
			label: 'Name',
			key: 'ownerName',
			type: 'string'
		},
		{
			label: 'Buyer Type',
			key: 'buyerType',
			type: 'string'
		},
		{
			label: 'Phone Number',
			key: 'phoneNumber',
			type: 'string'
		},
		{
			label: 'Return Request Date',
			key: 'returnRequestedDate',
			type: 'date'
		},
		{
			label: 'Sold Date',
			key: 'purchaseDate',
			type: 'date'
		},
		{
			label: 'Expiry Date',
			key: 'expiryDate',
			type: 'date'
		},
		{
			label: 'Invoiced Amount',
			key: 'invoiceAmount',
			type: 'amount'
		},
		{
			label: 'Refund Amount',
			key: 'refundAmount',
			type: 'amount',
		},
		{
			label: 'Approval Status',
			key: 'returnStatus',
			type: 'custom',
			renderItem: renderApprovalStatus
		},
		{
			label: 'Return Reason',
			key: 'returnReason',
			type: 'custom',
			renderItem: renderReturnReason
		},
		{
			label: 'Documents',
			key: 'documents',
			type: 'custom',
			renderItem: renderViewDocBtn
		},
		{
			label: 'Returns Policy',
			key: 'returnPolicyId',
			type: 'custom',
			renderItem: renderPolicyLink
		}
	];

	const statusFilters = [
		{
			label: 'ALL',
			slug: 'all'
		},
		{
			label: 'Pending',
			slug: 'pending'
		},
		{
			label: 'Approved',
			slug: 'approved'
		},
		{
			label: 'Rejected',
			slug: 'rejected'
		}
	];

	const onStatusFilterClick = (item) => {
		setActiveStatus(item.slug);
		if (item.slug === 'all') return dispatch(fetchFSMPendingReturns(filters));
		return dispatch(fetchFSMPendingReturns({ returnStatus: item.slug.toUpperCase(), ...filters }));
	};

	const onCancelClick = () => {
		item = {
			...item,
			returnStatus: "CANCELLED",
			returnSubStatus: "CANCELLED",
		};

		if (window.confirm('Are you sure. You want to cancel the request?')) {
			dispatch(cancelPendingReturnRequest({ item, activeFilter: activeStatus }));
		}
		setShowMenu();
	};

	const onApproveClick = () => {
		item = {
			...item,
			returnSubStatus: "PENDING RUNNER ASSIGNMENT",
			franchiseApproverId: userTypeDetails().userId
		};

		if (window.confirm('Are you sure. You want to approve the request?')) {
			dispatch(approveReturn({ item, activeFilter: activeStatus }));
		}
		setShowMenu();
	};

	const onRejectClick = () => {
		item = {
			...item,
			returnStatus: "REJECTED",
			returnSubStatus: "REJECTED",
		};

		if (window.confirm('Are you sure. You want to reject the request?')) {
			dispatch(rejectReturn({ item, activeFilter: activeStatus }));
		}
		setShowMenu();
	}

	const openActionsMenu = ({ e, item }) => {
		_disableCancel(
			item.returnStatus === 'CANCELLED' ||
			item.returnStatus === 'REJECTED' ||
			item.returnSubStatus === 'PENDING REFUND APPROVAL');

		_disableApproveOrReject(!(item.returnSubStatus === 'PENDING REFUND APPROVAL'
			&& (item.returnStatus !== 'CANCELLED' ||
				item.returnStatus !== 'REJECTED')));

		setItemToBeUpdated(item);
		setShowMenu(e.currentTarget);
	}

	const renderCancelBtn = () => {
		return (
			<img
				src={menuIcon}
				id="menu-icon"
				alt="Action"
				role="button"
				className="action-icon"
			/>
		);
	};

	const actionButtons = [
		{
			name: 'Cancel',
			component: renderCancelBtn,
			onClickHandler: openActionsMenu
		}
	];

	const renderEmptyTable = () => {
		return (
			<div className="table-wraper mt-3">
				<MuiTable size="small">
					<TableHead
						tableHeadCellConfig={tableHeadCellConfig}
					/>
				</MuiTable>
				<div className="table-paginator">
					<NoResultFound />
				</div>
			</div>
		);
	}

	const renderTable = () => {
		if (!list.length) return renderEmptyTable();

		return (
			<Table
				tableHeadCellConfig={tableHeadCellConfig}
				items={list}
				rowsPerPage={pageSize}
				totalItemsCount={count}
				pageNum={pageNumber}
				actionButtons={actionButtons}
				onPageChange={pageChange}
				classNames={{ tableActionHeadCellClassName: 'text-center' }}
			/>
		)
	}

	return (
		<div>
			<h3>Pending Return details</h3>

			<ApprovalStatusFilter
				statusFilters={statusFilters}
				activeStatus={activeStatus}
				onStatusFilterClick={onStatusFilterClick}
			/>

			<ReturnsFilter dateTypes={dateTypes} onApplyFilter={onApplyFilter} />

			{renderTable()}

			<Menu anchorEl={showMenu} keepMounted open={Boolean(showMenu)} onClose={() => setShowMenu()}>
				<MenuItem onClick={onCancelClick} disabled={disableCancel}>Cancel</MenuItem>
				<MenuItem onClick={onApproveClick} disabled={disableApproveOrReject}>Approve</MenuItem>
				<MenuItem onClick={onRejectClick} disabled={disableApproveOrReject}>Reject</MenuItem>
			</Menu>

			<ViewDocsDialog isOpen={isViewDocsDialogVisible} documentUrls={documentUrls} onCloseClick={() => { toggleViewDocsDialog(false); setDocumentUrls([]); }} />

			<ViewCommentsDialog isOpen={isViewCommentsDialogVisible} comments={comments} onCloseClick={() => { toggleViewCommentsDialog(false); setComments(''); }} />

			<ReturnPolicyDialog
				isOpen={isTogglePolicyDialogVisible}
				details={returnPolicyDetails}
				title={getDialogTitle('policy')}
				onCloseClick={() => { togglePolicyDialog(false); setReturnPolicyDetails({}) }}
			/>
		</div>
	);
};

export default PendingReturns;
