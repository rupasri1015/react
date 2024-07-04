import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { size } from 'lodash';

import Dialog from '@material-ui/core/Dialog';
import DialogHeader from '../../../components/DialogHeader';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { setNotification } from '../../../../../redux/actions/notificationAction';
import styles from './styles.module.scss';


const EditProfileDialog = (props) => {
    const { isOpen, profileDetails, closeEditModal, handleProfileUpdate } = props;
    const dispatch = useDispatch();


    if (!size(profileDetails)) return null;

    const [name, setName] = useState(profileDetails.name);
    const [email, setEmail] = useState(profileDetails.email);
    const [officialEmail, setOfficialEmail] = useState(profileDetails.officialMail);
    const [mobileNo, setMobileNo] = useState(profileDetails.mobileNo);
    const [alternateMobileNumber, setAlternateMobileNumber] = useState(profileDetails.alternateMobileNo);
    const [whatsAppMobileNumber, setWhatsAppMobileNumber] = useState(profileDetails.whatsUpNo);
    const [ownerNumber, setOwnerNumber] = useState(profileDetails.ownerNumber);
    const [address, setAddress] = useState(profileDetails.address);


    const onSaveClick = () => {
      if (!name) {
        dispatch(setNotification('danger', 'Error', 'Name field cannot be empty!'));
      } else if (!email) {
        dispatch(setNotification('danger', 'Error', 'Email field cannot be empty!'));
      } else return handleProfileUpdate({
          name: name,
          email: email,
          address: address,
          alternateMobileNo: alternateMobileNumber,
          whatsupNumber: whatsAppMobileNumber,
          officialEmail: officialEmail,
          ownerNumber: ownerNumber,
          mobileNo: mobileNo
      });
    }

    return (
        <Dialog
          open={isOpen}
          onClose={() => closeEditModal({ open: false })}
          className={styles.modalContainer}
        >
          <DialogTitle>
            <DialogHeader title="Update Info" onCloseClick={() => { closeEditModal({ open: false }) }} />
          </DialogTitle>
          <DialogContent>
            <div className="form-group row">
              <label htmlFor="inputPassword" className="col-sm-5 col-form-label">
                Name
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  id="form104"
                  className="form-control"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                ></input>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword" className="col-sm-5 col-form-label">
                {' '}
                Email
              </label>
              <div className="col-sm-7">
                {' '}
                <input
                  type="text"
                  id="form104"
                  className="form-control"
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  value={email}
                ></input>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword" className="col-sm-5 col-form-label">
                Official Email
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  id="form104"
                  className="form-control"
                  onChange={(e) => {
                    setOfficialEmail(e.target.value);
                  }}
                  value={officialEmail}
                ></input>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword" className="col-sm-5 col-form-label">
                Store Sales Manager Mobile Number1
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  id="form104"
                  className="form-control"
                  onChange={(e) => {
                    setMobileNo(e.target.value);
                  }}
                  value={mobileNo}
                ></input>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword" className="col-sm-5 col-form-label">
                Store Sales Manager Mobile Number2
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  id="form104"
                  className="form-control"
                  maxLength="10"
                  onChange={(e) => {
                    setAlternateMobileNumber(e.target.value);
                  }}
                  value={alternateMobileNumber}
                ></input>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword" className="col-sm-5 col-form-label">
                WhatsApp MobileNumber
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  id="form104"
                  className="form-control"
                  maxLength="10"
                  onChange={(e) => {
                    setWhatsAppMobileNumber(e.target.value);
                  }}
                  value={whatsAppMobileNumber}
                ></input>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword" className="col-sm-5 col-form-label">
                Owner MobileNumber
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  id="form104"
                  className="form-control"
                  maxLength="10"
                  onChange={(e) => {
                    setOwnerNumber(e.target.value);
                  }}
                  value={ownerNumber}
                ></input>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputPassword" className="col-sm-5 col-form-label">
                Personal Address
              </label>
              <div className="col-sm-7">
                {' '}
                <textarea
                  id="form107"
                  className="md-textarea form-control"
                  rows="4"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  value={address}
                ></textarea>
              </div>{' '}
            </div>
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className=" btn-warning btn ml-2 mt-2 applyButton"
              onClick={() => {
                setName('');
                setEmail('');
                setAddress('');
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className=" btn-primary btn ml-2 mt-2 applyButton"
              onClick={onSaveClick}
            >
              Save
            </button>
          </DialogActions>
        </Dialog>
    );
}

export default EditProfileDialog;
