import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import classname from 'classnames';

import { Button } from 'reactstrap';

import DatePicker from '../../../../../shared/components/form/DatePicker';
import SearchField from '../../../../../shared/components/form/Search';
import DropDown from '../../../../../shared/components/form/DropDown';
import CityDropDown from '../../../../../shared/components/form/CityDropDown'
import { listStores } from '../../../../../core/services/miscServices'

import { setNotification } from '../../../../../redux/actions/notificationAction';

import { getDatePayload } from '../../../../../core/utility';

import styles from './styles.module.scss';
import { DownloadIcon } from '../../../../../core/utility/iconHelper'
import { cmsData } from '../../../../../core/services/franchiseServices';
import { showLoader, hideLoader } from '../../../../../redux/actions/loaderAction'

const CMSFilter = (props) => {

    const { onApplyFilter, paymentTypes, onClearFilter } = props;
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [city, setCity] = useState('')
    const [showrooms, setShowrooms] = useState([])
    const [showroom, setShowroom] = useState('')

    const searchPlaceHolder = 'Search by Registration Number';

    const dispatch = useDispatch();

    const onClearClick = () => {
        setFromDate(null);
        setToDate(null);
        setRegNumber('');
        setCity(null)
        setShowrooms([])
        setShowroom('')
        onClearFilter()
        // onApplyFilter();
    };

    const onApplyClick = (searchTerm) => {
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

        if (regNumber) {
            filterData.regNumber = regNumber
        }

        if (city) {
            filterData.cityId = city.value;
        }

        if (showroom) {
            filterData.storeId = showroom.value;
        }

        if (Object.keys(filterData).length && isValid) {
            onApplyFilter(filterData);
        }
    };

    const _setSearchText = () => {
        setRegNumber('');
        onClearFilter()
        // onApplyClick('');
    }

    const onCityChange = (value) => {
        setShowroom('')
        setShowrooms([])
        setCity(value)
        listStores(value.value)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    const stores = apiResponse.storeListByCityId.map(store => ({
                        value: store.storeId,
                        label: store.storeName
                    }))
                    setShowrooms(stores)
                }
            })
    }

    const getPayload = () => {
        let payload={}
        if (fromDate) {
            payload.fromDate = getDatePayload(fromDate)
        }
        if (toDate) {
            payload.toDate = getDatePayload(toDate)
        }
        if (regNumber) {
            payload.regNumber = regNumber
        }
        if (city) {
            payload.cityId = city.value;
        }
        if (showroom) {
            payload.storeId = showroom.value
        }
        payload.pageNum = 1
        payload.exportType = 'YES'
        return payload
    }


    const exportFilterData = () => {
        let payload = getPayload()
        if (Object.keys(payload).length) {
        dispatch(showLoader())
        cmsData(payload).
            then(exportResponse => {
                window.open(exportResponse.downloadUrl)
            })
        dispatch(hideLoader())
        }
        else {
            dispatch(setNotification('danger', 'Invalid Selection', 'Select Filter'))
        }
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

                    <CityDropDown
                        onCityChange={onCityChange}
                        value={city}
                        className="dropdown-wraper"
                    />

                    <DropDown
                        options={showrooms}
                        value={showroom}
                        placeholder="Select Showroom"
                        onChange={setShowroom}
                        className="dropdown-wraper m-0"
                    />

                    <SearchField
                        value={regNumber}
                        onSearch={setRegNumber}
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
                    <div style={{ marginLeft: '8px' }}>
                        <button className="icon-btn float-right" onClick={exportFilterData} >
                            <img src={DownloadIcon} className="btn-icon" alt="Download" />
                            Export Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CMSFilter;
