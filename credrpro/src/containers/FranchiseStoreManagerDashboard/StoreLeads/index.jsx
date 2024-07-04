import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Filter from '../components/ShowroomLeadsFilter';
import Table from './Table';
import { getShowRoomLeads } from '../../../redux/actions/showroomLeadsAction';
import { userTypeDetails } from '../../../core/services/authenticationServices';
import { getCityID } from '../../../core/services/rbacServices'
import { createWalkinLead } from '../../../core/services/franchiseServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import OfflineLeadCard from '../components/OfflineLeadCard'
import CreateLead from '../components/OfflineLeadForm'

const StoreLeads = () => {
	const [filters, setFilters] = useState({});
	const storeID = userTypeDetails().userType.storeId;
	const [open, setOpen] = useState(false)
	const [filetrDrawer, setFiltersDrawer] = useState(false)

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getShowRoomLeads({ pageNum: 1, storeID: storeID, cityID: getCityID() }));
	}, []);

	const list = useSelector((state) => state.showroom.storeLead);
	const count = useSelector((state) => state.showroom.count);
	const pageNum = useSelector((state) => state.showroom.pageNum);

	const pageChange = (page) => {
		// console.log('page', page)
		window.scrollTo(0, 0);
		dispatch(getShowRoomLeads({ pageNum: page, storeID: storeID, cityID: getCityID(), ...filters }));
	};


	const onApplyFilter = (filterObj) => {
		let payload = { storeID: storeID, cityID: getCityID() };
		// console.log('pay', payload)
		if (filterObj) {
			payload = {
				...payload,
				fromDate: filterObj.fromDate,
				toDate: filterObj.toDate,
				regNum: filterObj.regnum,
				searchByParameter: filterObj.dateType,
				registrationNumber: filterObj.searchRegText,
				name: filterObj.name,
				mobileNumber: filterObj.mobileNumber,
				leadType: filterObj.leadTypes,
				orderType: 'desc',
				storeID
			}
		}
		setFiltersDrawer(true)
		setFilters(payload);
		return dispatch(getShowRoomLeads({ ...payload, pageNum: 1 }));
	};

	const renderMMV = (item, index) => {
		return (
			<div>{item.make} {item.model} {item.variant}</div>
		);
	};

	const tableHeadCellConfig = [
		{
			label: 'Lead Created Date',
			key: 'leadCreatedDate',
			type: 'date'
		},
		{
			label: 'Registration number',
			key: 'regnum',
			type: 'string'
		},
		{
			label: 'MMV',
			key: 'make',
			type: 'custom',
			renderItem: renderMMV
		},
		{
			label: 'Name',
			key: 'name',
			type: 'string'
		},
		{
			label: 'Mobile Number',
			key: 'number',
			type: 'string'
		},
		{
			label: 'CSP',
			key: 'bikeprice',
			type: 'amount'
		}
	];

	const openWalkinLeadForm = () => {
		setOpen(true)
	}

	const closeDialog = () => {
		setOpen(false)
	}

	const createOfflineLead = (payload) => {
		createWalkinLead(payload)
			.then(leadResponse => {
				if (leadResponse.isValid) {
					setOpen(false)
					dispatch(setNotification('success', 'SUCCESS', 'Lead Created Successfully'))
					refreshPage()
				}
				else {
					setOpen(false)
					dispatch(setNotification('danger', 'ERROR', leadResponse.message))
				}
			})
	}

	const refreshPage = () => {
		dispatch(getShowRoomLeads({ pageNum: 1, storeID: storeID, cityID: getCityID() }));
	}

	const handleClearFilter = () => {
		if (Object.keys(filters).length) {
			setFilters({})
			setFiltersDrawer(false)
			dispatch(getShowRoomLeads({ pageNum: 1, storeID: storeID, cityID: getCityID() }));
		}
	}

	return (
		<div>
			<Filter
				onApplyFilter={onApplyFilter}
				searchPlaceHolder="Search by MMV"
				showDateTypeDropdown={false}
				showSearchByRegistration={true}
				onClearFilter={handleClearFilter}
			/>
			<OfflineLeadCard
				onOpenLeadForm={openWalkinLeadForm}
			/>
			<Table
				tableHeadCellConfig={tableHeadCellConfig}
				items={list}
				rowsPerPage={15}
				totalItemsCount={count}
				pageNum={pageNum}
				onPageChange={pageChange}
				storeID={storeID}
				classNames={{ tableActionHeadCellClassName: 'text-center' }}
				filetrDrawer={filetrDrawer}
			/>
			{
				<CreateLead
					open={open}
					onClose={closeDialog}
					onCreateLead={createOfflineLead}
				/>
			}
		</div>
	)
};

export default StoreLeads;
