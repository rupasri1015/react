import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classname from 'classnames';

import { Button } from 'reactstrap';

import DatePicker from '../../../shared/components/form/DatePicker';
import SearchField from '../../../shared/components/form/Search';
import DropDown from '../../../shared/components/form/DropDown';

import { setNotification } from '../../../redux/actions/notificationAction';

import { getDatePayload } from '../../../core/utility'

import styles from './ToBeDeliveredFilter/styles.module.scss';

const LiveInventoryFilter = (props) => {

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
            if ((/^[a-z0-9]+$/i).test(searchText)) {
                filterData.searchRegText = searchText;
            }
            else if (searchText) {
                filterData.searchTerm = searchText
            }
            else {
                dispatch(setNotification('danger', 'Invalid Selection', 'Please search with OrderID/RegNo'))
            }
        }
        
		if (Object.keys(filterData).length && isValid) {
			onApplyFilter(filterData);
		}
	};

	const _setSearchText = () => {
		setSearchText('');
        onApplyClick('');
        onClearFilter()
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
						{
							<SearchField
								value={searchText}
								onSearch={setSearchText}
								withButton
								onClick={onApplyClick}
								onEnter={onApplyClick}
								placeholder='Search by Reg.No/MMV'
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

LiveInventoryFilter.defaultProps = {
	dateTypes: [
		{
			id: 1,
			label: 'Expected Delivery Date',
			value: 'Expected Delivery Date'
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

LiveInventoryFilter.propTypes = {
	dateTypes: PropTypes.array,
	searchTypes: PropTypes.array
};

export default LiveInventoryFilter;