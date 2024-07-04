import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import DatePicker from '../../../shared/components/form/DatePicker';
import { getDatePayload } from '../../../core/utility';
import { setNotification } from '../../../redux/actions/notificationAction';
import CityDropDown from '../../../shared/components/form/CityDropDown';
import DropDown from '../../../shared/components/form/DropDown';
import {
  listStoresFhdShd,
  getDocQcCities,
} from '../../../core/services/miscServices';
import SearchField from '../../../shared/components/form/Search';
import { getRole, getUserID } from '../../../core/services/rbacServices';
import searchIcon from '../../../shared/img/icons/search_icon_black.svg';
import styles from './styles.module.scss';

const allDateType = [
  {
    value: 'EXCHANGEDATE',
    label: 'Exchange Date',
  },
];

const pendingDateType = [
  {
    value: 'EXCHANGEDATE',
    label: 'Exchange Date',
  },
  {
    value: 'DEADLINEDATE',
    label: 'Deadline Date',
  },
];

const approvedDateType = [
  {
    value: 'EXCHANGEDATE',
    label: 'Exchange Date',
  },
  {
    value: 'APPROVEDDATE',
    label: 'Approved Date',
  },
];

const disputeDateType = [
  {
    value: 'EXCHANGEDATE',
    label: 'Exchange Date',
  },
  {
    value: 'DISPUTEDATE',
    label: 'Dispute Date',
  },
];

const rejectedDateType = [
  {
    value: 'EXCHANGEDATE',
    label: 'Exchange Date',
  },
  {
    value: 'REJECTEDDATE',
    label: 'Rejected Date',
  },
];

