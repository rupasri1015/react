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

const CredrWalletFilter = (props) => {

	const { onApplyFilter, paymentAgainstTypes, searchTypes, onclearFilter, refreshPage, OnSearchReg } = props;
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [searchText, setSearchText] = useState('');
	const [dateType, setDateType] = useState(null);
	const [searchType, setSearchType] = useState(null)
	const [paymentAgainst, setPaymentAgainstType] = useState(null);

	const dispatch = useDispatch();

	const onClearClick = () => {
		setFromDate(null);
		setToDate(null);
		setSearchText('');
		setSearchType(null)
		setDateType(null);
		setPaymentAgainstType(null);
		onclearFilter()
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
		if (paymentAgainst) {
			filterData.paymentAgainst = paymentAgainst.value
		}
		if (searchTerm === '') {
			filterData.searchTerm = '';
		} else if (searchText) {
			if(searchType.value === 'regNumber'){
				filterData.regNumber = searchText
			}
			else filterData.searchKeyWord = searchText
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

		if (Object.keys(filterData).length && isValid) {
			onApplyFilter(filterData);
		}
	};

	const _setSearchText = () => {
		setSearchText('');
		onApplyClick('');
	}

	const getPlaceHolder = () => {
		if (searchType.value === 'regNumber')
			return 'Search by Registration Number'
		else
			return 'Search by TXN ID or Order ID'
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
					<div className={classname('from-date', styles.marginRight)}>
					<DropDown
						options={paymentAgainstTypes}
						value={paymentAgainst}
						placeholder="Select Payment Against"
						onChange={setPaymentAgainstType}
						className="dropdown-wraper m-0"
					/>
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

CredrWalletFilter.defaultProps = {
	paymentAgainstTypes: [
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
	],
	searchTypes: [
		{
			id: 1,
			label: 'Registration Number',
			value: 'regNumber'
		},
		{
			id: 2,
			label: 'TXN ID or Order ID',
			value: 'searchKeyWord'
		},
	]
};

CredrWalletFilter.propTypes = {
	dateTypes: PropTypes.array,
	searchTypes: PropTypes.array
};

export default CredrWalletFilter;