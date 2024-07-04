import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';

import Chip from '@material-ui/core/Chip';
import { Button } from 'reactstrap';
import MuiTable from '@material-ui/core/Table';

import ReturnsFilter from '../FranchiseStoreManagerDashboard/components/ReturnsFilter';
import ApprovalStatusFilter from '../FranchiseStoreManagerDashboard/components/ApprovalStatusFilter';
import ViewDocsDialog from '../FranchiseStoreManagerDashboard/components/ViewDocsDialog';
import ViewCommentsDialog from '../FranchiseStoreManagerDashboard/components/ViewCommentsDialog ';
import DialogHeader from '../FranchiseStoreManagerDashboard/components/DialogHeader';
import ReturnPolicyDialog from '../FranchiseStoreManagerDashboard/components/ReturnPolicyDialog';

import Table from '../../shared/components/Table';
import TableHead from '../../shared/components/Table/components/TableHead';
import NoResultFound from '../../shared/components/NoResultFound';

import {
  fetchFranchiseReturnsList,
  approveReturn,
  rejectReturn,
} from '../../redux/actions/franchiseReturnsActions';
import { fetchDocumentUrlsById, getReturnPolicyDetails } from '../../core/services/franchiseServices';
import { userTypeDetails } from '../../core/services/authenticationServices';

import { capaitalize, getOnlyDate } from '../../core/utility';

import styles from './styles.module.scss';
import { getCityID } from '../../core/services/rbacServices';