const DocumentQCFilters = ({
  onApplyFilter,
  onClearFilters,
  status,
  isResetRequired,
  reasonList,
  searchText,
  onSearchType,
  onQcStatusUpdate,
  onSearch,
  onClearSearch,
  onIncludeOldRecordsClick,
}) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [city, setCity] = useState(null);
  const [dateType, setDateType] = useState(null);
  const [outlet, setOutlet] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [reason, setReason] = useState(null);
  const [universalCheck, setUniversalCheck] = useState(false);

  const dispatch = useDispatch();

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
    setOutlet(null);
    setCity(null);
    setDateType(null);
    setReason(null);
    onClearFilters();
  };

  useEffect(() => {
    if (isResetRequired) {
      clearFilters();
    }
  });

  useEffect(() => {
    let getCityList = [];
    getDocQcCities(getUserID()).then((apiResponse) => {
      if (
        apiResponse.isValid &&
        apiResponse.cityList &&
        apiResponse.cityList.length
      ) {
        getCityList = apiResponse.cityList.map((city) => {
          return {
            value: city.cityId,
            label: city.cityName,
          };
        });
        setCityList(getCityList);
      }
    });
  }, []);

  const applyFilter = () => {
    const payload = {};
    let isValid = true;
    if (city) {
      payload.cityId = [city.value];
    }
    if (outlet) {
      payload.storeId = [outlet.value];
    }
    if (reason) {
      payload.reasonId = reason.value;
    }
    if (searchText) {
      if(/^\d+$/.test(searchText)) {
        payload.leadId = searchText;
      }else{
        payload.regNum = searchText;
    }
  }
    if (fromDate && toDate) {
      payload.dateType = 'InspectedDate';
      payload.fromDate = getDatePayload(fromDate);
      payload.toDate = getDatePayload(toDate);
    } else if (fromDate || toDate) {
      isValid = false;
      if (fromDate) {
        dispatch(
          setNotification('danger', 'Invalid Selection', 'To Date Required.')
        );
      } else {
        dispatch(
          setNotification('danger', 'Invalid Selection', 'From Date Required.')
        );
      }
    }

    if (Object.keys(payload).length && isValid) {
      onApplyFilter(payload);
    }
  };

  const onCityChange = (cityData) => {
    if (cityData) {
      listStoresFhdShd({
        storeTypeId: 3,
        cityId: cityData.value,
      }).then((apiResponse) => {
        if (apiResponse.isValid) {
          const stores = apiResponse.storeListByCityId.map((store) => ({
            value: store.storeId,
            label: store.storeName,
          }));
          setStoreList(stores);
        } else {
          setStoreList([]);
        }
      });
    }
    setCity(cityData);
  };

  const onOutletChange = (outletData) => {
    setOutlet(outletData);
  };

  const clearCheckedInput = () => {
    onClearSearch(setUniversalCheck(false));
  };

  const onReasonChange = (reasonData) => {
    setReason(reasonData);
  };

  const handleChange = (e) => {
    setUniversalCheck(e.target.checked);
    onIncludeOldRecordsClick(e.target.checked);
  };

  const dateTypeValues = () => {
    switch (status.toLowerCase()) {
      case 'all':
        return allDateType;
      case 'pending':
        return pendingDateType;
      case 'approved':
        return approvedDateType;
      case 'dispute':
        return disputeDateType;
      case 'rejected':
        return rejectedDateType;
      default:
        return [];
    }
  };

  const onDateTypeChange = (dateTypeData) => {
    setDateType(dateTypeData);
  };

  const onReasonListChange = (reasonData) => {
    setReason(reasonData);
  };

  const searchRegNumber = (a, b) => {
    onSearch(a, b);
  };

  const renderDatePickers = () => {
    return (
      <div style={{ display: 'flex', width: '78%', marginBottom: '17px' }}>
        <div className="from-date">
          <DatePicker
            onDateChange={setFromDate}
            max={toDate}
            startDate={fromDate}
            placeholder={'From Date'}
            className={styles.fromDateContainer}
          />
        </div>
        <div className="from-date">
          <DatePicker
            onDateChange={setToDate}
            min={fromDate}
            startDate={toDate}
            placeholder={'To Date'}
            className={styles.toDateContainer}
          />
        </div>
        {getRole() !== 'DOC_QC' ? (
          <CityDropDown
            onCityChange={onCityChange}
            value={city}
            className={classNames('dropdown-wraper', styles.dropDownContainer)}
          />
        ) : (
          <DropDown
            placeholder="Select City"
            onChange={onCityChange}
            options={cityList}
            value={city}
            className={classNames('dropdown-wraper', styles.dropDownContainer)}
          />
        )}
      </div>
    );
  };

  const renderSearchField = () => {
    return (
      <SearchField
        value={searchText}
        onSearch={onSearchType}
        onEnter={() => searchRegNumber(searchText)}
        onClick={() => searchRegNumber(searchText)}
        onClearInput={clearCheckedInput}
        placeholder="Search By Registration Number"
        icon={searchIcon}
        className={styles.searchContainer}
        searchFieldClass={styles.searchFieldClass}
      />
    );
  };

  const renderOldRecordsCheckbox = () => {
    return (
      <div>
        <Checkbox
          color="primary"
          checked={universalCheck}
          onChange={(e) => handleChange(e)}
          style={{ padding: 0, marginRight: '10px' }}
        />
        <span
          style={{
            fontSize: 16,
            fontFamily: 'ProximaNovaSemibold',
            marginRight: 20,
            marginBottom: 9,
          }}
        >
          Include Old Records
        </span>
      </div>
    );
  };

  return (
    <div className={styles.filterContainer}>
      <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
        Filter By
      </div>
      {renderDatePickers()}
      <div style={{ display: 'flex', width: '78%', marginBottom: '17px' }}>
        {renderSearchField()}
        <DropDown
          placeholder="Select Reasons"
          onChange={onReasonChange}
          options={reasonList}
          value={reason}
          className={classNames('dropdown-wraper', styles.dropDownContainer)}
        />
        <DropDown
          placeholder="Select Outlet"
          onChange={onOutletChange}
          options={storeList}
          value={outlet}
          className={classNames('dropdown-wraper', styles.dropDownContainer)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {renderOldRecordsCheckbox()}
        <div>
          <Button
            className="rounded no-margin"
            type="button"
            onClick={clearFilters}
            style={{
              width: '103px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            CLEAR
          </Button>
          <Button
            color="success"
            type="button"
            className="rounded no-margin"
            onClick={applyFilter}
            style={{ width: '103px', fontSize: '14px', fontWeight: 600 }}
          >
            APPLY
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentQCFilters;
