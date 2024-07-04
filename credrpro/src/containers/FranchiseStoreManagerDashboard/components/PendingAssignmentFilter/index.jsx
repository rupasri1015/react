import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import classname from 'classnames';

import { Button } from 'reactstrap';

import DatePicker from '../../../../shared/components/form/DatePicker';
import SearchField from '../../../../shared/components/form/Search';

import { setNotification } from '../../../../redux/actions/notificationAction';

import { getDatePayload } from '../../../../core/utility';

import styles from './styles.module.scss';

const PendingAssignmentFilter = (props) => {
	const { onApplyFilter, onClearFilter, paymentstatus, onClearFilterAwait, onClearFilters } = props;
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchText, setSearchText] = useState('');
	const searchPlaceHolder = 'Search by Reg.No/OrderId/MMV';

	const dispatch = useDispatch();

	const onClearClick = () => {
		setFromDate(null);
		setToDate(null);
		setSearchText('');
		if(paymentstatus === 'PENDING') {
			onClearFilter()
		}
		if(paymentstatus === "AWAITING") {
			onClearFilterAwait()
		}
		if(paymentstatus === "PENDINGS") {
			onClearFilters()
		}
		// onApplyFilter();
	};

	const onApplyClick = (searchTerm, searchRegText) => {
		console.log('searchTerm', searchTerm, searchRegText,)
		const filterData = {};
		let isValid = true;
		// else {
			// if (fromDate && toDate) { orderID
			// 	filterData.fromDate = getDatePayload(fromDate);
			// 	filterData.toDate = getDatePayload(toDate);
			// }
			// else {
			// 	isValid = false;
			// 	if (!fromDate) {
			// 		dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'));
			// 	} else {
			// 		dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'));
			// 	}
			// }
		// }

			if (fromDate && toDate) {
				filterData.fromDate = getDatePayload(fromDate)
				filterData.toDate = getDatePayload(toDate)
			} else if (fromDate || toDate) {
			  isValid = false
			  if (fromDate) {
				dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'))
			  } else {
				dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'))
			  }
			}
			if(searchText) {
				if (searchText.match(/^\d/)) {
					filterData.orderID = searchText;
				}
				else if((/^[a-z0-9]+$/i).test(searchText)) {
					filterData.searchRegText = searchText
				}
				else if (searchText) {
					filterData.searchTerm = searchText
				}
				else {
					dispatch(setNotification('danger', 'Invalid Selection', 'Please search with OrderID/RegNo'))
				}
			}
			// else {
			// 	dispatch(setNotification('danger', 'Invalid Selection', 'Please search with OrderID/RegNo'));
			// }
		if (Object.keys(filterData).length && isValid) {
			onApplyFilter(filterData);
		}
	};

	const _setSearchText = () => {
		setSearchText('');
		onApplyFilter('clear');
	}

	return (
		<div className={styles.filterContainer}>
			<div className="pending-inventory-filter-container mt-3">
				<div className={classname('filter-title', styles.marginRight)}>Filters</div>

				<div className={'row align-items-center ml-0'}>
					<div className="from-date">
						<p>From</p>
						<DatePicker onDateChange={setFromDate} max={toDate} startDate={fromDate} />
					</div>

					<div className={classname('from-date', styles.marginRight)}>
						<p>To</p>
						<DatePicker onDateChange={setToDate} min={fromDate} startDate={toDate} />
					</div>

					<SearchField
						value={searchText}
						onSearch={setSearchText}
						withButton
						onClick={onApplyClick}
						onEnter={onApplyClick}
						placeholder={searchPlaceHolder}
						onClearInput={_setSearchText}
						className={styles.searchContainer}
						searchFieldClass={styles.searchField}
					/>
				
					<div className={styles.buttonContainer}>
						<Button color="success" type="button" className="rounded no-margin" onClick={onApplyClick}>
							Apply
						</Button>

						<Button className="rounded no-margin" type="button" onClick={onClearClick}>
							Clear
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PendingAssignmentFilter;
