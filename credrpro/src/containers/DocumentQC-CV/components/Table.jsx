import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Pagination from 'rc-pagination';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import NoResultFound from '../../../shared/components/NoResultFound';
import {
  getQcList,
  resetQcList,
} from '../../../redux/actions/documentQcListAction';
import {
  getDate,
  getAmount,
  capaitalize,
  renderString,
} from '../../../core/utility';
import CallIcon from '../../../shared/img/icons/green_call_icon.svg';
import pendingIcon from '../../../shared/img/icons/pending_icon.svg';
import approvedIcon from '../../../shared/img/icons/approved_icon.svg';
import Chip from '@material-ui/core/Chip';
import isEqual from 'lodash/isEqual';
import CallAction from '../components/CallAction';
import styles from './styles.module.scss';
import '../../Logistics/style.scss';

const columns = [
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'inspectedDate', label: 'Inspected Date' },
  { id: 'fhd', label: 'FHD' },
  { id: 'valuatorName', label: 'Valuator' },
  { id: 'city', label: 'City' },
  { id: 'status', label: 'Approval Status' },
  { id: 'document', label: 'Documents' },
];

const pendingColumns = [
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'inspectedDate', label: 'Inspected Date' },
  { id: 'fhd', label: 'FHD' },
  { id: 'valuatorName', label: 'Valuator' },
  { id: 'city', label: 'City' },
  { id: 'status', label: 'Approval Status' },
  { id: 'document', label: 'Documents' },
];

const reUploadedColumns = [
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'inspectedDate', label: 'Inspected Date' },
  { id: 'fhd', label: 'FHD' },
  { id: 'tat', label: 'TAT' },
  { id: 'valuatorName', label: 'Valuator' },
  { id: 'city', label: 'City' },
  { id: 'status', label: 'Approval Status' },
  { id: 'document', label: 'Documents' },
];

const conditionalColumns = [
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'inspectedDate', label: 'Inspected Date' },
  { id: 'fhd', label: 'FHD' },
  { id: 'tat', label: 'TAT' },
  { id: 'valuatorName', label: 'Valuator' },
  { id: 'city', label: 'City' },
  { id: 'status', label: 'Approval Status' },
  { id: 'document', label: 'Documents' },
];

const disputeColumns = [
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'inspectedDate', label: 'Inspected Date' },
  { id: 'docReuploadStatus', label: 'Doc Reuploaded Status' },
  { id: 'fhd', label: 'FHD' },
  { id: 'tat', label: 'TAT' },
  { id: 'valuatorName', label: 'Valuator' },
  { id: 'city', label: 'City' },
  { id: 'status', label: 'Approval Status' },
  { id: 'document', label: 'Documents' },
];

const rejectedColumns = [
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'inspectedDate', label: 'Inspected Date' },
  { id: 'fhd', label: 'FHD' },
  { id: 'tat', label: 'TAT' },
  { id: 'valuatorName', label: 'Valuator' },
  { id: 'city', label: 'City' },
  { id: 'status', label: 'Approval Status' },
  { id: 'document', label: 'Documents' },
  { id: 'reason', label: 'Reason For Rejection' },
];

class QcTable extends Component {
  state = {
    isOpen: false,
    valuatorData: {},
  };

  pageChange = (pageNum) => {
    const { onPageChange } = this.props;
    if (onPageChange) {
      onPageChange(pageNum);
    }
  };

  get tableHeaders() {
    const { leadStatus } = this.props;
    switch (leadStatus) {
      case 'PENDING':
        return pendingColumns;
      case 'DISPUTE':
        return disputeColumns;
      case 'REJECTED':
        return rejectedColumns;
      case 'COND_APPROVED':
        return conditionalColumns;
      default:
        return columns;
    }
  }

