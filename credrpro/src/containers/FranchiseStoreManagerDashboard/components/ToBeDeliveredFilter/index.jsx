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

const ToBeDeliveredFilter = (props) => {

	const { onApplyFilter, dateTypes, searchTypes, onClearFilter } = props;
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchText, setSearchText] = useState('');
	const [dateType, setDateType] = useState(null);
	const [searchType, setSearchType] = useState(null)

	const dispatch = useDispatch();

	const onClearClick = () => {
		setFromDate(null);
		setToDate(null);
		setSearchText('');
		setSearchType(null)
		setDateType(null);
		onClearFilter()
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

		if (searchTerm === '') {
			filterData.searchTerm = '';
		} else if (searchText) {
			if(searchType.value === 'registrationNumber'){
				filterData.registrationNumber = searchText
			}
			else filterData.mmv = searchText
		}
		if (dateType) {
			filterData.dateType = dateType.value;
			console.log('111', dateType.value)
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

		if (!searchText && !dateType) dispatch(setNotification('danger', 'Invalid Selection', 'You must add some filter'));
		
		if (Object.keys(filterData).length && isValid) {
			onApplyFilter(filterData);
		}
	};

	const _setSearchText = () => {
		setSearchText('');
		onApplyClick('');
	}

	const getPlaceHolder = () => {
		if (searchType.value === 'registrationNumber')
			return 'Search by Registration Number'
		else
			return 'Search by MMV'
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
						className="dropdown-wraper m-0"
					/>

					<div className="from-date">
						<p>From</p>
						<DatePicker onDateChange={setFromDate} max={toDate} startDate={fromDate} />
					</div>

					<div className={classname('from-date', styles.marginRight)}>
						<p>To</p>
						<DatePicker onDateChange={setToDate} min={fromDate} startDate={toDate} />
					</div>
					<div className={'row'} style={{ marginRight: '8px' }}>
						<DropDown
							options={searchTypes}
							value={searchType}
							placeholder="Select Search Type"
							onChange={setSearchType}
							className="dropdown-wraper m-0"
						/>
					</div>
						{
							searchType !== null &&
							<SearchField
								value={searchText}
								onSearch={setSearchText}
								withButton
								onClick={onApplyClick}
								onEnter={onApplyClick}
								placeholder={getPlaceHolder()}
								onClearInput={() => _setSearchText()}
								className={styles.searchContainer}
								searchFieldClass={styles.searchField}
							/>
						}
					<div className={styles.buttonContainer} >
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

ToBeDeliveredFilter.defaultProps = {
	dateTypes: [
		{
			id: 1,
			label: 'Expected Delivered Date',
			value: 'Expected Delivered Date'
		},
		{
			id: 2,
			label: 'Payment Date',
			value: 'Payment Date'
		}
	],
	searchTypes: [
		{
			id: 1,
			label: 'Registration Number',
			value: 'registrationNumber'
		},
		{
			id: 2,
			label: 'MMV',
			value: 'mmv'
		}
	]
};

ToBeDeliveredFilter.propTypes = {
	dateTypes: PropTypes.array,
	searchTypes: PropTypes.array
};

export default ToBeDeliveredFilter;
