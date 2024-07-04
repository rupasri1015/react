import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from '../../../shared/components/form/DatePicker';
import SearchField from '../../../shared/components/form/Search';
import { getDatePayload } from '../../../core/utility';
import { getDocQcCities } from '../../../core/services/miscServices';
import { setNotification } from '../../../redux/actions/notificationAction';
import { getUserID, getRole } from '../../../core/services/rbacServices';
import MultiSelect from '../../../shared/components/form/MultiSelect';
import DropDown from '../../../shared/components/form/DropDown';

const LeadTypeList = [{  value: 'TP', label: 'TP'}, { value: 'TP-FHD', label: 'TP-FHD' }, { value: 'NTP', label: 'NTP' }, { value: 'TP-R', label: 'TP-R' }, { value: 'TP-CP', label: 'TP-CP' }, { value: 'NA', label: 'NA' }]
const Shd_Lead_Type_List = [{ value: 'NTP', label: 'NTP' }, { value: 'TP-R', label: 'TP-R' }]

const BiddingFilter = ({ onApplyFilter, onClearFilters, onClearSearch, value, onInput, onSearch }) => {
	const [searchText, setSearchText] = useState('');
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [city, setCity] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [leadType, setLeadType] = useState(null)
	const cities = useSelector((state) => state.cities.cityList);
	const dispatch = useDispatch();

	useEffect(() => {
		if (getRole() === 'PRO_BID' || getRole() === 'SHD_COMMISSION') {
			let getCityList = [];
			getDocQcCities(getUserID()).then((apiResponse) => {
				if (apiResponse.isValid && apiResponse.cityList && apiResponse.cityList.length) {
					getCityList = apiResponse.cityList.map((city) => {
						return {
							cityId: city.cityId,
							cityName: city.cityName
						};
					});
					setCityList(getCityList);
				}
			});
		}
	}, []);

	const clearFilters = () => {
		setSearchText('');
		setFromDate(null);
		setToDate(null);
		setCity([]);
		onClearFilters();
		setLeadType(null)
	};

	const applyFilter = () => {
		const payload = {};
		let isValid = true;
		if (city.length) {
			payload.cityId = city.map((cityData) => cityData.cityId);
		}
		if (searchText) {
			payload.searchKeyword = searchText;
		}
		if(leadType){
			payload.type = leadType.value
		}
		if (fromDate && toDate) {
			payload.fromDate = getDatePayload(fromDate);
			payload.toDate = getDatePayload(toDate);
		} else if (fromDate || toDate) {
			isValid = false;
			if (fromDate) {
				dispatch(setNotification('danger', 'Invalid Selection', 'To Date Required.'));
			} else {
				dispatch(setNotification('danger', 'Invalid Selection', 'From Date Required.'));
			}
		}
		if (Object.keys(payload).length && isValid) {
			onApplyFilter(payload);
		}
	};

	const onLeadTypeChange = (dateTypeData) => {
		setLeadType(dateTypeData)
	}

	const getRoleStatus = () => {
		if(getRole() === 'PRO_BID' || getRole() === 'SHD_COMMISSION')
		return false
		else return true
	}

	return (
		<>
			<div className="pending-inventory-filter-container mt-3">
				<div className="filter-title">Filters</div>
				<DropDown
					placeholder="Select Lead Type"
					options={ getRole() === 'SHD_COMMISSION' ?  Shd_Lead_Type_List : LeadTypeList}
					onChange={onLeadTypeChange}
					value={leadType}
					className="dropdown-wraper"
				/>
				<div className="from-date">
					<p>From</p>
					<DatePicker onDateChange={setFromDate} max={toDate} startDate={fromDate} />
				</div>
				<div className="from-date" style={{ marginRight: 20 }}>
					<p>To</p>
					<DatePicker onDateChange={setToDate} min={fromDate} startDate={toDate} />
				</div>
				{getRoleStatus() ? (
					<MultiSelect
						className="dropdown-wraper mr"
						options={cities}
						multiple
						value={city}
						valueKey="cityId"
						labelKey="cityName"
						placeholder="Select Cities"
						manySelectedPlaceholder="%s Cities Selected"
						onChange={setCity}
					/>
				) : (
					<MultiSelect
						className="dropdown-wraper mr"
						options={cityList}
						multiple
						value={city}
						valueKey="cityId"
						labelKey="cityName"
						placeholder="Select Cities"
						manySelectedPlaceholder="%s Cities Selected"
						onChange={setCity}
					/>
				)}
				<SearchField
					value={searchText}
					onSearch={setSearchText}
					onEnter={applyFilter}
					placeholder="Search By Keywords"
					className="number-search with-margin"
				/>
				<Button color="success" type="button" className="rounded no-margin" onClick={applyFilter}>
					Apply
				</Button>
				<Button className="rounded no-margin" type="button" onClick={clearFilters}>
					Clear
				</Button>
			</div>
		</>
	);
};

export default BiddingFilter;
