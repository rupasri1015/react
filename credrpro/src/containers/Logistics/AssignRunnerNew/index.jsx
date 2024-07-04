import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

// import RunnerFilter from '../AssignRunner/components/RunnerFilter';
// import UniversalSearch from '../AssignRunner/components/UniversalSearch';
import AssignRunnerDialog from '../AssignRunner/components/AssignRunnerDialog';
import Table from '../../../shared/components/Table';
// import TableHead from '../../../shared/components/Table/components/TableHead';
// import NoResultFound from '../../../shared/components/NoResultFound';

import { getRunnerData } from '../../../redux/actions/assignRunnerListAction';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';
import { getAllVehiclesList, assignRunner } from '../../../redux/actions/assignRunnerNewAction';

import Filter from './Header/Filter';
import { getRole, getUserID, /*getCityID, getUserID*/ } from '../../../core/services/rbacServices';
import { userTypeDetails } from '../../../core/services/authenticationServices';
import { listStoresFhdShd } from '../../../core/services/miscServices';
import { getRunners, assignRunnerToInventory } from '../../../core/services/logisticServices';

const AssignRunnerNew = () => {
  const dispatch = useDispatch()

  // const page = useSelector(state => state.runner.pageNumber)
  const [filters, setFilters] = useState({})
  const [outlet, setOutlet] = useState(null)
  const [outlets, setOutlets] = useState([])
  const [dateType, setDateType] = useState(null)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [city, setCity] = useState(null)
  const [conversionCategory, setConversionCategory] = useState(null)
  const [runner, setRunner] = useState(null)
  const [runners, setRunners] = useState(null)
  const [searchText, setSeachText] = useState('')
  const [isReassignOpen, setIsReassignOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const userDetails = userTypeDetails();
  // Consider cities if only proper string exist. Eliminate if null
  const cities = userDetails.userType.userCityList ? userDetails.userType.userCityList : userDetails.userType.cityId;

  const {
    data,
    resultCount,
    pageNumber,
    pageSize,
  } = useSelector((state) => state.assignRunnerNew);

  useEffect(() => {
    dispatch(getAllVehiclesList({ listCityId: cities, returnLogisticStatus: 'UNASSIGNED', pageNo: 0 }));
  }, []);

  // table helper functions
  const renderCity = (item) => {
    if (!item.city) return '-';

    if (!Object.keys(item.city)) return '-';

    if (!item.city.cityName) return '-';

    return item.city.cityName;
  }

  const renderRegNo = (item) => {
    if (!item.bikeProfile) return '-';

    if (!Object.keys(item.bikeProfile)) return '-';

    if (!item.bikeProfile.registrationNumber) return '-';

    return item.bikeProfile.registrationNumber;
  }

  const renderMakeModel = (item) => {
    if (!item.bikeProfile) return '-';

    if (!Object.keys(item.bikeProfile)) return '-';

    if (!item.bikeProfile.bikeModel) return '-';

    return item.bikeProfile.bikeModel.modelName;
  }

  const renderAddress = (addressType = 'from') => {
    return (item) => {
      let address = '';

      if (addressType === 'from') {
        if (!item.fromAddress) address = ' - '
        else address = item.fromAddress.address;
      } else {
        if (!item.toAddress) address = ' - '
        else address = item.toAddress.address;
      }

      return (
        <div>
          {address}
        </div>
      );
    }
  }

  // On butotn click in the table
  const handleAssignRunner = (currentunner, isReassign = false) => {
    dispatch(showLoader())
    getRunners(currentunner.leadId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          setRunner(currentunner)
          setRunners(apiResponse.runnerList)
          if (isReassign)
            setIsReassignOpen(true)
          else
            setIsOpen(true)
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  const getActionButton = (item) => {
    return (
      <button className="btn-outline--small blue" onClick={() => handleAssignRunner(item)}>Assign&nbsp;Runner</button>
    );
  }

  const handleCityChange = selectedCity => {
    setOutlets([])
    setOutlet(null)
    setCity(selectedCity)

    if (selectedCity && selectedCity.value) {
      listStoresFhdShd({
        storeTypeId: 3,
        cityId: selectedCity.value
      })
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const stores = apiResponse.storeListByCityId.map(store => ({
              value: store.storeId,
              label: store.storeName
            }))

            setOutlets(stores)
          }
        })
    }
  }

  const applyFilter = newFilters => {
    if (!isEqual(newFilters, filters)) { // checking whether if there is any filters change
      setFilters(newFilters)

      const payload = { pageNumber: 1 }
      window.scrollTo(0, 0)

      dispatch(getRunnerData({ ...newFilters, ...payload }))
    }
  }

  const handleSearch = () => {
    if (searchText && filters.searchKeyword !== searchText) {
      clearFilterState()

      setFilters({ searchKeyword: searchText })

      dispatch(getRunnerData({ searchKeyword: searchText, pageNumber: 1 }))
    }
  }

  const clearFilterState = () => {
    if (getRole() !== 'LOGISTICS_COORDINATOR') {
      setOutlets([])
    }

    setDateType(null)
    setFromDate(null)
    setToDate(null)
    setCity(null)
    setConversionCategory(null)
    setOutlet(null)
    setOutlets([])
    setRunner(null)
  }

  const clearFilters = () => {
    //  clear all filters
    clearFilterState();

    if (Object.keys(filters).length) {
      setFilters({})
      window.scrollTo(0, 0)

      // refetch with cleared filters
      dispatch(getRunnerData())
    }
  }

  const closeForm = () => {
    setIsOpen(false)
    setRunner(null)
    setRunners(null)
    setIsReassignOpen(false)
  }

  const refreshData = () => {
    window.scrollTo(0, 0)
    // Consider cities if only proper string exist. Eliminate if null
    // const cities = userDetails.userType.userCityList.length ? userDetails.userType.userCityList : '';

    dispatch(getAllVehiclesList({ listCityId: cities, returnLogisticStatus: 'UNASSIGNED', pageNo: pageNumber }));
  }

  // This go in search component
  const handleClearFilters = () => {
    setSeachText('')

    if (filters.searchKeyword) {
      dispatch(getRunnerData())
      setFilters({})
    }
  }

  // On butotn click in the Dialog
  const handleRunner = (payload) => {
    const bodyPayload = {
      assignRunnerPayload: {
        brlId: payload.brlId,
        logisticCoId: getUserID(),
        logisticTransportationType: payload.mode === 'Individual' ? 'RUNNER' : payload.mode.toUpperCase(),
        runnerId: Number(payload.userId),
      },
      initialPayload: {
        listCityId: cities, returnLogisticStatus: 'UNASSIGNED', pageNo: pageNumber
      }
    }
    dispatch(assignRunner(bodyPayload));
    setIsOpen(false);
  }

  const handlePageChange = PageNo => {
    const payload = { pageNo: PageNo - 1, listCityId: cities, returnLogisticStatus: 'UNASSIGNED' }
    window.scrollTo(0, 0)
    dispatch(getAllVehiclesList(payload))
  }
  const setSearch = (val) => {
    setSeachText(val)
  }
  const onSearchText = () => {
    window.scrollTo(0, 0)
    dispatch(getAllVehiclesList({ listCityId: cities, returnLogisticStatus: 'UNASSIGNED', searchString: searchText, pageNo:0 }));

  }
  const tableHeadCellConfig = [
    {
      label: 'Created Date',
      key: 'createdDate',
      type: 'date',
    },
    {
      label: 'City',
      type: 'custom',
      renderItem: renderCity,
    },
    {
      label: 'Reg. No',
      type: 'regNumber',
      renderItem: renderRegNo,
    },
    {
      label: 'Make Model',
      type: 'custom',
      renderItem: renderMakeModel,
    },
    {
      label: 'From Add.',
      key: 'fromAddress',
      type: 'custom',
      renderItem: renderAddress('from'),
    },
    {
      label: 'Type',
      key: 'type',
      type: 'string',
    },
    {
      label: 'To Add.',
      key: 'toAddress',
      type: 'custom',
      renderItem: renderAddress('to'),
    },
  ];

  const actionButtons = [
    {
      name: 'Assign',
      component: getActionButton,
      onClickHandler: () => { },
    }
  ];

  const renderData = () => {
    
    // if (pageSize) {
      return (
        <Table
          tableHeadCellConfig={tableHeadCellConfig}
          items={data}
          rowsPerPage={pageSize}
          totalItemsCount={resultCount}
          pageNum={pageNumber + 1}
          actionButtons={actionButtons}
          onPageChange={handlePageChange}
        >
        </Table>
      );
    // }
  }
const onClearSearch=()=>{
  setSeachText('')
  dispatch(getAllVehiclesList({ listCityId: cities, returnLogisticStatus: 'UNASSIGNED', pageNo:0 }));

}
  return (
    <>
      <h3> Runner Details </h3>
      {/* TODO: add filters, search when api supports it */}
      {/* <RunnerFilter
        onApplyFilters={applyFilter}
        onClearFilters={clearFilters}
        onCityChange={handleCityChange}
        onConversionChange={setConversionCategory}
        onDateTypeChange={setDateType}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onOutletChange={setOutlet}
        outlets={outlets}
        outlet={outlet}
        toDate={toDate}
        fromDate={fromDate}
        conversionCategory={conversionCategory}
        dateType={dateType}
        city={city}
      />
      <UniversalSearch
        onInput={setSeachText}
        value={searchText}
        onClearSearch={handleClearFilters}
        onSearch={handleSearch}
      /> */}
      <Filter
        setSearch={setSearch}
        onSearchText={onSearchText}
        searchText={searchText} 
        onClearSearch={onClearSearch}/>
      {renderData()}

      {
        isOpen &&
        <AssignRunnerDialog
          open={isOpen}
          onClose={closeForm}
          runners={runners}
          runner={runner}
          onAssignRunner={handleRunner}
        />
      }
      {
        isReassignOpen &&
        <AssignRunnerDialog
          open={isReassignOpen}
          onClose={closeForm}
          runners={runners}
          runner={runner}
          onAssignRunner={(payload) => handleRunner({ ...payload, reAssign: true })}
        />
      }
    </>
  )
}

export default AssignRunnerNew
