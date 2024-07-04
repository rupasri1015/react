import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';

import DatePicker from '../../../../../shared/components/form/DatePicker';

import { setNotification } from '../../../../../redux/actions/notificationAction';

import { getDatePayload } from '../../../../../core/utility';

const UpcomingSalesFilter = (props) => {
	const { onApplyFilter } = props;
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');

	const dispatch = useDispatch();

	const onClearClick = () => {
		setFromDate(null);
		setToDate(null);
	};

	const onApplyClick = () => {
		const filterData = {};
		let isValid = true;

		if (fromDate && toDate) {
			filterData.fromDate = getDatePayload(fromDate);
			filterData.toDate = getDatePayload(toDate);
		} else if (!fromDate || !toDate) {
			isValid = false;

			if (fromDate) {
				dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'));
			} else {
				dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'));
			}
		}

		if (Object.keys(filterData).length && isValid) {
			onApplyFilter(filterData);
		}
	};

	return (
		<>
			<div className="card">
				<h3>Select Meeting Date</h3>
				<div className="row align-items-center">
					<div className="from-date col-lg-3 md-3 sm-3">
						<p>From</p>
						<DatePicker onDateChange={setFromDate} max={toDate} startDate={fromDate} />
					</div>

					<div className="from-date col-lg-3 md-3 sm-3">
						<p>To</p>
						<DatePicker onDateChange={setToDate} min={fromDate} startDate={toDate} />
					</div>

					<div className="ml-1 mt-3">
						<Button color="success" type="button" className="rounded no-margin" onClick={onApplyClick}>
							Apply
						</Button>
					</div>
					<div className="ml-1 mt-3 ml-2">
						<Button className="rounded no-margin" type="button" onClick={onClearClick}>
							Clear
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default UpcomingSalesFilter;
