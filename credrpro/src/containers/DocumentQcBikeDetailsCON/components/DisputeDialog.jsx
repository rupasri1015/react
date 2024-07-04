import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { connect, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import TextField from '../../../shared/components/redux-form/TextField';
import ImagePreview from '../../../shared/components/ImagePreview';
import { uploadMultiImages } from '../../../core/services/documentQcServices';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';
import FileUploadInput from '../../../shared/components/form/UploadImgnPdf';
import DropDown from '../../../shared/components/form/DropDown';

import uploadIcon from '../../../shared/img/icons/upload.svg';

import classes from '../styles.module.scss';

const rejectOptions = [
  {
    value: 'documents',
    label: 'Documents',
  },
  {
    value: 'challan',
    label: 'Challan',
  },
  {
    value: 'noc',
    label: 'NOC',
  },
  {
    value: 'rc',
    label: 'RC',
  },
  {
    value: 'idProof',
    label: 'ID Proof',
  },
  {
    value: 'others',
    label: 'Others',
  },
];

const validate = (values) => {
  const error = {};
  if (!values.reason) error.reason = 'Please Select Reason';
  else if (values.reason === 'Others' && !values.otherReason)
    error.otherReason = 'Please Enter Reason';
  return error;
};

let DisputeDialog = ({
  onClose,
  open,
  onRejectDocuments,
  reasonField,
  handleSubmit,
  change,
  untouch,
  valid,
}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [reason, setReason] = useState('Select');
  const [remarks, setRemarks] = useState('');
  const [disputeFormData, setDisputeFormData] = useState({});
  const dispatch = useDispatch();

  const useStyles = makeStyles((theme) => {
    return {
      outlined: {
        padding: '10px',
        fontSize: 14,
      },
      commentsArea: {
        width: '80%',
        marginTop: '20px',
        fontSize: 14,
      },
    };
  });

  const styles = useStyles();

  const _setReason = (selectedReason) => {
    setReason(selectedReason);
    setDisputeFormData({ ...disputeFormData, reason: selectedReason });
  };

  const handleRejectForm = (formData) => {
    if (valid) {
      const payload = {};
      if (!Object.keys(disputeFormData).length)
        return dispatch(
          setNotification('danger', 'Error', 'Please select some reason')
        );
      if (disputeFormData.reason === 'Others') {
        payload.reasonForDocRejection = disputeFormData.otherReason;
      } else {
        payload.reasonForDocRejection = disputeFormData.reason.value;
        payload.reasonId = disputeFormData.reason.value;
      }
      if (uploadedImages.length) {
        payload.referenceImage = uploadedImages;
      }
      if (formData.remark) {
        payload.remarks = formData.remark;
      }
      onRejectDocuments(payload);
    }
  };

  const uploadImagesForDelvivery = (images) => {
    dispatch(showLoader());
    const formData = new FormData();
    images.forEach((file) => {
      formData.append('file', file);
    });
    return uploadMultiImages(formData).then((apiResponse) => {
      if (apiResponse.isValid) {
        setUploadedImages([...uploadedImages, ...apiResponse.urls]);
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
      }
      dispatch(hideLoader());
    });
  };

  const removeImage = (index) => {
    const currentImages = [].concat(uploadedImages);
    currentImages.splice(index, 1);
    setUploadedImages(currentImages);
  };

  useEffect(() => {
    if (reasonField !== 'Others') {
      change('otherReason', '');
      untouch('otherReason');
    }
  }, [reasonField]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleRejectForm)}>
        <DialogTitle>
          <span style={{ color: 'red', letterSpacing: '0.05ch' }}>
            Dispute Arising Details
          </span>
          <span
            className="float-right"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          >
            &#10005;
          </span>
        </DialogTitle>
        <Divider />
        <DialogContent style={{ paddingBottom: '60px' }}>
          <div
            style={{
              width: '100%',
              margin: '20px 0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <p className="bold-text title" style={{ marginRight: '30px' }}>
              Dispute Reason
            </p>
            <DropDown
              options={rejectOptions}
              value={reason}
              placeholder="Select Reason"
              onChange={_setReason}
              className={classes.dropDown}
            />
          </div>
          {reasonField === 'Others' && (
            <div style={{ width: 355, margin: '20px 0' }}>
              <Field
                name="otherReason"
                component={TextField}
                label="Other Reason"
              />
            </div>
          )}
          <div
            style={{
              width: '100%',
              margin: '20px 0',
            }}
          >
            <p className="bold-text title" style={{ marginRight: '30px' }}>
              Remarks
            </p>
            <textarea
              className={classNames('form-control', styles.commentsArea)}
              placeholder="Write remarks"
              id="remarks"
              rows="3"
              value={remarks}
              maxLength="100"
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 500 }}>Reference Images</div>
            <FileUploadInput
              multiple
              accept="image/*, application/pdf"
              onFileChange={uploadImagesForDelvivery}
              leftIcon={uploadIcon}
              imageStyles={{
                float: 'right',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
              }}
              showOnlyImage={true}
              minWidth={124}
            />
          </div>
          {Boolean(uploadedImages.length) && (
            <div style={{ width: '100%', margin: '20px 0' }}>
              {uploadedImages.map((url, index) => (
                <ImagePreview
                  key={`${url}${index}`}
                  url={url}
                  onRemove={() => removeImage(index)}
                  className={classes.referenceImg}
                />
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <button
            className="icon-btn success"
            style={{ width: '100px', fontWeight: 600, marginBottom: '10px' }}
          >
            SUBMIT
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

DisputeDialog = reduxForm({
  form: 'reject-qc',
  validate,
})(DisputeDialog);

const selector = formValueSelector('reject-qc');

const mapStateToprops = (state) => {
  return {
    reasonField: selector(state, 'reason'),
  };
};

export default connect(mapStateToprops)(DisputeDialog);
