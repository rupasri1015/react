import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Filter from '../components/ShowroomSalesFilter';
import Table from './Table';
import { getShowRoomSales } from '../../../redux/actions/showroomSalesAction';
import { userTypeDetails } from '../../../core/services/authenticationServices';
import { refundToken } from '../../../core/services/franchiseServices'
import SalesHeader from '../StoreLeads/Header';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import './sales.scss'
import { setNotification } from '../../../redux/actions/notificationAction';
import SoldPopup from './Modal'
import ViewPDFFiles from './ViewPdf'

const StoreSales = () => {

	const [filters, setFilters] = useState({});
	const storeID = userTypeDetails().userType.storeId;
	const [status, setStatus] = useState('TOKEN')
	const [open, setPopupOpen] = useState(false)
	const [rowInfo, setRowInfo] = useState({})
	const [viewPdfs, setViewPdfs] = useState(false)
	const [splittedPdfs, setSplittedPdfs] = useState([])
	const [filetrDrawer, setFiltersDrawer] = useState(false)

	const dispatch = useDispatch();

	useEffect(() => {
		// This Actions fetches the Assinged inventory, acceptedStatus key will decide which data to return
		dispatch(getShowRoomSales({ pageNum: 1, storeId: storeID, paymentStatus: 'TOKEN' }));
	}, []);

	const list = useSelector((state) => state.showroomSales.manageLeadsResponse);
	const count = useSelector((state) => state.showroomSales.count);
	const pageNum = useSelector((state) => state.showroomSales.pageNum);

	const pageChange = (page) => {
		window.scrollTo(0, 0);
		dispatch(getShowRoomSales({ pageNum: page, storeId: storeID, ...filters, paymentStatus: status }));
	};

	const updateStatus = (status) => {
		setStatus(status)
		dispatch(getShowRoomSales({ pageNum: 1, storeId: storeID, ...filters, paymentStatus: status }));
	}

	const onApplyFilter = (filterObj) => {
		let payload = { storeId: storeID, paymentStatus: status };
		if (filterObj) {
			payload = {
				...payload,
				fromDate: filterObj.fromDate,
				toDate: filterObj.toDate,
				regNumber: filterObj.regnum,
				saleParameter: filterObj.dateType,
				registrationNumber: filterObj.searchRegText,
				name: filterObj.name,
				mobileNo: filterObj.mobileNumber,
				orderType: 'desc',
				storeId: storeID,
				paymentParameter: filterObj.paymentParameter
			}
		}
		setFilters(payload);
		setFiltersDrawer(true)
		return dispatch(getShowRoomSales({ ...payload, pageNum: 1 }));
	};

	const refundAmount = (item) => {
		const payload = {
			leadId: item.leadId,
			invId: item.invId
		}
		dispatch(showLoader())
		refundToken(payload).
			then(refundResponse => {
				if (refundResponse.isValid) {
					dispatch(setNotification('success', 'SUCCESS', refundResponse.message))
					setStatus('REFUND')
				}
			})
		setTimeout(() => {
			dispatch(hideLoader())
		}, 500)
	}

	const openPdf = (item) => {
		setViewPdfs(true)
		let splitPdfs = item.tranactionreciptUrls.split('$')
		setSplittedPdfs(splitPdfs)
	}

	const viewSaleRecieptButton = (item, index) => {
		if (status === 'TOKEN') return <div><button className='refundClass' onClick={() => refundAmount(item)}>Refund</button></div>

		return (
			<button className="link-button" onClick={() => openPdf(item)}>
				View PDF
			</button>
		);
	};

	const markAsSoldButton = (item, index) => {
		return (
			<button className="refundClass" onClick={() => openMarkAsSoldPopup(item)}>
				Mark As Sold
			</button>
		)
	};

	const getTableHeaders = () => {
		if (status === 'TOKEN') {
			return tableTokenHeadCellConfig
		}
		else {
			return tableHeadCellConfig
		}
	}

	const tableTokenHeadCellConfig = [
		{
			label: 'Sale Date',
			key: 'soldDate',
			type: 'date'
		},
		{
			label: 'Registration number',
			key: 'registrationNumber',
			type: 'string'
		},
		{
			label: 'Name',
			key: 'customerName',
			type: 'string'
		},
		{
			label: 'Mobile Number',
			key: 'customerMobileName',
			type: 'string'
		},
		{
			label: 'Sale Status',
			key: 'paymentStatus',
			type: 'string'
		},
		{
			label: 'Showroom Name',
			key: 'storeName',
			type: 'string'
		},
		{
			label: 'Margin',
			key: 'margin',
			type: 'amount'
		},
		{
			label: 'Refund',
			key: 'refund',
			type: 'custom',
			renderItem: viewSaleRecieptButton
		},
		{
			label: 'Action',
			key: 'action',
			type: 'custom',
			renderItem: markAsSoldButton
		}
	];

	const tableHeadCellConfig = [
		{
			label: 'Sale Date',
			key: 'soldDate',
			type: 'date'
		},
		{
			label: 'Registration number',
			key: 'registrationNumber',
			type: 'string'
		},
		{
			label: 'Name',
			key: 'customerName',
			type: 'string'
		},
		{
			label: 'Mobile Number',
			key: 'customerMobileName',
			type: 'string'
		},
		{
			label: 'Sale Status',
			key: 'paymentStatus',
			type: 'string'
		},
		{
			label: 'Showroom Name',
			key: 'storeName',
			type: 'string'
		},
		{
			label: 'Margin',
			key: 'margin',
			type: 'amount'
		},
		{
			label: 'View Reciept',
			key: 'view',
			type: 'custom',
			renderItem: viewSaleRecieptButton
		},
	];

	const openMarkAsSoldPopup = (item) => {
		setRowInfo(item)
		setPopupOpen(true)
	}

	const closeSoldPopup = () => {
		setPopupOpen(false)
	}

	const closeViewPdfs = () => {
		setViewPdfs(false)
		setSplittedPdfs([])
	}

	const handleClearFilters = () => {
		if (Object.keys(filters).length) {
			setFilters({})
			setFiltersDrawer(false)
			dispatch(getShowRoomSales({ pageNum: 1, storeId: storeID, paymentStatus: status }));
		}
	}

	const changeStatus = (value) => {
		setStatus(value)
		dispatch(getShowRoomSales({ pageNum: 1, storeId: storeID, paymentStatus: value }));
	}

	return (
		<div>
			<Filter
				onApplyFilter={onApplyFilter}
				searchPlaceHolder="Search by MMV"
				showDateTypeDropdown={false}
				showSearchByRegistration={true}
				onClearFilters={handleClearFilters}
			/>
			<SalesHeader
				onChangeStatus={updateStatus}
				status={status}
			/>
			<div style={{ marginTop: '5px', marginLeft: '3px' }}>
				
				<Table
					items={list}
					rowsPerPage={15}
					totalItemsCount={count}
					pageNum={pageNum}
					onPageChange={pageChange}
					storeID={storeID}
					classNames={{ tableActionHeadCellClassName: 'text-center' }}
					status={status}
					filetrDrawer={filetrDrawer}
					onStatusChange={changeStatus}
				/>
			</div>
			{
				<SoldPopup
					open={open}
					rowInfo={rowInfo}
					onClose={closeSoldPopup}
				/>
			}
			{
				<ViewPDFFiles
					viewPdfs={viewPdfs}
					splittedPdfs={splittedPdfs}
					onClose={closeViewPdfs}
				/>
			}
		</div>
	)
};

export default StoreSales;
