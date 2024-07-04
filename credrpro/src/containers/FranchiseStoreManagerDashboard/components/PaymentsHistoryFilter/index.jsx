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

const PaymentsHistoryFilter = (props) => {
	const { onApplyFilter, paymentTypes, onClearFilter } = props;
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchText, setSearchText] = useState('');
	const [paymentType, setPaymentType] = useState(null);

	const searchPlaceHolder = 'Search by TXN ID or Order ID / Registration Number';

	const dispatch = useDispatch();

	const onClearClick = () => {
		setFromDate(null);
		setToDate(null);
		setSearchText('');
		setPaymentType(null);
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

		// if (searchTerm === '') {
		// 	filterData.searchTerm = '';
		// } else if (searchText) filterData.searchTerm = searchText;

		if (paymentType) {
			filterData.paymentAgainst = paymentType.value;
		}

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
			if(REGESTRATION_REGEX.test(searchText)) {
				filterData.searchRegText = searchText
			}
			else {
				filterData.searchTerm = searchText
			}
		}

		if (Object.keys(filterData).length && isValid) {
			onApplyFilter(filterData);
		}
	};

	const _setSearchText = () => {
		setSearchText('');
		onClearFilter()
		// onApplyClick('');
	}

	return (
		<div className={styles.filterContainer}>
			<div className="pending-inventory-filter-container mt-3">
				<div className={classname('filter-title', styles.marginRight)}>Filters</div>

				<div className={'row align-items-center ml-0'}>
					<DropDown
						options={paymentTypes}
						value={paymentType}
						placeholder="Select Payment Against"
						onChange={setPaymentType}
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

PaymentsHistoryFilter.defaultProps = {
	paymentTypes: [
		{
			id: 1,
			label: 'Inventory',
			value: 'Inventory'
		},
		{
			id: 2,
			label: 'Advance',
			value: 'Advance'
		}
	]
};

PaymentsHistoryFilter.propTypes = {
	paymentTypes: PropTypes.array
};

export default PaymentsHistoryFilter;
