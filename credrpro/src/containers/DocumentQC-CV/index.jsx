import React, { useState, useEffect } from 'react';
import DocumentQcCvHeader from '../DocumentQC-CV/components/Header';
import DocQcFilters2 from '../DocumentQC-CV/components/Filters';
import isEqual from 'lodash/isEqual';
import { getQcList } from '../../redux/actions/documentQcListAction';
import { useDispatch } from 'react-redux';
import QcTable from '../DocumentQC-CV/components/Table';
import ViewReason from '../DocumentQC-CV/components/ViewReason';
import {
  getReasonForRejection,
  getDocumentQcList,
} from '../../core/services/documentQcServices';
import { showLoader, hideLoader } from '../../redux/actions/loaderAction';
import { getReasons } from '../../core/services/documentQcServices';
import { setNotification } from '../../redux/actions/notificationAction';

const DocumentQcCv = ({ history }) => {
  const [leadStatus, setLeadStatus] = useState('PENDING');
  const [regNum, setRegNum] = useState('');
  const [filters, setFilters] = useState({});
  const [isResetRequired, setIsResetRequired] = useState(false);
  const [isRegistrationSearch, setIsRegistrationSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [reasonList, setReasonList] = useState([]);
  const [leadData, setLeadData] = useState({});
  const [universalCheck, setUniversalCheck] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const qcId = 1;
    let reasonList = [];
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

  const handleStatusChange = (status, universalSearch) => {
    let payload = {
      leadStatus: status,
      pageNum: 1,
      qcApprovalType: 'QCCONDITIONAL',
    };
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters };
    }
    if (universalSearch === true) {
      payload = {
        ...payload,
        leadStatus: status,
        pageNum: 1,
        qcApprovalType: 'QCCONDITIONAL',
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
        qcApprovalType: 'QCCONDITIONAL',
      };
      if (regNum) {
        payload.regNum = regNum;
      }
      dispatch(getQcList(payload));
    }
    setLeadStatus(status);
    window.scrollTo(0, 0);

    // if (leadStatus !== status) {
    //   setLeadStatus(status)
    //   setRegNum('')
    //   setFilters({})
    //   setIsResetRequired(true)
    //   let payload = { leadStatus: status, pageNum: 1, qcApprovalType: "QCCONDITIONAL" }
    //   refreshData(payload)
    // }
  };

  const refreshData = (
    payload = { leadStatus: 'ALL', pageNum: 1, qcApprovalType: 'QCCONDITIONAL' }
  ) => {
    window.scrollTo(0, 0);
    dispatch(getQcList(payload));
  };

  const searchHandler = (regNummber, universalSearch) => {
    setIsResetRequired(true);
    setIsRegistrationSearch(true);
    setFilters({});
    if (regNummber) {
      if (/^\d+$/.test(regNummber)) {
        const payload = {
          pageNum: 1,
          qcApprovalType: 'QCCONDITIONAL',
          isUniversalSearch: true,
          leadStatus: 'ALL',
        };
        payload.leadId = regNummber;
        refreshData(payload);
      } else {
        const payload = {
          pageNum: 1,
          qcApprovalType: 'QCCONDITIONAL',
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
      dispatch(
        setNotification('danger', 'Please Enter Correct Register Number')
      );
      // let payload = {
      //   pageNum: 1,
      //   qcApprovalType: 'QCCONDITIONAL',
      //   leadStatus: 'ALL',
      // };
      // if (regNummber) {
      //   payload.regNum = regNummber;
      //   refreshData(payload);
      // }
    }
  };

  const handleApplyFilter = (newFilters) => {
    let payload = { pageNum: 1, leadStatus, qcApprovalType: 'QCCONDITIONAL' };
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
      refreshData({
        pageNum: 1,
        leadStatus: 'ALL',
        qcApprovalType: 'QCCONDITIONAL',
      });
    }
  };

  const clearSearch = () => {
    setRegNum('');
    setLeadStatus('ALL');
    refreshData();
  };

  const closeViewReason = () => {
    setLeadData({});
    setIsOpen(false);
  };

  const handlePageChange = (pageNum) => {
    let payload = { leadStatus, pageNum, qcApprovalType: 'QCCONDITIONAL' };
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters };
    }
    if (regNum) {
      payload.regNum = regNum;
    }
    refreshData(payload);
  };

  const goToViewSummaryPage = (id, cityId, status) => {
    history.push({
      pathname: `/documentQc/QC1/bikedetails/${id}/${status}`,
      state: { reasonList, cityId },
    });
  };

  const goToViewPage = (id, status) => {
    history.push(`/documentQc/QC1/viewdetails/${id}/${status}`);
  };

  const changeLeadStatus = (status) => {
    setLeadStatus(status);
    setIsRegistrationSearch(false);
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

  const exportData = () => {
    dispatch(showLoader());
    let payload = { leadStatus, export: true, qcApprovalType: 'QCCONDITIONAL' };
    if (Object.keys(filters).length) {
      payload = { ...filters, ...payload };
    }
    if (regNum) {
      payload.regNum = regNum;
      delete payload.leadStatus;
    }
    getDocumentQcList(payload).then((apiResponse) => {
      if (apiResponse.isValid) window.location.href = apiResponse.downloadUrl;
      else dispatch(setNotification('danger', 'Error', apiResponse.message));
      dispatch(hideLoader());
    });
  };

  const onIncludeOldRecordsClick = (check) => {
    setUniversalCheck(check);
  };

  return (
    <>
      <h3>Document QC-1 Details</h3>
      <DocQcFilters2
        status={leadStatus}
        onApplyFilter={handleApplyFilter}
        isResetRequired={isResetRequired}
        reasonList={reasonList}
        onClearFilters={handleClearFilter}
        onSearch={searchHandler}
        onClearSearch={clearSearch}
        searchText={regNum}
        onSearchType={setRegNum}
        onIncludeOldRecordsClick={onIncludeOldRecordsClick}
      />
      <DocumentQcCvHeader
        leadStatus={leadStatus}
        onQcStatusUpdate={handleStatusChange}
        onExportFile={exportData}
        universalCheck={universalCheck}
      />
      <QcTable
        leadStatus={leadStatus}
        onPageChange={handlePageChange}
        onGoToSummary={goToViewSummaryPage}
        onGoToViewOnly={goToViewPage}
        isRegistrationSearch={isRegistrationSearch}
        onSetStatus={changeLeadStatus}
        onViewRejection={openViewReason}
        reasonList={reasonList}
      />
      <ViewReason
        isOpen={isOpen}
        onClose={closeViewReason}
        leadData={leadData}
      />
    </>
  );
};

export default DocumentQcCv;
