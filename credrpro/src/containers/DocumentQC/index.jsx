import React, { useState, Fragment, useEffect } from 'react';
import DocumentQcTable from './components/Table';
import DocumentQcFilters from './components/DocumentQCFilters';
import Header from './components/DocumentQcHeader';
import { getQcList } from '../../redux/actions/documentQcListAction';
import { showLoader, hideLoader } from '../../redux/actions/loaderAction';
import { setNotification } from '../../redux/actions/notificationAction';
import { useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getReasons, validateAccountDetails } from '../../core/services/documentQcServices';
import ViewReason from './components/ViewReason';
import {
  getReasonForRejection,
  getDocumentQcList,
} from '../../core/services/documentQcServices';

const DocumentQc = ({ history }) => {
  const [leadStatus, setLeadStatus] = useState('PENDING');
  const [isRegistrationSearch, setIsRegistrationSearch] = useState(false);
  const [isResetRequired, setIsResetRequired] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [leadData, setLeadData] = useState({});
  const [reasonList, setReasonList] = useState([]);
  const dispatch = useDispatch();
  const [universalCheck, setUniversalCheck] = useState(false);
  const [regNum, setRegNum] = useState('');
  const [fundAccType,setFundAccType] =useState()

  useEffect(() => {
    let reasonList = [];
    const qcId = 2;
    getReasons(qcId).then((apiResponse) => {
      if (apiResponse.isValid) {
        reasonList = apiResponse.crmStatusBean.map((reason) => {
          return {
            value: reason.statusId,
            label: reason.statusName,
          };
        });
        setReasonList(reasonList);
      }
    });
  }, []);

  const handleStatusChange = (status, universalCheck) => {
    let payload = { leadStatus: status, pageNum: 1, qcApprovalType: 'QCMAIN' };
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters };
    }
    if (universalCheck === true) {
      payload = {
        ...payload,
        leadStatus: status,
        pageNum: 1,
        qcApprovalType: 'QCMAIN',
        isUniversalSearch: true,
      };
      if (regNum) {
        payload.regNum = regNum;
      }
      dispatch(getQcList(payload));
    } else {
      payload = {
        ...payload,
        leadStatus: status,
        pageNum: 1,
        qcApprovalType: 'QCMAIN',
      };
      if (regNum) {
        payload.regNum = regNum;
      }
      dispatch(getQcList(payload));
    }
    setLeadStatus(status);
    window.scrollTo(0, 0);
    //dispatch(getQcList(payload))

    // if (leadStatus !== status) {
    //   setRegNum('')
    //   setFilters({})
    //   let payload = { leadStatus: status, pageNum: 1, qcApprovalType: 'QCMAIN' }
    //   if(Object.keys(filters).length){
    //     payload = { ...payload, ...filters }
    //   }
    //   setLeadStatus(status)
    //   setIsResetRequired(true)
    //   refreshData(payload)
    // }
  };

  const handlePageChange = (pageNum) => {
    let payload = { leadStatus, pageNum, qcApprovalType: 'QCMAIN' };
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters };
    }
    if (regNum) {
      payload.regNum = regNum;
    }
    refreshData(payload);
  };

  const goToViewSummaryPage = (id, cityId,userId) => {
    const payload = {
      leadId:id,
      userId:userId
    }
    validateAccountDetails(payload).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(setNotification('success', 'Success', apiResponse.message));
        setFundAccType(apiResponse.fundValidationResponse.fundAccount.accountType)
        history.push({
          pathname: `/documentQc/QC2/bikedetails/${id}`,
          state: { reasonList, cityId,fundAccType: apiResponse.fundValidationResponse.fundAccount.accountType,
          accountStatus:apiResponse.fundValidationResponse.results.accountStatus }
        });
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
        dispatch(hideLoader());
        history.push({
          pathname: `/documentQc/QC2/bikedetails/${id}`,
          state: { reasonList, cityId,fundAccType: null,accountStatus:null }
        });
      }
    })
  };

  const goToViewPage = (id) => {
    history.push(`/documentQc/Qc2/viewdetails/${id}`);
  };

  const clearSearch = () => {
    setRegNum('');
    setLeadStatus('ALL');
    refreshData();
  };

  const refreshData = (
    payload = { leadStatus: 'ALL', pageNum: 1, qcApprovalType: 'QCMAIN' }
  ) => {
    window.scrollTo(0, 0);
    dispatch(getQcList(payload));
  };

  const searchHandler = (regNummber, universalSearch) => {
    setIsResetRequired(true);
    setIsRegistrationSearch(true);
    setFilters({});
    if (regNummber) {
      if(/^\d+$/.test(regNummber)){ //(regNummber.length >= 6) {
        const payload = {
          pageNum: 1,
          qcApprovalType: 'QCMAIN',
          isUniversalSearch: true,
          leadStatus: 'ALL',
        };
        payload.leadId = regNummber;
        refreshData(payload);
      } else {
        const payload = {
          pageNum: 1,
          qcApprovalType: 'QCMAIN',
          isUniversalSearch: true,
          leadStatus: 'ALL',
        };
        payload.regNum = regNummber;
        refreshData(payload);
        // dispatch(
        //   setNotification('danger', 'Please Enter Correct Register Number')
        // );
      }
    } else {
      // let payload = { pageNum: 1, qcApprovalType: 'QCMAIN', leadStatus: 'ALL' };
      // if (regNummber) {
      //   payload.regNum = regNummber;
      //   refreshData(payload);
      // }
       dispatch(
          setNotification('danger', 'Please Enter Correct Register Number or lead ID')
        );
    }
  };

  const onIncludeOldRecordsClick = (check) => {
    setUniversalCheck(check);
  };

  const changeLeadStatus = (status) => {
    setLeadStatus(status);
    setIsRegistrationSearch(false);
  };

  const handleApplyFilter = (newFilters) => {
    let payload = { pageNum: 1, leadStatus, qcApprovalType: 'QCMAIN' };
    if (!isEqual(newFilters, filters)) {
      setFilters(newFilters);
      refreshData({ ...payload, ...newFilters });
    }
  };

  const handleClearFilter = () => {
    setIsResetRequired(false);
    if (Object.keys(filters).length) {
      setFilters({});
      setLeadStatus('ALL');
      setRegNum('');
      refreshData({ pageNum: 1, leadStatus: 'ALL', qcApprovalType: 'QCMAIN' });
    }
  };

  const closeViewReason = () => {
    setLeadData({});
    setIsOpen(false);
  };

  const openViewReason = (leadId) => {
    dispatch(showLoader());
    getReasonForRejection(leadId).then((apiResponse) => {
      if (apiResponse.isValid) {
        const { docRespRejected } = apiResponse;
        setLeadData(docRespRejected);
        setIsOpen(true);
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
      }
      dispatch(hideLoader());
    });
  };

  // const exportData = () => {
  //   dispatch(showLoader())
  //   let payload = { leadStatus, export: true }
  //   if (Object.keys(filters).length) {
  //     payload = { ...filters, ...payload }
  //   }
  //   if (regNum) {
  //     payload.regNum = regNum
  //     delete payload.leadStatus
  //   }
  //   getDocumentQcList(payload)
  //     .then(apiResponse => {
  //       if (apiResponse.isValid)
  //         window.location.href = apiResponse.downloadUrl
  //       else
  //         dispatch(setNotification('danger', 'Error', apiResponse.message))
  //       dispatch(hideLoader())
  //     })
  // }

  const goToOnlyView = (id,userId) => {
    const payload = {
      leadId:id,
      userId:userId
    }
    validateAccountDetails(payload).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(setNotification('success', 'Success', apiResponse.message));
        setFundAccType(apiResponse.fundValidationResponse.fundAccount.accountType)
        history.push({
          pathname: `/documentQc/QC2/viewdetails/${id}`,
          state: { reasonList,fundAccType: apiResponse.fundValidationResponse.fundAccount.accountType,
            accountStatus:apiResponse.fundValidationResponse.results.accountStatus }
        });
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
        dispatch(hideLoader());
        history.push({
          pathname: `/documentQc/QC2/viewdetails/${id}`,
          state: { reasonList,fundAccType: null,accountStatus:null }
        });
      }
    })
  };

  return (
    <Fragment>
      <h3>Document QC-2 Details</h3>
      <DocumentQcFilters
        status={leadStatus}
        onApplyFilter={handleApplyFilter}
        isResetRequired={isResetRequired}
        onClearFilters={handleClearFilter}
        reasonList={reasonList}
        onSearch={searchHandler}
        onClearSearch={clearSearch}
        searchText={regNum}
        onSearchType={setRegNum}
        onIncludeOldRecordsClick={onIncludeOldRecordsClick}
      />
      <Header
        leadStatus={leadStatus}
        onQcStatusUpdate={handleStatusChange}
        universalCheck={universalCheck}
      />
      <DocumentQcTable
        leadStatus={leadStatus}
        onPageChange={handlePageChange}
        onGoToSummary={goToViewSummaryPage}
        onGoToViewOnly={goToViewPage}
        onOnlyView={goToOnlyView}
        isRegistrationSearch={isRegistrationSearch}
        onSetStatus={changeLeadStatus}
        onViewRejection={openViewReason}
      />
      <ViewReason
        isOpen={isOpen}
        onClose={closeViewReason}
        leadData={leadData}
      />
    </Fragment>
  );
};

export default DocumentQc;
