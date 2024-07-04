import React, { useState, useEffect, useRef } from 'react';
import { renderString, getBikeNameYear } from '../../../core/utility';
import { editYearOrRegNo as editYear } from '../../../core/services/documentQcServices';
import edit from '../../../shared/img/icons/edit-icon.svg';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationAction';
import { getUserID } from '../../../core/services/rbacServices';
import { useParams } from 'react-router-dom';
import MMVDialog from './MMVDialog'
import classNames from 'classnames';
import DropDown from '../../../shared/components/form/DropDown';
import styles from '../../DocumentQC-CV/components/styles.module.scss'

const VehicleDetails = ({ vehicle, isEdit,refreshData, cityId,handleFinVal,handleInsureVal,handleRcVal, }) => {
  const yesNoOptions = [
    { label: 'Yes', value: true }, { label: 'No', value: false }
  ]
  const rcOptions = [{label:'Original',value:'Original'},{label:'Copy',value:'Copy'},
  {label:'DRC',value:'DRC'},{label:'Missing',value:'Missing'}]

  const dispatch = useDispatch();
  const rcValue = { label: vehicle.bikeRcType, value: vehicle.bikeRcType }
  const financeVal = vehicle.bikeFinance ? yesNoOptions[0] : yesNoOptions[1]
  const insuranceVal = vehicle.insurance ? yesNoOptions[0] : yesNoOptions[1]

  const [year, setYear] = useState(null);
  const [noOfOwners, setNoOfOwners] = useState(null);
  const [regNo, setRegNo] = useState(null);
  const [yearError, setYearError] = useState(false);
  const [noOfOwnersError, setNoOfOwnersError] = useState(false);
  const [enableTextBox, setEnableTextBox] = useState(false);
  const [enableNoOfOwners, setEnableNoOfOwners] = useState(false);
  const [enableRegNo, setEnableRegNo] = useState(false);
  const [openMMV, setOpenMMV] = useState(false);
  const [mmv, setMMV] = useState("");
  const [mmvdata, setMMVData] = useState([]);
  const inputVal = useRef(null);
  const inputNoOfVal = useRef(null);
  const inputRegNo = useRef(null);
  const params = useParams();
  const [updatedFin,setUpdatedFin]=useState();
  const [updatedIns,setUpdatedIns] =useState();
  const [updatedRc,setUpdatedRc] = useState();

  useEffect(() => {
    if (params.status === 'PENDING') {
      // inputVal && inputVal.current.focus();
      inputNoOfVal && inputNoOfVal.current.focus();
      inputRegNo && inputRegNo.current.focus();
    }
    setUpdatedFin(financeVal)
    setUpdatedIns(insuranceVal)
    setUpdatedRc(rcValue)
  },[])




  const editYearQc1 = (e) => {
    if (e.keyCode === 13) {
      let payload = {};
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
    }
  };

  const handleRegNo = (e) => {
    setRegNo(e.target.value);
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

  const editNoOfOwners = (e) => {
    if (e.keyCode === 13) {
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
    }
  };

  const setNewYear = () => {
    setEnableTextBox(true);
  };

  const openNoOfOwnersTextBox = () => {
    setEnableNoOfOwners(true);
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

      editYear(payload).then((apiResponse) => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message));
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message));
        }
        setEnableRegNo(false);
      });
    }
  };
  const handleFinance = (val) => {
    setUpdatedFin(val)
    handleFinVal(val.label)
  }
  const handleInsurance = (val) => {
    setUpdatedIns(val)
    handleInsureVal(val.label)
  }
  const handleRc = (val) => {
    setUpdatedRc(val)
    if(val.label !== "Select RC Type") handleRcVal(val.value)
  }

  const getFinVal = () => {
    if(updatedFin) return updatedFin
    return financeVal
  }
  const getInsVal = () => {
    if(updatedIns) return updatedIns
    return insuranceVal
  }

  const getRcVal = (value) => {
    if (updatedRc && updatedRc.label !== undefined) return updatedRc
    else {
      if (value.label === 'NA' || value.label === "") return { value: '', label: 'Select RC Type' }
      else return rcValue
    }
  }

  return (
    <div>
      <div
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
      </div>
      <div className="data-row">
        <p className="bold-text title">MMV - Y</p>

        <p className="data">
          {getBikeNameYear(
            vehicle.bikeManufactureName,
            vehicle.bikeModelName,
            vehicle.bikeVariantName,
            vehicle.bikeManufacturerYear
          )}
          {!isEdit && <img
            src={edit}
            alt="Edit FM Price"
            role="button"
            className="action-icon"
            style={{ marginLeft: 10 }}
            onClick={() => openMMVDialog()}
          />}
        </p>
      </div>
      {!isEdit ? (
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
              disabled={!enableRegNo}
              value={regNo === null ? vehicle.bikeRegistrationNumber : regNo}
              onChange={(e) => handleRegNo(e)}
              onKeyDown={(e) => onInputEnterRegNo(e)}
            />
            <img
              src={edit}
              alt="Edit No Of Owners"
              role="button"
              className="action-icon"
              style={{ marginLeft: 10 }}
              onClick={() => setEnableRegNo(true)}
            />
          </p>
        </div>
      ) : (
        <div className="data-row">
          <p className="bold-text title">Registration&nbsp;Number</p>
          <p className="data"> {vehicle.bikeRegistrationNumber} </p>
        </div>
      )}
      {params.status === 'PENDING' || params.status === 'DISPUTE' ? (
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
              onKeyDown={(e) => editNoOfOwners(e)}
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
        {params.status === 'PENDING' || params.status === 'DISPUTE' ? (
          <div style={{ width: '175px' }}>
            <DropDown
              // placeholder={financeVal}
              onChange={handleFinance}
              options={yesNoOptions}
              value={getFinVal(financeVal)}
              className={classNames('dropdown-wraper', styles.dropDownContainer)}
            />
          </div>) : <p className="data">{renderString(vehicle.bikeFinance)}</p>}
      </div>
      <div className="data-row">
        <p className="bold-text title">Insurance&nbsp;(Y/N)</p>
        {params.status === 'PENDING' || params.status === 'DISPUTE' ? (
          <div style={{ width: '175px', marginTop: '5px' }}>
            <DropDown
              // placeholder={insuranceVal}
              onChange={handleInsurance}
              options={yesNoOptions}
              value={getInsVal(insuranceVal)}
              className={classNames('dropdown-wraper', styles.dropDownContainer)}
            />
          </div>) : <p className="data">{renderString(vehicle.insurance)}</p>}
      </div>
      <div className="data-row">
        <p className="bold-text title">RC Type</p>
        {params.status === 'PENDING' || params.status === 'DISPUTE' ? (
          <div style={{ width: '175px', margin: '5px 0 10px 0' }}>
            <DropDown
              // placeholder={updatedRc ? updatedRc : rcValue}
              onChange={handleRc}
              options={rcOptions}
              value={getRcVal(rcValue)}
              className={classNames('dropdown-wraper', styles.dropDownContainer)}
            />
          </div>) : <p className="data">{renderString(vehicle.bikeRcType)}
        </p>}
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
