import React, { useState, useEffect, useRef } from 'react';
import { renderString, getBikeName, getBikeNameYear } from '../../../core/utility';
import { editYearOrRegNo } from '../../../core/services/documentQcServices';
import edit from '../../../shared/img/icons/edit-icon.svg';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationAction';
import { getUserID } from '../../../core/services/rbacServices';
import { useLocation, useParams } from 'react-router-dom';
import MMVDialog from '../../DocumentQcBikeDetailsCON/components/MMVDialog';

import styles from '../styles.module.scss'
import uploadIcon from '../../../shared/img/icons/upload.svg';
import removeicon from '../../../shared/img/icons/ic_remove.svg';
import dropDownIcon from '../../../shared/img/icons/drop_down_2.svg';
import greenTicketIcon from '../../../shared/img/icons/green_tick.svg';
import pendingIcon from '../../../shared/img/icons/red_pending.svg';
import classNames from 'classnames';
import DropDown from '../../../shared/components/form/DropDown';
import style from '../../DocumentQC-CV/components/styles.module.scss'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';

const VehicleDetails = ({openDocument,setOpenDocument, vehicle, isEdit,refreshData, cityId,handleFinVal,handleInsureVal,handleRcVal }) => {
  const dispatch = useDispatch();

  const [year, setYear] = useState(null);
  const [noOfOwners, setNoOfOwners] = useState(null);
  const [yearError, setYearError] = useState(false);
  const [regNo, setRegNo] = useState();
  const [noOfOwnersError, setNoOfOwnersError] = useState(false);
  const [enableTextBox, setEnableTextBox] = useState(false);
  const [enableNoOfOwners, setEnableNoOfOwners] = useState(false);
  const [enableRegNo, setEnableRegNo] = useState(false);
  const inputVal = useRef(null);
  const inputNoOfVal = useRef(null);
  const inputRegNo = useRef(null);
  const params = useParams();
  const [mmvdata, setMMVData] = useState([]);
  const [openMMV, setOpenMMV] = useState(false);
  const [financeVal,setFinanceVal] = useState()
  const [insuranceVal,setInsuranceVal] = useState()
  const [rcValue,setRcValue] = useState(vehicle.bikeRcType)

  useEffect(() => {
    if (params.status === 'PENDING') {
      inputVal.current.focus();
      inputNoOfVal && inputNoOfVal.current.focus();
      inputRegNo && inputRegNo.current.focus();
    }
  }, []);

  useEffect(() => {
    setRegNo(vehicle.bikeRegistrationNumber);
    setFinanceVal(vehicle.bikeFinance ? yesNoOptions[0]: yesNoOptions[1])
    setInsuranceVal(vehicle.insurance ? yesNoOptions[0]: yesNoOptions[1])
    setRcValue(vehicle.bikeRcType)
  }, [vehicle]);

  const yesNoOptions = [
    { label: 'Yes', value: true }, { label: 'No', value: false }
  ]
  const rcOptions = [{label:'Original',value:'Original'},{label:'Copy',value:'Copy'},
  {label:'DRC',value:'DRC'},{label:'Missing',value:'Missing'}]

  const handleFinance = (val) => {
    setFinanceVal(val)
    handleFinVal(val.label)
  }
  const handleInsurance = (val) => {
    setInsuranceVal(val)
    handleInsureVal(val.label)
  }
  const handleRc = (val) => {
    setRcValue(val)
    handleRcVal(val.value)
  }
  const onInputEnterYear = (e) => {
    let payload = {};
    if (e.keyCode === 13)
      if (enableTextBox) {
        payload = {
          mfgYear: year,
          leadId: vehicle.leadId,
          updatedBy: getUserID(),
          gatepassId: vehicle.bikeGatepassId
            .replace(vehicle.bikeManufacturerYear, e.target.value)
            .replace(
              vehicle.bikeRegistrationNumber,
              regNo || vehicle.bikeRegistrationNumber
            ),
        };

        if (
          payload.mfgYear === null ||
          payload.mfgYear === '' ||
          (year && year.length < 4)
        ) {
          setYearError(true);
        } else {
          editYearOrRegNo(payload).then((apiResponse) => {
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
          editYearOrRegNo(payload).then((apiResponse) => {
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

  const handleRegNo = (e) => {
    setRegNo(e.target.value);
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

  const onInputEnterNoOfOwners = (e) => {
    let payload = {};
    if (e.keyCode === 13)
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
          editYearOrRegNo(payload).then((apiResponse) => {
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
          editYearOrRegNo(payload).then((apiResponse) => {
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

  const openRegNo = () => {
    setEnableRegNo(true);
  };

  const onInputEnterRegNo = (e) => {
    if (e.keyCode === 13) {
      const payload = {
        leadId: vehicle.leadId,
        updatedBy: getUserID(),
        regNumber: e.target.value,
        gatepassId: vehicle.bikeGatepassId
          .replace(vehicle.bikeRegistrationNumber, e.target.value)
          .replace(
            vehicle.bikeManufacturerYear,
            year || vehicle.bikeManufacturerYear
          ),
      };
      editYearOrRegNo(payload).then((apiResponse) => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message));
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message));
        }
        setEnableRegNo(false);
      });
    }
  };
  const openMMVDialog = () => {

    let make = { label: vehicle.bikeManufactureName, value: vehicle.bikeMakerId }
    let model = { label: vehicle.bikeModelName, value: vehicle.bikeModelId }
    let variant = { label: vehicle.bikeVariantName, value: vehicle.bikeVariantId }
    let mmv = [make, model, variant]
    setMMVData(mmv)
    setOpenMMV(true)
  }
  const closeMMVDialog = () => {
    setOpenMMV(false)
  }
  const updateMMV = (mmv) => {
    refreshData(vehicle.leadId)
    // setMMV(mmv)
  }
// cv vdcvd
const statusIcon = false ? pendingIcon : greenTicketIcon

    if (openDocument)
    return (
      <div
        className={styles.dropDownContainer}
        onClick={() => setOpenDocument(!openDocument)}
      >
        <span style={{ fontSize: 15 }}>
          <span style={{ fontSize: 15, textTransform: 'capitalize' }}>
            Vehicle Details
          </span>
          {true && (
            <span style={{ marginLeft: 6, fontSize: 18, color: 'red' }}>
              *
            </span>
          )}
        </span>
        <div className="flex">
          <img
            src={statusIcon}
            alt="open"
            className={styles.documentStatusIcon}
          />
          <img
            src={dropDownIcon}
            alt="open"
            className={styles.dropdownIcon}
          />
        </div>
      </div>
    );
    return (
    <div>
      <div 
        className={styles.expandedDropDown}
        onClick={() => setOpenDocument(!openDocument)}
      >
        <span style={{ fontSize: 15 }}>
          <span
                style={{
                    padding: '8px 15px',
                    background: '#FFDEC7',
                    width: '220px',
                    color: '#98360C',
                    letterSpacing: '0.05ch',
                    borderTopLeftRadius: '5px',
                }}
            >
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Vehicle Details</span>
            </span>
          {true && (
            <span style={{ marginLeft: 6, fontSize: 18, color: 'red' }}>
              *
            </span>
          )}
        </span>
        <div className="flex">
          <img
            src={statusIcon}
            alt="open"
            className={styles.documentStatusIcon}
          />
          <img
            src={dropDownIcon}
            alt="open"
            className={styles.dropdownIcon}
          />
        </div>
      </div>
      {/* <div
        style={{
          padding: '8px 15px',
          background: '#FFDEC7',
          width: '150px',
          color: '#98360C',
          letterSpacing: '0.05ch',
          borderTopLeftRadius: '5px',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Vehicle Details
        </span>
      </div> */}
      <div className="data-row">
        <p className="bold-text title">MMV - Y</p>
        <p className="data">
          {getBikeNameYear(
            vehicle.bikeManufactureName,
            vehicle.bikeModelName,
            vehicle.bikeVariantName,
            vehicle.bikeManufacturerYear
          )}
          {isEdit && <img
            src={edit}
            alt="Edit FM Price"
            role="button"
            className="action-icon"
            style={{ marginLeft: 10 }}
            onClick={() => openMMVDialog()}
          />}
        </p>
      </div>
      {isEdit ? (
        <div className="data-row">
          <p className="bold-text title">Registration&nbsp;Number</p>
          <p className="data">
            <input
              style={{
                height: '30px',
                width: '175px',
                border: '1px solid rgba(160, 160, 160, 0.5)',
              }}
              ref={inputRegNo}
              value={regNo}
              disabled={!enableRegNo}
              onChange={(e) => handleRegNo(e)}
              onKeyDown={(e) => onInputEnterRegNo(e)}
            />
            <img
              src={edit}
              alt="Edit No Of Owners"
              role="button"
              className="action-icon"
              style={{ marginLeft: 10 }}
              onClick={() => openRegNo()}
            />
          </p>
        </div>
      ) : (
        <div className="data-row">
          <p className="bold-text title">Registration&nbsp;Number</p>
          <p className="data"> {vehicle.bikeRegistrationNumber} </p>
        </div>
      )}
      {isEdit ? (
        <div className="data-row">
          <p className="bold-text title">No.&nbsp;of&nbsp;Owners</p>
          <p className="data">
            <input
              style={{
                height: '30px',
                width: '175px',
                border: '1px solid rgba(160, 160, 160, 0.5)',
              }}
              ref={inputNoOfVal}
              disabled={!enableNoOfOwners}
              value={noOfOwners === null ? vehicle.noOfUsers : noOfOwners}
              onChange={(e) => handleNoOfOwners(e)}
              onKeyDown={(e) => onInputEnterNoOfOwners(e)}
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
          </p>
        </div>
      ) : (
        <div className="data-row">
          <p className="bold-text title">No.&nbsp;of&nbsp;Owners</p>
          <p className="data"> {vehicle.noOfUsers} </p>
        </div>
      )}
      <div className="data-row">
        <p className="bold-text title">Finance&nbsp;(Y/N)</p>
        <p className="data">{renderString(vehicle.bikeFinance)}</p>
        {/* <div style={{ width: '175px' }}>
          <DropDown
            placeholder={financeVal}
            onChange={handleFinance}
            options={yesNoOptions}
            value={financeVal}
            className={classNames('dropdown-wraper', style.dropDownContainer)}
          />
        </div> */}
      </div>
      <div className="data-row">
        <p className="bold-text title">Insurance&nbsp;(Y/N)</p>
        <p className="data">{renderString(vehicle.insurance)}</p>
        {/* <div style={{ width: '175px',marginTop:'5px' }}>
          <DropDown
            placeholder={insuranceVal}
            onChange={handleInsurance}
            options={yesNoOptions}
            value={insuranceVal}
            className={classNames('dropdown-wraper', style.dropDownContainer)}
          />
        </div> */}
      </div>
      <div className="data-row">
        <p className="bold-text title">RC Type</p>
        <p className="data">{renderString(vehicle.bikeRcType)}</p>
        {/* <div style={{ width: '175px',margin:'5px 0 10px 0' }}>
          <DropDown
            placeholder={rcValue}
            onChange={handleRc}
            options={rcOptions}
            value={rcValue}
            className={classNames('dropdown-wraper', style.dropDownContainer)}
          />
      </div> */}
      </div>
      {
        openMMV &&
        <MMVDialog
          open={openMMV}
          onClose={closeMMVDialog}
          onUpdate={updateMMV}
          mmvdata={mmvdata}
          leadId={vehicle.leadId}
          year={vehicle.bikeManufacturerYear}
          cityId={cityId}
        />
      }
    </div>
  );
};

export default VehicleDetails;
