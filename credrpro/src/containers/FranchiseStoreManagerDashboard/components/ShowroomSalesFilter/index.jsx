import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classname from 'classnames';

import { Button } from 'reactstrap';

import DatePicker from '../../../../shared/components/form/DatePicker';
import SearchField from '../../../../shared/components/form/Search';
import DropDown from '../../../../shared/components/form/DropDown';

import { setNotification } from '../../../../redux/actions/notificationAction';

import { getDatePayload } from '../../../../core/utility';

import styles from './styles.module.scss';
import { REGESTRATION_REGEX } from '../../../../core/constants/settings'

const ReturnsFilter = (props) => {
	const { onApplyFilter, dateTypes, paymentTypes, onClearFilters } = props;
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchText, setSearchText] = useState('');
	const [dateType, setDateType] = useState(null);
	const [paymentType, setPaymentType] = useState(null);

	const searchPlaceHolder = 'Search by Reg.No/Mobile No./Name';

	const dispatch = useDispatch();

	const onClearClick = () => {
		setFromDate(null);
		setToDate(null);
		setSearchText('');
		setDateType(null);
		setPaymentType(null);
		onClearFilters()
		// onApplyFilter();
	};

	const onApplyClick = (searchTerm) => {
		/**
		 * filterData: {
		 * 	fromDate: '',
		 * 	toDate: '',
		 * 	searchTerm: '',
		 * 	dateType: ''
		 * }
		 */
		const filterData = {};
		let isValid = true;

		// if (searchTerm === '') {
		// 	filterData.searchTerm = '';
		// } else if (searchText) filterData.regnum = searchText;

		if (dateType) {
			filterData.dateType = dateType.value;
		}

		if (fromDate && toDate) {
			if (!dateType) return dispatch(setNotification('danger', 'Invalid Selection', 'Date Type Required.'));
			filterData.fromDate = getDatePayload(fromDate);
			filterData.toDate = getDatePayload(toDate);
		} else if (dateType && (!fromDate || !toDate)) {
			isValid = false;

			if (!fromDate) {
				dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'));
			} else {
				dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'));
			}
		}

		if(searchText) {
			if (searchText.match(/^[0-9]{10}$/)) {
				filterData.mobileNumber = searchText;
			}
			else if(REGESTRATION_REGEX.test(searchText)) {
				filterData.regnum = searchText
			}
			// else if((/^[a-z0-9]+$/i).test(searchText)) {
			// 	filterData.name = searchText
			// }
			else {
				filterData.name = searchText
			}
		}

		if (!searchText && !dateType ) dispatch(setNotification('danger', 'Invalid Selection', 'You must add some filter'));

		if (Object.keys(filterData).length && isValid) {
			onApplyFilter(filterData);
		}
	};

	const _setSearchText = () => {
		setSearchText('');
		onClearFilters()
		// onApplyClick('');
	}

	return (
		<div className={styles.filterContainer}>
			<div className="pending-inventory-filter-container mt-3">
				<div className={classname('filter-title', styles.marginRight)}>Filters</div>

				<div className={'row align-items-center ml-0'}>
					<DropDown
						options={dateTypes}
						value={dateType}
						placeholder="Select Date Type"
						onChange={setDateType}
						className="dropdown-wraper m-1"
					/>
					<div className="from-date m-1">
						<p>From</p>
						<DatePicker onDateChange={setFromDate} max={toDate} startDate={fromDate} />
					</div>

					<div className={classname('from-date', styles.marginRight)}>
						<p>To</p>
						<DatePicker onDateChange={setToDate} min={fromDate} startDate={toDate} />
					</div>
					<div style={{ marginTop: '5px', marginLeft: '3px' }}>
						<SearchField
							value={searchText}
							onSearch={setSearchText}
							withButton
							onClick={onApplyClick}
							onEnter={onApplyClick}
							placeholder={searchPlaceHolder}
							onClearInput={() => _setSearchText()}
							className={styles.searchContainer}
							searchFieldClass={styles.searchField}
						/>
					</div>
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

ReturnsFilter.defaultProps = {
	dateTypes: [
		{
			id: 1,
			label: 'Sale Date',
			value: 'sale date'
		},
		{
			id: 2,
			label: 'Lead Created Date',
			value: 'lead created date'
		}
	],
	paymentTypes: [
		{
			id: 1,
			label: 'Token',
			value: 'Token'
		},
		{
			id: 2,
			label: 'Full Sale',
			value: 'Full Sale'
		}
	]
};

ReturnsFilter.propTypes = {
	dateTypes: PropTypes.array
};

export default ReturnsFilter;
