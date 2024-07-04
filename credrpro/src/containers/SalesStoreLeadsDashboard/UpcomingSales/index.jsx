import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import cookie from 'react-cookies'

import UpcomingSalesFilter from './components/UpcomingSalesFilter';
import Table from '../../../shared/components/Table';
import AlertDialog from '../../../shared/components/AlertDialog';

import { placeCallToLead } from '../../../core/services/salesStoreServices';

// action, utility imports
import { getVisitingLeads } from '../../../redux/actions/visitingLeadsAction';
import { setNotification } from '../../../redux/actions/notificationAction';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';

// icon imports
import { CallIcon } from '../../../core/utility/iconHelper';

// style imports
import classes from './styles.module.scss';

const UpcomingSales = (props) => {
	const { storeList, orderType, count, pageNum, dispatch } = props;
	const [currentSort, setCurrentSort] = useState({
		order: orderType || 'asc',
		key: 'name'
	});
	const [openPlaceCallDialog, setPlaceCallDialog] = useState(false);
	const [activeUser, setActiveUser] = useState({});

	// TODO: Change once when api send store information
	let body = {
		storeVisitId: 20,
		pageNum: 1,
		fromDate: '',
		toDate: ''
	};

	useEffect(() => {
		dispatch(getVisitingLeads(body));
	}, []);

	const sortData = (key, order) => {
		setCurrentSort({ key, order });
		// TODO: make api call
	};

	const onApplyFilter = ({ fromDate, toDate }) => {
		body = {
			...body,
			fromDate,
			toDate
		};
		dispatch(getVisitingLeads(body));
	};

	// TODO: Test pagination
	const pageChange = (page) => {
		let payload = { ...body, pageNum: page, orderType };

		window.scrollTo(0, 0);
		dispatch(getVisitingLeads(payload));
	};

	const onCallClick = (item) => {
		setActiveUser(item);
		setPlaceCallDialog(true);
	};

	const onCloseClick = () => {
		setActiveUser({});
		setPlaceCallDialog(false);
	};

	const handlePlaceCall = async () => {
		dispatch(showLoader());

		/* TODO: uncomment once api is ready
		const payload = {
			// TODO: Fill when api comes up
		};
		// const payload = {
		// 	fromNumber: activeUser.caller,
		// 	toNumber: activeUser.customer,
		// 	userId: this.state.userId,
		// 	leadId: leadId
		// };
		const response = await placeCallToLead(payload);

		if (response.status === 200) {
			dispatch(setNotification('success', 'Success', 'Call Placed Successfully'));
		} else {
			dispatch(setNotification('danger', 'Error', 'Call Unsuccessfull'));
		}

		dispatch(hideLoader());
		onCloseClick();
    */
	};

	const renderNameWithCallIcon = (item, index) => {
		return (
			<div className={classes.nameSection}>
				{item.firstName}
				<img src={CallIcon} className={classes.callIcon} alt="call-icon" onClick={() => onCallClick(item)} />
			</div>
		);
	};

	const tableHeadCellConfig = [
		{
			label: 'Name',
			key: 'firstName',
			type: 'custom',
			allowSort: true,
			renderItem: renderNameWithCallIcon
		},
		{
			label: 'Store Name',
			key: 'storeLocationName',
			type: 'string'
		},
		{
			label: 'Meeting Date',
			key: 'meetingTime',
			type: 'dateTime',
			sort: 'sort'
		},
		{
			label: 'Last Call Date',
			key: 'lastCalledtime',
			type: 'dateTime'
		}
	];

	// TODO: Remove this dummy data once api send info
	const ditems = [
		{
			firstName: 'Sravani',
			storeLocationName: 'CRM store',
			meetingTime: '',
			lastCalledtime: ''
		}
	];

	return (
		<div>
			<UpcomingSalesFilter onApplyFilter={onApplyFilter} />
			<Table
				tableHeadCellConfig={tableHeadCellConfig}
				items={ditems}
				rowsPerPage={15}
				currentSort={currentSort}
				sortData={sortData}
				totalItemsCount={count}
				pageNum={pageNum}
				onPageChange={pageChange}
				classNames={{ tableActionHeadCellClassName: 'text-center' }}
			/>
			<AlertDialog
				isOpen={openPlaceCallDialog}
				title={'Call to lead'}
				contentText={`Are you sure you want to call ${activeUser.firstName} ?`}
				onCloseClick={onCloseClick}
				onOkClick={handlePlaceCall}
			/>
		</div>
	);
};

const mapStateToProps = (state) => ({
	storeList: state.manageLeads.storeLeads,
	count: state.manageLeads.count,
	pageNum: state.manageLeads.pageNum,
	orderType: state.manageLeads.orderType
});

export default connect(mapStateToProps)(UpcomingSales);
