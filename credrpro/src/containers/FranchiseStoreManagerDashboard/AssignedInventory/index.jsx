import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ReturnsFilter from '../components/ReturnsFilter';
import AssignedInventoryFilter from '../components/AssignedInvFilter'
import Table from '../../../shared/components/Table';

import { getPendingAssignList } from '../../../redux/actions/pendingAssignListAction';
import { userTypeDetails } from '../../../core/services/authenticationServices';

const AssignedInventory = () => {
	const [filters, setFilters] = useState({});
	const storeID = userTypeDetails().userType.storeId;

	const dispatch = useDispatch();

	useEffect(() => {
		// This Actions fetches the Assinged inventory, acceptedStatus key will decide which data to return
		dispatch(getPendingAssignList({ page: 1, acceptedStatus: "ASSIGNED", storeID }));
	}, []);


	const list = useSelector((state) => state.pending.pendingList);
	const count = useSelector((state) => state.pending.count);
	const pageNumber = useSelector((state) => state.pending.page);

	const pageChange = (page) => {
		window.scrollTo(0, 0);
		dispatch(getPendingAssignList({ page, acceptedStatus: "ASSIGNED", storeID, ...filters }));
	};

	const onApplyFilter = (filterObj) => {
		let payload = { page: 1, acceptedStatus: "ASSIGNED" };
		if (filterObj) {
			payload = {
				...payload,
				startDate: filterObj.fromDate,
				endDate: filterObj.toDate,
				mmv: filterObj.searchTerm,
				registrationNumber: filterObj.searchRegText,
				storeID
			}
		}
		setFilters(payload);
		return dispatch(getPendingAssignList(payload));
	};

	const handleClearFilter = () => {
		if (Object.keys(filters).length) {
			setFilters({})
			dispatch(getPendingAssignList({ page: 1, acceptedStatus: "ASSIGNED", storeID }));
		}
	}

	const tableHeadCellConfig = [
		{
			label: 'Assigned Date',
			key: 'assigneDate',
			type: 'date'
		},
		{
			label: 'Registration number',
			key: 'registrationNumber',
			type: 'string'
		},
		{
			label: 'MMV',
			key: 'mmv',
			type: 'string'
		},
		{
			label: 'CFP',
			key: 'assignedCfp',
			type: 'amount'
		},
		{
			label: 'CSP',
			key: 'assignedCrp',
			type: 'amount'
		},
	];

	return (
		<div>
			<AssignedInventoryFilter
				onApplyFilter={onApplyFilter}
				searchPlaceHolder="Search by MMV"
				showDateTypeDropdown={false}
				showSearchByRegistration={true}
				onClearFilter={handleClearFilter}
			/>
			<Table
				tableHeadCellConfig={tableHeadCellConfig}
				items={list}
				rowsPerPage={15}
				totalItemsCount={count}
				pageNum={pageNumber}
				onPageChange={pageChange}
				classNames={{ tableActionHeadCellClassName: 'text-center' }}
			/>
		</div>
	)
};

export default AssignedInventory;
