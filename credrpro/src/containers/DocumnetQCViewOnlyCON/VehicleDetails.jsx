import React, { Fragment, useState, useEffect, useRef } from 'react';
import { renderString, getBikeName } from '../../core/utility';
import { editYearOrRegNo as editYear } from '../../core/services/documentQcServices';
import edit from '../../shared/img/icons/edit-icon.svg';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationAction';
import { getUserID } from '../../core/services/rbacServices';
import {  useParams } from 'react-router-dom';

const VehicleDetails = ({ vehicle }) => {
  const dispatch = useDispatch();

  const [year, setYear] = useState(null);
  const [noOfOwners, setNoOfOwners] = useState(null);
  const [yearError, setYearError] = useState(false);
  const [noOfOwnersError, setNoOfOwnersError] = useState(false);
  const [enableTextBox, setEnableTextBox] = useState(false);
  const [enableNoOfOwners, setEnableNoOfOwners] = useState(false);
  const inputVal = useRef(null);
  const inputNoOfVal = useRef(null);
  const params = useParams();

  useEffect(() => {
    if (params.status === 'PENDING') {
      inputVal.current.focus();
      inputNoOfVal && inputNoOfVal.current.focus();
    }
  }, []);

  const editYearQc1 = () => {
    let payload = {};
    if (enableTextBox) {
      payload = {
        mfgYear: year,
        leadId: vehicle.leadId,
        updatedBy: getUserID(),
      };

      if (
        payload.mfgYear === null ||
        payload.mfgYear === '' ||
        (year && year.length < 4)
      ) {
        setYearError(true);
      } else {
        editYear(payload).then((apiResponse) => {
          if (apiResponse.isValid) {
            dispatch(
              setNotification('success', 'Success', apiResponse.message)
            );
          } else {
            dispatch(setNotification('danger', 'Error', apiResponse.message));
          }
        });
        setEnableTextBox(false);
        setYearError(false);
      }
    } else {
      payload = {
        mfgYear: vehicle.bikeManufacturerYear,
        leadId: vehicle.leadId,
        updatedBy: getUserID(),
      };
      if (payload.mfgYear === null || payload.mfgYear === '') {
        setYearError(true);
      } else {
        editYear(payload).then((apiResponse) => {
          if (apiResponse.isValid) {
            dispatch(
              setNotification('success', 'Success', apiResponse.message)
            );
          } else {
            dispatch(setNotification('danger', 'Error', apiResponse.message));
          }
        });
        setEnableTextBox(false);
        setYearError(false);
      }
    }
  };

  const handleYear = (e) => {
    const regexp = /^[0-9\b]+$/;
    if (e.target.value === '' || regexp.test(e.target.value)) {
      if (e.target.value.length <= 4) {
        setYear(e.target.value);
        setYearError(false);
      }
    }
  };

  const handleNoOfOwners = (e) => {
    const regexp = /^[0-9\b]+$/;
    if (e.target.value === '' || regexp.test(e.target.value)) {
      if (e.target.value.length <= 2) {
        setNoOfOwners(e.target.value);
        setNoOfOwnersError(false);
      }
    }
  };

  const editNoOfOwners = () => {
    let payload = {};
    if (enableNoOfOwners) {
      payload = {
        noOfOwners: noOfOwners,
        leadId: vehicle.leadId,
        updatedBy: getUserID(),
      };
      if (
        payload.noOfOwners === null ||
        payload.noOfOwners === '' ||
        (noOfOwners && noOfOwners.length < 1)
      ) {
        setNoOfOwnersError(true);
      } else {
        editYear(payload).then((apiResponse) => {
          if (apiResponse.isValid) {
            dispatch(
              setNotification('success', 'Success', apiResponse.message)
            );
          } else {
            dispatch(setNotification('danger', 'Error', apiResponse.message));
          }
        });
        setEnableNoOfOwners(false);
        setNoOfOwnersError(false);
      }
    } else {
      payload = {
        noOfOwners: vehicle.noOfOwners,
        leadId: vehicle.leadId,
        updatedBy: getUserID(),
      };
      if (payload.noOfOwners === null || payload.noOfOwners === '') {
        setNoOfOwnersError(true);
      } else {
        editYear(payload).then((apiResponse) => {
          if (apiResponse.isValid) {
            dispatch(
              setNotification('success', 'Success', apiResponse.message)
            );
          } else {
            dispatch(setNotification('danger', 'Error', apiResponse.message));
          }
        });
        setEnableNoOfOwners(false);
        setNoOfOwnersError(false);
      }
    }
  };

  const setNewYear = () => {
    setEnableTextBox(true);
  };

  const openNoOfOwnersTextBox = () => {
    setEnableNoOfOwners(true);
  };

  return (
    <Fragment>
      <h1 className="tab-heading">Vehicle Details</h1>
      <div className="data-row">
        <p className="title">MMV</p>
        <p className="data">
          {getBikeName(
            vehicle.bikeManufactureName,
            vehicle.bikeModelName,
            vehicle.bikeVariantName
          )}
        </p>
      </div>
      {params.status === 'PENDING' || params.status === 'DISPUTE' ? (
        <div className="data-row">
          <p className="title">Year</p>
          <p className="data">
            <input
              ref={inputVal}
              disabled={!enableTextBox}
              value={year === null ? vehicle.bikeManufacturerYear : year}
              onChange={(e) => handleYear(e)}
            />
            <img
              src={edit}
              alt="Edit FM Price"
              role="button"
              className="action-icon"
              style={{ marginLeft: 10 }}
              onClick={() => setNewYear()}
            />
            {yearError && (
              <span style={{ color: 'red' }}> *Please Enter Year </span>
            )}
            {enableTextBox && (
              <button
                className="icon-btn"
                style={{ backgroundColor: '#4caf50', marginLeft: '15px' }}
                onClick={editYearQc1}
              >
                {' '}
                Update{' '}
              </button>
            )}
          </p>
        </div>
      ) : (
        <div className="data-row">
          <p className="title">Year</p>
          <p className="data"> {vehicle.bikeManufacturerYear} </p>
        </div>
      )}
      <div className="data-row">
        <p className="title">Registration&nbsp;Number</p>
        <p className="data">{renderString(vehicle.bikeRegistrationNumber)}</p>
      </div>
      {params.status === 'PENDING' || params.status === 'DISPUTE' ? (
        <div className="data-row">
          <p className="title">No.&nbsp;of&nbsp;Owners</p>
          <p className="data">
            <input
              ref={inputNoOfVal}
              disabled={!enableNoOfOwners}
              value={noOfOwners === null ? vehicle.noOfUsers : noOfOwners}
              onChange={(e) => handleNoOfOwners(e)}
            />
            <img
              src={edit}
              alt="Edit No Of Owners"
              role="button"
              className="action-icon"
              style={{ marginLeft: 10 }}
              onClick={() => openNoOfOwnersTextBox()}
            />
            {noOfOwnersError && (
              <span style={{ color: 'red' }}> *Please Enter No.Of Owners </span>
            )}
            {enableNoOfOwners && (
              <button
                className="icon-btn"
                style={{ backgroundColor: '#4caf50', marginLeft: '15px' }}
                onClick={editNoOfOwners}
              >
                {' '}
                Update{' '}
              </button>
            )}
          </p>
        </div>
      ) : (
        <div className="data-row">
          <p className="title">No.&nbsp;of&nbsp;Owners</p>
          <p className="data"> {vehicle.noOfUsers} </p>
        </div>
      )}

      <div className="data-row">
        <p className="title">Finance&nbsp;(Y/N)</p>
        <p className="data">{renderString(vehicle.bikeFinance)}</p>
      </div>
      <div className="data-row">
        <p className="title">Insurance&nbsp;(Y/N)</p>
        <p className="data">{renderString(vehicle.insurance)}</p>
      </div>
      {/* <div className="data-row">
      <button className="icon-btn" style={{backgroundColor: '#4caf50', marginBottom: '15px'}} onClick={editYearQc1}> Update </button>
    </div> */}
    </Fragment>
  );
};

export default VehicleDetails;