  componentDidMount() {
    const { dispatch, leadStatus } = this.props;
    dispatch(
      getQcList({ qcApprovalType: 'QCCONDITIONAL', leadStatus, pageNum: 1 })
    );
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetQcList());
  }

  componentDidUpdate(prevProps) {
    const { documentQcList, isRegistrationSearch, onSetStatus } = this.props;
    if (
      documentQcList &&
      documentQcList.length &&
      !isEqual(prevProps.documentQcList, documentQcList) &&
      isRegistrationSearch
    ) {
      if (documentQcList.length > 1) {
        onSetStatus('PENDING');
      } else {
        onSetStatus(documentQcList[0].status);
      }
    }
  }

  openCallAction = (valuator) => {
    this.setState({ isOpen: true, valuatorData: valuator });
  };

  closeCallAction = () => {
    this.setState({ isOpen: false, valuatorData: {} });
  };

  get pageCount() {
    const {
      approvedCount,
      disputeCount,
      rejectedCount,
      pendingCount,
      total,
      leadStatus,
      conditionalCount,
      reuploadedCount,
    } = this.props;
    switch (leadStatus) {
      case 'PENDING':
        return pendingCount;
      case 'DISPUTE':
        return disputeCount;
      case 'REJECTED':
        return rejectedCount;
      case 'COND_APPROVED':
        return conditionalCount;
      default:
        return total;
    }
  }

  getStatusIcon = (status) => {
    let icon;
    switch (status) {
      case 'APPROVED':
        icon = approvedIcon;
        break;
      case 'PENDING':
        icon = pendingIcon;
        break;
      case 'DISPUTE':
        icon = pendingIcon;
        break;
      case 'COND_APPROVED':
        icon = approvedIcon;
        break;
      case 'REJECTED':
        icon = pendingIcon;
        break;
      default:
        break;
    }
    return (
      <img
        src={icon}
        alt="!"
        style={{
          height: '15px',
          width: '15px',
          marginRight: '10px',
          marginLeft: 0,
        }}
      />
    );
  };

  goToViwSumPage = (leadId, cityId, status) => {
    const { onGoToSummary } = this.props
    onGoToSummary(leadId, cityId, status)
  }

  getClassName = (type) => {
    if(type === 'NTP') return 'NTPstatusLabel'
    else return 'TPstatusLabel'
  }

  render() {
    const {
      documentQcList,
      page,
      onGoToViewOnly,
      leadStatus,
      onViewRejection,
    } = this.props;
    const { isOpen, valuatorData } = this.state;
    return (
      <>
        <div
          className={classNames(
            'table-wraper marginFranchiseTop',
            styles.tableContainer
          )}
        >
          <Table size="medium">
            <TableHead style={{ height: '53px', background: '#EFF8FF' }}>
              <TableRow>
                {this.tableHeaders.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody
              style={{
                borderRadius: '4px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              {documentQcList &&
                Boolean(documentQcList.length) &&
                documentQcList.map((qclist, index) => {
                  const {
                    fhd,
                    valuatorName,
                    registrationNumber,
                    mmv,
                    bikeMakeYear,
                    highestBid,
                    orderVoucherPrice,
                    status,
                    leadID,
                    inspectedDate,
                    approvedDate,
                    rejectedDate,
                    disputeDate,
                    cityName,
                    mobileNumber,
                    tat,
                    docReuploadStatus,
                    cityId,
                    vehicleSellType
                  } = qclist;
                  return (
                    <TableRow hover tabIndex={-1} key={`${leadID}${index}`}>
                      <TableCell>
                        <p>{renderString(registrationNumber)}</p>
                        <small className='leadLabel'>{leadID}</small>
                        <p className={this.getClassName(vehicleSellType)}>{vehicleSellType}</p>
                      </TableCell>
                      {leadStatus === 'ALL' && (
                        <TableCell>
                          <p> {getDate(inspectedDate)} </p>
                        </TableCell>
                      )}
                      {leadStatus === 'APPROVED' && (
                        <TableCell>
                          <p> {getDate(inspectedDate)} </p>
                        </TableCell>
                      )}
                      {leadStatus === 'PENDING' && (
                        <TableCell>
                          <p>{getDate(inspectedDate)}</p>
                        </TableCell>
                      )}
                      {leadStatus !== 'DISPUTE' && leadStatus !== 'REJECTED' && (
                        <TableCell>
                          <p>{renderString(fhd)}</p>
                        </TableCell>
                      )}
                      {leadStatus === 'DOC_REUPLOADED' && (
                        <>
                          <TableCell>
                            <p>{getDate(inspectedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(tat)}</p>
                          </TableCell>
                        </>
                      )}
                      {leadStatus === 'DISPUTE' && (
                        <>
                          <TableCell>
                            <p>{getDate(inspectedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>
                              {renderString(docReuploadStatus ? 'Yes' : 'No')}{' '}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p>{renderString(fhd)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(tat)}</p>
                          </TableCell>
                        </>
                      )}
                      {leadStatus === 'REJECTED' && (
                        <>
                          <TableCell>
                            <p>{getDate(inspectedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{renderString(fhd)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(tat)}</p>
                          </TableCell>
                        </>
                      )}
                      {leadStatus === 'COND_APPROVED' && (
                        <>
                          <TableCell>
                            <p>{getDate(inspectedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getDate(tat)}</p>
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                          <p style={{ minWidth: 120 }}>
                            {renderString(valuatorName)}
                            <br />
                            {renderString(mobileNumber)}
                          </p>
                          <img
                            src={CallIcon}
                            style={{ width: 24, height: 24, cursor: 'pointer' }}
                            onClick={() => this.openCallAction(qclist)}
                            alt="Call To Valuator"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(cityName)}</p>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            status === 'COND_APPROVED'
                              ? 'Conditionally Approved'
                              : capaitalize(status)
                          }
                          icon={this.getStatusIcon(status)}
                          classes={{ colorPrimary: capaitalize(status) }}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        {Boolean(
                          status === 'REJECTED' ||
                            status === 'COND_APPROVED' ||
                            status === 'APPROVED'
                        ) ? (
                          <button
                            className="btn-outline--small blue"
                            style={{ borderRadius: '6px' }}
                            onClick={() => onGoToViewOnly(leadID, status)}
                          >
                            View
                          </button>
                        ) : (
                          <button
                            className="btn-outline--small blue"
                            style={{ borderRadius: '6px' }}
                            // onClick={() => onGoToSummary(leadID, status)}
                            onClick={() => this.goToViwSumPage(leadID, cityId, status)}
                          >
                            View&nbsp;&amp;&nbsp;Approve
                          </button>
                        )}
                      </TableCell>
                      {leadStatus === 'REJECTED' && (
                        <TableCell>
                          <p
                            className="text-button"
                            onClick={() => onViewRejection(leadID)}
                          >
                            View Details
                          </p>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <div className="table-paginator">
            {documentQcList && Boolean(documentQcList.length) ? (
              <Pagination
                className="float-right"
                current={page}
                total={this.pageCount}
                pageSize={10}
                locale={localeInfo}
                showQuickJumper
                onChange={this.pageChange}
              />
            ) : (
              <NoResultFound />
            )}
          </div>
        </div>
        <CallAction
          open={isOpen}
          valuator={valuatorData}
          onClose={this.closeCallAction}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  documentQcList: state.documentQcData.documentQcList,
  total: state.documentQcData.count,
  page: state.documentQcData.pageNum,
  approvedCount: state.documentQcData.approvedCount,
  disputeCount: state.documentQcData.disputeCount,
  rejectedCount: state.documentQcData.rejectedCount,
  pendingCount: state.documentQcData.pendingCount,
  conditionalCount: state.documentQcData.conditionalCount,
  reuploadedCount: state.documentQcData.reuploadedCount,
});

export default connect(mapStateToProps)(QcTable);