const Returns = () => {
  const PageSize = 12;
  const dispatch = useDispatch();

	const [isTogglePolicyDialogVisible, togglePolicyDialog] = useState(false);
  const [activeStatus, setActiveStatus] = useState('all');
  const [isViewDocsDialogVisible, toggleViewDocsDialog] = useState(false);
  const [isViewCommentsDialogVisible, toggleViewCommentsDialog] =
    useState(false);
  const [comments, setComments] = useState('');
  const [filters, setFilters] = useState({});
  const [documentUrls, setDocumentUrls] = useState([]);
	const [returnPolicyDetails, setReturnPolicyDetails] = useState({});

  const pendingAt = {
    'PENDING INSPECTION': { name: 'Inspection' },
    'PENDING FINANCE': { name: 'Finance' },
    'PENDING PICKUP': { name: 'Runner' },
    'PENDING REVIEW': { name: 'Operations' },
    'PENDING COMPLETE': { name: 'Complete' },
    'PENDING REFUND APPROVAL': { name: 'Franchise' },
    'PENDING RUNNER ASSIGNMENT': { name: 'Logistics' },
    'PENDING REFUND': { name: 'Finance' },
    'PENDING': { name: 'Pending' },
    'REJECTED': { name: 'Rejected' },
    'CANCELLED': { name: 'Cancelled' },
  };

  useEffect(() => {
    dispatch(fetchFranchiseReturnsList({ cityId: getCityID(), PageSize }));
  }, []);

  const {
    returnsList,
    count,
    pageNum: pageNumber,
    pageSize,
  } = useSelector((state) => state.franchiseReturns);

  const renderApprovalStatus = (item, index) => {
    const label = pendingAt[item.returnSubStatus] ? pendingAt[item.returnSubStatus].name : 'Pending';

    const chipColor =
      item.returnSubStatus === 'CANCELLED' ? 'default' : 'primary';

    return (
      <Chip
        className={styles.statusText}
        label={label}
        classes={{ colorPrimary: label }}
        color={chipColor}
        size="small"
      />
    );
  };

  const renderStatus = (item, index) => {
    const chipColor = item.returnStatus === 'CANCELLED' ? 'default' : 'primary';

    return (
      <Chip
        className={styles.statusText}
        label={capaitalize(item.returnStatus)}
        classes={{ colorPrimary: capaitalize(item.returnStatus) }}
        color={chipColor}
        size="small"
      />
    );
  };

  const getAcceptBtn = () => {
    return (
      <Button outline color="success" className={styles.approveBtn}>
        Approve
      </Button>
    );
  };

  const getRejectBtn = () => {
    return (
      <Button outline color="danger" className={styles.rejectBtn}>
        Reject
      </Button>
    );
  };

  const statusFilters = [
    {
      label: 'ALL',
      slug: 'all',
    },
    {
      label: 'Inspection',
      slug: 'pending inspection',
    },
    {
      label: 'Refurb',
      slug: 'refurb',
    },
    {
      label: 'Finance',
      slug: 'pending finance',
    },
    {
      label: 'Runner',
      slug: 'pending pickup',
    },
    {
      label: 'Refund Approved',
      slug: 'pending refund'
    },
    {
      label: 'Approved',
      slug: 'approved',
    },
    {
      label: 'Operations',
      slug: 'pending review',
    },
    {
      label: 'Rejected',
      slug: 'rejected',
    },
  ];

  const dateTypes = [
    {
      id: 1,
      label: 'Sold Date',
      value: 'purchaseDate',
    },
    {
      id: 2,
      label: 'Return Request Date',
      value: 'returnRequestedDate',
    },
  ];

  const getDialogTitle = () => {
		return <DialogHeader title="Return Policy Details" onCloseClick={() => { togglePolicyDialog(false); setReturnPolicyDetails({}) }} />;
	};

  const onStatusFilterClick = (item) => {
    setActiveStatus(item.slug);

    if (item.slug === 'all') {
      return dispatch(fetchFranchiseReturnsList({ cityId: getCityID(), PageSize, ...filters }));
    }
    if (item.slug === 'pending pickup') {
      return dispatch(fetchFranchiseReturnsList({ cityId: getCityID(), PageSize, returnSubStatus: 'PENDING RUNNER ASSIGNMENT, PENDING PICKUP', ...filters }));
    }

    return dispatch(fetchFranchiseReturnsList({
        cityId: getCityID(),
        PageSize,
        returnSubStatus: item.slug.toUpperCase(),
        ...filters,
      })
    );
  };

  const openCommentsDialog = (comments) => {
    setComments(comments);
    toggleViewCommentsDialog(true);
  };

  const openDocsDialog = (id) => {
    toggleViewDocsDialog(true);
    let urls = [];
    fetchDocumentUrlsById(id).then((response) => {
      if (response.valid) {
        urls = response.resultSet.map((item) => {
          return item.documentUrl;
        });
      }
      setDocumentUrls(urls);
    });
  };

  const openViewPolicyDialog = async (item) => {
		if (item.returnPolicyId) {
			const response = await getReturnPolicyDetails(item.returnPolicyId);
			const { valid, resultSet: { policyDescription, policyExpirationDate, policyName }} = response;

			if (valid) {
				setReturnPolicyDetails({
					name: policyName,
					description: policyDescription,
					expiry: getOnlyDate(policyExpirationDate)
				});
			}
		}

		togglePolicyDialog(true);
	}

  const onApplyFilter = (filterObj) => {
    let filterPayload = { cityId: getCityID() };
    let returnSubStatus = '';
    if (filterObj) {
      if (filterObj.dateType) {
        filterPayload = {
          ...filterPayload,
          PageSize,
          dateColumn: filterObj.dateType && filterObj.dateType,
          from: filterObj.fromDate && filterObj.fromDate,
          to: filterObj.toDate && filterObj.toDate,
        };
      }
      filterPayload = {
        ...filterPayload,
        searchString: filterObj.searchTerm && filterObj.searchTerm,
      };
    }
    setFilters(filterPayload);

    if (activeStatus !== 'all' && activeStatus !== 'pending pickup') {
      returnSubStatus = activeStatus.toUpperCase();

      return dispatch(fetchFranchiseReturnsList({
        cityId: getCityID(),
        ...filterPayload,
        returnSubStatus
      }));
    }

    if (activeStatus === 'pending pickup') {
      returnSubStatus = 'PENDING RUNNER ASSIGNMENT, PENDING PICKUP';

      return dispatch(fetchFranchiseReturnsList({
        cityId: getCityID(),
        ...filterPayload,
        returnSubStatus
      }));
    }

    dispatch(fetchFranchiseReturnsList(filterPayload));
  };

  const pageChange = (page) => {
    window.scrollTo(0, 0);
    if (activeStatus === 'all')
      return dispatch(fetchFranchiseReturnsList({ cityId: getCityID(), PageNo: page, PageSize, ...filters }));
    dispatch(
      fetchFranchiseReturnsList({
        cityId: getCityID(),
        PageNo: page,
        PageSize,
        ...filters,
        returnSubStatus: activeStatus,
      })
    );
  };

  const handleAcceptBtnClick = ({ item }) => {
    if (
      window.confirm(
        'Are you sure. Do you want to approve?'
      )
    ) {
      item = {
        ...item,
        returnSubStatus: 'PENDING INSPECTION',
        fomApprovalStatus: true,
      };

      dispatch(approveReturn({ item, activeFilter: activeStatus }));
    }
  };

  const handleRejectBtnClick = ({ item }) => {
    item = {
      ...item,
      returnStatus: 'REJECTED',
      returnSubStatus: 'REJECTED'
    };

    dispatch(rejectReturn({ item, activeFilter: activeStatus }));
  };

  const renderReturnReason = (item, index) => {
    return (
      <div className={styles.returnReason}>
        {item.returnReason ? <span>{item.returnReason}</span> : <span>-</span>}
        {item.comments && item.comments.length ? (
          <div
            className={styles.linkButton}
            onClick={() => openCommentsDialog(item.comments)}
          >
            View Comments
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  };

  const renderViewDocBtn = (item, index) => {
    return (
      <div
        className={styles.linkButton}
        onClick={() => openDocsDialog(item.id)}
      >
        View Documents
      </div>
    );
  };

	const renderPolicyLink = (item) => {
		if (!item.returnPolicyId) return <div>NA</div>

		return (
			<button onClick={() => openViewPolicyDialog(item)} className="link-button">
				View Policy
			</button>
		);
	};

  const tableHeadCellConfig = [
    {
      label: 'Vehicle Number',
      key: 'vehicleNumber',
      type: 'string',
    },
    {
      label: 'Name',
      key: 'ownerName',
      type: 'string',
    },
    {
      label: 'Buyer Type',
      key: 'buyerType',
      type: 'string',
    },
    {
      label: 'Phone Number',
      key: 'phoneNumber',
      type: 'string',
    },
    {
      label: 'Sold Date',
      key: 'purchaseDate',
      type: 'date',
    },
    {
      label: 'Return Request Date',
      key: 'returnRequestedDate',
      type: 'date',
    },
    {
      label: 'Invoiced Amount',
      key: 'invoiceAmount',
      type: 'amount',
    },
    {
      label: 'Refund Amount',
      key: 'refundAmount',
      type: 'amount',
    },
    {
      label: 'Refund Status',
      key: 'refundStatus',
      type: 'custom',
      renderItem: renderStatus,
    },
    {
      label: 'Pending At',
      key: 'returnSubStatus',
      type: 'custom',
      renderItem: renderApprovalStatus,
    },
    {
      label: 'Return Reason',
      key: 'returnReason',
      type: 'custom',
      renderItem: renderReturnReason,
    },
    {
      label: 'Documents',
      key: 'documents',
      type: 'custom',
      renderItem: renderViewDocBtn,
    },
    {
      label: 'Returns Policy',
      key: 'returnPolicyId',
      type: 'custom',
			renderItem: renderPolicyLink
    },
  ];

const actionButtons = [
  {
    name: 'return',
    component: getAcceptBtn,
    onClickHandler: handleAcceptBtnClick,
  },
  {
    name: 'return',
    component: getRejectBtn,
    onClickHandler: handleRejectBtnClick,
  },
];

  const renderEmptyTable = () => {
    return (
      <div className="table-wraper mt-3">
        <MuiTable size="small">
          <TableHead tableHeadCellConfig={tableHeadCellConfig} />
        </MuiTable>
        <div className="table-paginator">
          <NoResultFound />
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (!returnsList.length) return renderEmptyTable();

    return (
      <Table
        role={userTypeDetails().userType.userRole}
        tableHeadCellConfig={tableHeadCellConfig}
        items={returnsList}
        rowsPerPage={pageSize}
        totalItemsCount={count}
        pageNum={pageNumber}
        actionButtons={actionButtons}
        onPageChange={pageChange}
      />
    );
  };

  return (
    <div>
      <h3>Return details</h3>

      <ApprovalStatusFilter
        statusFilters={statusFilters}
        activeStatus={activeStatus}
        onStatusFilterClick={onStatusFilterClick}
      />

      <ReturnsFilter dateTypes={dateTypes} onApplyFilter={onApplyFilter} />

      {renderTable()}

      <ViewDocsDialog
        isOpen={isViewDocsDialogVisible}
        documentUrls={documentUrls}
        onCloseClick={() => {
          toggleViewDocsDialog(false);
          setDocumentUrls([]);
        }}
      />

      <ViewCommentsDialog
        isOpen={isViewCommentsDialogVisible}
        comments={comments}
        onCloseClick={() => {
          toggleViewCommentsDialog(false);
          setComments('');
        }}
      />
      <ReturnPolicyDialog
				isOpen={isTogglePolicyDialogVisible}
				details={returnPolicyDetails}
				title={getDialogTitle()}
				onCloseClick={() => { togglePolicyDialog(false); setReturnPolicyDetails({}) }}
			/>
    </div>
  );
};

export default Returns;
