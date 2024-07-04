import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classname from 'classnames';

import { Button } from 'reactstrap';

import DatePicker from '../../../../shared/components/form/DatePicker';
import SearchField from '../../../../shared/components/form/Search';
import DropDown from '../../../../shared/components/form/DropDown';
import SearchRegNumber from '../../../../shared/components/SearchRegNum';
import { setNotification } from '../../../../redux/actions/notificationAction';

import { getDatePayload } from '../../../../core/utility';

import styles from './styles.module.scss';

const ReturnsFilter = (props) => {
	const {
		onApplyFilter,
		dateTypes,
		searchPlaceHolder,
		showDateTypeDropdown,
		showSearchByRegistration,
	} = props;
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchText, setSearchText] = useState('');
	const [dateType, setDateType] = useState(null);
	const [searchRegText, setSearchRegText] = useState('');

	const dispatch = useDispatch();

	const onClearClick = () => {
		setFromDate(null);
		setToDate(null);
		setSearchText('');
		setDateType(null);
		// onClearFilter()
		onApplyFilter();
	};

	const onApplyClick = (clearSearchTerm, clearSearchRegText) => {
		/**
		 * filterData: {
		 * 	fromDate: '',
		 * 	toDate: '',
		 * 	searchTerm: '',
		 *  searchRegText
		 * 	dateType: ''
		 * }
		 */
		const filterData = {};
		let isValid = true;

		if (clearSearchTerm === true) {
			filterData.searchTerm = '';
		} else filterData.searchTerm = searchText;

		if (clearSearchRegText === true) {
			filterData.searchRegText = '';
		} else filterData.searchRegText = searchRegText;

		if (dateType) {
			filterData.dateType = dateType.value;
		}

		if (fromDate && toDate) {
			if (showDateTypeDropdown && !dateType) return dispatch(setNotification('danger', 'Invalid Selection', 'Date Type Required.'));
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

		if (!searchText && (showDateTypeDropdown && !dateType)) dispatch(setNotification('danger', 'Invalid Selection', 'You must add some filter'));

		if (Object.keys(filterData).length && isValid) {
			onApplyFilter(filterData);
		}
	};

	const _setSearchText = () => {
		setSearchText('');
		onApplyClick(true);

	}

	const _setSearchRegText = () => {
		setSearchText('');
		setSearchRegText('');
		onApplyClick(true, true);
	}

	const onSearchIconClick = () => {
		setSearchText('');
		onApplyClick(true);
	}

	return (
		<div className={styles.filterContainer}>
			<div className="pending-inventory-filter-container mt-3">
				<div className={classname('filter-title', styles.marginRight)}>Filters</div>

				<div className={'row align-items-center ml-0'}>
					{showDateTypeDropdown &&
						<DropDown
							options={dateTypes}
							value={dateType}
							placeholder="Select Date Type"
							onChange={setDateType}
							className="dropdown-wraper m-0"
						/>
					}

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
						onClearInput={() => onClearClick()}
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
  		{showSearchByRegistration &&
				<SearchRegNumber
					onSearch={onSearchIconClick}
					searchText={searchRegText}
					onClearSearch={() => _setSearchRegText()}
					onSearchType={setSearchRegText}
					onShowExport={false}
				/>
			}
		</div>
	);
};

ReturnsFilter.defaultProps = {
	dateTypes: [
		{
			id: 1,
			label: 'Sold Date',
			value: 'soldDate'
		},
		{
			id: 2,
			label: 'Return Expiry Date',
			value: 'expiryDate'
		}
	],
	searchPlaceHolder: 'Search by Reg.No., Ph.no., name, buyer type',
	showDateTypeDropdown: true
};

ReturnsFilter.propTypes = {
	dateTypes: PropTypes.array,
	searchPlaceHolder: PropTypes.string,
	showDateTypeDropdown: PropTypes.bool,
	showSearchByRegistration: PropTypes.bool,
};

export default ReturnsFilter;
